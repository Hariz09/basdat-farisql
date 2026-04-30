export type { Ticket } from "@/lib/schemas";
export { TicketSchema } from "@/lib/schemas";

import type { Ticket } from "@/lib/schemas";

export type TicketView = Ticket & {
  status: "Valid" | "Terpakai" | "Dibatalkan";
  categoryName: string;
  eventName: string;
  eventDate: string;
  venueName: string;
  venueCity: string;
  price: number;
  customerName: string;
  seatId?: string;
  seatInfo?: string;
};

export type TicketFormState = {
  torderId: string;
  tcategoryId: string;
  seatId: string;
};

export type TicketStats = {
  totalTicket: number;
  totalValid: number;
  totalTerpakai: number;
};

export type TicketActionResult =
  | { ok: true; message: string; tickets: TicketView[] }
  | { ok: false; message: string };

export type TicketInput = Omit<Ticket, "ticketId">;