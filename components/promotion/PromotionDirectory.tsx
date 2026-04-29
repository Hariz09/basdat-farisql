"use client";

import { usePromotion } from "@/hooks/usePromotion";
import type {
  DiscountType,
  PromoFormState,
  PromotionView,
} from "@/types/promotion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type PromotionDirectoryProps = {
  mode: "manage" | "read";
  initialPromotions: PromotionView[];
};

type PromoFormProps = {
  form: PromoFormState;
  setField: <K extends keyof PromoFormState>(
    key: K,
    value: PromoFormState[K],
  ) => void;
};

function PromoForm({ form, setField }: PromoFormProps) {
  return (
    <div className="grid gap-4 py-2">
      <div className="space-y-2">
        <label className="text-sm font-medium">Kode Promo *</label>
        <Input
          placeholder="Contoh: DISKON10"
          value={form.promoCode}
          onChange={(e) => setField("promoCode", e.target.value.toUpperCase())}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipe Diskon *</label>
          <select
            className="flex h-10 w-full rounded-md border bg-white px-3 text-sm"
            value={form.discountType}
            onChange={(e) =>
              setField("discountType", e.target.value as DiscountType)
            }
          >
            <option value="PERCENTAGE">Persentase (%)</option>
            <option value="NOMINAL">Nominal (Rp)</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Nilai Diskon *</label>
          <Input
            type="number"
            placeholder={
              form.discountType === "PERCENTAGE"
                ? "Contoh: 10"
                : "Contoh: 50000"
            }
            value={form.discountValue || ""}
            onChange={(e) => setField("discountValue", Number(e.target.value))}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tanggal Mulai *</label>
          <Input
            type="date"
            value={form.startDate}
            onChange={(e) => setField("startDate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Tanggal Berakhir *</label>
          <Input
            type="date"
            value={form.endDate}
            onChange={(e) => setField("endDate", e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Batas Penggunaan *</label>
        <Input
          type="number"
          placeholder="Jumlah maksimal penggunaan"
          value={form.usageLimit || ""}
          onChange={(e) => setField("usageLimit", Number(e.target.value))}
        />
      </div>
    </div>
  );
}

export default function PromotionDirectory({
  mode,
  initialPromotions,
}: PromotionDirectoryProps) {
  const canManage = mode === "manage";
  const {
    filtered,
    stats,
    isPending,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    form,
    setField,
    resetForm,
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    deleteOpen,
    setDeleteOpen,
    editingPromo,
    promoToDelete,
    handleCreate,
    handleOpenEdit,
    handleUpdate,
    handleDelete,
    openDeleteDialog,
  } = usePromotion(initialPromotions);

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Daftar Promosi</h1>
        <p className="text-sm text-muted-foreground">
          Daftar kode promo yang tersedia di TikTakTuk.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Promo</p>
          <p className="mt-2 text-3xl font-bold">{stats.totalPromo}</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Penggunaan</p>
          <p className="mt-2 text-3xl font-bold">{stats.totalUsage}</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Tipe Persentase</p>
          <p className="mt-2 text-3xl font-bold">{stats.totalPersentase}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm lg:flex-row lg:items-center">
        <div className="w-full lg:flex-1">
          <Input
            placeholder="Cari kode promo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <select
            className="h-10 rounded-md border bg-white px-3 text-sm"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
          >
            <option value="all">Semua Tipe</option>
            <option value="Persentase">Persentase</option>
            <option value="Nominal">Nominal</option>
          </select>
          {canManage && (
            <Dialog
              open={createOpen}
              onOpenChange={(v) => {
                setCreateOpen(v);
                if (!v) resetForm();
              }}
            >
              <DialogTrigger asChild>
                <Button>+ Buat Promo</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-125">
                <DialogHeader>
                  <DialogTitle>Buat Promosi Baru</DialogTitle>
                </DialogHeader>
                <PromoForm form={form} setField={setField} />
                <DialogFooter>
                  <Button onClick={handleCreate} disabled={isPending}>
                    {isPending ? "Menyimpan..." : "Buat"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Kode Promo</th>
                <th className="text-left px-4 py-3 font-medium">Tipe</th>
                <th className="text-left px-4 py-3 font-medium">Nilai</th>
                <th className="text-left px-4 py-3 font-medium">Mulai</th>
                <th className="text-left px-4 py-3 font-medium">Berakhir</th>
                <th className="text-left px-4 py-3 font-medium">Penggunaan</th>
                {canManage && (
                  <th className="text-left px-4 py-3 font-medium">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={canManage ? 7 : 6}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    Tidak ada promosi yang ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((promo) => (
                  <tr
                    key={promo.promotionId}
                    className="border-b last:border-0 hover:bg-muted/20"
                  >
                    <td className="px-4 py-3 font-semibold font-mono">
                      {promo.promoCode}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs font-medium ${promo.discountType === "PERCENTAGE" ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-purple-100 text-purple-700 border-purple-200"}`}
                      >
                        {promo.discountType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {promo.discountType === "PERCENTAGE"
                        ? `${promo.discountValue}%`
                        : `Rp ${promo.discountValue.toLocaleString("id-ID")}`}
                    </td>
                    <td className="px-4 py-3 text-xs">{promo.startDate}</td>
                    <td className="px-4 py-3 text-xs">{promo.endDate}</td>
                    <td className="px-4 py-3">
                      {promo.usageCount} / {promo.usageLimit}
                    </td>
                    {canManage && (
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleOpenEdit(promo)}
                          >
                            Update
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDeleteDialog(promo)}
                            disabled={isPending}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {canManage && (
        <>
          <Dialog
            open={editOpen}
            onOpenChange={(v) => {
              setEditOpen(v);
              if (!v) resetForm();
            }}
          >
            <DialogContent className="sm:max-w-125">
              <DialogHeader>
                <DialogTitle>Update Promosi</DialogTitle>
              </DialogHeader>
              <PromoForm form={form} setField={setField} />
              <DialogFooter>
                <Button variant="ghost" onClick={() => setEditOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleUpdate} disabled={isPending}>
                  {isPending ? "Menyimpan..." : "Simpan"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogContent className="sm:max-w-100">
              <DialogHeader>
                <DialogTitle>Konfirmasi Hapus Promosi</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-muted-foreground">
                  Apakah Anda yakin ingin menghapus promosi ini?
                </p>
                {promoToDelete && (
                  <div className="mt-4 rounded-lg border bg-muted/50 p-4">
                    <p className="font-semibold font-mono">
                      {promoToDelete.promoCode}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {promoToDelete.discountType === "PERCENTAGE"
                        ? "Persentase"
                        : "Nominal"}{" "}
                      —{" "}
                      {promoToDelete.discountType === "PERCENTAGE"
                        ? `${promoToDelete.discountValue}%`
                        : `Rp ${promoToDelete.discountValue.toLocaleString("id-ID")}`}
                    </p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
                  Batal
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isPending}
                >
                  {isPending ? "Memproses..." : "Hapus"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
