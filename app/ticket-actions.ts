"use server";

import { revalidatePath } from "next/cache";
import { tickets, createTicket, deleteTicket } from "@/lib/mock-ticket-db";
import { orders, hasRelationships, assignSeat } from "@/lib/mock-order-db";
import { ticketCategories } from "@/lib/mock-ticketCategory-db";
import { events } from "@/lib/mock-event-db";
import { customers } from "@/lib/mock-auth-db";
import { venues } from "@/lib/mock-venue-db";
import { getAvailableSeatsByVenue, getSeatById } from "@/lib/mock-seat-db";
import type { SessionUser } from "@/lib/session";

import type { TicketView, TicketActionResult, TicketFormState } from "@/types/ticket";

type TicketOverride = {
  status: TicketView["status"];
};

const frontendStatusOverrides = new Map<string, TicketOverride>();

const generateTicketCode = (): string => {
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `TKT-2026-${randomNum}`;
};

export async function getTicketsAction(session: SessionUser): Promise<TicketActionResult> {
  try {
    const rawTickets = Array.from(tickets.values());

    const filteredRawTickets = rawTickets.filter((ticket) => {
      if (session.role === "admin") return true;

      const order = orders.get(ticket.torderId);

      if (session.role === "customer") {
        const customerRecord = order ? customers.get(order.customerId) : undefined;
        return customerRecord?.userId === session.userId;
      }

      if (session.role === "organizer") {
        const category = ticketCategories.find((c) => c.categoryId === ticket.tcategoryId);
        const event = category ? events.get(category.teventId) : undefined;
        return event?.organizerId === session.profileId;
      }

      return false;
    });

    const ticketViews: TicketView[] = filteredRawTickets.map((ticket) => {
      const override = frontendStatusOverrides.get(ticket.ticketId);
      const order = orders.get(ticket.torderId);
      const category = ticketCategories.find((c) => c.categoryId === ticket.tcategoryId);
      const event = category ? events.get(category.teventId) : undefined;
      const customer = order ? customers.get(order.customerId) : undefined;
      const venue = event ? venues.get(event.venueId) : undefined;

      const rel = hasRelationships.find((r) => r.ticketId === ticket.ticketId);
      let seatInfo = undefined;
      let seatId = undefined;

      if (rel) {
        seatId = rel.seatId;
        const seat = getSeatById(rel.seatId);
        if (seat) {
          seatInfo = `${seat.section} — Baris ${seat.rowNumber}, No. ${seat.seatNumber}`;
        }
      }

      return {
        ...ticket,
        status: override?.status ?? "Valid",
        seatId,
        seatInfo,
        categoryName: category?.categoryName ?? "-",
        eventName: event?.eventTitle ?? "-",
        eventDate: event?.eventDatetime ?? "",
        venueName: venue?.venueName ?? "-",
        venueCity: venue?.city ?? "-",
        price: category?.price ?? 0,
        customerName: customer?.fullName ?? "-",
      };
    });

    return { ok: true, message: "Sukses", tickets: ticketViews };
  } catch (error) {
    return { ok: false, message: "Gagal memuat data tiket" };
  }
}

export async function addTicketAction(data: TicketFormState): Promise<TicketActionResult> {
  try {
    const category = ticketCategories.find((c) => c.categoryId === data.tcategoryId);
    
    if (!category) {
      return { ok: false, message: "Kategori tiket tidak ditemukan" };
    }
    
    if (category.quota <= 0) {
      return { ok: false, message: "Kuota tiket untuk kategori ini sudah penuh" };
    }

    const newTicket = createTicket({
      ticketCode: generateTicketCode(),
      tcategoryId: data.tcategoryId,
      torderId: data.torderId,
    });

    frontendStatusOverrides.set(newTicket.ticketId, { status: "Valid" });

    if (data.seatId && data.seatId !== "none") {
      assignSeat(data.seatId, newTicket.ticketId);
    }

    revalidatePath("/admin/tickets");
    revalidatePath("/organizer/tickets");
    revalidatePath("/customer/tickets");
    
    return { ok: true, message: "Sukses", tickets: [] }; 
  } catch (error) {
    return { ok: false, message: "Gagal membuat tiket" };
  }
}

