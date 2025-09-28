import { CheckInOutBlock, Day, VisitBlock } from "../utils/itinerary.ts";
import { Trip } from "../utils/trip.ts";
import { calculateTimeOffset } from "./utils/blocks.ts";

export type Issue = {
  code: string;
  field: string;
  at?: {
    leftIndex?: number;
    rightIndex?: number;
  };
  message: string;
};

/**
 * Inserts the anchors (checkin/checkout and fixed appointments) into an empty day scaffold
 * @param trip - the full trip details
 * @param days - an empty scaffold of the days of the trip
 * @returns A copy of the days scaffold with the anchors inserted, or an error message if there are issues
 */
export function insertAnchors(trip: Trip, days: Day[]): { ok: true; data: Day[] } | { ok: false; error: Issue } {
  // create a copy and sort the destinations by their start date
  const sortedDestinations = [...trip.destinations].sort((a, b) => a.dates.start.localeCompare(b.dates.start));

  const anchorDays = JSON.parse(JSON.stringify(days));
  let dayIndex = 0; // keep track of which day of the itinerary we are currently on
  let pointer:
    | {
        block: CheckInOutBlock | VisitBlock;
        index?: { destination: number; place: number };
      }
    | undefined; // keep track of the last block

  for (const [destinationIndex, destination] of sortedDestinations.entries()) {
    // create each anchor for the destination
    const anchors: {
      block: CheckInOutBlock | VisitBlock;
      index?: { destination: number; place: number };
    }[] = [];

    // create the checkin/checkout anchors, which is only IF the destination has an accomodation defined
    if (destination.accommodation !== undefined) {
      // extract the information about the place, except the checkin/checkout times
      // deno-lint-ignore no-unused-vars
      const placeRef = (({ checkInTime, checkOutTime, ...rest }) => rest)(destination.accommodation);

      // construct the start of the checkin/checkout blocks, falling back to defaults if not provided
      const startCheckIn = `${destination.dates.start}T${destination.accommodation.checkInTime ?? "15:00:00"}`;
      const startCheckOut = `${destination.dates.end}T${destination.accommodation.checkOutTime ?? "10:00:00"}`;

      // create and add the checkin/checkout blocks to the anchors
      const checkInBlock: CheckInOutBlock = {
        type: "check-in",
        placeRef,
        id: crypto.randomUUID(),
        start: startCheckIn,
        end: calculateTimeOffset(startCheckIn, 30),
        locked: true,
      };
      const checkOutBlock: CheckInOutBlock = {
        type: "check-out",
        placeRef,
        id: crypto.randomUUID(),
        start: startCheckOut,
        end: calculateTimeOffset(startCheckOut, 30),
        locked: true,
      };
      anchors.push({ block: checkInBlock });
      anchors.push({ block: checkOutBlock });
    }

    // create the fixed appointment blocks
    for (const [placeindex, place] of destination.places.entries()) {
      // for it to be a fixed place, it must have a fixed defined
      if (place.fixed !== undefined) {
        // deno-lint-ignore no-unused-vars
        const placeRef = (({ fixed, ...rest }) => rest)(place);
        const fixedPlaceBlock: VisitBlock = {
          type: "visit",
          placeRef,
          id: crypto.randomUUID(),
          start: place.fixed.start,
          end: place.fixed.end ?? calculateTimeOffset(place.fixed.start, 60), // TODO: implement proper time estimate function
          locked: true,
          source: "fixed",
        };
        anchors.push({
          block: fixedPlaceBlock,
          index: { destination: destinationIndex, place: placeindex },
        });
      }
    }
    const sortedAnchors = [...anchors].sort((a, b) => a.block.start.localeCompare(b.block.start));

    for (const anchor of sortedAnchors) {
      const anchorStart = anchor.block.start;
      const anchorEnd = anchor.block.end;

      // check if the anchor lays outside of the dates of the destination
      if (anchorStart.split("T")[0] < destination.dates.start || anchorEnd.split("T")[0] > destination.dates.end) {
        return {
          ok: false,
          error: {
            code: "place_outside_trip",
            field: `destinations[${anchor.index?.destination}].places[${anchor.index?.place}].fixed`,
            message: "a fixed appointment is outside of the dates of the destination",
          },
        };
      }

      // check that the day of anchor is equal to the dayIndex day
      // day is a date, start is a datetime, use the split to compare
      while (dayIndex < anchorDays.length && anchorDays[dayIndex].date !== anchorStart.split("T")[0]) {
        // if not, move the dayIndex day to the day of the anchor
        dayIndex++;
      }

      if (dayIndex >= anchorDays.length || anchorDays[dayIndex].date !== anchorStart.split("T")[0]) {
        return {
          ok: false,
          error: {
            code: "place_outside_trip",
            field: `destinations[${anchor.index?.destination}].places[${anchor.index?.place}].fixed`,
            message: "a fixed appointment is outside of the dates of the destination",
          },
        };
      }

      // check if the anchor overlaps with the previous anchor
      if (pointer !== undefined && anchorStart < pointer.block.end) {
        const at: Issue["at"] = {};
        if (pointer?.index?.place !== undefined) at.leftIndex = pointer.index.place;
        if (anchor.index?.place !== undefined) at.rightIndex = anchor.index.place;
        return {
          ok: false,
          error: {
            code: "anchor_overlap",
            field: `destinations[${destinationIndex}].places`,
            ...(Object.keys(at).length ? { at } : {}),
            message: "two anchors (fixed appointment or checkin/checkout) have overlapping dates",
          },
        };
      }

      // check if the anchor has enough travel time with the previous anchor
      if (pointer !== undefined && calculateTimeOffset(anchorStart, -30) < pointer.block.end) {
        const at: Issue["at"] = {};
        if (pointer?.index?.place !== undefined) at.leftIndex = pointer.index.place;
        if (anchor.index?.place !== undefined) at.rightIndex = anchor.index.place;
        return {
          ok: false,
          error: {
            code: "gap_too_small",
            field: `destinations[${destinationIndex}].places`,
            ...(Object.keys(at).length ? { at } : {}),
            message:
              "the gap between two anchors (fixed appointment or checkin/checkout) is too small to allow travel time",
          },
        };
      }

      pointer = JSON.parse(JSON.stringify(anchor));
      anchorDays[dayIndex].blocks.push(anchor.block);
    }
  }
  return {
    ok: true,
    data: anchorDays,
  };
}
