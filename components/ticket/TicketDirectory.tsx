"use client";

import { Plus, Search, QrCode, Edit, Trash2, Download, Share2 } from "lucide-react";
import { useTicket } from "@/hooks/useTicket";
import type { TicketView, TicketFormState } from "@/types/ticket";
import type { OrderOption, CategoryOption, SeatOption } from "@/app/ticket-actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

type TicketDirectoryProps = {
  mode: "manage" | "read";
  initialTickets: TicketView[];
  orderOptions?: OrderOption[];
};

type CreateFormProps = {
  form: TicketFormState;
  setField: <K extends keyof TicketFormState>(key: K, value: TicketFormState[K]) => void;
  isPending: boolean;
  orderOptions: OrderOption[];
  categoryOptions: CategoryOption[];
  seatOptions: SeatOption[];
  isReserved: boolean;
};

const EMPTY_ORDER_OPTIONS: OrderOption[] = [];

function TicketForm({ form, setField, isPending, orderOptions, categoryOptions, seatOptions, isReserved }: CreateFormProps) {
  return (
    <div className="grid gap-4 py-2">
      <div className="space-y-2">
        <label className="text-sm font-medium">ORDER *</label>
        <select
          className="flex h-10 w-full rounded-md border bg-white px-3 text-sm disabled:opacity-50"
          value={form.torderId}
          onChange={(e) => setField("torderId", e.target.value)}
          disabled={isPending}
          required
        >
          <option value="" disabled>Pilih Order</option>
          {orderOptions.map((opt) => (
            <option key={opt.orderId} value={opt.orderId}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">KATEGORI TIKET *</label>
        <select
          className="flex h-10 w-full rounded-md border bg-white px-3 text-sm disabled:opacity-50"
          value={form.tcategoryId}
          onChange={(e) => setField("tcategoryId", e.target.value)}
          disabled={isPending || !form.torderId}
          required
        >
          <option value="" disabled>Pilih Kategori</option>
          {categoryOptions.map((opt) => (
            <option key={opt.categoryId} value={opt.categoryId} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {isReserved && (
        <div className="space-y-2">
          <label className="text-sm font-medium">
            KURSI <span className="text-muted-foreground font-normal">(opsional)</span>
          </label>
          <select
            className="flex h-10 w-full rounded-md border bg-white px-3 text-sm disabled:opacity-50"
            value={form.seatId}
            onChange={(e) => setField("seatId", e.target.value)}
            disabled={isPending || !form.torderId}
          >
            <option value="none">Tanpa Kursi</option>
            {seatOptions.map((opt) => (
              <option key={opt.seatId} value={opt.seatId}>{opt.label}</option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">KODE TIKET</label>
        <Input disabled placeholder="Auto-generate saat dibuat" className="bg-gray-50 italic" />
      </div>
    </div>
  );
}

export default function TicketDirectory({ 
  mode, 
  initialTickets, 
  orderOptions = EMPTY_ORDER_OPTIONS
}: TicketDirectoryProps) {
  const canManage = mode === "manage";
  const {
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
  } = useTicket(initialTickets, orderOptions);

  const getBadgeVariant = (status: string) => {
    if (status === "Valid") return "default";
    return "secondary";
  };

  const getBadgeClassName = (status: string) => {
    if (status === "Valid") return "bg-green-100 text-green-700 hover:bg-green-100 border-green-200";
    return "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">
          {canManage ? "Manajemen Tiket" : "Tiket Saya"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {canManage 
            ? "Kelola tiket: tambah, ubah status, dan hapus tiket" 
            : "Kelola dan akses tiket pertunjukan Anda"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Tiket</p>
          <p className="mt-2 text-3xl font-bold">{stats.totalTicket}</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Valid</p>
          <p className="mt-2 text-3xl font-bold">{stats.totalValid}</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Terpakai</p>
          <p className="mt-2 text-3xl font-bold">{stats.totalTerpakai}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm lg:flex-row lg:items-center">
        <div className="w-full lg:flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari kode tiket atau nama acara..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <select
            className="h-10 rounded-md border bg-white px-3 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="Semua Status">Semua Status</option>
            <option value="Valid">Valid</option>
            <option value="Terpakai">Terpakai</option>
          </select>
          
          {canManage && (
            <Dialog open={createOpen} onOpenChange={(v) => { setCreateOpen(v); if (!v) resetForm(); }}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full">
                  <Plus className="mr-2 h-4 w-4" /> Tambah Tiket
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-125">
                <DialogHeader>
                  <DialogTitle className="font-sans text-lg font-bold">Tambah Tiket Baru</DialogTitle>
                </DialogHeader>
                <TicketForm 
                  form={form} 
                  setField={setField} 
                  isPending={isPending} 
                  orderOptions={orderOptions}
                  categoryOptions={categoryOptions}
                  seatOptions={seatOptions}
                  isReserved={isReserved}
                />
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setCreateOpen(false)} disabled={isPending}>Batal</Button>
                  <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 rounded-full" disabled={isPending}>
                    {isPending ? "Memproses..." : "Buat Tiket"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="px-4 py-10 text-center text-muted-foreground border rounded-2xl bg-white shadow-sm">
            Tidak ada tiket yang ditemukan.
          </div>
        ) : (
          filtered.map((ticket) => (
            <Card key={ticket.ticketId} className="flex flex-col md:flex-row overflow-hidden shadow-sm border-0 ring-1 ring-border rounded-2xl">
              <div className="flex-1 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                    <QrCode className="w-5 h-5"/>
                  </div>
                  <div>
                    <div className="flex gap-2 items-center mb-1">
                      <Badge variant={getBadgeVariant(ticket.status)} className={getBadgeClassName(ticket.status)}>
                        {ticket.status.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                        {ticket.categoryName}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-lg leading-none">{ticket.eventName}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{ticket.ticketCode}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-6">
                  <div>
                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider mb-1">JADWAL</p>
                    <p className="font-medium">{new Date(ticket.eventDate).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider mb-1">LOKASI</p>
                    <p className="font-medium">{ticket.venueName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider mb-1">KURSI</p>
                    <p className="font-medium">{ticket.seatInfo || "-"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider mb-1">ORDER</p>
                    <p className="font-medium">{ticket.torderId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider mb-1">HARGA</p>
                    <p className="font-medium">Rp {ticket.price.toLocaleString("id-ID")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider mb-1">PELANGGAN</p>
                    <p className="font-medium">{ticket.customerName}</p>
                  </div>
                </div>

                {canManage ? (
                  <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
                    <Button variant="outline" size="sm" className="h-8 rounded-full" onClick={() => handleOpenEdit(ticket)}>
                      <Edit className="w-3 h-3 mr-2" /> Update
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 rounded-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={() => openDeleteDialog(ticket)}>
                      <Trash2 className="w-3 h-3 mr-2" /> Hapus
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
                    <Button className="h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-white" size="sm">
                       <QrCode className="w-4 h-4 mr-2" /> Tampilkan QR
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                       <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                       <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              {!canManage && (
                <div className="w-full md:w-48 bg-gray-50 border-l flex flex-col items-center justify-center p-6 border-t md:border-t-0">
                  <div className="bg-white p-3 rounded-xl shadow-sm border mb-2">
                    <QrCode className="w-24 h-24 text-gray-800" />
                  </div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-2">SCAN ENTRY</p>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {canManage && (
        <>
          <Dialog open={editOpen} onOpenChange={(v) => { setEditOpen(v); if (!v) resetForm(); }}>
            <DialogContent className="sm:max-w-125">
              <DialogHeader>
                <DialogTitle className="font-sans text-lg font-bold"> Update Tiket</DialogTitle>
              </DialogHeader>
              {editingTicket && (
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">KODE TIKET</label>
                    <Input disabled value={editingTicket.ticketCode} className="bg-gray-50 font-mono text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">STATUS</label>
                    <select
                      className="flex h-10 w-full rounded-md border bg-white px-3 text-sm disabled:opacity-50"
                      value={editForm.status}
                      onChange={(e) => setEditField("status", e.target.value as any)}
                      disabled={isPending}
                    >
                      <option value="Valid">Valid</option>
                      <option value="Terpakai">Terpakai</option>
                    </select>
                  </div>
                  {editIsReserved && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        KURSI <span className="text-muted-foreground font-normal">(opsional)</span>
                      </label>
                      <select
                        className="flex h-10 w-full rounded-md border bg-white px-3 text-sm disabled:opacity-50"
                        value={editForm.seatId}
                        onChange={(e) => setEditField("seatId", e.target.value)}
                        disabled={isPending}
                      >
                        <option value="none">Tanpa Kursi</option>
                        {editSeatOptions.map((opt) => (
                          <option key={opt.seatId} value={opt.seatId}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}
              <DialogFooter>
                <Button variant="ghost" onClick={() => setEditOpen(false)} disabled={isPending}>Batal</Button>
                <Button onClick={handleUpdate} className="bg-blue-600 hover:bg-blue-700 rounded-full" disabled={isPending}>
                  {isPending ? "Menyimpan..." : "Simpan"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogContent className="sm:max-w-100">
              <DialogHeader>
                <DialogTitle className="font-sans text-lg font-bold text-red-600">Hapus Tiket</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-muted-foreground">Apakah Anda yakin ingin menghapus tiket ini? Relasi kursi akan dilepaskan.</p>
                {ticketToDelete && (
                  <div className="mt-4 rounded-lg border bg-muted/50 p-4">
                    <p className="font-semibold font-mono text-gray-800">{ticketToDelete.ticketCode}</p>
                    <p className="text-sm text-muted-foreground mt-1">{ticketToDelete.eventName} - {ticketToDelete.customerName}</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setDeleteOpen(false)} disabled={isPending}>Batal</Button>
                <Button variant="destructive" onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700 rounded-full" disabled={isPending}>
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