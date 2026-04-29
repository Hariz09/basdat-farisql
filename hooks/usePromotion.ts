"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  createPromotionAction,
  deletePromotionAction,
  updatePromotionAction,
} from "@/services/promotionService";
import type {
  DiscountType,
  PromoFormState,
  PromotionStats,
  PromotionView,
} from "@/types/promotion";

export const EMPTY_FORM: PromoFormState = {
  promoCode: "",
  discountType: "PERCENTAGE",
  discountValue: 0,
  startDate: "",
  endDate: "",
  usageLimit: 0,
};

export function usePromotion(initialPromotions: PromotionView[]) {
  const [isPending, startTransition] = useTransition();
  const [promotions, setPromotions] =
    useState<PromotionView[]>(initialPromotions);

  // ── Search & filter ─────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | DiscountType>("all");

  const filtered = useMemo(
    () =>
      promotions.filter((p) => {
        const matchSearch = p.promoCode
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchType = typeFilter === "all" || p.discountType === typeFilter;
        return matchSearch && matchType;
      }),
    [promotions, search, typeFilter],
  );

  const stats: PromotionStats = useMemo(
    () => ({
      totalPromo: promotions.length,
      totalUsage: promotions.reduce((s, p) => s + p.usageCount, 0),
      totalPersentase: promotions.filter((p) => p.discountType === "PERCENTAGE")
        .length,
    }),
    [promotions],
  );

  // ── Form state ───────────────────────────────────────────────────────────
  const [form, setForm] = useState<PromoFormState>(EMPTY_FORM);

  const setField = <K extends keyof PromoFormState>(
    key: K,
    value: PromoFormState[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  // ── Dialog state ─────────────────────────────────────────────────────────
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromotionView | null>(null);
  const [promoToDelete, setPromoToDelete] = useState<PromotionView | null>(
    null,
  );

  // ── CRUD handlers ────────────────────────────────────────────────────────
  const handleCreate = () => {
    startTransition(async () => {
      const result = await createPromotionAction({
        ...form,
        usageLimit: Number(form.usageLimit),
        discountValue: Number(form.discountValue),
      });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      setPromotions(result.promotions);
      setCreateOpen(false);
      setForm(EMPTY_FORM);
      toast.success(result.message);
    });
  };

  const handleOpenEdit = (promo: PromotionView) => {
    setEditingPromo(promo);
    setForm({
      promoCode: promo.promoCode,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      startDate: promo.startDate,
      endDate: promo.endDate,
      usageLimit: promo.usageLimit,
    });
    setEditOpen(true);
  };

  const handleUpdate = () => {
    if (!editingPromo) return;
    startTransition(async () => {
      const result = await updatePromotionAction(editingPromo.promotionId, {
        ...form,
        usageLimit: Number(form.usageLimit),
        discountValue: Number(form.discountValue),
      });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      setPromotions(result.promotions);
      setEditOpen(false);
      setEditingPromo(null);
      setForm(EMPTY_FORM);
      toast.success(result.message);
    });
  };

  const handleDelete = () => {
    if (!promoToDelete) return;
    startTransition(async () => {
      const result = await deletePromotionAction(promoToDelete.promotionId);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      setPromotions(result.promotions);
      setDeleteOpen(false);
      setPromoToDelete(null);
      toast.success(result.message);
    });
  };

  const openDeleteDialog = (promo: PromotionView) => {
    setPromoToDelete(promo);
    setDeleteOpen(true);
  };

  const resetForm = () => setForm(EMPTY_FORM);

  return {
    // data
    filtered,
    stats,
    isPending,
    // search & filter
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    // form
    form,
    setField,
    resetForm,
    // dialog state
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    deleteOpen,
    setDeleteOpen,
    editingPromo,
    promoToDelete,
    // handlers
    handleCreate,
    handleOpenEdit,
    handleUpdate,
    handleDelete,
    openDeleteDialog,
  };
}
