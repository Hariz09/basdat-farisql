import { EventArtist } from "@/types/eventartist";

const g = globalThis as unknown as {
  __eventArtists?: EventArtist[];
};

if (!g.__eventArtists) {
  g.__eventArtists = [
    { eventId: "1", artistId: "4" },
    { eventId: "1", artistId: "3" },

    { eventId: "2", artistId: "2" },
    { eventId: "2", artistId: "6" },

    { eventId: "3", artistId: "1" },
    { eventId: "3", artistId: "8" },

    { eventId: "4", artistId: "3" },
    { eventId: "4", artistId: "7" },

    { eventId: "5", artistId: "5" },
    { eventId: "5", artistId: "6" },

    { eventId: "6", artistId: "1" },
    { eventId: "6", artistId: "2" },
  ];
}

export const eventArtists = g.__eventArtists!;