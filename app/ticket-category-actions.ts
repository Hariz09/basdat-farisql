"use server";

import { revalidatePath } from "next/cache";
import {
  createTicketCategory,
  deleteTicketCategory,
  getAllTicketCategories,
  getTotalQuotaByEventId,
  updateTicketCategory,
} from "@/lib/mock-ticketCategory-db";
import { getAllEvents } from "@/lib/mock-event-db";
import { getSession } from "@/lib/session";
import { venues } from "@/lib/mock-venue-db";
import {
  getTicketCategoryViews,
  type TicketCategoryView,
} from "@/lib/ticket-category-helpers";
import type { TicketCategory } from "@/types/ticketCategory";

type TicketCategoryMutationResult =
  | {
      ok: true;
      message: string;
      ticketCategories: TicketCategoryView[];
    }
  | {
      ok: false;
      message: string;
    };

function revalidateTicketCategoryPaths() {
  revalidatePath("/admin/ticket-categories");
  revalidatePath("/organizer/ticket-categories");
  revalidatePath("/customer/ticket-categories");
  revalidatePath("/ticket-categories");
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

function validateTicketCategoryInput(
  data: Omit<TicketCategory, "categoryId">,
  isNew: boolean,
  currentId?: string,
) {
  if (!data.categoryName.trim()) {
    return "Nama kategori wajib diisi.";
  }

  if (!Number.isFinite(data.quota) || data.quota <= 0) {
    return "Kuota harus bilangan bulat positif (> 0).";
  }

  if (!Number.isFinite(data.price) || data.price <= 0) {
    return "Harga harus bilangan positif (> 0).";
  }

  if (!data.teventId) {
    return "Event wajib dipilih.";
  }

  const events = getAllEvents();
  const event = events.find((e) => e.eventId === data.teventId);
  if (!event) {
    return "Event tidak ditemukan.";
  }

  const venueCapacity = venues.get(event.venueId)?.capacity ?? 0;
  if (venueCapacity <= 0) {
    return "Kapasitas venue tidak valid.";
  }

  const currentTotalQuota = getTotalQuotaByEventId(data.teventId);
  const existingQuota = isNew
    ? 0
    : (getAllTicketCategories().find((tc) => tc.categoryId === currentId)
        ?.quota ?? 0);
  const newTotalQuota = currentTotalQuota - existingQuota + data.quota;

  if (newTotalQuota > venueCapacity) {
    return `Total kuota (${newTotalQuota}) tidak boleh melebihi kapasitas venue (${venueCapacity}). Kuota tersedia: ${venueCapacity - (currentTotalQuota - existingQuota)}.`;
  }

  return null;
}

export async function createTicketCategoryAction(
  data: Omit<TicketCategory, "categoryId">,
): Promise<TicketCategoryMutationResult> {
  const session = await getAuthorizedSession();

  if (!session) {
    return {
      ok: false,
      message: "Anda tidak punya akses untuk menambah kategori tiket.",
    };
  }

  const validationError = validateTicketCategoryInput(data, true);

  if (validationError) {
    return {
      ok: false,
      message: validationError,
    };
  }

  createTicketCategory({
    categoryName: data.categoryName.trim(),
    quota: data.quota,
    price: data.price,
    teventId: data.teventId,
  });

  revalidateTicketCategoryPaths();

  return {
    ok: true,
    message: "Kategori tiket berhasil ditambahkan.",
    ticketCategories: getTicketCategoryViews(),
  };
}

export async function updateTicketCategoryAction(
  categoryId: string,
  data: Omit<TicketCategory, "categoryId">,
): Promise<TicketCategoryMutationResult> {
  const session = await getAuthorizedSession();

  if (!session) {
    return {
      ok: false,
      message: "Anda tidak punya akses untuk mengubah kategori tiket.",
    };
  }

  const validationError = validateTicketCategoryInput(data, false, categoryId);

  if (validationError) {
    return {
      ok: false,
      message: validationError,
    };
  }

  const updated = updateTicketCategory(categoryId, {
    categoryName: data.categoryName.trim(),
    quota: data.quota,
    price: data.price,
    teventId: data.teventId,
  });

  if (!updated) {
    return {
      ok: false,
      message: "Kategori tiket tidak ditemukan.",
    };
  }

  revalidateTicketCategoryPaths();

  return {
    ok: true,
    message: "Kategori tiket berhasil diperbarui.",
    ticketCategories: getTicketCategoryViews(),
  };
}

export async function deleteTicketCategoryAction(
  categoryId: string,
): Promise<TicketCategoryMutationResult> {
  const session = await getAuthorizedSession();

  if (!session) {
    return {
      ok: false,
      message: "Anda tidak punya akses untuk menghapus kategori tiket.",
    };
  }

  const deleted = deleteTicketCategory(categoryId);

  if (!deleted) {
    return {
      ok: false,
      message: "Kategori tiket tidak ditemukan.",
    };
  }

  revalidateTicketCategoryPaths();

  return {
    ok: true,
    message: "Kategori tiket berhasil dihapus.",
    ticketCategories: getTicketCategoryViews(),
  };
}
