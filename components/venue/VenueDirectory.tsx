"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  createVenueAction,
  deleteVenueAction,
  updateVenueAction,
} from "@/app/venue-actions";
import type { Venue } from "@/types/venue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type VenueDirectoryProps = {
  mode: "manage" | "read";
  title: string;
  description: string;
  initialVenues: Venue[];
};

export default function VenueDirectory({
  mode,
  title,
  description,
  initialVenues,
}: VenueDirectoryProps) {
  const canManage = mode === "manage";
  const [isPending, startTransition] = useTransition();
  const [venues, setVenues] = useState<Venue[]>(initialVenues);

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

  const resetForm = () => {
    setVenueName("");
    setCity("");
    setCapacity(0);
    setAddress("");
    setSeatingType("reserved");
  };

  const validateVenueForm = () => {
    if (!venueName.trim()) {
      toast.error("Nama venue wajib diisi.");
      return false;
    }

    if (!city.trim()) {
      toast.error("Kota venue wajib diisi.");
      return false;
    }

    if (!address.trim()) {
      toast.error("Alamat venue wajib diisi.");
      return false;
    }

    if (!Number.isFinite(capacity) || capacity <= 0) {
      toast.error("Kapasitas venue harus lebih dari 0.");
      return false;
    }

    return true;
  };

  const handleCreate = () => {
    if (!validateVenueForm()) {
      return;
    }

    startTransition(async () => {
      const result = await createVenueAction({
        venueName: venueName.trim(),
        city: city.trim(),
        capacity,
        address: address.trim(),
        seatingType,
      });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      resetForm();
      setOpen(false);
      setVenues(result.venues);
      toast.success(result.message);
    });
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
    if (!editingVenue) {
      return;
    }

    if (!validateVenueForm()) {
      return;
    }

    startTransition(async () => {
      const result = await updateVenueAction(editingVenue.venueId, {
        venueName: venueName.trim(),
        city: city.trim(),
        capacity,
        address: address.trim(),
        seatingType,
      });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setEditOpen(false);
      setEditingVenue(null);
      resetForm();
      setVenues(result.venues);
      toast.success(result.message);
    });
  };

  const cityOptions = useMemo(
    () => Array.from(new Set(venues.map((venue) => venue.city))).sort(),
    [venues],
  );

  const filteredVenues = useMemo(() => {
    return venues.filter((venue) => {
      const matchSearch =
        venue.venueName.toLowerCase().includes(search.toLowerCase()) ||
        venue.address.toLowerCase().includes(search.toLowerCase());

      const matchCity = cityFilter === "all" || venue.city === cityFilter;
      const matchSeating =
        seatingFilter === "all" || venue.seatingType === seatingFilter;

      return matchSearch && matchCity && matchSeating;
    });
  }, [venues, search, cityFilter, seatingFilter]);

  const totalVenue = venues.length;
  const totalReserved = venues.filter(
    (venue) => venue.seatingType === "reserved",
  ).length;
  const totalCapacity = venues.reduce((sum, venue) => sum + venue.capacity, 0);

  const heading = canManage ? title : title;
  const subheading = canManage
    ? description
    : `${description} Gunakan pencarian dan filter untuk menemukan venue yang relevan.`;

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{heading}</h1>
        <p className="text-sm text-muted-foreground">{subheading}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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

      <div className="flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full lg:flex-1">
          <Input
            placeholder="Cari nama atau alamat venue..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            className="h-10 rounded-md border bg-white px-3 text-sm"
            value={cityFilter}
            onChange={(event) => setCityFilter(event.target.value)}
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
            onChange={(event) => setSeatingFilter(event.target.value)}
          >
            <option value="all">Semua Tipe Seating</option>
            <option value="reserved">Reserved Seating</option>
            <option value="free">Free Seating</option>
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
                    onChange={(event) => setVenueName(event.target.value)}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      placeholder="Kapasitas"
                      value={capacity}
                      onChange={(event) => setCapacity(Number(event.target.value))}
                    />

                    <Input
                      placeholder="Kota"
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                    />
                  </div>

                  <Textarea
                    placeholder="Alamat"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                  />

                  <select
                    className="h-10 rounded-md border bg-white px-3 text-sm"
                    value={seatingType}
                    onChange={(event) =>
                      setSeatingType(event.target.value as "reserved" | "free")
                    }
                  >
                    <option value="reserved">Reserved Seating</option>
                    <option value="free">Free Seating</option>
                  </select>
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

      <div className="grid gap-4">
        {filteredVenues.map((venue) => (
          <div
            key={venue.venueId}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold">{venue.venueName}</h2>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${
                      venue.seatingType === "reserved"
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-gray-50 text-gray-700"
                    }`}
                  >
                    {venue.seatingType === "reserved"
                      ? "Reserved Seating"
                      : "Free Seating"}
                  </span>
                </div>

                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>{venue.address}</p>
                  <p>{venue.city}</p>
                </div>

                <div className="inline-flex rounded-md bg-muted px-3 py-2 text-sm">
                  <span className="font-medium">Kapasitas:</span>
                  <span className="ml-2">
                    {venue.capacity.toLocaleString("id-ID")} kursi
                  </span>
                </div>
              </div>

              {canManage ? (
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => handleOpenEdit(venue)}>
                    Edit
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => {
                      startTransition(async () => {
                        const result = await deleteVenueAction(venue.venueId);

                        if (!result.ok) {
                          toast.error(result.message);
                          return;
                        }

                        setVenues(result.venues);
                        toast.success(result.message);
                      });
                    }}
                    disabled={isPending}
                  >
                    {isPending ? "Memproses..." : "Hapus"}
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        ))}

        {filteredVenues.length === 0 ? (
          <div className="rounded-xl border bg-white p-10 text-center text-sm text-muted-foreground">
            Tidak ada venue yang sesuai dengan pencarian atau filter.
          </div>
        ) : null}
      </div>

      {canManage ? (
        <Dialog
          open={editOpen}
          onOpenChange={(value) => {
            setEditOpen(value);
            if (!value) {
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
                onChange={(event) => setVenueName(event.target.value)}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Kapasitas"
                  value={capacity}
                  onChange={(event) => setCapacity(Number(event.target.value))}
                />

                <Input
                  placeholder="Kota"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                />
              </div>

              <Textarea
                placeholder="Alamat"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
              />

              <select
                className="h-10 rounded-md border bg-white px-3 text-sm"
                value={seatingType}
                onChange={(event) =>
                  setSeatingType(event.target.value as "reserved" | "free")
                }
              >
                <option value="reserved">Reserved Seating</option>
                <option value="free">Free Seating</option>
              </select>
            </div>

            <DialogFooter>
              <Button onClick={handleEditSave} disabled={isPending}>
                {isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}
