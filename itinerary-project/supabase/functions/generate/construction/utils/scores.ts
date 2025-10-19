import { Place } from "../../utils/trip.ts";
import { Gap } from "../gaps.ts";
import {
  calculateDefaultVisitTime,
  calculateMinTransitTime,
  calculateMinutesBetween,
  calculateWindowIntersection,
  calculateTimeOffset,
  getOpeningPeriodWindow,
} from "./blocks.ts";

// NOTE: gap may be modified subset of the original gaps, as the place might only be able to be inserted
// into a subset of the available gap due to opening hours
export type GapScore = Gap & {
  score: number;
};

export type MustVisitGapScores = {
  place: Place;
  gapScores: GapScore[];
};

/**
 * Calculate a score from 0 - 1 of how good the candidate gap is for the place
 * @param windowTime - Available time for the window
 * @param visitTime - Expected duration of the visit
 * @param travelIn - Time taken to travel to place
 * @param travelOut - Time take to travel out of place
 * @returns Score from 0 - 1
 */
const score = (windowMinutes: number, visitMinutes: number, travelIn: number, travelOut: number): number => {
  const totalTravel = travelIn + travelOut;
  const travelScore = 1 - Math.min(totalTravel / windowMinutes, 1);
  const fitScore = Math.min(visitMinutes / windowMinutes, 1);
  return 0.6 * travelScore + 0.4 * fitScore;
};

export function scoreCandidates(places: Place[], gaps: Gap[]): MustVisitGapScores[] {
  const mustVisitGapScores: MustVisitGapScores[] = [];

  for (const place of places) {
    const currentGapScores: GapScore[] = [];
    for (const gap of gaps) {
      // get the minimum travel in/out and visit time
      const travelIn = calculateMinTransitTime(gap.fromPlace, place.location);
      const travelOut = calculateMinTransitTime(place.location, gap.endPlace);
      const visitTime = calculateDefaultVisitTime();

      const candidateWindows: { start: string; end: string }[] = [];

      if (place.openingHours) {
        for (const period of place.openingHours.periods) {
          const periodWindow = getOpeningPeriodWindow(period, gap.date);
          const overlap = calculateWindowIntersection(gap.start, gap.end, periodWindow.start, periodWindow.end);

          if (overlap) {
            candidateWindows.push(overlap);
          }
        }

        if (candidateWindows.length === 0) {
          continue;
        }
      } else {
        candidateWindows.push({
          start: gap.start,
          end: gap.end,
        });
      }

      for (const window of candidateWindows) {
        const arrivalTime =
          calculateMinutesBetween(gap.start, window.start) >= travelIn
            ? window.start
            : calculateTimeOffset(gap.start, travelIn);
        const departureTime =
          calculateMinutesBetween(window.end, gap.end) >= travelOut
            ? window.end
            : calculateTimeOffset(gap.end, -travelOut);

        if (arrivalTime.localeCompare(departureTime) >= 0) continue;

        // check candidate viability, ensuring the opening window can accommodate the visit time
        const windowMinutes = calculateMinutesBetween(arrivalTime, departureTime);
        if (windowMinutes < visitTime) continue;

        // if viable, score candidate
        const gapScore = score(calculateMinutesBetween(window.start, window.end), visitTime, travelIn, travelOut);

        // insert with the window (not gap, as the place might only be able to be visited within a subset of the gap)
        currentGapScores.push({
          date: gap.date,
          start: arrivalTime,
          end: departureTime,
          fromPlace: gap.fromPlace,
          endPlace: gap.endPlace,
          score: gapScore,
        });
      }
    }

    mustVisitGapScores.push({
      place: place,
      gapScores: currentGapScores,
    });
  }
  return mustVisitGapScores;
}
