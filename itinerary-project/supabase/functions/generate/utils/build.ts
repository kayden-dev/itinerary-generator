import { Day } from "./itinerary.ts";
import { Destination, Trip } from "./trip.ts";

export type Issue = {
  code: string;
  field: string;
  at?: {
    leftIndex: number,
    rightIndex: number
  }
  message: string;
}

export function buildDays (
  destinations: Destination[], 
  tripDates: Trip["dates"]
): {ok: true;data: Day[]} | {ok: false: errors: Issue[]}{
  // sort the destination by start date

  // set the initial ptr at the trip dates start

  // then iterate through each sorted destination

    // check that the start = ptr

    // if yes, move the ptr to end + 1

  // keep repeating, if ever the condition breaks, that must mean there is either an overlap or gap

  // at the end, terminating cond check that ptr = end - 1

  // if all of these hold, then the days is verified, and can hence proceed with creating the scaffold days
}