export type { PaymentStatus, Order } from "@/lib/schemas";
export { PaymentStatusSchema, OrderSchema } from "@/lib/schemas";

/** View model — enriched with joined data for display purposes. */
export type OrderView = import("@/lib/schemas").Order & {
  customerName: string;
  eventTitle: string;
  categoryName: string;
  organizerId: string;
  eventId: string;
  /** Number of tickets in this order (derived from TICKET table rows). */
  quantity: number;
  /** "Section · Row X · Seat N" — populated when a seat is linked via HAS_RELATIONSHIP */
  seatLabel?: string;
  /** Applied promo codes, if any */
  promoCodes?: string[];
};
