import "server-only";

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { Artist } from "@/types/artist";

const RUNTIME_DIRECTORY = path.join(process.cwd(), ".runtime");
const ARTISTS_FILE_PATH = path.join(RUNTIME_DIRECTORY, "mock-artists.json");

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

function ensureArtistFile() {
  mkdirSync(RUNTIME_DIRECTORY, { recursive: true });

  if (!existsSync(ARTISTS_FILE_PATH)) {
    writeFileSync(
      ARTISTS_FILE_PATH,
      JSON.stringify(seededArtists, null, 2),
      "utf8",
    );

    return seededArtists;
  }

  try {
    const raw = readFileSync(ARTISTS_FILE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Artist[];

    if (!Array.isArray(parsed)) {
      throw new Error("Artist runtime store is not an array.");
    }

    return parsed;
  } catch {
    writeFileSync(
      ARTISTS_FILE_PATH,
      JSON.stringify(seededArtists, null, 2),
      "utf8",
    );

    return seededArtists;
  }
}

function getArtistStore() {
  if (!g.__artists) {
    const persistedArtists = ensureArtistFile();
    g.__artists = new Map(
      persistedArtists.map((artist) => [artist.artistId, artist] as const),
    );
  }

  return g.__artists;
}

function persistArtists() {
  const store = getArtistStore();
  mkdirSync(RUNTIME_DIRECTORY, { recursive: true });
  writeFileSync(
    ARTISTS_FILE_PATH,
    JSON.stringify(Array.from(store.values()), null, 2),
    "utf8",
  );
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
  persistArtists();

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
  persistArtists();

  return updatedArtist;
}

export function deleteArtist(id: string) {
  const deleted = artists.delete(id);

  if (!deleted) {
    return false;
  }

  persistArtists();
  return true;
}