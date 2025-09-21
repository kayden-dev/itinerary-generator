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

// helper functions to normalise the ISO dates to UTC midnight and to increment the day
const toUtcMidnight = (isoDate: string) => {
  const date = new Date(isoDate);
  date.setUTCHours(0, 0, 0, 0);
  return date;
};

const addOneDayUtc = (date: Date) => {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + 1);
  return next;
};

export function buildDays (
  destinations: Destination[], 
  tripDates: Trip["dates"]
): {ok: true;data: Day[]} | {ok: false;error: Issue}{
  // create a copy and sort the destinations by their start date
  const sortedDestinations = [...destinations].sort((a, b) => (
    Date.parse(a.dates.start) - Date.parse(b.dates.start)
  ));

  // normalise the trip start and end dates, and initialise the pointer
  const tripStart = toUtcMidnight(tripDates.start);
  const tripEnd = toUtcMidnight(tripDates.end);
  let pointer = new Date(tripStart);
  const days: Day[] = [];

  // check if there are no destinations, which is only valid if the trip start and end is the same
  if (sortedDestinations.length === 0) {
    if (tripStart.getTime() === tripEnd.getTime()) {
      // Trip is a single day with no destinations; caller can decide how to handle
      return { ok: true, data: [] };
    }

    return {
      ok: false,
      error: {
        code: "no_destinations",
        field: "destinations",
        message: "Trip dates are defined but no destinations cover them"
      }
    };
  }

  // keep track of the destinations which have already been seen, to ensure there are no duplicates
  const seenDestinationIds = new Set<string>();
  for (const [index, destination] of sortedDestinations.entries()) {
    // check if the destination id has already been seen
    if (seenDestinationIds.has(destination.id)) {
      return {
        ok: false,
        error: {
          code: "duplicate_destination_id",
          field: `destinations[${index}].id`,
          message: "Each destination must have a unique id"
        }  
      }
    }
    seenDestinationIds.add(destination.id);

    const currentStart = toUtcMidnight(destination.dates.start);
    const currentEnd = toUtcMidnight(destination.dates.end);

    // first, check if either the start is before trip start or end is after trip end
    if (currentStart < tripStart || currentEnd > tripEnd) {
      return {
        ok: false,
        error: {
          code: "city_outside_trip",
          field: `destinations[${index}].dates`,
          message: "City dates are outside of the trip"
        }
      };
    }

    if (currentStart < pointer) {
      return {
        ok: false,
        error: {
          code: "overlap_between_cities",
          field: "destinations",
          at: { leftIndex: index - 1, rightIndex: index },
          message: "The dates of two cities are overlapping"
        }
      };
    }

    if (currentStart > pointer) {
      const leftIndex = index - 1;
      const at = leftIndex >= 0 ? { leftIndex, rightIndex: index } : undefined;

      return {
        ok: false,
        error: {
          code: "gap_between_cities",
          field: "destinations",
          ...(at && { at }),
          message: at ? "Gap between cities or before/after cities" : "Destinations do not cover the full trip dates"
        }
      };
    }

    let currentPointer = currentStart;
    while (currentPointer <= currentEnd) {
      days.push({
        date: currentPointer.toISOString().split('T')[0],
        destinationId: destination.id,
        blocks: []
      });
      currentPointer = addOneDayUtc(currentPointer);
    }

    // increment the counter
    pointer = addOneDayUtc(currentEnd);
  }

  // by the end, check if there is still another gap
  const endBoundary = addOneDayUtc(tripEnd);
  const pointerTime = pointer;

  if (pointerTime < endBoundary) {
    return {
      ok: false,
      error: {
        code: "gap_between_cities",
        field: "destinations",
        message: "Destinations do not cover the full trip dates"
      }
    };
  }

  return {
    ok: true,
    data: days
  };
}
