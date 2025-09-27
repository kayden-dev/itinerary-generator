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
  const anchors: (CheckInOutBlock | VisitBlock)[] = [];

  for (const destination of sortedDestinations) {
    // create the checkin/checkout anchors, which is only IF the destination has 
    if (destination.accommodation !== undefined) {
      // extract the information about the place, except the checkin/checkout times
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
      anchors.push(checkInBlock);
      anchors.push(checkOutBlock);
    }
    
    // create the fixed appointment blocks
    for (const place of destination.places) {
      // for it to be a fixed place, it must have a fixed defined
      if (place.fixed !== undefined) {
        // if so, then start the creation of the block
        // if the block doesn't have an end, call a function to determine the default time spent for that type of block
        // later on: change the place schema to require the type of place it is

        // the function will just return a time, here use the same process as before to calculate the offset time, turn 
        // it into a function maybe? if need to be reusued, where the input is a dateitme, output is a datetime, and another
        // input is duration in minutes

        // once created, just add to the anchors array
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
        anchors.push(fixedPlaceBlock);
      }
    }


  }

  const sortedAnchors = [...anchors].sort((a,b) => (
    Date.parse(a.start) - Date.parse(b.start)
  ));

  const anchorDays = JSON.parse(JSON.stringify(days)); // TODO: deep copy not shallow copy
  let dayIndex = 0; // keep track of which day of the itinerary we are currently on

  for (const anchor of sortedAnchors) {
    // first, do a check with this anchor and the previous anchor to ensure there is sufficient min gap using another min gap function, default for now

    // if good, then proceed to insertion

    // INSERTION ++++

    const anchorDate = anchor.start.split("T")[0];

    // check that the day of anchor is equal to the dayIndex day
    // day is a date, start is a datetime, use the split to compare
    while (dayIndex < anchorDays.length && anchorDays[dayIndex].date !== anchorDate) {
      // if not, move the dayIndex day to the day of the anchor
      dayIndex++;
    }

    // TODO: need to do case when none of the dates match the anchor days: meaning that anchor is outside of dates
    
    // then insert the anchor into the day
    anchorDays[dayIndex].blocks.push(anchor);
  }

  return {
    ok: true,
    data: anchorDays
  }
}

