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
): {ok: true;data: Day[]} | {ok: false;error: Issue}{
  // sort the destination by start date
  destinations.sort((a,b) => {
    return Date.parse(a.dates.start) - Date.parse(b.dates.start)
  });

  // set the trip start and end boundaries
  const start = new Date(tripDates.start);
  start.setHours(0,0,0,0);

  const end = new Date(tripDates.end);
  end.setHours(0,0,0,0);

  // set the initial ptr at the trip dates start
  let leading = new Date(tripDates.start);
  leading.setHours(0,0,0,0);

  // then iterate through each sorted destination
  for (const [index, destination] of destinations.entries()) {
    const currentStart = new Date(destination.dates.start);
    currentStart.setHours(0,0,0,0);

    if (currentStart < leading) {
      // if the start is before leading, either overlap OR outside of trip dates
      if (leading === start) {
        return {
          ok: false,
          error: {
            code: "city_outside_trip",
            field: `destinations[${index}].dates`,
            message: "City dates are outside of the trip"
          }
        }
      } else {
        return {
          ok: false,
          error: {
            code: "overlap_between_cities",
            field: "destinations",
            at: {leftIndex: index - 1, rightIndex: index},
            message: "The dates of two cities are overlapping"
          } 
        }
      }
    } else if (currentStart > leading) {
      // if the start is after leading, then there is a gap between cities or after the trip dates
      return {
        ok: false,
        error: {
          code: "gap_between_cities",
          field: "destinations",
          at: {leftIndex: index - 1, rightIndex: index},
          message: "Gap between cities or before/after cities"
        }
      }
    }
  }
    // check that the start = ptr

    // if yes, move the ptr to end + 1

  // keep repeating, if ever the condition breaks, that must mean there is either an overlap or gap

  // at the end, terminating cond check that ptr = end - 1

  // if all of these hold, then the days is verified, and can hence proceed with creating the scaffold days

  // TODO: check each city to see if that cities dates are outside of the trip dates, not just the last one or first one

  console.log(destinations);

  return {
    ok: false,
    errors: []
  }
}