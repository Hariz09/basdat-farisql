import "server-only";

import type { Seat } from "@/types/seat";
import { orders, tickets, hasRelationships } from "@/lib/mock-order-db";
import { ticketCategories } from "@/lib/mock-ticketCategory-db";
import { events } from "@/lib/mock-event-db";

// Seat generator — maps to DB columns: section, row_number, seat_number, venue_id
// seatId is a deterministic key: "{venueId}_{section}_{row}_{num}"

type SectionConfig = { name: string; rows: string[]; seatsPerRow: number };

function makeRows(from: string, to: string): string[] {
  const rows: string[] = [];
  for (let c = from.charCodeAt(0); c <= to.charCodeAt(0); c++) {
    rows.push(String.fromCharCode(c));
  }
  return rows;
}

function generateSeats(venueId: string, sections: SectionConfig[]): Seat[] {
  const seats: Seat[] = [];
  for (const sec of sections) {
    for (const row of sec.rows) {
      for (let n = 1; n <= sec.seatsPerRow; n++) {
        seats.push({
          seatId: `${venueId}_${sec.name}_${row}_${n}`,
          section: sec.name,
          rowNumber: row,
          seatNumber: String(n),
          venueId,
        });
      }
    }
  }
  return seats;
}

// Venue 1 — Jakarta Convention Center (reserved, cap 1000)
const venueOneSeats = generateSeats("1", [
  { name: "VVIP Pit", rows: makeRows("A", "B"), seatsPerRow: 25 }, // 50
  { name: "VIP", rows: makeRows("C", "F"), seatsPerRow: 25 }, // 100
  { name: "Regular", rows: makeRows("G", "Z"), seatsPerRow: 36 }, // 720 ≈ cap
]);

// Venue 3 — Graha Sabha Pramana (reserved, cap 1200) — hosts test event 7
const venueThreeSeats = generateSeats("3", [
  { name: "WVIP", rows: makeRows("A", "B"), seatsPerRow: 10 }, // 20
  { name: "VIP", rows: makeRows("C", "F"), seatsPerRow: 20 }, // 80
  { name: "Category 1", rows: makeRows("G", "V"), seatsPerRow: 25 }, // 500
]);

// Venue 5 — Dyandra Convention Center (reserved, cap 1500)
const venueFiveSeats = generateSeats("5", [
  { name: "Backstage", rows: makeRows("A", "A"), seatsPerRow: 20 }, // 20
  { name: "VIP", rows: makeRows("B", "D"), seatsPerRow: 25 }, // 75
  { name: "Tribune", rows: makeRows("E", "T"), seatsPerRow: 40 }, // 800
  { name: "Festival", rows: makeRows("U", "Z"), seatsPerRow: 40 }, // 240
]);

const g = globalThis as unknown as { __seats?: Map<string, Seat> };

if (!g.__seats) {
  const allSeats = [...venueOneSeats, ...venueThreeSeats, ...venueFiveSeats];
  g.__seats = new Map(allSeats.map((s) => [s.seatId, s]));
}

export const seats = g.__seats!;

// Queries

export function getSeatsByVenue(venueId: string): Seat[] {
  return Array.from(seats.values()).filter((s) => s.venueId === venueId);
}

/** Returns seatIds already booked for a specific event (non-cancelled orders). */
export function getTakenSeatIds(eventId: string): Set<string> {
  const taken = new Set<string>();
  for (const rel of hasRelationships) {
    const ticket = tickets.get(rel.ticketId);
    if (!ticket) continue;

    const order = orders.get(ticket.torderId);
    if (!order || order.paymentStatus === "Cancelled") continue;

    const cat = ticketCategories.find(
      (tc) => tc.categoryId === ticket.tcategoryId,
    );
    const ev = cat
      ? Array.from(events.values()).find((e) => e.eventId === cat.teventId)
      : undefined;

    if (ev?.eventId === eventId) taken.add(rel.seatId);
  }
  return taken;
}

/** Venue seats filtered by availability for a given event. */
export function getAvailableSeatsByVenue(
  venueId: string,
  eventId: string,
): Seat[] {
  const taken = getTakenSeatIds(eventId);
  return getSeatsByVenue(venueId).filter((s) => !taken.has(s.seatId));
}

export function getSeatById(seatId: string): Seat | undefined {
  return seats.get(seatId);
}
