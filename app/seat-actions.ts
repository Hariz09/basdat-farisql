"use server";

import { revalidatePath } from "next/cache";
import { seats } from "@/lib/mock-seat-db";
import { hasRelationships } from "@/lib/mock-order-db";
import { venues } from "@/lib/mock-venue-db";
import type { SessionUser } from "@/lib/session";
import type { SeatView, SeatActionResult, SeatFormState, VenueOption } from "@/types/seat";

export async function getSeatsAction(session: SessionUser): Promise<SeatActionResult> {
  try {
    const rawSeats = Array.from(seats.values());

    const seatViews: SeatView[] = rawSeats.map((seat) => {
      const venue = venues.get(seat.venueId);
      const isAssigned = hasRelationships.some((r) => r.seatId === seat.seatId);

      return {
        ...seat,
        venueName: venue?.venueName ?? "-",
        status: isAssigned ? "Terisi" : "Tersedia",
        isAssigned,
      };
    });

    return { ok: true, message: "Sukses", seats: seatViews };
  } catch (error) {
    return { ok: false, message: "Gagal memuat data kursi" };
  }
}

export async function getVenueOptionsAction(): Promise<VenueOption[]> {
  return Array.from(venues.values()).map((v) => ({
    venueId: v.venueId,
    venueName: v.venueName,
  }));
}

export async function addSeatAction(data: SeatFormState): Promise<SeatActionResult> {
  try {
    const seatId = `${data.venueId}_${data.section}_${data.rowNumber}_${data.seatNumber}`;

    if (seats.has(seatId)) {
      return { ok: false, message: "Kursi dengan identitas tersebut sudah ada" };
    }

    seats.set(seatId, { seatId, ...data });

    revalidatePath("/admin/seats");
    revalidatePath("/organizer/seats");
    revalidatePath("/customer/seats");

    return { ok: true, message: "Sukses", seats: [] };
  } catch (error) {
    return { ok: false, message: "Gagal menambah kursi" };
  }
}

export async function editSeatAction(oldSeatId: string, data: SeatFormState): Promise<SeatActionResult> {
  try {
    const newSeatId = `${data.venueId}_${data.section}_${data.rowNumber}_${data.seatNumber}`;
    const isAssigned = hasRelationships.some((r) => r.seatId === oldSeatId);

    if (oldSeatId !== newSeatId) {
      if (seats.has(newSeatId)) {
        return { ok: false, message: "Identitas kursi baru sudah digunakan kursi lain" };
      }
      if (isAssigned) {
        return { ok: false, message: "Kursi sedang terisi, identitas tidak dapat diubah" };
      }
    }

    seats.delete(oldSeatId);
    seats.set(newSeatId, { seatId: newSeatId, ...data });

    revalidatePath("/admin/seats");
    revalidatePath("/organizer/seats");
    revalidatePath("/customer/seats");

    return { ok: true, message: "Sukses", seats: [] };
  } catch (error) {
    return { ok: false, message: "Gagal mengubah kursi" };
  }
}

export async function removeSeatAction(seatId: string): Promise<SeatActionResult> {
  try {
    const isAssigned = hasRelationships.some((r) => r.seatId === seatId);

    if (isAssigned) {
      return { ok: false, message: "Kursi ini sudah di-assign ke tiket dan tidak dapat dihapus. Hapus atau ubah tiket terlebih dahulu." };
    }

    seats.delete(seatId);

    revalidatePath("/admin/seats");
    revalidatePath("/organizer/seats");
    revalidatePath("/customer/seats");

    return { ok: true, message: "Sukses", seats: [] };
  } catch (error) {
    return { ok: false, message: "Gagal menghapus kursi" };
  }
}