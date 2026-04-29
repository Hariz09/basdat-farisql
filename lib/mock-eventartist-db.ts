import type { EventArtist } from "@/lib/schemas";
import { EventArtistSchema } from "@/lib/schemas";

const ea = (eventId: string, artistId: string, role?: string): EventArtist =>
  EventArtistSchema.parse({ eventId, artistId, role });

const g = globalThis as unknown as {
  __eventArtists?: EventArtist[];
};

if (!g.__eventArtists) {
  g.__eventArtists = [
    ea("1", "4", "Performer"),
    ea("1", "3", "Performer"),

    ea("2", "2", "Headliner"),
    ea("2", "6", "Supporting"),

    ea("3", "1", "Headliner"),
    ea("3", "8", "Supporting"),

    ea("4", "3", "Performer"),
    ea("4", "7", "Performer"),

    ea("5", "5", "Headliner"),
    ea("5", "6", "Supporting"),

    ea("6", "1", "Performer"),
    ea("6", "2", "Performer"),
  ];
}

export const eventArtists = g.__eventArtists!;
