import { Day, Unscheduled } from "../utils/itinerary.ts";
import { Destination, Trip } from "../utils/trip.ts";
import { Issue } from "../utils/validate.ts";
import {
  DayWithPlaceBlocks,
  findGaps,
  Gap,
  GapDay,
  HomeLocation,
} from "./gaps.ts";
import {
  MustVisitGapScores,
  scoreCandidates,
  GapIDMap,
} from "./utils/scores.ts";

// store the full gap details along with the score

/**
 * Insert all of the must visit (places without a fixed time) into the itinerary based around the anchors
 * @param trip - the full trip details
 * @param days - a scaffold of the days of the trip with anchors inserted
 * @returns A copy of the days scaffold with must visits inserted, or an error message if there are issues
 */
export function insertMustVisits(
  trip: Trip,
  days: Day[]
): [MustVisitGapScores[], GapDay[], GapIDMap] {
  //TODO: remove this later, as the insert must visits should be returning below where we only want the days and the unscheduled items
  // ): { ok: true; data: { days: Day[]; unscheduled: Unscheduled[] } } | { ok: false; error: Issue } {
  // find the gaps between the anchors in the itinerary
  const homeLocations: HomeLocation[] = trip.destinations.map(
    (destination: Destination) => ({
      destinationId: destination.id,
      location: destination.accommodation?.location ?? destination.location,
    })
  );
  const daysWithAnchors = days as DayWithPlaceBlocks[];
  const gaps = findGaps(daysWithAnchors, homeLocations);

  // score each of the must visit places and their candidate gaps
  const mustVisitGapScores: MustVisitGapScores[] = [];

  // keep a map of the MVGS, which keeps a reference of which MVGS has which gapIDs in it
  const gapIDMap: GapIDMap = {};

  for (const destination of trip.destinations) {
    // get all the must visit places (places without a fixed) with the candidate gaps for the place
    const mustVisits = destination.places.filter(
      (place) => place.fixed === undefined
    );
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

  const placesDays = JSON.parse(JSON.stringify(days)); // create a copy of the current iteration of days
  const placesUnscheduled: Unscheduled[] = [];

  while (mustVisitGapScores.length > 0) {
    // continue here
  }
  }

  return [mustVisitGapScores, gaps, gapIDMap];
  // return {
  //   ok: true,
  //   data: {
  //     days: [],
  //     unscheduled: [],
  //   },
  // };
}
