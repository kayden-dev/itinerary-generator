export type Trip = {
  name: string;
  dates: { start: string; end: string }; // ISO string, "YYYY-MM-DD"
  timezone?: string; // timezone of the user inputting, to avoid bugs eg Australia/Melbourne
  // if timezone is missing, then default
  preferences: Preferences;
  destinations: Destination[];
  meta?: { version?: string; source?: "app" | "import"; createdAt?: string };
};

export type Preferences = {
  pace: "Relaxed" | "Balanced" | "Packed";
};

export type Destination = {
  id: string;
  placeId: string;
  name: string;
  dates: { start: string; end: string }; // "YYYY-MM-DD"
  accommodation?: Accomodation;
  places: Place[];
};

export type Accomodation = {
  id: string;
  placeId: string;
  name: string;
  address: string;
  location: { lat: number; lng: number }
  checkInTime?: string; // "15:00"
  checkOutTime?: string; // "10:00"
};

export type Place = {
  id: string;
  placeId: string;
  name: string;
  address: string;
  location: { lat: number; lng: number }
  fixed?: {
    start: string; // ISO datetime, e.g. "2025-10-03T14:30:00+10:00"
    end?: string; // ISO datetime, optional
  }
};