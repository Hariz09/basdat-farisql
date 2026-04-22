import { Venue } from "@/types/venue";

const a = globalThis as unknown as {
  __venues?: Map<string, Venue>;
};

if (!a.__venues) {
  a.__venues = new Map<string, Venue>([
    [
      "1",
      {
        venueId: "1",
        venueName: "Jakarta Convention Center",
        capacity: 1000,
        address: "Jl. Gatot Subroto No.1",
        city: "Jakarta",
        seatingType: "reserved",
      },
    ],
    [
      "2",
      {
        venueId: "2",
        venueName: "Balai Sarbini",
        capacity: 500,
        address: "Jl. Jend. Sudirman",
        city: "Jakarta",
        seatingType: "free",
      },
    ],
    [
      "3",
      {
        venueId: "3",
        venueName: "Graha Sabha Pramana",
        capacity: 1200,
        address: "Bulaksumur",
        city: "Yogyakarta",
        seatingType: "reserved",
      },
    ],
    [
      "4",
      {
        venueId: "4",
        venueName: "Trans Luxury Hall",
        capacity: 800,
        address: "Jl. Gatot Subroto No.289",
        city: "Bandung",
        seatingType: "free",
      },
    ],
    [
      "5",
      {
        venueId: "5",
        venueName: "Dyandra Convention Center",
        capacity: 1500,
        address: "Jl. Basuki Rahmat No.93-105",
        city: "Surabaya",
        seatingType: "reserved",
      },
    ],
  ]);
}

export const venues = a.__venues!;

export function getAllVenues() {
  return Array.from(venues.values());
}

export function createVenue(data: Omit<Venue, "venueId">) {
  const id = Date.now().toString();

  const newVenue: Venue = {
    venueId: id,
    ...data,
  };

  venues.set(id, newVenue);
}

export function updateVenue(id: string, data: Omit<Venue, "venueId">) {
  const existing = venues.get(id);
  if (!existing) return;

  venues.set(id, {
    venueId: id,
    ...data,
  });
}

export function deleteVenue(id: string) {
  venues.delete(id);
}