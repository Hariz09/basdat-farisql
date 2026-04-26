import { Artist } from "@/types/artist";

const g = globalThis as unknown as {
  __artists?: Map<string, Artist>;
};

if (!g.__artists) {
  g.__artists = new Map<string, Artist>([
    ["1", { artistId: "1", name: "Hindia", genre: "Pop" }],
    ["2", { artistId: "2", name: "Tulus", genre: "Pop" }],
    ["3", { artistId: "3", name: "Nadin Amizah", genre: "Folk" }],
    ["4", { artistId: "4", name: "Fourtwnty", genre: "Indie" }],
    ["5", { artistId: "5", name: "Pamungkas", genre: "Pop" }],
    ["6", { artistId: "6", name: "Raisa", genre: "Pop" }],
    ["7", { artistId: "7", name: "Yura Yunita", genre: "Pop" }],
    ["8", { artistId: "8", name: "Kunto Aji", genre: "Indie" }],
  ]);
}

export const artists = g.__artists!;

export function getAllArtists() {
  return Array.from(artists.values());
}