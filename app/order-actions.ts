"use server";

import { revalidatePath } from "next/cache";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrdersByCustomer,
  getOrdersByOrganizer,
  updateOrderStatus,
} from "@/lib/mock-order-db";
import { getSession } from "@/lib/session";
import { getPromotionByCode } from "@/lib/mock-promotion-db";
import { orderPromotions } from "@/lib/mock-order-db";
import { ticketCategories } from "@/lib/mock-ticketCategory-db";
import { getSeatById, getTakenSeatIds } from "@/lib/mock-seat-db";
import { events } from "@/lib/mock-event-db";
import { applyPromotion, assignSeat, createTicket } from "@/lib/mock-order-db";
import type { OrderView, PaymentStatus } from "@/types/order";

type OrderResult =
  | { ok: true; message: string; orders: OrderView[] }
  | { ok: false; message: string };

type CheckoutInput = {
  categoryId: string;
  /** Number of tickets (each becomes a TICKET row). Max 10. */
  quantity: number;
  /** FK → SEAT.seat_id — only for reserved-seating venues */
  seatId?: string;
  promoCode?: string;
};

function revalidateOrderPaths() {
  revalidatePath("/admin/orders");
  revalidatePath("/organizer/orders");
  revalidatePath("/customer/orders");
}

export async function createOrderAction(
  input: CheckoutInput,
): Promise<OrderResult> {
  const session = await getSession();
  if (!session || session.role !== "customer") {
    return { ok: false, message: "Hanya Customer yang dapat membuat order." };
  }

  if (!input.categoryId)
    return { ok: false, message: "Kategori tiket wajib dipilih." };
  if (
    !Number.isInteger(input.quantity) ||
    input.quantity <= 0 ||
    input.quantity > 10
  ) {
    return { ok: false, message: "Jumlah tiket harus antara 1 dan 10." };
  }

  const category = ticketCategories.find(
    (tc) => tc.categoryId === input.categoryId,
  );
  if (!category)
    return { ok: false, message: "Kategori tiket tidak ditemukan." };

  // Validate seatId if provided
  if (input.seatId) {
    const seat = getSeatById(input.seatId);
    if (!seat) return { ok: false, message: "Kursi tidak ditemukan." };

    const event = Array.from(events.values()).find(
      (e) => e.eventId === category.teventId,
    );
    if (seat.venueId !== event?.venueId) {
      return { ok: false, message: "Kursi tidak termasuk venue event ini." };
    }

    const taken = getTakenSeatIds(category.teventId);
    if (taken.has(input.seatId)) {
      return { ok: false, message: "Kursi sudah dipesan oleh customer lain." };
    }
  }

  let discountAmount = 0;
  let promoId: string | undefined;

  if (input.promoCode) {
    const promo = getPromotionByCode(input.promoCode);
    if (!promo) return { ok: false, message: "Kode promo tidak valid." };

    const today = new Date().toISOString().slice(0, 10);
    if (today < promo.startDate || today > promo.endDate) {
      return { ok: false, message: "Kode promo sudah tidak berlaku." };
    }
    // Compute usage count from ORDER_PROMOTION table
    const usageCount = orderPromotions.filter(
      (op) => op.promotionId === promo.promotionId,
    ).length;
    if (usageCount >= promo.usageLimit) {
      return {
        ok: false,
        message: "Kode promo telah mencapai batas penggunaan.",
      };
    }

    const subtotal = category.price * input.quantity;
    if (promo.discountType === "PERCENTAGE") {
      discountAmount = Math.floor((subtotal * promo.discountValue) / 100);
    } else {
      discountAmount = promo.discountValue; // NOMINAL
    }
    promoId = promo.promotionId;
  }

  const subtotal = category.price * input.quantity;
  const totalAmount = Math.max(0, subtotal - discountAmount);

  // Insert into orders table (5 columns only)
  const newOrder = createOrder({
    orderDate: new Date().toISOString(),
    paymentStatus: "Pending",
    totalAmount,
    customerId: session.profileId,
  });

  // Insert one TICKET row per seat requested
  for (let i = 0; i < input.quantity; i++) {
    const ticket = createTicket({
      ticketCode: `TKT-${newOrder.orderId}-${i + 1}`,
      tcategoryId: input.categoryId,
      torderId: newOrder.orderId,
    });

    // Assign seat only for the first ticket (reserved seating)
    if (i === 0 && input.seatId) {
      assignSeat(input.seatId, ticket.ticketId);
    }
  }

  // Insert ORDER_PROMOTION row if a promo was used
  if (promoId) applyPromotion(promoId, newOrder.orderId);

  revalidateOrderPaths();
  return {
    ok: true,
    message: "Order berhasil dibuat! Status pembayaran: Pending.",
    orders: getOrdersByCustomer(session.profileId),
  };
}

export async function updateOrderStatusAction(
  orderId: string,
  paymentStatus: PaymentStatus,
): Promise<OrderResult> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return {
      ok: false,
      message: "Hanya Admin yang dapat memperbarui status order.",
    };
  }

  const updated = updateOrderStatus(orderId, paymentStatus);
  if (!updated) return { ok: false, message: "Order tidak ditemukan." };

  revalidateOrderPaths();
  return {
    ok: true,
    message: "Status order berhasil diperbarui.",
    orders: getAllOrders(),
  };
}

export async function deleteOrderAction(orderId: string): Promise<OrderResult> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { ok: false, message: "Hanya Admin yang dapat menghapus order." };
  }

  const deleted = deleteOrder(orderId);
  if (!deleted) return { ok: false, message: "Order tidak ditemukan." };

  revalidateOrderPaths();
  return {
    ok: true,
    message: "Order berhasil dihapus.",
    orders: getAllOrders(),
  };
}

export async function getMyOrdersAction(): Promise<OrderView[]> {
  const session = await getSession();
  if (!session || session.role !== "customer") return [];
  return getOrdersByCustomer(session.profileId);
}

export async function getOrganizerOrdersAction(): Promise<OrderView[]> {
  const session = await getSession();
  if (!session || session.role !== "organizer") return [];
  return getOrdersByOrganizer(session.profileId);
}
