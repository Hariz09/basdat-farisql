"use client";

import { Plus, Search, QrCode, Edit, Trash2 } from "lucide-react";
import { useTicket } from "@/hooks/useTicket";
import type { TicketView, TicketFormState } from "@/types/ticket";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type TicketDirectoryProps = {
  mode: "manage" | "read";
  initialTickets: TicketView[];
};

type CreateFormProps = {
  form: TicketFormState;
  setField: <K extends keyof TicketFormState>(key: K, value: TicketFormState[K]) => void;
  isPending: boolean;
};

function CreateTicketForm({ form, setField, isPending }: CreateFormProps) {
  return (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label>ORDER</Label>
        <Select required value={form.torderId} onValueChange={(v) => setField("torderId", v)} disabled={isPending}>
          <SelectTrigger><SelectValue placeholder="Pilih Order" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ord_001">ord_001 — Budi Santoso</SelectItem>
            <SelectItem value="ord_002">ord_002 — Siti Rahayu</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>KATEGORI TIKET</Label>
        <Select required value={form.tcategoryId} onValueChange={(v) => setField("tcategoryId", v)} disabled={isPending}>
          <SelectTrigger><SelectValue placeholder="Pilih Kategori" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="cat_vip_001">VIP — Rp 750,000</SelectItem>
            <SelectItem value="cat_gen_002">General Admission — Rp 150,000</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>KURSI <span className="text-muted-foreground text-xs font-normal">(opsional)</span></Label>
        <Select value={form.seatInfo} onValueChange={(v) => setField("seatInfo", v)} disabled={isPending}>
          <SelectTrigger><SelectValue placeholder="Pilih Kursi" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Tanpa Kursi</SelectItem>
            <SelectItem value="Category 1 — Baris C, No. 1">Category 1 — Baris C, No. 1</SelectItem>
            <SelectItem value="VIP — Baris A, No. 5">VIP — Baris A, No. 5</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>KODE TIKET</Label>
        <Input disabled placeholder="Auto-generate saat dibuat" className="bg-gray-50" />
      </div>
    </div>
  );
}

