// Re-exported from the central Zod schema — do not edit here.
export type { DiscountType, Promotion } from "@/lib/schemas";
export { DiscountTypeSchema, PromotionSchema } from "@/lib/schemas";

import type { DiscountType, Promotion } from "@/lib/schemas";

/**
 * PromotionView — Promotion extended with computed fields for display.
 * `usageCount` is derived via COUNT on ORDER_PROMOTION.
 */
export type PromotionView = Promotion & { usageCount: number };

/** Shared form state used by the hook and form component. */
export type PromoFormState = {
  promoCode: string;
  discountType: DiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
};

/** Computed summary stats for the promotion list header. */
export type PromotionStats = {
  totalPromo: number;
  totalUsage: number;
  totalPersentase: number;
};

/** Discriminated-union result returned by every promotion server action. */
export type PromotionActionResult =
  | { ok: true; message: string; promotions: PromotionView[] }
  | { ok: false; message: string };

/** Input shape for create / update (promotionId is generated server-side). */
export type PromotionInput = Omit<Promotion, "promotionId">;
