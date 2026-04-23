"use client";

import { useMemo, useState } from "react";
import {
  getAllVenues,
  createVenue,
  updateVenue,
  deleteVenue,
} from "@/lib/mock-venue-db";
import { Venue } from "@/types/venue";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

export default function VenuePage() {
  // ganti role ini sesuai kebutuhan demo
  const role = "organizer" as "admin" | "organizer" | "customer";
  const canManage = role === "admin" || role === "organizer";

  const [venues, setVenues] = useState<Venue[]>(getAllVenues());

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);

  const [venueName, setVenueName] = useState("");
  const [city, setCity] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [address, setAddress] = useState("");
  const [seatingType, setSeatingType] = useState<"reserved" | "free">("reserved");

  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [seatingFilter, setSeatingFilter] = useState("all");

  const refresh = () => {
    setVenues(getAllVenues());
  };

  const resetForm = () => {
    setVenueName("");
    setCity("");
    setCapacity(0);
    setAddress("");
    setSeatingType("reserved");
  };

  const handleCreate = () => {
    if (!venueName.trim() || !city.trim() || !address.trim() || capacity <= 0) {
      return;
    }

    createVenue({
      venueName,
      city,
      capacity,
      address,
      seatingType,
    });

    resetForm();
    setOpen(false);
    refresh();
  };

  const handleOpenEdit = (venue: Venue) => {
    setEditingVenue(venue);
    setVenueName(venue.venueName);
    setCity(venue.city);
    setCapacity(venue.capacity);
    setAddress(venue.address);
    setSeatingType(venue.seatingType);
    setEditOpen(true);
  };

  const handleEditSave = () => {
    if (!editingVenue) return;
    if (!venueName.trim() || !city.trim() || !address.trim() || capacity <= 0) {
      return;
    }

    updateVenue(editingVenue.venueId, {
      venueName,
      city,
      capacity,
      address,
      seatingType,
    });

    setEditOpen(false);
    setEditingVenue(null);
    resetForm();
    refresh();
  };

  const cityOptions = useMemo(() => {
    return Array.from(new Set(venues.map((v) => v.city)));
  }, [venues]);

  const filteredVenues = useMemo(() => {
    return venues.filter((v) => {
      const matchSearch =
        v.venueName.toLowerCase().includes(search.toLowerCase()) ||
        v.address.toLowerCase().includes(search.toLowerCase());

      const matchCity = cityFilter === "all" ? true : v.city === cityFilter;
      const matchSeating =
        seatingFilter === "all" ? true : v.seatingType === seatingFilter;

      return matchSearch && matchCity && matchSeating;
    });
  }, [venues, search, cityFilter, seatingFilter]);

  const totalVenue = venues.length;
  const totalReserved = venues.filter((v) => v.seatingType === "reserved").length;
  const totalCapacity = venues.reduce((sum, v) => sum + v.capacity, 0);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Manajemen Venue</h1>
        <p className="text-sm text-muted-foreground">
          Kelola lokasi pertunjukan dan kapasitas tempat duduk
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Venue</p>
          <p className="mt-2 text-3xl font-bold">{totalVenue}</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Reserved Seating</p>
          <p className="mt-2 text-3xl font-bold">{totalReserved}</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Kapasitas</p>
          <p className="mt-2 text-3xl font-bold">
            {totalCapacity.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full lg:flex-1">
          <Input
            placeholder="Cari nama atau alamat venue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            className="h-10 rounded-md border bg-white px-3 text-sm"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="all">Semua Kota</option>
            {cityOptions.map((cityOption) => (
              <option key={cityOption} value={cityOption}>
                {cityOption}
              </option>
            ))}
          </select>

          <select
            className="h-10 rounded-md border bg-white px-3 text-sm"
            value={seatingFilter}
            onChange={(e) => setSeatingFilter(e.target.value)}
          >
            <option value="all">Semua Tipe Seating</option>
            <option value="reserved">Reserved Seating</option>
            <option value="free">Free Seating</option>
          </select>

          {canManage && (
            <Dialog
              open={open}
              onOpenChange={(val) => {
                setOpen(val);
                if (!val) resetForm();
              }}
            >
              <DialogTrigger asChild>
                <Button>Tambah Venue</Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Tambah Venue Baru</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-2">
                  <Input
                    placeholder="Nama Venue"
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      placeholder="Kapasitas"
                      value={capacity}
                      onChange={(e) => setCapacity(Number(e.target.value))}
                    />

                    <Input
                      placeholder="Kota"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  <Textarea
                    placeholder="Alamat"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />

                  <select
                    className="h-10 rounded-md border bg-white px-3 text-sm"
                    value={seatingType}
                    onChange={(e) =>
                      setSeatingType(e.target.value as "reserved" | "free")
                    }
                  >
                    <option value="reserved">Reserved Seating</option>
                    <option value="free">Free Seating</option>
                  </select>
                </div>

                <DialogFooter>
                  <Button onClick={handleCreate}>Simpan</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredVenues.map((v) => (
          <div
            key={v.venueId}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold">{v.venueName}</h2>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      v.seatingType === "reserved"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-gray-50 text-gray-700 border border-gray-200"
                    }`}
                  >
                    {v.seatingType === "reserved"
                      ? "Reserved Seating"
                      : "Free Seating"}
                  </span>
                </div>

                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>{v.address}</p>
                  <p>{v.city}</p>
                </div>

                <div className="inline-flex rounded-md bg-muted px-3 py-2 text-sm">
                  <span className="font-medium">Kapasitas:</span>
                  <span className="ml-2">{v.capacity} kursi</span>
                </div>
              </div>

              {canManage && (
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => handleOpenEdit(v)}>
                    Edit
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => {
                      deleteVenue(v.venueId);
                      refresh();
                    }}
                  >
                    Hapus
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredVenues.length === 0 && (
          <div className="rounded-xl border bg-white p-10 text-center text-sm text-muted-foreground">
            Tidak ada venue yang sesuai dengan pencarian atau filter.
          </div>
        )}
      </div>

      <Dialog
        open={editOpen}
        onOpenChange={(val) => {
          setEditOpen(val);
          if (!val) {
            setEditingVenue(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Venue</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <Input
              placeholder="Nama Venue"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Kapasitas"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
              />

              <Input
                placeholder="Kota"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <Textarea
              placeholder="Alamat"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <select
              className="h-10 rounded-md border bg-white px-3 text-sm"
              value={seatingType}
              onChange={(e) =>
                setSeatingType(e.target.value as "reserved" | "free")
              }
            >
              <option value="reserved">Reserved Seating</option>
              <option value="free">Free Seating</option>
            </select>
          </div>

          <DialogFooter>
            <Button onClick={handleEditSave}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}