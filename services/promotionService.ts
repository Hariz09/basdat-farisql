"use server";

import { revalidatePath } from "next/cache";
import {
  createPromotion,
  deletePromotion,
  getAllPromotions,
  getPromotionByCode,
  updatePromotion,
} from "@/lib/mock-promotion-db";
import { getSession } from "@/lib/session";
import type { PromotionActionResult, PromotionInput } from "@/types/promotion";

// Internal helpers

function revalidatePromotionPaths() {
  revalidatePath("/admin/promotions");
  revalidatePath("/customer/promotions");
  revalidatePath("/promotions");
}

function validatePromotionInput(
  input: PromotionInput,
  excludeId?: string,
): string | null {
  if (!input.promoCode.trim()) return "Kode promo wajib diisi.";
  if (!input.discountType) return "Tipe diskon wajib dipilih.";
  if (!Number.isFinite(input.discountValue) || input.discountValue <= 0) {
    return "Nilai diskon harus bilangan positif (> 0).";
  }
  if (!input.startDate) return "Tanggal mulai wajib diisi.";
  if (!input.endDate) return "Tanggal berakhir wajib diisi.";
  if (input.endDate < input.startDate) {
    return "Tanggal berakhir harus sama atau setelah tanggal mulai.";
  }
  if (!Number.isInteger(input.usageLimit) || input.usageLimit <= 0) {
    return "Batas penggunaan harus bilangan bulat positif (> 0).";
  }

  const existing = getPromotionByCode(input.promoCode);
  if (existing && existing.promotionId !== excludeId) {
    return "Kode promo sudah digunakan.";
  }

  return null;
}

// Server actions

export async function createPromotionAction(
  input: PromotionInput,
): Promise<PromotionActionResult> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { ok: false, message: "Hanya Admin yang dapat membuat promosi." };
  }

  const error = validatePromotionInput(input);
  if (error) return { ok: false, message: error };

  createPromotion({
    promoCode: input.promoCode.trim().toUpperCase(),
    discountType: input.discountType,
    discountValue: input.discountValue,
    startDate: input.startDate,
    endDate: input.endDate,
    usageLimit: input.usageLimit,
  });

  revalidatePromotionPaths();
  return {
    ok: true,
    message: "Promosi berhasil dibuat.",
    promotions: getAllPromotions(),
  };
}

export async function updatePromotionAction(
  promotionId: string,
  input: PromotionInput,
): Promise<PromotionActionResult> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return {
      ok: false,
      message: "Hanya Admin yang dapat memperbarui promosi.",
    };
  }

  const error = validatePromotionInput(input, promotionId);
  if (error) return { ok: false, message: error };

  const updated = updatePromotion(promotionId, {
    promoCode: input.promoCode.trim().toUpperCase(),
    discountType: input.discountType,
    discountValue: input.discountValue,
    startDate: input.startDate,
    endDate: input.endDate,
    usageLimit: input.usageLimit,
  });

  if (!updated) return { ok: false, message: "Promosi tidak ditemukan." };

  revalidatePromotionPaths();
  return {
    ok: true,
    message: "Promosi berhasil diperbarui.",
    promotions: getAllPromotions(),
  };
}

export async function deletePromotionAction(
  promotionId: string,
): Promise<PromotionActionResult> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { ok: false, message: "Hanya Admin yang dapat menghapus promosi." };
  }

  const deleted = deletePromotion(promotionId);
  if (!deleted) return { ok: false, message: "Promosi tidak ditemukan." };

  revalidatePromotionPaths();
  return {
    ok: true,
    message: "Promosi berhasil dihapus.",
    promotions: getAllPromotions(),
  };
}
