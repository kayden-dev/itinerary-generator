import { insertAnchors } from "./construction/anchors.ts";
import { buildDays } from "./construction/days.ts";
import { insertMustVisits } from "./construction/must_visits.ts";
import { Trip, TripSchema } from "./utils/trip.ts";
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

  const [days_must_visits, gaps, gapIDMap] = insertMustVisits(
    trip,
    days_anchors.data
  );

  // if (!days_must_visits.ok) {
  //   return new Response(JSON.stringify({ errors: [days_must_visits.error] }), {
  //     status: 400,
  //     headers: { "content-type": "application/json" },
  //   });
  // }

  const body = {
    id: crypto.randomUUID(),
    name: trip.name,
    timezone: trip.timezone ?? "Australia/Melbourne",
    dates: trip.dates,
    days: days_anchors.data,
    gaps: gaps,
    must_visit_gaps: days_must_visits,
    gapIDMap: gapIDMap,
    unscheduled: [], //days_must_visits.data.unscheduled,
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
