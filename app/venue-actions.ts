"use server";

import { revalidatePath } from "next/cache";
import {
  createVenue,
  deleteVenue,
  getAllVenues,
  updateVenue,
} from "@/lib/mock-venue-db";
import { getSession } from "@/lib/session";
import type { Venue } from "@/types/venue";

type VenueMutationResult =
  | {
      ok: true;
      message: string;
      venues: Venue[];
    }
  | {
      ok: false;
      message: string;
    };

function revalidateVenuePaths() {
  revalidatePath("/admin/venues");
  revalidatePath("/organizer/venues");
  revalidatePath("/customer/venues");
  revalidatePath("/venues");
  revalidatePath("/events");
  revalidatePath("/customer/events");
}

async function getAuthorizedSession() {
  const session = await getSession();

  if (!session || (session.role !== "admin" && session.role !== "organizer")) {
    return null;
  }

  return session;
}

function validateVenueInput(data: Omit<Venue, "venueId">) {
  if (!data.venueName.trim()) {
    return "Nama venue wajib diisi.";
  }

  if (!data.city.trim()) {
    return "Kota venue wajib diisi.";
  }

  if (!data.address.trim()) {
    return "Alamat venue wajib diisi.";
  }

  if (!Number.isFinite(data.capacity) || data.capacity <= 0) {
    return "Kapasitas venue harus lebih dari 0.";
  }

  return null;
}

export async function createVenueAction(
  data: Omit<Venue, "venueId">,
): Promise<VenueMutationResult> {
  const session = await getAuthorizedSession();

  if (!session) {
    return {
      ok: false,
      message: "Anda tidak punya akses untuk menambah venue.",
    };
  }

  const validationError = validateVenueInput(data);

  if (validationError) {
    return {
      ok: false,
      message: validationError,
    };
  }

  createVenue({
    venueName: data.venueName.trim(),
    city: data.city.trim(),
    capacity: data.capacity,
    address: data.address.trim(),
    seatingType: data.seatingType,
  });

  revalidateVenuePaths();

  return {
    ok: true,
    message: "Venue berhasil ditambahkan.",
    venues: getAllVenues(),
  };
}

export async function updateVenueAction(
  venueId: string,
  data: Omit<Venue, "venueId">,
): Promise<VenueMutationResult> {
  const session = await getAuthorizedSession();

  if (!session) {
    return {
      ok: false,
      message: "Anda tidak punya akses untuk mengubah venue.",
    };
  }

  const validationError = validateVenueInput(data);

  if (validationError) {
    return {
      ok: false,
      message: validationError,
    };
  }

  const updated = updateVenue(venueId, {
    venueName: data.venueName.trim(),
    city: data.city.trim(),
    capacity: data.capacity,
    address: data.address.trim(),
    seatingType: data.seatingType,
  });

  if (!updated) {
    return {
      ok: false,
      message: "Venue tidak ditemukan.",
    };
  }

  revalidateVenuePaths();

  return {
    ok: true,
    message: "Venue berhasil diperbarui.",
    venues: getAllVenues(),
  };
}

export async function deleteVenueAction(
  venueId: string,
): Promise<VenueMutationResult> {
  const session = await getAuthorizedSession();

  if (!session) {
    return {
      ok: false,
      message: "Anda tidak punya akses untuk menghapus venue.",
    };
  }

  const deleted = deleteVenue(venueId);

  if (!deleted) {
    return {
      ok: false,
      message: "Venue tidak ditemukan.",
    };
  }

  revalidateVenuePaths();

  return {
    ok: true,
    message: "Venue berhasil dihapus.",
    venues: getAllVenues(),
  };
}
