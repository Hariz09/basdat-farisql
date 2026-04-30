"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  createTicketCategoryAction,
  deleteTicketCategoryAction,
  updateTicketCategoryAction,
} from "@/app/ticket-category-actions";
import { type TicketCategoryView } from "@/lib/ticket-category-helpers";
import type { EventOption } from "@/types/event";
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

type TicketCategoryDirectoryProps = {
  mode: "manage" | "read";
  title: string;
  description: string;
  initialTicketCategories: TicketCategoryView[];
  events: EventOption[];
};

export default function TicketCategoryDirectory({
  mode,
  title,
  description,
  initialTicketCategories,
  events,
}: TicketCategoryDirectoryProps) {
  const canManage = mode === "manage";
  const [isPending, startTransition] = useTransition();
  const [ticketCategories, setTicketCategories] = useState<TicketCategoryView[]>(
    initialTicketCategories,
  );

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TicketCategoryView | null>(
    null,
  );
  const [categoryToDelete, setCategoryToDelete] = useState<TicketCategoryView | null>(
    null,
  );

  const [categoryName, setCategoryName] = useState("");
  const [quota, setQuota] = useState(0);
  const [price, setPrice] = useState(0);
  const [eventId, setEventId] = useState("");

  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("all");

  const resetForm = () => {
    setCategoryName("");
    setQuota(0);
    setPrice(0);
    setEventId("");
  };

  const getVenueCapacity = (eId: string) => {
    const event = events.find((e) => e.eventId === eId);
    return event?.venueCapacity ?? 0;
  };

  const getAvailableQuota = (eId: string) => {
    const event = events.find((e) => e.eventId === eId);
    const venueCapacity = event?.venueCapacity ?? 0;
    const usedQuota = ticketCategories
      .filter((tc) => tc.eventId === eId && tc.categoryId !== editingCategory?.categoryId)
      .reduce((sum, tc) => sum + tc.quota, 0);
    return venueCapacity - usedQuota;
  };

  const validateForm = () => {
    if (!categoryName.trim()) {
      toast.error("Nama kategori wajib diisi.");
      return false;
    }

    if (!Number.isFinite(quota) || quota <= 0) {
      toast.error("Kuota harus bilangan bulat positif (> 0).");
      return false;
    }

    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Harga harus bilangan positif (> 0).");
      return false;
    }

    if (!eventId) {
      toast.error("Event wajib dipilih.");
      return false;
    }

    const availableQuota = getAvailableQuota(eventId);
    if (quota > availableQuota) {
      toast.error(`Kuota tidak boleh melebihi kapasitas tersedia (${availableQuota}).`);
      return false;
    }

    return true;
  };

  const handleCreate = () => {
    if (!validateForm()) {
      return;
    }

    startTransition(async () => {
      const result = await createTicketCategoryAction({
        categoryName: categoryName.trim(),
        quota,
        price,
        eventId,
      });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      resetForm();
      setOpen(false);
      setTicketCategories(result.ticketCategories);
      toast.success(result.message);
    });
  };

  const handleOpenEdit = (category: TicketCategoryView) => {
    setEditingCategory(category);
    setCategoryName(category.categoryName);
    setQuota(category.quota);
    setPrice(category.price);
    setEventId(category.eventId);
    setEditOpen(true);
  };

  const handleEditSave = () => {
    if (!editingCategory) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    startTransition(async () => {
      const result = await updateTicketCategoryAction(editingCategory.categoryId, {
        categoryName: categoryName.trim(),
        quota,
        price,
        eventId,
      });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setEditOpen(false);
      setEditingCategory(null);
      resetForm();
      setTicketCategories(result.ticketCategories);
      toast.success(result.message);
    });
  };

  const handleOpenDelete = (category: TicketCategoryView) => {
    setCategoryToDelete(category);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!categoryToDelete) return;

    startTransition(async () => {
      const result = await deleteTicketCategoryAction(categoryToDelete.categoryId);

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setTicketCategories(result.ticketCategories);
      toast.success(result.message);
      setDeleteOpen(false);
      setCategoryToDelete(null);
    });
  };

  const eventOptions = useMemo(() => events, [events]);

  const filteredCategories = useMemo(() => {
    return ticketCategories
      .filter((category) => {
        const matchSearch =
          category.categoryName.toLowerCase().includes(search.toLowerCase()) ||
          category.eventTitle.toLowerCase().includes(search.toLowerCase());

        const matchEvent = eventFilter === "all" || category.eventId === eventFilter;

        return matchSearch && matchEvent;
      })
      .sort((a, b) => {
        const eventCompare = a.eventTitle.localeCompare(b.eventTitle);
        if (eventCompare !== 0) return eventCompare;
        return a.categoryName.localeCompare(b.categoryName);
      });
  }, [ticketCategories, search, eventFilter]);

  const groupedCategories = useMemo(() => {
    const groups = new Map<string, TicketCategoryView[]>();
    for (const category of filteredCategories) {
      const existing = groups.get(category.eventTitle) ?? [];
      groups.set(category.eventTitle, [...existing, category]);
    }
    return groups;
  }, [filteredCategories]);

  const totalCategories = ticketCategories.length;
  const totalQuota = ticketCategories.reduce((sum, tc) => sum + tc.quota, 0);
  const totalRevenue = ticketCategories.reduce(
    (sum, tc) => sum + tc.quota * tc.price,
    0,
  );

  const heading = title;
  const subheading = canManage
    ? description
    : `${description} Gunakan pencarian dan filter untuk menemukan kategori tiket yang relevan.`;

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(p);

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{heading}</h1>
        <p className="text-sm text-muted-foreground">{subheading}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Kategori</p>
          <p className="mt-2 text-3xl font-bold">{totalCategories}</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Kuota</p>
          <p className="mt-2 text-3xl font-bold">
            {totalQuota.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Potensi Revenue</p>
          <p className="mt-2 text-3xl font-bold">{formatPrice(totalRevenue)}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full lg:flex-1">
          <Input
            placeholder="Cari nama atau event..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            className="h-10 rounded-md border bg-white px-3 text-sm"
            value={eventFilter}
            onChange={(event) => setEventFilter(event.target.value)}
          >
            <option value="all">Semua Event</option>
            {eventOptions.map((event) => (
              <option key={event.eventId} value={event.eventId}>
                {event.eventTitle}
              </option>
            ))}
          </select>

          {canManage ? (
            <Dialog
              open={open}
              onOpenChange={(value) => {
                setOpen(value);
                if (!value) {
                  resetForm();
                }
              }}
            >
              <DialogTrigger asChild>
                <Button>+ Tambah Kategori Tiket</Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Tambah Kategori Tiket Baru</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nama Kategori</label>
                    <Input
                      placeholder="Contoh: VIP, Regular, Festival"
                      value={categoryName}
                      onChange={(event) => setCategoryName(event.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Kuota</label>
                      <Input
                        type="number"
                        placeholder="Jumlah tiket"
                        value={quota || ""}
                        onChange={(event) =>
                          setQuota(Number(event.target.value) || 0)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Harga</label>
                      <Input
                        type="number"
                        placeholder="Harga per orang"
                        value={price || ""}
                        onChange={(event) =>
                          setPrice(Number(event.target.value) || 0)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Event</label>
                    <select
                      className="flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm"
                      value={eventId}
                      onChange={(event) => setEventId(event.target.value)}
                    >
                      <option value="">Pilih Event</option>
                      {eventOptions.map((event) => (
                        <option key={event.eventId} value={event.eventId}>
                          {event.eventTitle} (Kuota tersedia:{" "}
                          {getAvailableQuota(event.eventId)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <DialogFooter>
                  <Button onClick={handleCreate} disabled={isPending}>
                    {isPending ? "Menyimpan..." : "Simpan"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6">
        {Array.from(groupedCategories.entries()).map(([eventTitle, categories]) => (
          <div
            key={eventTitle}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <h3 className="mb-4 text-lg font-semibold">{eventTitle}</h3>
            <div className="space-y-3">
              {categories.map((category) => (
                <div
                  key={category.categoryId}
                  className="flex flex-col gap-3 rounded-xl border p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{category.categoryName}</span>
                      <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                        {category.quota.toLocaleString("id-ID")} tiket
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(category.price)} / orang
                    </p>
                  </div>

                  {canManage ? (
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleOpenEdit(category)}
                      >
                        Update
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleOpenDelete(category)}
                        disabled={isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ))}

        {groupedCategories.size === 0 ? (
          <div className="rounded-xl border bg-white p-10 text-center text-sm text-muted-foreground">
            Tidak ada kategori tiket yang sesuai dengan pencarian atau filter.
          </div>
        ) : null}
      </div>

      {canManage ? (
        <Dialog
          open={editOpen}
          onOpenChange={(value) => {
            setEditOpen(value);
            if (!value) {
              setEditingCategory(null);
              resetForm();
            }
          }}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Update Kategori Tiket</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nama Kategori</label>
                <Input
                  placeholder="Contoh: VIP, Regular, Festival"
                  value={categoryName}
                  onChange={(event) => setCategoryName(event.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kuota</label>
                  <Input
                    type="number"
                    placeholder="Jumlah tiket"
                    value={quota || ""}
                    onChange={(event) =>
                      setQuota(Number(event.target.value) || 0)
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Kuota tersedia: {editingCategory ? getAvailableQuota(editingCategory.eventId) + editingCategory.quota : 0}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Harga</label>
                  <Input
                    type="number"
                    placeholder="Harga per orang"
                    value={price || ""}
                    onChange={(event) =>
                      setPrice(Number(event.target.value) || 0)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Event</label>
                <select
                  className="flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm"
                  value={eventId}
                  onChange={(event) => setEventId(event.target.value)}
                >
                  <option value="">Pilih Event</option>
                  {eventOptions.map((event) => (
                    <option key={event.eventId} value={event.eventId}>
                      {event.eventTitle}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleEditSave} disabled={isPending}>
                {isPending ? "Menyimpan..." : "Update"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}

      {canManage ? (
        <Dialog
          open={deleteOpen}
          onOpenChange={(value) => {
            setDeleteOpen(value);
            if (!value) {
              setCategoryToDelete(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Konfirmasi Hapus Kategori Tiket</DialogTitle>
            </DialogHeader>

            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                Apakah Anda yakin ingin menghapus kategori tiket ini?
              </p>
              {categoryToDelete && (
                <div className="mt-4 rounded-lg border bg-muted/50 p-4">
                  <p className="font-medium">{categoryToDelete.categoryName}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Event: {categoryToDelete.eventTitle}
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => {
                  setDeleteOpen(false);
                  setCategoryToDelete(null);
                }}
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={isPending}
              >
                {isPending ? "Memproses..." : "Hapus"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}
