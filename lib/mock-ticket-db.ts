import "server-only";

import type { Ticket } from "@/lib/schemas";
import { TicketSchema } from "@/lib/schemas";

const g = globalThis as unknown as { __tickets?: Map<string, Ticket> };

if (!g.__tickets) {
  g.__tickets = new Map<string, Ticket>([
    [
      "tkt-1",
      TicketSchema.parse({
        ticketId: "tkt-1",
        ticketCode: "TKT-2026-0001",
        tcategoryId: "2",
        torderId: "ord-1",
      }),
    ],
    [
      "tkt-2",
      TicketSchema.parse({
        ticketId: "tkt-2",
        ticketCode: "TKT-2026-0002",
        tcategoryId: "3",
        torderId: "ord-2",
      }),
    ],
    [
      "tkt-3",
      TicketSchema.parse({
        ticketId: "tkt-3",
        ticketCode: "TKT-2026-0003",
        tcategoryId: "3",
        torderId: "ord-2",
      }),
    ],
    [
      "tkt-4",
      TicketSchema.parse({
        ticketId: "tkt-4",
        ticketCode: "TKT-2026-0004",
        tcategoryId: "6",
        torderId: "ord-3",
      }),
    ],
  ]);
}

export const tickets = g.__tickets!;

export function getAllTickets(): Ticket[] {
  return Array.from(tickets.values());
}

export function getTicketById(ticketId: string): Ticket | undefined {
  return tickets.get(ticketId);
}

export function getTicketsByOrderId(orderId: string): Ticket[] {
  return Array.from(tickets.values()).filter((t) => t.torderId === orderId);
}

export function createTicket(
  data: Omit<Ticket, "ticketId">
): Ticket {
  const ticketId = crypto.randomUUID();
  const newTicket: Ticket = TicketSchema.parse({
    ticketId,
    ...data,
  });
  tickets.set(ticketId, newTicket);
  return newTicket;
}

export function updateTicket(
  ticketId: string,
  data: Omit<Ticket, "ticketId">
): Ticket | null {
  const existing = tickets.get(ticketId);
  if (!existing) return null;
  const updated: Ticket = TicketSchema.parse({ ...existing, ...data });
  tickets.set(ticketId, updated);
  return updated;
}

export function deleteTicket(ticketId: string): boolean {
  return tickets.delete(ticketId);
}