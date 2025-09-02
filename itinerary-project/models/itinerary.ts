export type Itinerary = {
  id: string;
  tripName: string;
  timezone: string;
  dates: { start: string; end: string };
  days: ItineraryDay[];
  meta: {
    generatedBy: "rule-engine" | "hybrid";
    version: string;
    createdAt: string;
  };
};

export type ItineraryDay = {
  date: string;                   // "YYYY-MM-DD" (local to `timezone`)
  destinationId: string;
  summary?: string;
  blocks: Block[];                // strictly time-ordered, non-overlapping
};

export type Block =
  | VisitBlock
  | TransitBlock
  | CheckInOutBlock
  | MealBlock;

type BaseBlock = {
  id: string;
  start: string;                  // ISO datetime with offset
  end: string;                    // ISO datetime with offset
  locked?: boolean;
  notes?: string;
  diagnostics?: Diagnostic[];
};

export type VisitBlock = BaseBlock & {
  type: "visit";
  placeId: string;
  placeRef: {
    id: string;
    name: string;
    address?: string;
    location: { lat: number; lng: number };
  };
  source: "fixed" | "scheduled";
  estimatedDurationMins?: number;
};

export type TransitBlock = BaseBlock & {
  type: "transit";
  mode: "Walk" | "Transit" | "Drive";
  from: { placeId: string };      // REQUIRED
  to:   { placeId: string };      // REQUIRED
  distanceMeters?: number;        // optional (router)
  durationMinutes?: number;       // optional (redundant with end-start, handy for UI)
  polyline?: string;              // optional
};

export type CheckInOutBlock = BaseBlock & {
  type: "check-in" | "check-out";
  placeId: string;                // accommodation is just another place
  placeRef: {
    id: string;
    name: string;
    address?: string;
    location: { lat: number; lng: number };
  };
};

export type MealBlock = BaseBlock & {
  type: "meal";
  meal: "Lunch" | "Dinner";
};

export type Diagnostic = {
  level: "info" | "warn" | "error";
  code:
    | "OVERLAP"
    | "GAP_TOO_SMALL"
    | "GAP_TOO_LARGE"
    | "CUTTING_IT_CLOSE"
    | "TOO_FAR_FOR_MODE"
    | "MEAL_MISSING"
    | "CHECKIN_CONFLICT"
    | "FIXED_TIME_CONFLICT";
  message: string;
  data?: Record<string, unknown>;
};