import { Day, Unscheduled, VisitBlock } from "../utils/itinerary.ts";
import { Destination, Trip } from "../utils/trip.ts";
import { Issue } from "../utils/validate.ts";
import { DayWithPlaceBlocks, findGaps, Gap, GapDay, HomeLocation } from "./gaps.ts";
import { calculateDefaultVisitTime, calculateMinutesBetween, calculateTimeOffset } from "./utils/blocks.ts";
import { MustVisitGapScores, scoreCandidates, GapIDMap, GapScore } from "./utils/scores.ts";

const getNextMVGS = (mvgc: MustVisitGapScores[]): MustVisitGapScores => {
  let bestIdx = 0;
  for (let i = 1; i < mvgc.length; i++) {
    if (mvgc[i].gapScores.length < mvgc[bestIdx].gapScores.length) {
      bestIdx = i;
    }
  }
  return mvgc.splice(bestIdx, 1)[0];
};

const getBestGapScore = (gapScores: GapScore[]): GapScore => {
  let bestIdx = 0;
  for (let i = 1; i < gapScores.length; i++) {
    if (gapScores[i].score > gapScores[bestIdx].score) {
      bestIdx = i;
    }
  }
  return gapScores[bestIdx];
};
/**
 * Insert all of the must visit (places without a fixed time) into the itinerary based around the anchors
 * @param trip - the full trip details
 * @param days - a scaffold of the days of the trip with anchors inserted
 * @returns A copy of the days scaffold with must visits inserted, or an error message if there are issues
 */
