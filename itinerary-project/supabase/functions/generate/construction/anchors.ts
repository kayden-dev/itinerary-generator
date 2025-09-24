import { Day, CheckInOutBlock, VisitBlock } from "../utils/itinerary.ts";
import { Trip } from "../utils/trip.ts";

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

  // first, create the checkinout anchors, which is only IF the destination has 
  for (const destination of sortedDestinations) {
    if (destination.accommodation !== undefined) {
      const placeRef = (({ checkInTime, checkOutTime, ...rest }) => rest)(destination.accommodation);
      
      const startCheckIn = `${destination.dates.start}T${destination.accommodation.checkInTime ?? "15:00:00"}`;
      const startCheckOut = `${destination.dates.end}T${destination.accommodation.checkOutTime ?? "10:00:00"}`;

      const endCheckInObject = new Date(startCheckIn);
      const endCheckOutObject = new Date(startCheckOut);

      const checkInOutDuration = 30 * 60 * 1000;

      endCheckInObject.setTime(endCheckInObject.getTime() + checkInOutDuration);
      endCheckOutObject.setTime(endCheckOutObject.getTime() + checkInOutDuration);

      const endCheckIn = endCheckInObject.toISOString().slice(0,-5);
      const endCheckOut = endCheckOutObject.toISOString().slice(0,-5); // remove the z from the string and the milliseconds
 
      const checkInBlock: CheckInOutBlock = {
        type: "check-in",
        placeRef,
        id: crypto.randomUUID(),
        start: startCheckIn,
        end: endCheckIn,
        locked: true
      };

      const checkOutBlock: CheckInOutBlock = {
        type: "check-out",
        placeRef,
        id: crypto.randomUUID(),
        start: startCheckOut,
        end: endCheckOut,
        locked: true
      };

      anchors.push(checkInBlock);
      anchors.push(checkOutBlock);
    }
  }

  // here, implement some sort of sorting algorithm and the implementation of the fixed
  const sortedAnchors = [...anchors];

  const anchorDays = [...days];
  let dayIndex = 0; // keep track of which day of the itinerary we are currently on

  for (const anchor of sortedAnchors) {
    // first, do a check with this anchor and the previous anchor to ensure there is sufficient min gap

    // if good, then proceed to insertion

    // INSERTION ++++

    const anchorDate = anchor.start.split("T")[0];

    // check that the day of anchor is equal to the dayIndex day
    // day is a date, start is a datetime, use the split to compare
    while (dayIndex < anchorDays.length && anchorDays[dayIndex].date !== anchorDate) {
      // if not, move the dayIndex day to the day of the anchor
      dayIndex++;
    }
    
    // then insert the anchor into the day
    anchorDays[dayIndex].blocks.push(anchor);
  }

  return {
    ok: true,
    data: anchorDays
  }
}

