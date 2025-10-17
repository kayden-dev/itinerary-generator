import { insertAnchors } from "./construction/anchors.ts";
import { buildDays } from "./construction/days.ts";
import { findGaps } from "./construction/gaps.ts";
import type { DayWithPlaceBlocks, HomeLocation } from "./construction/gaps.ts";
import { type Destination, Trip, TripSchema } from "./utils/trip.ts";
import { parseJsonWith } from "./utils/validate.ts";

export async function handleGenerate(req: Request): Promise<Response> {
  const parsed = await parseJsonWith(req, TripSchema);

  if (!parsed.ok) {
    return new Response(JSON.stringify({ errors: parsed.errors }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const trip: Trip = parsed.data;

  const days = buildDays(trip.destinations, trip.dates);

  if (!days.ok) {
    return new Response(JSON.stringify({ errors: [days.error] }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const days_anchors = insertAnchors(trip, days.data);

  if (!days_anchors.ok) {
    return new Response(JSON.stringify({ errors: [days_anchors.error] }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const homeLocations: HomeLocation[] = trip.destinations.map((destination: Destination) => ({
    destinationId: destination.id,
    location: destination.accommodation?.location ?? destination.location,
  }));

  const daysWithAnchors = days_anchors.data as DayWithPlaceBlocks[];
  const gaps = findGaps(daysWithAnchors, homeLocations);

  const body = {
    id: crypto.randomUUID(),
    name: trip.name,
    timezone: trip.timezone ?? "Australia/Melbourne",
    dates: trip.dates,
    days: days_anchors.data,
    unscheduled: [],
    meta: {
      generatedBy: "rule-engine",
      version: "1.0.0",
      createdAt: new Date().toISOString(),
    },
  };

  return new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" },
  });
}

Deno.serve((req) => handleGenerate(req));
