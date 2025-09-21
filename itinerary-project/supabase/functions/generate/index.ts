import { buildDays } from "./utils/build.ts";
import { Trip, TripSchema } from "./utils/trip.ts";
import { parseJsonWith } from "./utils/validate.ts";

Deno.serve(async (req) => {
  const parsed = await parseJsonWith(req,TripSchema);

  if (!parsed.ok) {
    return new Response(JSON.stringify({errors:parsed.errors}),{
      status: 400,
      headers: {"content-type":"application/json"},
    })
  }

  const trip : Trip = parsed.data;

  const days = buildDays(trip.destinations,trip.dates);

  if (!days.ok) {
    return new Response(JSON.stringify({errors:[days.error]}),{
      status: 400,
      headers: {"content-type":"application/json"}
    })
  }
  const body = {
    id: crypto.randomUUID(),
    name: trip.name,
    timezone: trip.timezone ?? "Australia/Melbourne",
    dates: trip.dates,
    days: [],
    unscheduled: [],
    meta: {
      generatedBy: "rule-engine",
      version: "1.0.0",
      createdAt: new Date().toISOString()
    }
  }

  return new Response(
    JSON.stringify(body),
    { headers: { "Content-Type": "application/json" } },
  )
})
