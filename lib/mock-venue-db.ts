import "server-only";

import type { Venue } from "@/types/venue";

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

if (!g.__venues) {
  g.__venues = new Map(
    seededVenues.map((venue) => [venue.venueId, venue] as const),
  );
}

export const venues = g.__venues!;

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

  return updatedVenue;
}

export function deleteVenue(id: string) {
  return venues.delete(id);
}
