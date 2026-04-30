"use client";

import { useState, useTransition, useMemo } from "react";
import type { SeatView, SeatFormState, SeatStats } from "@/types/seat";
import { addSeatAction, editSeatAction, removeSeatAction } from "@/app/seat-actions";

export function useSeat(initialSeats: SeatView[]) {
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState("");
  const [venueFilter, setVenueFilter] = useState("Semua Venue");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [editingSeat, setEditingSeat] = useState<SeatView | null>(null);
  const [seatToDelete, setSeatToDelete] = useState<SeatView | null>(null);

  const [form, setForm] = useState<SeatFormState>({
    venueId: "",
    section: "",
    rowNumber: "",
    seatNumber: "",
  });

  const filtered = useMemo(() => {
    return initialSeats.filter((s) => {
      const query = search.toLowerCase();
      const matchesSearch =
        s.section.toLowerCase().includes(query) ||
        s.rowNumber.toLowerCase().includes(query) ||
        s.seatNumber.toLowerCase().includes(query);
      const matchesVenue = venueFilter === "Semua Venue" || s.venueId === venueFilter;
      return matchesSearch && matchesVenue;
    });
  }, [initialSeats, search, venueFilter]);

  const stats: SeatStats = useMemo(() => {
    return {
      totalSeat: initialSeats.length,
      totalTersedia: initialSeats.filter((s) => s.status === "Tersedia").length,
      totalTerisi: initialSeats.filter((s) => s.status === "Terisi").length,
    };
  }, [initialSeats]);

  const setField = <K extends keyof SeatFormState>(key: K, value: SeatFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm({ venueId: "", section: "", rowNumber: "", seatNumber: "" });
    setEditingSeat(null);
  };

  const handleCreate = () => {
    if (!form.venueId || !form.section || !form.rowNumber || !form.seatNumber) return;

    startTransition(async () => {
      const result = await addSeatAction(form);
      if (result.ok) {
        setCreateOpen(false);
        resetForm();
      } else {
        alert(result.message);
      }
    });
  };

  const handleOpenEdit = (seat: SeatView) => {
    setEditingSeat(seat);
    setForm({
      venueId: seat.venueId,
      section: seat.section,
      rowNumber: seat.rowNumber,
      seatNumber: seat.seatNumber,
    });
    setEditOpen(true);
  };

  const handleUpdate = () => {
    if (!editingSeat || !form.venueId || !form.section || !form.rowNumber || !form.seatNumber) return;

    startTransition(async () => {
      const result = await editSeatAction(editingSeat.seatId, form);
      if (result.ok) {
        setEditOpen(false);
        setEditingSeat(null);
        resetForm();
      } else {
        alert(result.message);
      }
    });
  };

  const openDeleteDialog = (seat: SeatView) => {
    if (seat.isAssigned) {
      alert("Kursi ini sudah di-assign ke tiket dan tidak dapat dihapus. Hapus atau ubah tiket terlebih dahulu.");
      return;
    }
    setSeatToDelete(seat);
    setDeleteOpen(true);
  };

  const handleDelete = () => {
    if (!seatToDelete) return;

    startTransition(async () => {
      const result = await removeSeatAction(seatToDelete.seatId);
      if (result.ok) {
        setDeleteOpen(false);
        setSeatToDelete(null);
      } else {
        alert(result.message);
      }
    });
  };

  return {
    filtered,
    stats,
    isPending,
    search,
    setSearch,
    venueFilter,
    setVenueFilter,
    form,
    setField,
    resetForm,
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    deleteOpen,
    setDeleteOpen,
    editingSeat,
    seatToDelete,
    handleCreate,
    handleOpenEdit,
    handleUpdate,
    handleDelete,
    openDeleteDialog,
  };
}