export async function editTicketAction(ticketId: string, status: TicketView["status"], seatId?: string): Promise<TicketActionResult> {
  try {
    const currentOverride = frontendStatusOverrides.get(ticketId);
    
    frontendStatusOverrides.set(ticketId, {
      status,
    });

    const relIndex = hasRelationships.findIndex((r) => r.ticketId === ticketId);
    if (relIndex > -1) {
      hasRelationships.splice(relIndex, 1);
    }

    if (seatId && seatId !== "none") {
      assignSeat(seatId, ticketId);
    }

    revalidatePath("/admin/tickets");
    revalidatePath("/organizer/tickets");
    revalidatePath("/customer/tickets");
    
    return { ok: true, message: "Sukses", tickets: [] };
  } catch (error) {
    return { ok: false, message: "Gagal memperbarui tiket" };
  }
}

export async function removeTicketAction(ticketId: string): Promise<TicketActionResult> {
  try {
    const relIndex = hasRelationships.findIndex((r) => r.ticketId === ticketId);
    if (relIndex > -1) {
      hasRelationships.splice(relIndex, 1);
    }

    frontendStatusOverrides.delete(ticketId);
    deleteTicket(ticketId);
    
    revalidatePath("/admin/tickets");
    revalidatePath("/organizer/tickets");
    revalidatePath("/customer/tickets");
    
    return { ok: true, message: "Sukses", tickets: [] };
  } catch (error) {
    return { ok: false, message: "Gagal menghapus tiket" };
  }
}

export type OrderOption = {
  orderId: string;
  label: string;
  eventId: string;
  venueId: string;
  seatingType: string;
};

export async function getOrderOptionsAction(): Promise<OrderOption[]> {
  const rawOrders = Array.from(orders.values());
  const options: OrderOption[] = [];

  for (const order of rawOrders) {
    const orderTickets = Array.from(tickets.values()).filter((t) => t.torderId === order.orderId);
    if (orderTickets.length > 0) {
      const category = ticketCategories.find((c) => c.categoryId === orderTickets[0].tcategoryId);
      const event = category ? events.get(category.teventId) : undefined;
      const customer = customers.get(order.customerId);
      const venue = event ? venues.get(event.venueId) : undefined;

      if (event && customer && venue) {
        options.push({
          orderId: order.orderId,
          label: `${order.orderId} — ${customer.fullName} — ${event.eventTitle}`,
          eventId: event.eventId,
          venueId: venue.venueId,
          seatingType: venue.seatingType || "free",
        });
      }
    }
  }
  return options;
}

export type CategoryOption = {
  categoryId: string;
  categoryName: string;
  label: string;
  disabled: boolean;
};

export type SeatOption = {
  seatId: string;
  section: string;
  label: string;
};

export async function getDependentOptionsAction(eventId: string, venueId: string, currentTicketId?: string) {
  const cats = ticketCategories.filter((c) => c.teventId === eventId);
  const categoryOptions: CategoryOption[] = cats.map((c) => {
    const catTickets = Array.from(tickets.values()).filter((t) => t.tcategoryId === c.categoryId);
    let validCount = 0;
    
    for (const t of catTickets) {
      const override = frontendStatusOverrides.get(t.ticketId);
      const order = orders.get(t.torderId);
      let defaultStatus = "Valid";
      if ((override?.status ?? defaultStatus) !== "Dibatalkan") validCount++;
    }

    return {
      categoryId: c.categoryId,
      categoryName: c.categoryName,
      label: `${c.categoryName} — Rp ${c.price.toLocaleString("id-ID")} (${validCount}/${c.quota})`,
      disabled: validCount >= c.quota,
    };
  });

  const venue = venues.get(venueId);
  const seatOptions: SeatOption[] = [];

  if (venue?.seatingType === "reserved") {
    const available = getAvailableSeatsByVenue(venueId, eventId);
    available.forEach((s) => {
      seatOptions.push({
        seatId: s.seatId,
        section: s.section,
        label: `${s.section} — Baris ${s.rowNumber}, No. ${s.seatNumber}`,
      });
    });

    if (currentTicketId) {
      const currentRel = hasRelationships.find((r) => r.ticketId === currentTicketId);
      if (currentRel) {
        const currentSeat = getSeatById(currentRel.seatId);
        if (currentSeat) {
          seatOptions.unshift({
            seatId: currentSeat.seatId,
            section: currentSeat.section,
            label: `${currentSeat.section} — Baris ${currentSeat.rowNumber}, No. ${currentSeat.seatNumber}`,
          });
        }
      }
    }
  }

  return { categoryOptions, seatOptions };
}