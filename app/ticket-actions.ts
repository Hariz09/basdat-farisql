"use server";

import { revalidatePath } from "next/cache";
import { tickets, createTicket, deleteTicket } from "@/lib/mock-ticket-db";
import type { TicketView, TicketActionResult, TicketFormState } from "@/types/ticket";

const frontendStatusOverrides = new Map<string, { status: TicketView["status"], seatInfo?: string }>();

const generateTicketCode = (categoryId: string): string => {
  const prefix = categoryId.substring(0, 3).toUpperCase();
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `TTK-${prefix}-${randomNum}`;
};

export async function getTicketsAction(): Promise<TicketActionResult> {
  try {
    const rawTickets = Array.from(tickets.values());

    const ticketViews: TicketView[] = rawTickets.map((ticket) => {
      const override = frontendStatusOverrides.get(ticket.ticketId);
      const isVip = ticket.tcategoryId.includes("vip");

      return {
        ...ticket,
        status: override?.status ?? "Valid",
        seatInfo: override?.seatInfo,
        categoryName: isVip ? "VIP" : "General Admission",
        eventName: isVip ? "Konser Melodi Senja" : "Festival Seni Budaya",
        eventDate: "2024-05-15T19:00:00",
        venueName: "Jakarta Convention Center",
        venueCity: "Jakarta",
        price: isVip ? 750000 : 150000,
        customerName: "Budi Santoso",
      };
    });

    return { ok: true, message: "Berhasil mengambil data tiket", tickets: ticketViews };
  } catch (error) {
    return { ok: false, message: "Gagal mengambil data tiket dari database" };
  }
}

export async function addTicketAction(data: TicketFormState): Promise<TicketActionResult> {
  try {
    const newTicket = createTicket({
      ticketCode: generateTicketCode(data.tcategoryId),
      tcategoryId: data.tcategoryId,
      torderId: data.torderId,
    });

    if (data.seatInfo && data.seatInfo !== "none") {
      frontendStatusOverrides.set(newTicket.ticketId, {
        status: "Valid",
        seatInfo: data.seatInfo,
      });
    }

    revalidatePath("/admin/tickets");
    return getTicketsAction();
  } catch (error) {
    return { ok: false, message: "Gagal membuat tiket baru" };
  }
}

export async function editTicketAction(ticketId: string, status: TicketView["status"], seatInfo?: string): Promise<TicketActionResult> {
  try {
    frontendStatusOverrides.set(ticketId, {
      status,
      seatInfo: seatInfo === "none" ? undefined : seatInfo,
    });

    revalidatePath("/admin/tickets");
    return getTicketsAction();
  } catch (error) {
    return { ok: false, message: "Gagal memperbarui tiket" };
  }
}

export async function removeTicketAction(ticketId: string): Promise<TicketActionResult> {
  try {
    frontendStatusOverrides.delete(ticketId);
    deleteTicket(ticketId);
    
    revalidatePath("/admin/tickets");
    return getTicketsAction();
  } catch (error) {
    return { ok: false, message: "Gagal menghapus tiket" };
  }
}