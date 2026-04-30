"use client";

import { useState, useTransition, useMemo, useEffect } from "react";
import type { TicketView, TicketFormState, TicketStats } from "@/types/ticket";
import { addTicketAction, editTicketAction, removeTicketAction, getDependentOptionsAction } from "@/app/ticket-actions";
import type { OrderOption, CategoryOption, SeatOption } from "@/app/ticket-actions";

export function useTicket(initialTickets: TicketView[], orderOptions: OrderOption[]) {
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
    seatId: "none",
  });

  const [editForm, setEditForm] = useState<{ status: TicketView["status"]; seatId: string }>({
    status: "Valid",
    seatId: "none",
  });

  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [seatOptions, setSeatOptions] = useState<SeatOption[]>([]);
  const [isReserved, setIsReserved] = useState(false);

  const [editSeatOptions, setEditSeatOptions] = useState<SeatOption[]>([]);
  const [editIsReserved, setEditIsReserved] = useState(false);

  useEffect(() => {
    if (!form.torderId) {
      setCategoryOptions(prev => prev.length > 0 ? [] : prev);
      setSeatOptions(prev => prev.length > 0 ? [] : prev);
      setIsReserved(prev => prev !== false ? false : prev);
      return;
    }

    const order = orderOptions.find((o) => o.orderId === form.torderId);
    if (order) {
      setIsReserved(order.seatingType === "reserved");
      startTransition(async () => {
        const deps = await getDependentOptionsAction(order.eventId, order.venueId);
        setCategoryOptions(deps.categoryOptions);
        setSeatOptions(deps.seatOptions);
        
        setForm((prev) => {
          if (prev.tcategoryId === "" && prev.seatId === "none") return prev;
          return { ...prev, tcategoryId: "", seatId: "none" };
        });
      });
    }
  }, [form.torderId, orderOptions]);
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
    setForm({ torderId: "", tcategoryId: "", seatId: "none" });
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
      seatId: ticket.seatId || "none",
    });
    setEditOpen(true);

    const order = orderOptions.find((o) => o.orderId === ticket.torderId);
    if (order) {
      setEditIsReserved(order.seatingType === "reserved");
      startTransition(async () => {
        const deps = await getDependentOptionsAction(order.eventId, order.venueId, ticket.ticketId);
        setEditSeatOptions(deps.seatOptions);
      });
    }
  };

  const handleUpdate = () => {
    if (!editingTicket) return;

    startTransition(async () => {
      const result = await editTicketAction(editingTicket.ticketId, editForm.status, editForm.seatId);
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

  const filteredSeatOptions = useMemo(() => {
    const selectedCategory = categoryOptions.find(c => c.categoryId === form.tcategoryId);
    return selectedCategory ? seatOptions.filter(s => s.section === selectedCategory.categoryName) : [];
  }, [seatOptions, form.tcategoryId, categoryOptions]);

  const filteredEditSeatOptions = useMemo(() => {
    return editingTicket ? editSeatOptions.filter(s => s.section === editingTicket.categoryName) : [];
  }, [editSeatOptions, editingTicket]);

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
    categoryOptions,
    seatOptions,
    isReserved,
    editSeatOptions,
    editIsReserved,
  };
}