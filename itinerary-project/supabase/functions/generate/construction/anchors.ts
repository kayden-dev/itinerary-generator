import { Day, CheckInOutBlock, VisitBlock } from "../utils/itinerary.ts";
import { Trip } from "../utils/trip.ts";
import { calculateTimeOffset } from "./utils/blocks.ts";

export type Issue = {
  code: string;
  field: string;
  at?: {
    leftIndex: number,
    rightIndex: number
  }
  message: string;
}

/**
 * Inserts the anchors (checkin/checkout and fixed appointments) into an empty day scaffold
 * @param trip - the full trip details
 * @param days - an empty scaffold of the days of the trip
 * @returns A copy of the days scaffold with the anchors inserted, or an error message if there are issues
 */
export function insertAnchors (
  trip: Trip,
  days: Day[]
): {ok: true;data: Day[]} | {ok: false; error: Issue} {
  // create a copy and sort the destinations by their start date
  const sortedDestinations = [...trip.destinations].sort((a, b) => (
    Date.parse(a.dates.start) - Date.parse(b.dates.start)
  ));
  // anchors => checkin/checkout and fixed

  // create each anchor
  const anchors: {block: CheckInOutBlock | VisitBlock; index?: {destination: number; place: number}}[] = [];

  for (const [destinationIndex,destination] of sortedDestinations.entries()) {
    // create the checkin/checkout anchors, which is only IF the destination has 
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
        end: calculateTimeOffset(startCheckIn,30),
        locked: true
      };
      const checkOutBlock: CheckInOutBlock = {
        type: "check-out",
        placeRef,
        id: crypto.randomUUID(),
        start: startCheckOut,
        end: calculateTimeOffset(startCheckOut,30),
        locked: true
      };
      anchors.push({block:checkInBlock});
      anchors.push({block:checkOutBlock});
    }
    
    // create the fixed appointment blocks
    for (const [placeindex,place] of destination.places.entries()) {
      // for it to be a fixed place, it must have a fixed defined
      if (place.fixed !== undefined) {
        // if so, then start the creation of the block
        // if the block doesn't have an end, call a function to determine the default time spent for that type of block
        // later on: change the place schema to require the type of place it is

        // the function will just return a time, here use the same process as before to calculate the offset time, turn 
        // it into a function maybe? if need to be reusued, where the input is a dateitme, output is a datetime, and another
        // input is duration in minutes

        // once created, just add to the anchors array
        // deno-lint-ignore no-unused-vars
        const placeRef = (({ fixed, ...rest }) => rest)(place);
        const fixedPlaceBlock: VisitBlock = {
          type: "visit",
          placeRef,
          id: crypto.randomUUID(),
          start: place.fixed.start,
          end: place.fixed.end ?? calculateTimeOffset(place.fixed.start,60), // TODO: implement proper time estimate function
          locked: true,
          source: "fixed"
        }
        anchors.push({block:fixedPlaceBlock,index:{destination:destinationIndex,place:placeindex}});
      }
    }


  }

  const sortedAnchors = [...anchors].sort((a,b) => (
    Date.parse(a.block.start) - Date.parse(b.block.start)
  ));

  const anchorDays = JSON.parse(JSON.stringify(days)); // TODO: deep copy not shallow copy
  let dayIndex = 0; // keep track of which day of the itinerary we are currently on

  for (const anchor of sortedAnchors) {
    // first, do a check with this anchor and the previous anchor to ensure there is sufficient min gap using another min gap function, default for now

    const anchorStart = anchor.block.start.split("T")[0];
    const anchorEnd = anchor.block.end.split("T")[0];

    if (anchorStart < anchorDays[0].date || anchorEnd > anchorDays[anchorDays.length - 1].date) {
      return {
        ok: false,
        error: {
          code: "place_outside_trip",
          field: `destinations[${anchor.index?.destination}].places[${anchor.index?.place}].fixed`,
          message: ""
        }
      }
    }
    // check that the day of anchor is equal to the dayIndex day
    // day is a date, start is a datetime, use the split to compare
    while (dayIndex < anchorDays.length && anchorDays[dayIndex].date !== anchorStart) {
      // if not, move the dayIndex day to the day of the anchor
      dayIndex++;
    }

    if (dayIndex >= anchorDays.length || anchorDays[dayIndex].date !== anchorStart) {
      return {
        ok: false,
        error: {
          code: "place_outside_trip",
          field: `destinations[${anchor.index?.destination}].places[${anchor.index?.place}].fixed`,
          message: ""
        }
      }
    }

    anchorDays[dayIndex].blocks.push(anchor.block);
  }

  return {
    ok: true,
    data: anchorDays
  }
}

