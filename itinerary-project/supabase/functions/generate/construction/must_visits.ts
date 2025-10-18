import { Day, Unscheduled } from "../utils/itinerary.ts";
import { Destination, Trip } from "../utils/trip.ts";
import { Issue } from "../utils/validate.ts";
import { DayWithPlaceBlocks, findGaps, Gap, HomeLocation } from "./gaps.ts";
import { MustVisitGapScores, scoreCandidates } from "./utils/scores.ts";

// store the full gap details along with the score

/**
 * Insert all of the must visit (places without a fixed time) into the itinerary based around the anchors
 * @param trip - the full trip details
 * @param days - a scaffold of the days of the trip with anchors inserted
 * @returns A copy of the days scaffold with must visits inserted, or an error message if there are issues
 */
export function insertMustVisits(trip: Trip, days: Day[]): MustVisitGapScores[] {
  // ): { ok: true; data: { days: Day[]; unscheduled: Unscheduled[] } } | { ok: false; error: Issue } {
  // find the gaps between the anchors in the itinerary
  const homeLocations: HomeLocation[] = trip.destinations.map((destination: Destination) => ({
    destinationId: destination.id,
    location: destination.accommodation?.location ?? destination.location,
  }));
  const daysWithAnchors = days as DayWithPlaceBlocks[];
  const gaps = findGaps(daysWithAnchors, homeLocations);

  // score each of the must visit places and their candidate gaps
  const mustVisitGapScores: MustVisitGapScores[] = [];

  for (const destination of trip.destinations) {
    // get all the must visit places (places without a fixed) with the candidate gaps for the place
    const mustVisits = destination.places.filter((place) => place.fixed === undefined);
    const candidateGaps: Gap[] = gaps
      .filter((gapDay) => gapDay.destinationId === destination.id)
      .flatMap((day) => day.gaps);

    // score all the candidate gaps with the must visits, and add to the list
    const destinationMustVisitGapScores: MustVisitGapScores[] = scoreCandidates(mustVisits, candidateGaps);
    mustVisitGapScores.push(...destinationMustVisitGapScores);
  }

  return mustVisitGapScores;
  // return {
  //   ok: true,
  //   data: {
  //     days: [],
  //     unscheduled: [],
  //   },
  // };
}
