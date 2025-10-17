import {
  BaseBlock,
  CheckInOutBlock,
  Day,
  VisitBlock,
} from "../utils/itinerary.ts";
import { Place } from "../utils/trip.ts";

export type GapDay = {
  destinationId: string;
  date: Day["date"];
  gaps: Gap[];
};

export type Gap = {
  start: BaseBlock["start"];
  end: BaseBlock["end"];
  fromPlace: Place["location"]; // location of the place before the gap. This can either be another place, an accomodation (if provided), or the location of the city
  endPlace: Place["location"];
};

export type HomeLocation = {
  destinationId: string;
  location: Place["location"];
};

export type DayWithPlaceBlocks = Omit<Day, "blocks"> & {
  blocks: (VisitBlock | CheckInOutBlock)[];
};

/**
 * Finds all of the gaps in an itinerary given the places inserted and within the day windows
 * @param days A list of days in the itinerary
 * @returns A list of gaps in the itinerary with the place the gap comes from and the place the gap goes to
 */
export function findGaps(
  days: DayWithPlaceBlocks[],
  homeLocations: HomeLocation[],
): GapDay[] {
  // defined the start and end windows in time format (9am - 9pm)
  const windowStart = "09:00:00";
  const windowEnd = "21:00:00";
  const gapDays: GapDay[] = [];

  for (const day of days) {
    const windowStartDateTime = `${day.date}T${windowStart}`;
    const windowEndDateTime = `${day.date}T${windowEnd}`;
    const homeLocation = homeLocations.find(
      (l) => l.destinationId === day.destinationId,
    )?.location;
    const sortedBlocks = [...day.blocks].sort((a, b) =>
      a.start.localeCompare(b.start)
    );

    const blocksInWindow = sortedBlocks.filter(
      (block) =>
        block.end.localeCompare(windowStartDateTime) > 0 &&
        block.start.localeCompare(windowEndDateTime) < 0,
    );

    const currentGapDay: GapDay = {
      destinationId: day.destinationId,
      date: day.date,
      gaps: [],
    };

    if (blocksInWindow.length === 0) {
      if (homeLocation) {
        currentGapDay.gaps.push({
          start: windowStartDateTime,
          end: windowEndDateTime,
          fromPlace: homeLocation,
          endPlace: homeLocation,
        });
      }
      if (currentGapDay.gaps.length > 0) {
        gapDays.push(currentGapDay);
      }
      continue;
    }

    const firstBlock = blocksInWindow[0];
    if (
      homeLocation &&
      firstBlock.start.localeCompare(windowStartDateTime) > 0
    ) {
      currentGapDay.gaps.push({
        start: windowStartDateTime,
        end: firstBlock.start,
        fromPlace: homeLocation,
        endPlace: firstBlock.placeRef.location,
      });
    }

    for (let i = 1; i < blocksInWindow.length; i++) {
      const previousBlock = blocksInWindow[i - 1];
      const currentBlock = blocksInWindow[i];
      const gapStart = previousBlock.end.localeCompare(windowStartDateTime) > 0
        ? previousBlock.end
        : windowStartDateTime;
      const gapEnd = currentBlock.start.localeCompare(windowEndDateTime) < 0
        ? currentBlock.start
        : windowEndDateTime;

      if (gapStart.localeCompare(gapEnd) < 0) {
        currentGapDay.gaps.push({
          start: gapStart,
          end: gapEnd,
          fromPlace: previousBlock.placeRef.location,
          endPlace: currentBlock.placeRef.location,
        });
      }
    }

    const lastBlock = blocksInWindow[blocksInWindow.length - 1];
    if (
      homeLocation &&
      lastBlock.end.localeCompare(windowEndDateTime) < 0
    ) {
      const gapStart = lastBlock.end.localeCompare(windowStartDateTime) > 0
        ? lastBlock.end
        : windowStartDateTime;
      if (gapStart.localeCompare(windowEndDateTime) < 0) {
        currentGapDay.gaps.push({
          start: gapStart,
          end: windowEndDateTime,
          fromPlace: lastBlock.placeRef.location,
          endPlace: homeLocation,
        });
      }
    }

    if (currentGapDay.gaps.length > 0) {
      gapDays.push(currentGapDay);
    }
  }

  return gapDays;
}
