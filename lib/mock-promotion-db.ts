import "server-only";

import type { Promotion } from "@/lib/schemas";
import { PromotionSchema } from "@/lib/schemas";
import type { PromotionView } from "@/types/promotion";
import { orderPromotions } from "@/lib/mock-order-db";

// Each row validated against the Zod schema at seed time.
// Replace with `db.query(...)` rows for Neon/PostgreSQL.
// NOTE: usageCount is not a DB column — compute it via COUNT on ORDER_PROMOTION.
const g = globalThis as unknown as { __promotions?: Map<string, Promotion> };

if (!g.__promotions) {
  g.__promotions = new Map<string, Promotion>([
    [
      "promo-1",
      PromotionSchema.parse({
        promotionId: "promo-1",
        promoCode: "DISKON10",
        discountType: "PERCENTAGE",
        discountValue: 10,
        startDate: "2026-04-01",
        endDate: "2026-06-30",
        usageLimit: 100,
      }),
    ],
    [
      "promo-2",
      PromotionSchema.parse({
        promotionId: "promo-2",
        promoCode: "HEMAT50K",
        discountType: "NOMINAL",
        discountValue: 50000,
        startDate: "2026-04-01",
        endDate: "2026-05-31",
        usageLimit: 50,
      }),
    ],
    [
      "promo-3",
      PromotionSchema.parse({
        promotionId: "promo-3",
        promoCode: "KONSER20",
        discountType: "PERCENTAGE",
        discountValue: 20,
        startDate: "2026-04-01",
        endDate: "2026-07-31",
        usageLimit: 200,
      }),
    ],
  ]);
}

export const promotions = g.__promotions!;

export function getAllPromotions(): PromotionView[] {
  return Array.from(promotions.values()).map((p) => ({
    ...p,
    usageCount: orderPromotions.filter((op) => op.promotionId === p.promotionId)
      .length,
  }));
}

export function getPromotionByCode(promoCode: string): Promotion | undefined {
  for (const p of promotions.values()) {
    if (p.promoCode.toUpperCase() === promoCode.toUpperCase()) return p;
  }
  return undefined;
}

export function getPromotionById(promotionId: string): Promotion | undefined {
  return promotions.get(promotionId);
}

export function createPromotion(
  data: Omit<Promotion, "promotionId">,
): Promotion {
  const promotionId = crypto.randomUUID();
  const newPromotion: Promotion = PromotionSchema.parse({
    promotionId,
    ...data,
  });
  promotions.set(promotionId, newPromotion);
  return newPromotion;
}

export function updatePromotion(
  promotionId: string,
  data: Omit<Promotion, "promotionId">,
): Promotion | null {
  const existing = promotions.get(promotionId);
  if (!existing) return null;
  const updated: Promotion = PromotionSchema.parse({ ...existing, ...data });
  promotions.set(promotionId, updated);
  return updated;
}

export function deletePromotion(promotionId: string): boolean {
  return promotions.delete(promotionId);
}

/**
 * Usage count for a single promotion.
 * With a real DB, compute via: SELECT COUNT(*) FROM ORDER_PROMOTION WHERE promotion_id = ?
 */
export function getUsageCount(promotionId: string): number {
  return orderPromotions.filter((op) => op.promotionId === promotionId).length;
}
