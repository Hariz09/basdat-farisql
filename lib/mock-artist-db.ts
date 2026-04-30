import "server-only";

import type { Artist } from "@/types/artist";

const seededArtists: Artist[] = [
  { artistId: "1", name: "Hindia", genre: "Pop" },
  { artistId: "2", name: "Tulus", genre: "Pop" },
  { artistId: "3", name: "Nadin Amizah", genre: "Folk" },
  { artistId: "4", name: "Fourtwnty", genre: "Indie" },
  { artistId: "5", name: "Pamungkas", genre: "Pop" },
  { artistId: "6", name: "Raisa", genre: "Pop" },
  { artistId: "7", name: "Yura Yunita", genre: "Pop" },
  { artistId: "8", name: "Kunto Aji", genre: "Indie" },
];

const g = globalThis as unknown as {
  __artists?: Map<string, Artist>;
};

function getArtistStore() {
  if (!g.__artists) {
    g.__artists = new Map(
      seededArtists.map((artist) => [artist.artistId, artist] as const),
    );
  }

  return g.__artists;
}

export const artists = getArtistStore();

export function getAllArtists() {
  return Array.from(artists.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

export function createArtist(data: Omit<Artist, "artistId">) {
  const id = crypto.randomUUID();

  const newArtist: Artist = {
    artistId: id,
    ...data,
  };

  artists.set(id, newArtist);

  return newArtist;
}

export function updateArtist(id: string, data: Omit<Artist, "artistId">) {
  const existingArtist = artists.get(id);

  if (!existingArtist) {
    return null;
  }

  const updatedArtist: Artist = {
    artistId: id,
    ...data,
  };

  artists.set(id, updatedArtist);

  return updatedArtist;
}

export function deleteArtist(id: string) {
  return artists.delete(id);
}
