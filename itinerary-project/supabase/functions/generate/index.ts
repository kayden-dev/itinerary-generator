import "jsr:@supabase/functions-js/edge-runtime.d.ts";
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
  const body = {
    id: crypto.randomUUID(),
    tripName: trip.name,
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