export default function TicketDirectory({ mode, initialTickets }: TicketDirectoryProps) {
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
  } = useTicket(initialTickets);

  const getBadgeVariant = (status: string) => {
    if (status === "Valid") return "default";
    if (status === "Terpakai") return "secondary";
    return "destructive";
  };

  const getBadgeClassName = (status: string) => {
    if (status === "Valid") return "bg-green-100 text-green-700 hover:bg-green-100 border-green-200";
    if (status === "Terpakai") return "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200";
    return "bg-red-100 text-red-700 hover:bg-red-100 border-red-200";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      {/* Header Halaman */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">
          {canManage ? "Manajemen Tiket" : "Tiket Saya"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {canManage 
            ? "Kelola tiket: tambah, ubah status, dan hapus tiket." 
            : "Kelola dan akses tiket pertunjukan Anda."}
        </p>
      </div>

      {/* Cards Statistik */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Total Tiket</p>
          <p className="mt-2 text-3xl font-bold">{stats.totalTicket}</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Valid</p>
          <p className="mt-2 text-3xl font-bold">{stats.totalValid}</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Terpakai</p>
          <p className="mt-2 text-3xl font-bold">{stats.totalTerpakai}</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semua Status">Semua Status</SelectItem>
              <SelectItem value="Valid">Valid</SelectItem>
              <SelectItem value="Terpakai">Terpakai</SelectItem>
              <SelectItem value="Dibatalkan">Dibatalkan</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Modal Tambah Tiket */}
          {canManage && (
            <Dialog open={createOpen} onOpenChange={(v) => { setCreateOpen(v); if (!v) resetForm(); }}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="mr-2 h-4 w-4" /> Tambah Tiket
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-125">
                <DialogHeader>
                  <DialogTitle>Buat Tiket Baru</DialogTitle>
                </DialogHeader>
                <CreateTicketForm form={form} setField={setField} isPending={isPending} />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateOpen(false)} disabled={isPending}>Batal</Button>
                  <Button onClick={handleCreate} disabled={isPending} className="bg-blue-600 hover:bg-blue-700">
                    {isPending ? "Memproses..." : "Buat Tiket"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Daftar Tiket Card List */}
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
                  <div className="w-10 h-10 rounded-md bg-blue-600 flex items-center justify-center text-white">
                    <span className="font-bold text-xs">TTK</span>
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
                    <p className="text-muted-foreground text-xs uppercase font-semibold mb-1">Jadwal</p>
                    <p className="font-medium">{new Date(ticket.eventDate).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase font-semibold mb-1">Lokasi</p>
                    <p className="font-medium">{ticket.venueName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase font-semibold mb-1">Kursi</p>
                    <p className="font-medium">{ticket.seatInfo || "-"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase font-semibold mb-1">Order</p>
                    <p className="font-medium">{ticket.torderId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase font-semibold mb-1">Harga</p>
                    <p className="font-medium">Rp {ticket.price.toLocaleString("id-ID")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase font-semibold mb-1">Pelanggan</p>
                    <p className="font-medium">{ticket.customerName}</p>
                  </div>
                </div>

                {/* Modals Update & Delete */}
                {canManage && (
                  <div className="flex gap-2 mt-6 pt-4 border-t">
                    <Button variant="outline" size="sm" className="h-8" onClick={() => handleOpenEdit(ticket)}>
                      <Edit className="w-3 h-3 mr-2" /> Update
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={() => openDeleteDialog(ticket)}>
                      <Trash2 className="w-3 h-3 mr-2" /> Hapus
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Kolom QR Scan */}
              {!canManage && (
                <div className="w-full md:w-48 bg-gray-50 border-l flex flex-col items-center justify-center p-6 border-t md:border-t-0">
                  <div className="bg-white p-2 rounded-lg shadow-sm border mb-2">
                    <QrCode className="w-20 h-20 text-gray-800" />
                  </div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mt-2">Scan Entry</p>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Global Edit Dialog */}
      {canManage && (
        <Dialog open={editOpen} onOpenChange={(v) => { setEditOpen(v); if (!v) resetForm(); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Tiket</DialogTitle>
            </DialogHeader>
            {editingTicket && (
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>KODE TIKET</Label>
                  <Input disabled value={editingTicket.ticketCode} className="bg-gray-50 font-mono text-sm" />
                </div>
                <div className="space-y-2">
                  <Label>STATUS</Label>
                  <Select disabled={isPending} value={editForm.status} onValueChange={(val: any) => setEditField("status", val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Valid">Valid</SelectItem>
                      <SelectItem value="Terpakai">Terpakai</SelectItem>
                      <SelectItem value="Dibatalkan">Dibatalkan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>KURSI <span className="text-muted-foreground font-normal">(opsional)</span></Label>
                  <Select disabled={isPending} value={editForm.seatInfo} onValueChange={(v) => setEditField("seatInfo", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Tanpa Kursi</SelectItem>
                      <SelectItem value="VIP - Baris B, No. 1">VIP - Baris B, No. 1</SelectItem>
                      <SelectItem value="Category 1 - Baris C, No. 1">Category 1 - Baris C, No. 1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="ghost" onClick={() => setEditOpen(false)} disabled={isPending}>Batal</Button>
              <Button onClick={handleUpdate} className="bg-blue-600 hover:bg-blue-700" disabled={isPending}>
                {isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Global Delete Dialog */}
      {canManage && (
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600">Hapus Tiket</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground">Apakah Anda yakin ingin menghapus tiket ini? Relasi kursi akan dilepaskan. Tindakan ini tidak dapat dibatalkan.</p>
              {ticketToDelete && (
                <div className="mt-4 rounded-lg border bg-muted/50 p-4">
                  <p className="font-semibold font-mono text-gray-800">{ticketToDelete.ticketCode}</p>
                  <p className="text-sm text-muted-foreground mt-1">{ticketToDelete.eventName} - {ticketToDelete.customerName}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setDeleteOpen(false)} disabled={isPending}>Batal</Button>
              <Button variant="destructive" onClick={handleDelete} className="bg-red-600" disabled={isPending}>
                {isPending ? "Menghapus..." : "Hapus"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}