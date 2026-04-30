import "server-only";

import type { Ticket } from "@/lib/schemas";
import { TicketSchema } from "@/lib/schemas";

const g = globalThis as unknown as { __tickets?: Map<string, Ticket> };

if (!g.__tickets) {
  g.__tickets = new Map<string, Ticket>([
    [
      "tkt_001",
      TicketSchema.parse({
        ticketId: "tkt_001",
        ticketCode: "TTK-EVT001-VIP-001",
        tcategoryId: "cat_vip_001",
        torderId: "ord_001",
      }),
    ],
    [
      "tkt_002",
      TicketSchema.parse({
        ticketId: "tkt_002",
        ticketCode: "TTK-EVT001-VIP-002",
        tcategoryId: "cat_vip_001",
        torderId: "ord_001",
      }),
    ],
    [
      "tkt_003",
      TicketSchema.parse({
        ticketId: "tkt_003",
        ticketCode: "TTK-FSB002-GEN-045",
        tcategoryId: "cat_gen_002",
        torderId: "ord_002",
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