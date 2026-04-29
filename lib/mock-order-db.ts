import "server-only";

import type {
  Order,
  Ticket,
  HasRelationship,
  OrderPromotion,
  PaymentStatus,
} from "@/lib/schemas";
import {
  OrderSchema,
  TicketSchema,
  HasRelationshipSchema,
  OrderPromotionSchema,
} from "@/lib/schemas";
import { ticketCategories } from "@/lib/mock-ticketCategory-db";
import { customers } from "@/lib/mock-auth-db";
import { events } from "@/lib/mock-event-db";
import { getSeatById } from "@/lib/mock-seat-db";
import type { OrderView } from "@/types/order";

// 14. orders table  (5 columns only — matches schema exactly)
const g = globalThis as unknown as {
  __orders?: Map<string, Order>;
  __tickets?: Map<string, Ticket>;
  __hasRelationships?: HasRelationship[];
  __orderPromotions?: OrderPromotion[];
};

if (!g.__orders) {
  g.__orders = new Map<string, Order>([
    [
      "ord-1",
      OrderSchema.parse({
        orderId: "ord-1",
        orderDate: "2026-04-20T10:30:00.000Z",
        paymentStatus: "Paid",
        totalAmount: 250000,
        customerId: "cus-1",
      }),
    ],
    [
      "ord-2",
      OrderSchema.parse({
        orderId: "ord-2",
        orderDate: "2026-04-22T14:00:00.000Z",
        paymentStatus: "Pending",
        totalAmount: 300000,
        customerId: "cus-1",
      }),
    ],
    [
      "ord-3",
      OrderSchema.parse({
        orderId: "ord-3",
        orderDate: "2026-04-25T09:15:00.000Z",
        paymentStatus: "Cancelled",
        totalAmount: 0,
        customerId: "cus-1",
      }),
    ],
  ]);
}

// 12. TICKET table  — one row per physical ticket, linked to an order

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

// 13. HAS_RELATIONSHIP table  — seat assignments

if (!g.__hasRelationships) {
  g.__hasRelationships = [
    // tkt-1 was given seat 1_VIP_C_1 (Jakarta Convention Center, VIP, row C, seat 1)
    HasRelationshipSchema.parse({ seatId: "1_VIP_C_1", ticketId: "tkt-1" }),
  ];
}

// 16. ORDER_PROMOTION table

if (!g.__orderPromotions) {
  g.__orderPromotions = [
    OrderPromotionSchema.parse({
      orderPromotionId: "op-1",
      promotionId: "promo-1",
      orderId: "ord-2",
    }),
  ];
}

export const orders = g.__orders!;
export const tickets = g.__tickets!;
export const hasRelationships = g.__hasRelationships!;
export const orderPromotions = g.__orderPromotions!;

// Helpers

function getTicketsByOrder(orderId: string): Ticket[] {
  return Array.from(tickets.values()).filter((t) => t.torderId === orderId);
}

function toOrderView(order: Order): OrderView {
  const orderTickets = getTicketsByOrder(order.orderId);
  const firstTicket = orderTickets[0];
  const category = firstTicket
    ? ticketCategories.find((tc) => tc.categoryId === firstTicket.tcategoryId)
    : undefined;
  const event = category
    ? Array.from(events.values()).find((e) => e.eventId === category.teventId)
    : undefined;
  const customer = customers.get(order.customerId);

  // Resolve seat via HAS_RELATIONSHIP → SEAT
  const seatRel = firstTicket
    ? hasRelationships.find((r) => r.ticketId === firstTicket.ticketId)
    : undefined;
  let seatLabel: string | undefined;
  if (seatRel) {
    const seat = getSeatById(seatRel.seatId);
    if (seat)
      seatLabel = `${seat.section} · Baris ${seat.rowNumber} · Kursi ${seat.seatNumber}`;
  }

  // Resolve applied promo codes via ORDER_PROMOTION
  const appliedPromoIds = orderPromotions
    .filter((op) => op.orderId === order.orderId)
    .map((op) => op.promotionId);

  return {
    ...order,
    customerName: customer?.fullName ?? order.customerId,
    eventTitle: event?.eventTitle ?? "Event tidak ditemukan",
    categoryName: category?.categoryName ?? "Kategori tidak ditemukan",
    organizerId: event?.organizerId ?? "",
    eventId: event?.eventId ?? "",
    quantity: orderTickets.length,
    seatLabel,
    promoCodes: appliedPromoIds.length ? appliedPromoIds : undefined,
  };
}

// Exported CRUD — replace bodies with Neon SQL queries when migrating

export function getAllOrders(): OrderView[] {
  return Array.from(orders.values())
    .map(toOrderView)
    .sort(
      (a, b) =>
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime(),
    );
}

export function getOrdersByCustomer(customerId: string): OrderView[] {
  return getAllOrders().filter((o) => o.customerId === customerId);
}

export function getOrdersByOrganizer(organizerId: string): OrderView[] {
  return getAllOrders().filter((o) => o.organizerId === organizerId);
}

export function getOrderById(orderId: string): OrderView | undefined {
  const order = orders.get(orderId);
  return order ? toOrderView(order) : undefined;
}

export function createOrder(data: Omit<Order, "orderId">): Order {
  const orderId = crypto.randomUUID();
  const newOrder = OrderSchema.parse({ orderId, ...data });
  orders.set(orderId, newOrder);
  return newOrder;
}

export function updateOrderStatus(
  orderId: string,
  paymentStatus: PaymentStatus,
): Order | null {
  const existing = orders.get(orderId);
  if (!existing) return null;
  const updated = OrderSchema.parse({ ...existing, paymentStatus });
  orders.set(orderId, updated);
  return updated;
}

export function deleteOrder(orderId: string): boolean {
  return orders.delete(orderId);
}

/** Attach a ticket to an order.  With Neon: INSERT INTO TICKET ... */
export function createTicket(data: Omit<Ticket, "ticketId">): Ticket {
  const ticketId = crypto.randomUUID();
  const newTicket = TicketSchema.parse({ ticketId, ...data });
  tickets.set(ticketId, newTicket);
  return newTicket;
}

/** Assign a seat to a ticket.  With Neon: INSERT INTO HAS_RELATIONSHIP ... */
export function assignSeat(seatId: string, ticketId: string): HasRelationship {
  const rel = HasRelationshipSchema.parse({ seatId, ticketId });
  hasRelationships.push(rel);
  return rel;
}

/** Apply a promotion to an order.  With Neon: INSERT INTO ORDER_PROMOTION ... */
export function applyPromotion(
  promotionId: string,
  orderId: string,
): OrderPromotion {
  const orderPromotionId = crypto.randomUUID();
  const op = OrderPromotionSchema.parse({
    orderPromotionId,
    promotionId,
    orderId,
  });
  orderPromotions.push(op);
  return op;
}
