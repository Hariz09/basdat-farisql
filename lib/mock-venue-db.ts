import "server-only";

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { Venue } from "@/types/venue";

const RUNTIME_DIRECTORY = path.join(process.cwd(), ".runtime");
const VENUES_FILE_PATH = path.join(RUNTIME_DIRECTORY, "mock-venues.json");

const seededVenues: Venue[] = [
  {
    venueId: "1",
    venueName: "Jakarta Convention Center",
    capacity: 1000,
    address: "Jl. Gatot Subroto No.1",
    city: "Jakarta",
    seatingType: "reserved",
  },
  {
    venueId: "2",
    venueName: "Balai Sarbini",
    capacity: 500,
    address: "Jl. Jend. Sudirman",
    city: "Jakarta",
    seatingType: "free",
  },
  {
    venueId: "3",
    venueName: "Graha Sabha Pramana",
    capacity: 1200,
    address: "Bulaksumur",
    city: "Yogyakarta",
    seatingType: "reserved",
  },
  {
    venueId: "4",
    venueName: "Trans Luxury Hall",
    capacity: 800,
    address: "Jl. Gatot Subroto No.289",
    city: "Bandung",
    seatingType: "free",
  },
  {
    venueId: "5",
    venueName: "Dyandra Convention Center",
    capacity: 1500,
    address: "Jl. Basuki Rahmat No.93-105",
    city: "Surabaya",
    seatingType: "reserved",
  },
];

const g = globalThis as unknown as {
  __venues?: Map<string, Venue>;
};

function ensureVenueFile() {
  mkdirSync(RUNTIME_DIRECTORY, { recursive: true });

  if (!existsSync(VENUES_FILE_PATH)) {
    writeFileSync(
      VENUES_FILE_PATH,
      JSON.stringify(seededVenues, null, 2),
      "utf8",
    );

    return seededVenues;
  }

  try {
    const raw = readFileSync(VENUES_FILE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Venue[];

    if (!Array.isArray(parsed)) {
      throw new Error("Venue runtime store is not an array.");
    }

    return parsed;
  } catch {
    writeFileSync(
      VENUES_FILE_PATH,
      JSON.stringify(seededVenues, null, 2),
      "utf8",
    );

    return seededVenues;
  }
}

function getVenueStore() {
  if (!g.__venues) {
    const persistedVenues = ensureVenueFile();
    g.__venues = new Map(
      persistedVenues.map((venue) => [venue.venueId, venue] as const),
    );
  }

  return g.__venues;
}

function persistVenues() {
  const store = getVenueStore();
  mkdirSync(RUNTIME_DIRECTORY, { recursive: true });
  writeFileSync(
    VENUES_FILE_PATH,
    JSON.stringify(Array.from(store.values()), null, 2),
    "utf8",
  );
}

export const venues = getVenueStore();

export function getAllVenues() {
  return Array.from(venues.values());
}

export function createVenue(data: Omit<Venue, "venueId">) {
  const id = crypto.randomUUID();

  const newVenue: Venue = {
    venueId: id,
    ...data,
  };

  venues.set(id, newVenue);
  persistVenues();

  return newVenue;
}

export function updateVenue(id: string, data: Omit<Venue, "venueId">) {
  const existingVenue = venues.get(id);

  if (!existingVenue) {
    return null;
  }

  const updatedVenue: Venue = {
    venueId: id,
    ...data,
  };

  venues.set(id, updatedVenue);
  persistVenues();

  return updatedVenue;
}

export function deleteVenue(id: string) {
  const deleted = venues.delete(id);

  if (!deleted) {
    return false;
  }

  persistVenues();
  return true;
}
