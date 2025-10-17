import { BaseBlock, CheckInOutBlock, Day, VisitBlock } from "../utils/itinerary.ts";
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
export function findGaps(days: DayWithPlaceBlocks[], homeLocations: HomeLocation[]): GapDay[] {
  // defined the start and end windows in time format (9am - 9pm)
  const windowStart = "09:00:00";
  const windowEnd = "21:00:00";
  const gapDays: GapDay[] = [];

  for (const day of days) {
    const windowStartDateTime = `${day.date}T${windowStart}`;
    const windowEndDateTime = `${day.date}T${windowEnd}`;
    const homeLocation = homeLocations.find((l) => l.destinationId === day.destinationId)?.location;
    const sortedBlocks = [...day.blocks].sort((a, b) => a.start.localeCompare(b.start));

    // get all the blocks where the gaps would be contained in the windows without cutoffs
    const blocksInWindow = sortedBlocks.filter(
      (block) => block.end.localeCompare(windowStartDateTime) > 0 && block.start.localeCompare(windowEndDateTime) < 0
    );

    const currentGapDay: GapDay = {
      destinationId: day.destinationId,
      date: day.date,
      gaps: [],
    };

    // if there are no blocks, then the whole day is a gap
    if (blocksInWindow.length === 0) {
      if (homeLocation) {
        currentGapDay.gaps.push({
          start: windowStartDateTime,
          end: windowEndDateTime,
          fromPlace: homeLocation,
          endPlace: homeLocation,
        });
      }
      // if there was a gap pushed then add that day to the gapdays
      if (currentGapDay.gaps.length > 0) {
        gapDays.push(currentGapDay);
      }
      continue;
    }

    // create a gap from the start window to the start of the first block if it exists
    const firstBlock = blocksInWindow[0];
    if (homeLocation && firstBlock.start.localeCompare(windowStartDateTime) > 0) {
      currentGapDay.gaps.push({
        start: windowStartDateTime,
        end: firstBlock.start,
        fromPlace: homeLocation,
        endPlace: firstBlock.placeRef.location,
      });
    }

    // create the gaps between every block bounded by the day windows
    for (let i = 1; i < blocksInWindow.length; i++) {
      const previousBlock = blocksInWindow[i - 1];
      const currentBlock = blocksInWindow[i];
      const gapStart =
        previousBlock.end.localeCompare(windowStartDateTime) > 0 ? previousBlock.end : windowStartDateTime;
      const gapEnd = currentBlock.start.localeCompare(windowEndDateTime) < 0 ? currentBlock.start : windowEndDateTime;

      if (gapStart.localeCompare(gapEnd) < 0) {
        currentGapDay.gaps.push({
          start: gapStart,
          end: gapEnd,
          fromPlace: previousBlock.placeRef.location,
          endPlace: currentBlock.placeRef.location,
        });
      }
    }

    // create a gap between the final block and the day end window if it exists
    const lastBlock = blocksInWindow[blocksInWindow.length - 1];
    if (homeLocation && lastBlock.end.localeCompare(windowEndDateTime) < 0) {
      const gapStart = lastBlock.end.localeCompare(windowStartDateTime) > 0 ? lastBlock.end : windowStartDateTime;
      if (gapStart.localeCompare(windowEndDateTime) < 0) {
        currentGapDay.gaps.push({
          start: gapStart,
          end: windowEndDateTime,
          fromPlace: lastBlock.placeRef.location,
          endPlace: homeLocation,
        });
      }
    }

    // only add the gap day if that day had gaps
    if (currentGapDay.gaps.length > 0) {
      gapDays.push(currentGapDay);
    }
  }

  return gapDays;
}