export function insertMustVisits(
  trip: Trip,
  days: Day[]
): { ok: true; data: { days: Day[]; unscheduled: Unscheduled[] } } | { ok: false; error: Issue } {
  // find the gaps between the anchors in the itinerary
  const homeLocations: HomeLocation[] = trip.destinations.map((destination: Destination) => ({
    destinationId: destination.id,
    location: destination.accommodation?.location ?? destination.location,
  }));
  const daysWithAnchors = days as DayWithPlaceBlocks[];
  const gaps = findGaps(daysWithAnchors, homeLocations);

  // score each of the must visit places and their candidate gaps
  const mustVisitGapScores: MustVisitGapScores[] = [];

  // keep a map of the MVGS, which keeps a reference of which MVGS has which gapIDs in it
  const gapIDMap: GapIDMap = {};

  for (const destination of trip.destinations) {
    // get all the must visit places (places without a fixed) with the candidate gaps for the place
    const mustVisits = destination.places.filter((place) => place.fixed === undefined);
    const candidateGaps: Gap[] = gaps
      .filter((gapDay) => gapDay.destinationId === destination.id)
      .flatMap((day) => day.gaps);

    // score all the candidate gaps with the must visits, and add to the list
    const {
      mustVisitGapScores: destinationMustVisitGapScores,
      gapIDMap: destinationGapIDMap,
    }: {
      mustVisitGapScores: MustVisitGapScores[];
      gapIDMap: GapIDMap;
    } = scoreCandidates(mustVisits, candidateGaps);

    mustVisitGapScores.push(...destinationMustVisitGapScores);

    for (const [gapID, newMVGSList] of Object.entries(destinationGapIDMap)) {
      // get or create the bucket
      const bucket = (gapIDMap[gapID] ??= []);

      for (const newMVGS of newMVGSList) {
        // prevent duplicates (based on place.id)
        if (!bucket.some((e) => e.place.id === newMVGS.place.id)) {
          bucket.push(newMVGS);
        }
      }
    }
  }

  // once all the must visit places have been scored, we can start iterating and inserting into the the new days

  const placesDays: Day[] = JSON.parse(JSON.stringify(days)); // create a copy of the current iteration of days
  const placesUnscheduled: Unscheduled[] = [];

  // keep getting MVGS until they run out
  while (mustVisitGapScores.length > 0) {
    const current: MustVisitGapScores = getNextMVGS(mustVisitGapScores);

    // if there are no candidate gaps, that means that it can't be scheduled
    if (current.gapScores.length === 0) {
      placesUnscheduled.push({
        placeId: current.place.id,
        reason: "conflict",
      });
      continue;
    }

    // get the best gap score and insert it into the itinerary
    const bestGapScore: GapScore = getBestGapScore(current.gapScores);
    const placeRef = (({ fixed, ...rest }) => rest)(current.place);
    const visitDuration = calculateDefaultVisitTime();
    const scheduledEndCandidate = calculateTimeOffset(bestGapScore.windowStart, visitDuration); // ensures that the block only goes for as long as required, to allow for space for other blocks
    const scheduledEnd =
      scheduledEndCandidate.localeCompare(bestGapScore.windowEnd) > 0 ? bestGapScore.windowEnd : scheduledEndCandidate;
    const scheduledVisit: VisitBlock = {
      type: "visit",
      placeRef,
      id: crypto.randomUUID(),
      start: bestGapScore.windowStart,
      end: scheduledEnd,
      source: "scheduled",
    };
    const targetDayIndex = placesDays.findIndex((day) => day.date === bestGapScore.date);
    placesDays[targetDayIndex].blocks.push(scheduledVisit);

    // carve new gaps from the original gap, one prior to the window and one post (only if there is time)
    const newGaps: Gap[] = [];
    if (calculateMinutesBetween(bestGapScore.start, bestGapScore.windowStart) > 0) {
      const preGap: Gap = {
        date: bestGapScore.date,
        start: bestGapScore.start,
        end: bestGapScore.windowStart,
        fromPlace: bestGapScore.fromPlace,
        endPlace: current.place.location,
      };
      newGaps.push(preGap);
    }

    if (calculateMinutesBetween(bestGapScore.windowEnd, bestGapScore.end) > 0) {
      const postGap: Gap = {
        date: bestGapScore.date,
        start: bestGapScore.windowEnd,
        end: bestGapScore.end,
        fromPlace: current.place.location,
        endPlace: bestGapScore.endPlace,
      };
      newGaps.push(postGap);
    }

    // iterate through all the must visits who reference the gap (what if it has already been inserted? doesn't matter as it won't get called again in while loop)
    const dependants = gapIDMap[bestGapScore.gapID];
    if (!dependants) {
      continue;
    }
    delete gapIDMap[bestGapScore.gapID];

    for (const affectedMVGC of dependants) {
      // delete that insance of the gap
      const gapIndex = affectedMVGC.gapScores.findIndex((gapScore) => gapScore.gapID === bestGapScore.gapID);
      if (gapIndex !== -1) {
        affectedMVGC.gapScores.splice(gapIndex, 1);
      }

      if (affectedMVGC.place.id === current.place.id) {
        continue;
      }

      // rescore with new gaps and combine
      if (newGaps.length > 0) {
        const {
          mustVisitGapScores: newScores,
          gapIDMap: newMap,
        }: {
          mustVisitGapScores: MustVisitGapScores[];
          gapIDMap: GapIDMap;
        } = scoreCandidates([affectedMVGC.place], newGaps);

        const updatedGapScores = newScores.length > 0 ? newScores[0].gapScores : [];
        for (const newGapScore of updatedGapScores) {
          const alreadyTracked = affectedMVGC.gapScores.some(
            (existing) =>
              existing.gapID === newGapScore.gapID &&
              existing.windowStart === newGapScore.windowStart &&
              existing.windowEnd === newGapScore.windowEnd
          );
          if (!alreadyTracked) {
            affectedMVGC.gapScores.push(newGapScore);
          }
        }

        for (const gapID of Object.keys(newMap)) {
          const bucket = (gapIDMap[gapID] ??= []);
          if (!bucket.some((entry) => entry.place.id === affectedMVGC.place.id)) {
            bucket.push(affectedMVGC);
          }
        }
      }
    }
  }

  return {
    ok: true,
    data: {
      days: placesDays,
      unscheduled: placesUnscheduled,
    },
  };
}
