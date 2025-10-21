import { Temporal } from "@js-temporal/polyfill";

import { BaseBlock } from "../../utils/itinerary.ts";
import { Place } from "../../utils/trip.ts";

/**
 * Calculates the end datetime given the start datetime and an offset (in minutes)
 *
 * @param start - The start datetime in local time
 * @param offset - The offset (in minutes) from the start datetime
 * @returns The end datetime in local time
 */
export function calculateTimeOffset(start: BaseBlock["start"], offset: number): BaseBlock["end"] {
  const dateTime = Temporal.PlainDateTime.from(start);
  return dateTime.add({ minutes: offset }).toString();
}

/**
 * Calculates the default visit time for a place given the type of that place
 * @param type - Type of place, given from the Google Place Details API
 * @returns A time in minutes of the visit time
 */
export function calculateDefaultVisitTime(type?: string): number {
  return 60; // TODO: implement this function
}

/**
 * Calculates the minimal time that should be allocated for travel time between place A and B
 * @param placeA - The location of the first place in lat, lang
 * @param placeB - The location of the second place in lat, lang
 * @returns A time in minutes of the minimum transit time
 */
export function calculateMinTransitTime(placeA: Place["location"], placeB: Place["location"]): number {
  return 30; //TODO: implement this function
}

/**
 * Calculates which day of the week a given day lands on
 * @param date - Date in ISO 8601 format without timezones
 * @returns a number from 0-6 indicating which day of the week (0 - Sunday, 1 - Monday, etc)
 */
export function getDay(date: string): number {
  const dateObj = Temporal.PlainDate.from(date);
  return dateObj.dayOfWeek % 7;
}

/**
 * Converts an
 * @param hour
 * @param minute
 * @returns
 */
export function getTime(hour: number, minute: number): string {
  return Temporal.PlainTime.from({ hour, minute }).toString();
}

/**
 * Calculates the number of minutes between two datetimes
 * @param start - The starting datetime in local time
 * @param end - The ending datetime in local time
 * @returns Total minutes between start and end (positive if end is after start)
 */
export function calculateMinutesBetween(start: BaseBlock["start"], end: BaseBlock["end"]): number {
  const startDateTime = Temporal.PlainDateTime.from(start);
  const endDateTime = Temporal.PlainDateTime.from(end);
  return endDateTime.since(startDateTime).total({ unit: "minutes" });
}

type OpeningPeriod = NonNullable<NonNullable<Place["openingHours"]>["periods"]>[number];

/**
 * Converts a weekly opening period into concrete datetimes aligned to the week containing the reference date.
 * Ensures the closing datetime is always after the opening datetime, accounting for periods that roll past midnight.
 *
 * @param period - The opening period definition from Google Places
 * @param referenceDate - ISO date (local) used to anchor the week containing the opening period
 * @returns A tuple of start and end datetimes for the opening period
 */
export function getOpeningPeriodWindow(period: OpeningPeriod, referenceDate: string): { start: string; end: string } {
  const reference = Temporal.PlainDate.from(referenceDate);
  const dayOfWeek = getDay(referenceDate);
  const weekStart = reference.subtract({ days: dayOfWeek });

  const openDate = weekStart.add({ days: period.open.day });
  const closeDate = weekStart.add({ days: period.close.day });
  const openDateTime = openDate.toPlainDateTime({ hour: period.open.hour, minute: period.open.minute });
  let closeDateTime = closeDate.toPlainDateTime({ hour: period.close.hour, minute: period.close.minute });

  let safetyCounter = 0;
  while (Temporal.PlainDateTime.compare(closeDateTime, openDateTime) <= 0 && safetyCounter < 7) {
    closeDateTime = closeDateTime.add({ days: 1 });
    safetyCounter++;
  }

  return {
    start: openDateTime.toString(),
    end: closeDateTime.toString(),
  };
}

/**
 * Finds the overlap between two datetime windows.
 * @returns A window representing the overlap, or undefined if there is none.
 */
export function calculateWindowIntersection(
  firstStart: BaseBlock["start"],
  firstEnd: BaseBlock["end"],
  secondStart: BaseBlock["start"],
  secondEnd: BaseBlock["end"]
): { start: string; end: string } | undefined {
  const aStart = Temporal.PlainDateTime.from(firstStart);
  const aEnd = Temporal.PlainDateTime.from(firstEnd);
  const bStart = Temporal.PlainDateTime.from(secondStart);
  const bEnd = Temporal.PlainDateTime.from(secondEnd);

  const overlapStart = Temporal.PlainDateTime.compare(aStart, bStart) > 0 ? aStart : bStart;
  const overlapEnd = Temporal.PlainDateTime.compare(aEnd, bEnd) < 0 ? aEnd : bEnd;

  if (Temporal.PlainDateTime.compare(overlapStart, overlapEnd) < 0) {
    return {
      start: overlapStart.toString(),
      end: overlapEnd.toString(),
    };
  }

  return undefined;
}
