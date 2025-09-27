import z from "zod";
import { PlaceSchema } from "./trip.ts";

export const BaseBlockSchema = z.object({
  id: z.string(),
  start: z.iso.datetime({ local: true }),
  end: z.iso.datetime({ local: true }),
  locked: z.boolean().optional(),
  notes: z.string().optional(),
})
.refine((data) => data.start <= data.end, {
  message: "Start datetime must be equal or before end datetime",
  path: ["start"],
  params: {code: "endtime_before_starttime"}
});

export const VisitBlockSchema = BaseBlockSchema.extend({
  type: z.literal("visit"),
  placeRef: PlaceSchema.omit({fixed: true}),
  source: z.enum(["fixed","scheduled"])
});

export const TransitBlockSchema = BaseBlockSchema.extend({
  type: z.literal("transit"),
  mode: z.enum(["Walk","Transit","Drive"]),
  from: z.object({ placeId: z.string()}),
  to: z.object({placeId: z.string()}),
  duration: z.number(),
});

export const CheckInOutBlockSchema = BaseBlockSchema.extend({
  type: z.enum(["check-in","check-out"]),
  placeRef: PlaceSchema.omit({fixed: true}),
});

export const MealBlockSchema = BaseBlockSchema.extend({
  type: z.literal("meal"),
  meal: z.enum(["Lunch", "Snack","Dinner"])
})

export const BlockSchema = z.discriminatedUnion("type",[
  VisitBlockSchema,
  TransitBlockSchema,
  CheckInOutBlockSchema,
  MealBlockSchema,
]);

export const DaySchema = z.object({
  date: z.iso.date(),
  destinationId: z.string(),
  summary: z.string().optional(),
  blocks: z.array(BlockSchema)
});

export const UnscheduledSchema = z.object({
  placeId: z.string(),
  reason: z.enum(["closed","transit_infeasible","fixed_conflict"])
})

export const ItinerarySchema = z.object({
  id: z.string(),
  name: z.string(),
  timezone: z.string(),
  dates: z.object({
    start: z.iso.date(), 
    end: z.iso.date(),   
  }),
  unscheduled: z.array(UnscheduledSchema),
  days: z.array(DaySchema),
  meta: z.object({
    generatedBy: z.enum(["rule-engine","hybrid"]),
    version: z.string(),
    createdAt: z.iso.datetime({ offset: true })
  })
})
.refine((data) => data.dates.start <= data.dates.end, {
  message: "Start date must be equal or before end date",
  path: ["dates"],
  params: {code: "end_before_start"}
})
.strict();

export type BaseBlock = z.infer<typeof BaseBlockSchema>;
export type VisitBlock = z.infer<typeof VisitBlockSchema>;
export type TransitBlock = z.infer<typeof TransitBlockSchema>;
export type CheckInOutBlock = z.infer<typeof CheckInOutBlockSchema>;
export type MealBlock = z.infer<typeof MealBlockSchema>;
export type Day = z.infer<typeof DaySchema>;
export type Unscheduled = z.infer<typeof UnscheduledSchema>;
export type Itinerary = z.infer<typeof ItinerarySchema>;