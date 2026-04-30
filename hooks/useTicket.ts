"use client";

import { useState, useTransition, useMemo } from "react";
import type { TicketView, TicketFormState, TicketStats } from "@/types/ticket";
import { addTicketAction, editTicketAction, removeTicketAction } from "@/app/ticket-actions";

export function useTicket(initialTickets: TicketView[]) {
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [editingTicket, setEditingTicket] = useState<TicketView | null>(null);
  const [ticketToDelete, setTicketToDelete] = useState<TicketView | null>(null);

  const [form, setForm] = useState<TicketFormState>({
    torderId: "",
    tcategoryId: "",
    seatInfo: "none",
  });

  const [editForm, setEditForm] = useState<{ status: TicketView["status"]; seatInfo: string }>({
    status: "Valid",
    seatInfo: "none",
  });

  const filtered = useMemo(() => {
    return initialTickets.filter((t) => {
      const matchesSearch =
        t.ticketCode.toLowerCase().includes(search.toLowerCase()) ||
        t.eventName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "Semua Status" || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [initialTickets, search, statusFilter]);

  const stats: TicketStats = useMemo(() => {
    return {
      totalTicket: initialTickets.length,
      totalValid: initialTickets.filter((t) => t.status === "Valid").length,
      totalTerpakai: initialTickets.filter((t) => t.status === "Terpakai").length,
    };
  }, [initialTickets]);

  const setField = <K extends keyof TicketFormState>(key: K, value: TicketFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setEditField = <K extends keyof typeof editForm>(key: K, value: typeof editForm[K]) => {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm({ torderId: "", tcategoryId: "", seatInfo: "none" });
    setEditingTicket(null);
  };

  const handleCreate = () => {
    if (!form.torderId || !form.tcategoryId) return;
    
    startTransition(async () => {
      const result = await addTicketAction(form);
      if (result.ok) {
        setCreateOpen(false);
        resetForm();
      } else {
        alert(result.message);
      }
    });
  };

  const handleOpenEdit = (ticket: TicketView) => {
    setEditingTicket(ticket);
    setEditForm({
      status: ticket.status,
      seatInfo: ticket.seatInfo || "none",
    });
    setEditOpen(true);
  };

  const handleUpdate = () => {
    if (!editingTicket) return;

    startTransition(async () => {
      const result = await editTicketAction(editingTicket.ticketId, editForm.status, editForm.seatInfo);
      if (result.ok) {
        setEditOpen(false);
        setEditingTicket(null);
      } else {
        alert(result.message);
      }
    });
  };

  const openDeleteDialog = (ticket: TicketView) => {
    setTicketToDelete(ticket);
    setDeleteOpen(true);
  };

  const handleDelete = () => {
    if (!ticketToDelete) return;

    startTransition(async () => {
      const result = await removeTicketAction(ticketToDelete.ticketId);
      if (result.ok) {
        setDeleteOpen(false);
        setTicketToDelete(null);
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
    statusFilter,
    setStatusFilter,
    form,
    setField,
    editForm,
    setEditField,
    resetForm,
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    deleteOpen,
    setDeleteOpen,
    editingTicket,
    ticketToDelete,
    handleCreate,
    handleOpenEdit,
    handleUpdate,
    handleDelete,
    openDeleteDialog,
  };
}