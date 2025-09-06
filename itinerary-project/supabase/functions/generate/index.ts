import "jsr:@supabase/functions-js/edge-runtime.d.ts"

Deno.serve(async (req) => {
  const trip = await req.json()
  const body = {
    id: crypto.randomUUID(),
    tripName: String(trip.name ?? ""),
    timezone: "Australia/Melbourne",
    dates: {
      start: String(trip.dates?.start ?? ""),
      end: String(trip.dates?.end ?? ""),
    },
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
