import { BaseBlock } from "../../utils/itinerary.ts";

/**
 * Calculates the end datetime given the start datetime and an offset (in minutes)
 *
 * @param start - The start datetime in local time
 * @param offset - The offset (in minutes) from the start datetime
 * @returns The end datetiome in local time
 */
export function calculateTimeOffset(start: BaseBlock["start"], offset: number): BaseBlock["end"] {
  const endObject = new Date(start);
  const offsetMilliseconds = offset * 60 * 1000; // convert the time in minutes to milliseconds
  endObject.setTime(endObject.getTime() + offsetMilliseconds);
  const end = endObject.toISOString().split(".")[0]; // remove the z from the string and the milliseconds
  return end;
}

/**
 * Calculates the default visit time for a place given the type of that place
 * @param type - Type of place, given from the Google Place Details API
 * @returns A time in minutes of the visit time
 */
export function calculateDefaultVisitTime(type?: string): number {
  return 60; // TODO: implement this function
}
