import { z } from "zod";

export const PlaceSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    address: z.string(),
    location: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    fixed: z
      .object({
        start: z.iso.datetime({ local: true }),
        end: z.iso.datetime({ local: true }).optional(),
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.fixed) return true;
      if (!data.fixed.end) return true;
      return new Date(data.fixed.start) <= new Date(data.fixed.end);
    },
    {
      message: "Start time must be equal or before end time",
      path: ["fixed"],
      params: { code: "place_end_before_start" },
    }
  );

export const AccommodationSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  checkInTime: z.iso.time().optional(),
  checkOutTime: z.iso.time().optional(),
});

export const DestinationSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    dates: z.object({
      start: z.iso.date(),
      end: z.iso.date(),
    }),
    accommodation: AccommodationSchema.optional(),
    places: z.array(PlaceSchema),
  })
  .refine((data) => data.dates.start <= data.dates.end, {
    message: "Start date must be equal or before end date",
    path: ["dates"],
    params: { code: "end_before_start" },
  });

export const PreferencesSchema = z.object({
  pace: z.enum(["Relaxed", "Balanced", "Packed"]),
});

export const TripSchema = z
  .object({
    name: z.string(),
    dates: z.object({
      start: z.iso.date(),
      end: z.iso.date(),
    }),
    timezone: z.string().optional(), // e.g. "Australia/Melbourne"
    preferences: PreferencesSchema,
    destinations: z.array(DestinationSchema),
    meta: z
      .object({
        version: z.string().optional(),
        source: z.enum(["app", "import"]).optional(),
        createdAt: z.iso.datetime({ offset: true }).optional(),
      })
      .optional(),
  })
  .refine((data) => data.dates.start <= data.dates.end, {
    message: "Start date must be equal or before end date",
    path: ["dates"],
    params: { code: "end_before_start" },
  })
  .strict();

export type Preferences = z.infer<typeof PreferencesSchema>;
export type Accommodation = z.infer<typeof AccommodationSchema>;
export type Place = z.infer<typeof PlaceSchema>;
export type Destination = z.infer<typeof DestinationSchema>;
export type Trip = z.infer<typeof TripSchema>;
