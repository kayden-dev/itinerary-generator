import { Temporal } from "@js-temporal/polyfill";

import { BaseBlock } from "../../utils/itinerary.ts";

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
 * @param placeA - The placeid (Google Places) of the first place
 * @param placeB - The placeid (Google Places) of the second place
 * @returns A time in minutes of the minimum transit time
 */
export function calculateMinTransitTime(placeA: string, placeB: string): number {
  return 30; //TODO: implement this function
}
