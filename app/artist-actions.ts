"use server";

import { revalidatePath } from "next/cache";
import {
  createArtist,
  deleteArtist,
  getAllArtists,
  updateArtist,
} from "@/lib/mock-artist-db";
import { getSession } from "@/lib/session";
import type { Artist } from "@/types/artist";

type ArtistMutationResult =
  | {
      ok: true;
      message: string;
      artists: Artist[];
    }
  | {
      ok: false;
      message: string;
    };

function revalidateArtistPaths() {
  revalidatePath("/admin/artists");
  revalidatePath("/artists");
  revalidatePath("/customer/artists");
  revalidatePath("/organizer/artists");
}

async function getAuthorizedSession() {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    return null;
  }

  return session;
}

function validateArtistInput(data: Omit<Artist, "artistId">) {
  if (!data.name.trim()) {
    return "Nama artist wajib diisi.";
  }

  return null;
}

export async function createArtistAction(
  data: Omit<Artist, "artistId">,
): Promise<ArtistMutationResult> {
  const session = await getAuthorizedSession();

  if (!session) {
    return {
      ok: false,
      message: "Anda tidak punya akses untuk menambah artist.",
    };
  }

  const validationError = validateArtistInput(data);

  if (validationError) {
    return {
      ok: false,
      message: validationError,
    };
  }

  createArtist({
    name: data.name.trim(),
    genre: data.genre?.trim() || undefined,
  });

  revalidateArtistPaths();

  return {
    ok: true,
    message: "Artist berhasil ditambahkan.",
    artists: getAllArtists(),
  };
}

export async function updateArtistAction(
  artistId: string,
  data: Omit<Artist, "artistId">,
): Promise<ArtistMutationResult> {
  const session = await getAuthorizedSession();

  if (!session) {
    return {
      ok: false,
      message: "Anda tidak punya akses untuk mengubah artist.",
    };
  }

  const validationError = validateArtistInput(data);

  if (validationError) {
    return {
      ok: false,
      message: validationError,
    };
  }

  const updated = updateArtist(artistId, {
    name: data.name.trim(),
    genre: data.genre?.trim() || undefined,
  });

  if (!updated) {
    return {
      ok: false,
      message: "Artist tidak ditemukan.",
    };
  }

  revalidateArtistPaths();

  return {
    ok: true,
    message: "Artist berhasil diperbarui.",
    artists: getAllArtists(),
  };
}

export async function deleteArtistAction(
  artistId: string,
): Promise<ArtistMutationResult> {
  const session = await getAuthorizedSession();

  if (!session) {
    return {
      ok: false,
      message: "Anda tidak punya akses untuk menghapus artist.",
    };
  }

  const deleted = deleteArtist(artistId);

  if (!deleted) {
    return {
      ok: false,
      message: "Artist tidak ditemukan.",
    };
  }

  revalidateArtistPaths();

  return {
    ok: true,
    message: "Artist berhasil dihapus.",
    artists: getAllArtists(),
  };
}
