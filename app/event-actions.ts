"use server";

import { revalidatePath } from "next/cache";
import {
  createEvent,
  deleteEvent,
  getEventById,
  updateEvent,
} from "@/lib/mock-event-db";
import { getSession } from "@/lib/session";
import { venues } from "@/lib/mock-venue-db";
import type { EventFormInput } from "@/types/event";
import type { SessionUser } from "@/lib/session";

type EventActionResult =
  | {
      ok: true;
      message: string;
      redirectTo: string;
    }
  | {
      ok: false;
      message: string;
    };

function getRoleBasePath(role: "admin" | "organizer") {
  return `/${role}/events`;
}

function revalidateEventPaths(eventId?: string) {
  revalidatePath("/organizer/events");
  revalidatePath("/admin/events");
  revalidatePath("/organizer/events/create");
  revalidatePath("/admin/events/create");

  if (!eventId) {
    return;
  }

  revalidatePath(`/organizer/events/${eventId}`);
  revalidatePath(`/organizer/events/${eventId}/edit`);
  revalidatePath(`/admin/events/${eventId}`);
  revalidatePath(`/admin/events/${eventId}/edit`);
}

function canManageEvent(
  role: "admin" | "organizer",
  sessionUserId: string,
  organizerId: string,
) {
  if (role === "admin") {
    return true;
  }

  return sessionUserId === organizerId;
}

function validateEventInput(
  input: EventFormInput,
  role: "admin" | "organizer",
) {
  const title = input.eventTitle.trim();
  const artistIds = input.artists.filter(Boolean);
  const tickets = input.tickets.filter((ticket) => ticket.categoryName.trim());

  if (!title) {
    return "Judul acara wajib diisi.";
  }

  if (!input.date || !input.time) {
    return "Tanggal dan waktu acara wajib diisi.";
  }

  if (!input.venueId) {
    return "Venue wajib dipilih.";
  }

  if (role === "admin" && !input.organizerId?.trim()) {
    return "Organizer wajib dipilih untuk admin.";
  }

  if (artistIds.length === 0) {
    return "Pilih minimal satu artis.";
  }

  if (tickets.length === 0) {
    return "Tambahkan minimal satu kategori tiket.";
  }

  for (const ticket of tickets) {
    if (!ticket.categoryName.trim()) {
      return "Nama kategori tiket wajib diisi.";
    }

    if (!Number.isFinite(ticket.price) || ticket.price < 0) {
      return "Harga tiket harus bernilai 0 atau lebih.";
    }

    if (!Number.isFinite(ticket.quota) || ticket.quota <= 0) {
      return "Kuota tiket harus lebih dari 0.";
    }
  }

  const selectedVenue = venues.get(input.venueId);
  const totalQuota = tickets.reduce((sum, ticket) => sum + ticket.quota, 0);

  if (selectedVenue && totalQuota > selectedVenue.capacity) {
    return `Total kuota tiket (${totalQuota}) melebihi kapasitas venue ${selectedVenue.venueName} (${selectedVenue.capacity}).`;
  }

  return null;
}

async function getAuthorizedSession() {
  const session = await getSession();

  if (!session || (session.role !== "admin" && session.role !== "organizer")) {
    return null;
  }

  return session as SessionUser & { role: "admin" | "organizer" };
}

export async function createEventAction(
  input: EventFormInput,
): Promise<EventActionResult> {
  const session = await getAuthorizedSession();

  if (!session) {
    return {
      ok: false,
      message: "Anda tidak punya akses untuk membuat event.",
    };
  }

  const organizerId =
    session.role === "admin" ? input.organizerId?.trim() : session.id;
  const normalizedInput = {
    ...input,
    organizerId,
  };

  const validationError = validateEventInput(normalizedInput, session.role);

  if (validationError) {
    return {
      ok: false,
      message: validationError,
    };
  }

  const event = createEvent(normalizedInput, organizerId!);

  revalidateEventPaths(event.eventId);

  return {
    ok: true,
    message: "Acara berhasil dibuat.",
    redirectTo: `${getRoleBasePath(session.role)}/${event.eventId}`,
  };
}

export async function updateEventAction(
  eventId: string,
  input: EventFormInput,
): Promise<EventActionResult> {
  const session = await getAuthorizedSession();

  if (!session) {
    return {
      ok: false,
      message: "Anda tidak punya akses untuk mengubah event.",
    };
  }

  const existingEvent = getEventById(eventId);

  if (!existingEvent) {
    return {
      ok: false,
      message: "Event tidak ditemukan.",
    };
  }

  if (!canManageEvent(session.role, session.id, existingEvent.organizerId)) {
    return {
      ok: false,
      message: "Anda tidak berhak mengubah event ini.",
    };
  }

  const organizerId =
    session.role === "admin"
      ? input.organizerId?.trim() || existingEvent.organizerId
      : existingEvent.organizerId;
  const normalizedInput = {
    ...input,
    organizerId,
  };

  const validationError = validateEventInput(normalizedInput, session.role);

  if (validationError) {
    return {
      ok: false,
      message: validationError,
    };
  }

  const updatedEvent = updateEvent(eventId, normalizedInput, organizerId);

  if (!updatedEvent) {
    return {
      ok: false,
      message: "Event gagal diperbarui.",
    };
  }

  revalidateEventPaths(eventId);

  return {
    ok: true,
    message: "Acara berhasil diperbarui.",
    redirectTo: `${getRoleBasePath(session.role)}/${eventId}`,
  };
}

export async function deleteEventAction(
  eventId: string,
): Promise<EventActionResult> {
  const session = await getAuthorizedSession();

  if (!session) {
    return {
      ok: false,
      message: "Anda tidak punya akses untuk menghapus event.",
    };
  }

  const existingEvent = getEventById(eventId);

  if (!existingEvent) {
    return {
      ok: false,
      message: "Event tidak ditemukan.",
    };
  }

  if (!canManageEvent(session.role, session.id, existingEvent.organizerId)) {
    return {
      ok: false,
      message: "Anda tidak berhak menghapus event ini.",
    };
  }

  const deleted = deleteEvent(eventId);

  if (!deleted) {
    return {
      ok: false,
      message: "Event gagal dihapus.",
    };
  }

  revalidateEventPaths(eventId);

  return {
    ok: true,
    message: "Acara berhasil dihapus.",
    redirectTo: getRoleBasePath(session.role),
  };
}
