"use client";

import { Plus, Search, Edit, Trash2, Armchair } from "lucide-react";
import { useSeat } from "@/hooks/useSeat";
import type { SeatView, SeatFormState, VenueOption } from "@/types/seat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

type SeatDirectoryProps = {
  mode: "manage" | "read";
  initialSeats: SeatView[];
  venueOptions: VenueOption[];
};

type SeatFormProps = {
  form: SeatFormState;
  setField: <K extends keyof SeatFormState>(key: K, value: SeatFormState[K]) => void;
  isPending: boolean;
  venueOptions: VenueOption[];
};

function SeatForm({ form, setField, isPending, venueOptions }: SeatFormProps) {
  return (
    <div className="grid gap-4 py-2">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase">VENUE</label>
        <select
          className="flex h-10 w-full rounded-md border bg-white px-3 text-sm disabled:opacity-50"
          value={form.venueId}
          onChange={(e) => setField("venueId", e.target.value)}
          disabled={isPending}
          required
        >
          <option value="" disabled>Pilih Venue</option>
          {venueOptions.map((opt) => (
            <option key={opt.venueId} value={opt.venueId}>{opt.venueName}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase">SECTION</label>
        <Input 
          placeholder="cth. WVIP" 
          value={form.section} 
          onChange={(e) => setField("section", e.target.value)} 
          disabled={isPending} 
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase">BARIS</label>
          <Input 
            placeholder="cth. A" 
            value={form.rowNumber} 
            onChange={(e) => setField("rowNumber", e.target.value)} 
            disabled={isPending} 
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase">NO. KURSI</label>
          <Input 
            placeholder="cth. 1" 
            value={form.seatNumber} 
            onChange={(e) => setField("seatNumber", e.target.value)} 
            disabled={isPending} 
          />
        </div>
      </div>
    </div>
  );
}

export default function SeatDirectory({ mode, initialSeats, venueOptions }: SeatDirectoryProps) {
  const canManage = mode === "manage";
  const {
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
    seatToDelete,
    handleCreate,
    handleOpenEdit,
    handleUpdate,
    handleDelete,
    openDeleteDialog,
  } = useSeat(initialSeats);

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Manajemen Kursi</h1>
        <p className="text-sm text-muted-foreground">Kelola kursi dan denah tempat duduk venue</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Kursi</p>
          <p className="mt-2 text-3xl font-bold">{stats.totalSeat}</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tersedia</p>
          <p className="mt-2 text-3xl font-bold">{stats.totalTersedia}</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Terisi</p>
          <p className="mt-2 text-3xl font-bold">{stats.totalTerisi}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="w-full lg:max-w-sm relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari section, baris, atau nomor..."
            className="pl-9 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full lg:max-w-xs">
          <select
            className="h-10 w-full rounded-md border bg-white px-3 text-sm"
            value={venueFilter}
            onChange={(e) => setVenueFilter(e.target.value)}
          >
            <option value="Semua Venue">Semua Venue</option>
            {venueOptions.map((opt) => (
              <option key={opt.venueId} value={opt.venueId}>{opt.venueName}</option>
            ))}
          </select>
        </div>
        
        <div className="flex-1 flex justify-end">
          {canManage && (
            <Dialog open={createOpen} onOpenChange={(v) => { setCreateOpen(v); if (!v) resetForm(); }}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full">
                  <Plus className="mr-2 h-4 w-4" /> Tambah Kursi
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Tambah Kursi Baru</DialogTitle>
                </DialogHeader>
                <SeatForm form={form} setField={setField} isPending={isPending} venueOptions={venueOptions} />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateOpen(false)} disabled={isPending} className="rounded-full">Batal</Button>
                  <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 rounded-full" disabled={isPending}>
                    {isPending ? "Memproses..." : "Tambah"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/50 border-b text-xs uppercase text-muted-foreground font-semibold">
            <tr>
              <th className="px-6 py-4">Section</th>
              <th className="px-6 py-4">Baris</th>
              <th className="px-6 py-4">No. Kursi</th>
              <th className="px-6 py-4">Venue</th>
              <th className="px-6 py-4">Status</th>
              {canManage && <th className="px-6 py-4 text-right">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={canManage ? 6 : 5} className="px-6 py-10 text-center text-muted-foreground">
                  Tidak ada data kursi.
                </td>
              </tr>
            ) : (
              filtered.map((seat) => (
                <tr key={seat.seatId} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-blue-600 flex items-center gap-2">
                    <Armchair className="w-4 h-4 text-blue-300" /> {seat.section}
                  </td>
                  <td className="px-6 py-4 font-medium">{seat.rowNumber}</td>
                  <td className="px-6 py-4 font-medium">{seat.seatNumber}</td>
                  <td className="px-6 py-4 text-muted-foreground flex items-center gap-2">
                     {seat.venueName}
                  </td>
                  <td className="px-6 py-4">
                    <Badge 
                      variant="outline" 
                      className={seat.status === "Tersedia" ? "text-green-600 border-green-200 bg-green-50" : "text-amber-600 border-amber-200 bg-amber-50"}
                    >
                      {seat.status === "Tersedia" ? "✓ TERSEDIA" : "◎ TERISI"}
                    </Badge>
                  </td>
                  {canManage && (
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-blue-600" onClick={() => handleOpenEdit(seat)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 ${seat.isAssigned ? "text-gray-300 cursor-not-allowed" : "text-muted-foreground hover:text-red-600"}`}
                        onClick={() => openDeleteDialog(seat)}
                        disabled={seat.isAssigned}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {canManage && (
        <>
          <Dialog open={editOpen} onOpenChange={(v) => { setEditOpen(v); if (!v) resetForm(); }}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Kursi</DialogTitle>
              </DialogHeader>
              <SeatForm form={form} setField={setField} isPending={isPending} venueOptions={venueOptions} />
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditOpen(false)} disabled={isPending} className="rounded-full">Batal</Button>
                <Button onClick={handleUpdate} className="bg-blue-600 hover:bg-blue-700 rounded-full" disabled={isPending}>
                  {isPending ? "Menyimpan..." : "Simpan"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-sans text-lg font-bold text-red-600">Hapus Kursi</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-muted-foreground">Apakah Anda yakin ingin menghapus kursi ini? Tindakan ini tidak dapat dibatalkan.</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={isPending} className="rounded-full">Batal</Button>
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