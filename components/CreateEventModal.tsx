"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export function CreateEventModal() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Nanti panggil createEventFull di sini
    console.log("Form dikirim!");
    setOpen(false); // Tutup modal setelah simpan
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-2">
          <Plus className="w-4 h-4" /> Buat Acara Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Buat Acara Baru</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Acara (EVENT_TITLE)</Label>
              <Input id="title" placeholder="cth. Konser Melodi Senja" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Tanggal (DATE)</Label>
              <Input id="date" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Waktu (TIME)</Label>
              <Input id="time" type="time" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue">Venue (VENUE_ID)</Label>
              <Input id="venue" placeholder="Pilih Venue" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Kategori Tiket</Label>
            <div className="p-4 border rounded-md bg-slate-50 space-y-3">
              <div className="flex gap-2">
                <Input placeholder="Nama Kategori" className="bg-white" />
                <Input type="number" placeholder="Harga" className="bg-white" />
                <Input type="number" placeholder="Kuota" className="bg-white" />
              </div>
              <Button type="button" variant="outline" size="sm" className="text-xs">
                + Tambah Kategori
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit">Buat Acara</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}