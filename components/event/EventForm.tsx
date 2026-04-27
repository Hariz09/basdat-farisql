"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  ArrowLeft,
  CalendarDays,
  LoaderCircle,
  MapPin,
  Music4,
  Plus,
  Ticket,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { createEventAction, updateEventAction } from "@/app/event-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Artist } from "@/types/artist";
import type { EventFormInput, EventTicketInput, OrganizerOption } from "@/types/event";
import type { Role } from "@/lib/session";
import type { Venue } from "@/types/venue";

type EventFormProps = {
  mode: "create" | "edit";
  role: Extract<Role, "admin" | "organizer">;
  eventId?: string;
  initialValues: EventFormInput;
  venues: Venue[];
  artists: Artist[];
  organizers: OrganizerOption[];
  cancelHref: string;
};

function createEmptyTicket(): EventTicketInput {
  return {
    categoryName: "",
    price: 0,
    quota: 0,
  };
}

export default function EventForm({
  mode,
  role,
  eventId,
  initialValues,
  venues,
  artists,
  organizers,
  cancelHref,
}: EventFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<EventFormInput>(initialValues);

  const selectedVenue = venues.find((venue) => venue.venueId === formData.venueId);
  const totalQuota = formData.tickets.reduce(
    (sum, ticket) => sum + (Number.isFinite(ticket.quota) ? ticket.quota : 0),
    0,
  );

  const validateForm = () => {
    if (!formData.eventTitle.trim()) {
      return "Judul acara wajib diisi.";
    }

    if (!formData.date || !formData.time) {
      return "Tanggal dan waktu acara wajib diisi.";
    }

    if (!formData.venueId) {
      return "Venue wajib dipilih.";
    }

    if (role === "admin" && !formData.organizerId?.trim()) {
      return "Organizer wajib dipilih.";
    }

    if (formData.artists.length === 0) {
      return "Pilih minimal satu artis.";
    }

    if (formData.tickets.length === 0) {
      return "Tambahkan minimal satu kategori tiket.";
    }

    for (const ticket of formData.tickets) {
      if (!ticket.categoryName.trim()) {
        return "Nama kategori tiket wajib diisi.";
      }

      if (!Number.isFinite(ticket.price) || ticket.price < 0) {
        return "Harga tiket harus bernilai 0 atau lebih.";
      }

      if (!Number.isFinite(ticket.quota) || ticket.quota <= 0) {
        return "Kuota tiket harus lebih dari 0.";
      }
    }

    if (selectedVenue && totalQuota > selectedVenue.capacity) {
      return `Total kuota tiket (${totalQuota}) melebihi kapasitas venue ${selectedVenue.venueName} (${selectedVenue.capacity}).`;
    }

    return null;
  };

  const updateTicket = (
    index: number,
    field: keyof EventTicketInput,
    value: string | number,
  ) => {
    setFormData((current) => {
      const nextTickets = [...current.tickets];
      nextTickets[index] = {
        ...nextTickets[index],
        [field]:
          field === "price" || field === "quota" ? Number(value) : String(value),
      };

      return {
        ...current,
        tickets: nextTickets,
      };
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      toast.error(validationError);
      return;
    }

    startTransition(async () => {
      const payload: EventFormInput = {
        ...formData,
        eventTitle: formData.eventTitle.trim(),
        description: formData.description.trim(),
        organizerId: formData.organizerId?.trim(),
        artists: Array.from(new Set(formData.artists)),
        tickets: formData.tickets.map((ticket) => ({
          ...ticket,
          categoryName: ticket.categoryName.trim(),
          price: Number(ticket.price),
          quota: Number(ticket.quota),
        })),
      };

      const result =
        mode === "create"
          ? await createEventAction(payload)
          : await updateEventAction(eventId!, payload);

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.push(result.redirectTo);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost">
        <Link href={cancelHref}>
          <ArrowLeft />
          Kembali ke daftar event
        </Link>
      </Button>

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="space-y-6">
          <article className="rounded-[30px] border border-black/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="space-y-2">
              <p className="text-sm text-black/55">
                {mode === "create" ? "Buat Acara Baru" : "Edit Acara"}
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-black">
                {mode === "create"
                  ? "Isi detail event baru"
                  : "Perbarui data event"}
              </h1>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <label className="space-y-2 md:col-span-2">
                <span className="text-xs font-medium uppercase tracking-wide text-black/55">
                  Judul Acara
                </span>
                <Input
                  value={formData.eventTitle}
                  onChange={(inputEvent) =>
                    setFormData((current) => ({
                      ...current,
                      eventTitle: inputEvent.target.value,
                    }))
                  }
                  placeholder="cth. Konser Melodi Senja"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-wide text-black/55">
                  Tanggal
                </span>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(inputEvent) =>
                    setFormData((current) => ({
                      ...current,
                      date: inputEvent.target.value,
                    }))
                  }
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-wide text-black/55">
                  Waktu
                </span>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(inputEvent) =>
                    setFormData((current) => ({
                      ...current,
                      time: inputEvent.target.value,
                    }))
                  }
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-wide text-black/55">
                  Venue
                </span>
                <select
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  value={formData.venueId}
                  onChange={(inputEvent) =>
                    setFormData((current) => ({
                      ...current,
                      venueId: inputEvent.target.value,
                    }))
                  }
                >
                  <option value="">Pilih venue</option>
                  {venues.map((venue) => (
                    <option key={venue.venueId} value={venue.venueId}>
                      {venue.venueName} · {venue.city} · kapasitas{" "}
                      {venue.capacity.toLocaleString("id-ID")}
                    </option>
                  ))}
                </select>
              </label>

              {role === "admin" ? (
                <label className="space-y-2">
                  <span className="text-xs font-medium uppercase tracking-wide text-black/55">
                    Organizer
                  </span>
                  <select
                    className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    value={formData.organizerId ?? ""}
                    onChange={(inputEvent) =>
                      setFormData((current) => ({
                        ...current,
                        organizerId: inputEvent.target.value,
                      }))
                    }
                  >
                    <option value="">Pilih organizer</option>
                    {organizers.map((organizer) => (
                      <option
                        key={organizer.organizerId}
                        value={organizer.organizerId}
                      >
                        {organizer.organizerName}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              <label className="space-y-2 md:col-span-2">
                <span className="text-xs font-medium uppercase tracking-wide text-black/55">
                  Deskripsi
                </span>
                <Textarea
                  value={formData.description}
                  onChange={(inputEvent) =>
                    setFormData((current) => ({
                      ...current,
                      description: inputEvent.target.value,
                    }))
                  }
                  placeholder="Deskripsikan konsep acara, performer, atau highlight utama."
                  className="min-h-32"
                />
              </label>
            </div>
          </article>

          <article className="rounded-[30px] border border-black/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-2 text-lg font-semibold text-black">
              <Music4 className="size-5" />
              Pilih Artis
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {artists.map((artist) => {
                const selected = formData.artists.includes(artist.artistId);

                return (
                  <button
                    key={artist.artistId}
                    type="button"
                    onClick={() =>
                      setFormData((current) => ({
                        ...current,
                        artists: selected
                          ? current.artists.filter((id) => id !== artist.artistId)
                          : [...current.artists, artist.artistId],
                      }))
                    }
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                      selected
                        ? "border-black bg-black text-white"
                        : "border-black/10 bg-white text-black/70 hover:border-black/20"
                    }`}
                  >
                    {artist.name}
                  </button>
                );
              })}
            </div>
          </article>
        </section>

        <section className="space-y-6">
          <article className="rounded-[30px] border border-black/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-lg font-semibold text-black">
                <Ticket className="size-5" />
                Kategori Tiket
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setFormData((current) => ({
                    ...current,
                    tickets: [...current.tickets, createEmptyTicket()],
                  }))
                }
              >
                <Plus />
                Tambah
              </Button>
            </div>

            <div className="mt-5 space-y-4">
              {formData.tickets.map((ticket, index) => (
                <div
                  key={ticket.categoryId ?? `ticket-${index}`}
                  className="rounded-2xl border border-black/10 bg-black/[0.02] p-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-black">
                        Kategori #{index + 1}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() =>
                          setFormData((current) => ({
                            ...current,
                            tickets:
                              current.tickets.length === 1
                                ? [createEmptyTicket()]
                                : current.tickets.filter((_, currentIndex) => currentIndex !== index),
                          }))
                        }
                      >
                        <Trash2 />
                      </Button>
                    </div>

                    <Input
                      value={ticket.categoryName}
                      onChange={(inputEvent) =>
                        updateTicket(index, "categoryName", inputEvent.target.value)
                      }
                      placeholder="Nama kategori"
                    />

                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input
                        type="number"
                        min={0}
                        value={ticket.price}
                        onChange={(inputEvent) =>
                          updateTicket(index, "price", inputEvent.target.value)
                        }
                        placeholder="Harga"
                      />
                      <Input
                        type="number"
                        min={1}
                        value={ticket.quota}
                        onChange={(inputEvent) =>
                          updateTicket(index, "quota", inputEvent.target.value)
                        }
                        placeholder="Kuota"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[30px] border border-black/10 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-semibold text-black">Ringkasan Validasi</h2>
            <div className="mt-5 space-y-4 text-sm">
              <div className="rounded-2xl bg-black/[0.03] p-4">
                <div className="flex items-center gap-2 font-medium text-black/60">
                  <MapPin className="size-4" />
                  Venue terpilih
                </div>
                <p className="mt-2 text-black">
                  {selectedVenue
                    ? `${selectedVenue.venueName} · ${selectedVenue.city}`
                    : "Belum memilih venue"}
                </p>
              </div>

              <div className="rounded-2xl bg-black/[0.03] p-4">
                <div className="flex items-center gap-2 font-medium text-black/60">
                  <Ticket className="size-4" />
                  Total kuota
                </div>
                <p className="mt-2 text-black">
                  {totalQuota.toLocaleString("id-ID")} tiket
                </p>
                <p className="text-xs text-black/50">
                  Kapasitas venue: {selectedVenue?.capacity?.toLocaleString("id-ID") ?? "-"}
                </p>
              </div>

              <div className="rounded-2xl bg-black/[0.03] p-4">
                <div className="flex items-center gap-2 font-medium text-black/60">
                  <CalendarDays className="size-4" />
                  Lineup & kategori
                </div>
                <p className="mt-2 text-black">
                  {formData.artists.length} artis dipilih · {formData.tickets.length} kategori tiket
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Button type="submit" size="lg" disabled={isPending}>
                {isPending ? <LoaderCircle className="animate-spin" /> : null}
                {mode === "create"
                  ? isPending
                    ? "Membuat acara..."
                    : "Buat Acara"
                  : isPending
                    ? "Menyimpan perubahan..."
                    : "Simpan Perubahan"}
              </Button>

              <Button asChild type="button" variant="outline" size="lg">
                <Link href={cancelHref}>Batal</Link>
              </Button>
            </div>
          </article>
        </section>
      </form>
    </div>
  );
}
