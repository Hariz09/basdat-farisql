import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  MapPin,
  Music4,
  ShieldUser,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import EventActions from "@/components/event/EventActions";
import type { EventView } from "@/types/event";

type EventDetailProps = {
  role: "admin" | "organizer";
  event: EventView;
};

export default function EventDetail({ role, event }: EventDetailProps) {
  const backHref = `/${role}/events`;

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost">
        <Link href={backHref}>
          <ArrowLeft />
          Kembali ke daftar event
        </Link>
      </Button>

      <section className="rounded-[30px] border border-black/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-black px-3 py-1 text-[11px] font-medium text-white">
                Event {event.eventId.slice(0, 8)}
              </span>
              <span className="rounded-full border border-black/10 px-3 py-1 text-[11px] font-medium text-black/60">
                {event.organizer.organizerName}
              </span>
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">
                {event.eventTitle}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-black/55">
                {event.description || "Belum ada deskripsi untuk event ini."}
              </p>
            </div>
          </div>

          <EventActions
            eventId={event.eventId}
            eventTitle={event.eventTitle}
            role={role}
            afterDeleteHref={backHref}
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <article className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-black">Informasi Utama</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-black/[0.03] p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-black/60">
                  <CalendarDays className="size-4" />
                  Tanggal & Waktu
                </div>
                <p className="mt-2 text-sm font-medium text-black">
                  {new Date(event.eventDatetime).toLocaleString("id-ID", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </p>
              </div>

              <div className="rounded-2xl bg-black/[0.03] p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-black/60">
                  <MapPin className="size-4" />
                  Venue
                </div>
                <p className="mt-2 text-sm font-medium text-black">
                  {event.venue?.venueName ?? `Venue ${event.venueId}`}
                </p>
                <p className="text-xs text-black/50">
                  {event.venue?.address
                    ? `${event.venue.address}, ${event.venue.city}`
                    : "Alamat venue belum tersedia"}
                </p>
              </div>

              <div className="rounded-2xl border border-black/10 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-black/60">
                  <ShieldUser className="size-4" />
                  Organizer
                </div>
                <p className="mt-2 text-sm font-medium text-black">
                  {event.organizer.organizerName}
                </p>
                <p className="text-xs text-black/50">
                  {event.organizer.contactEmail ?? event.organizer.organizerId}
                </p>
              </div>

              <div className="rounded-2xl border border-black/10 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-black/60">
                  <Ticket className="size-4" />
                  Kuota Total
                </div>
                <p className="mt-2 text-sm font-medium text-black">
                  {event.totalQuota.toLocaleString("id-ID")} tiket
                </p>
                <p className="text-xs text-black/50">
                  Kapasitas venue {event.venue?.capacity?.toLocaleString("id-ID") ??
                    "-"}
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-lg font-semibold text-black">
              <Music4 className="size-5" />
              Lineup Artis
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {event.artistDetails.map((artist) => (
                <div
                  key={artist.artistId}
                  className="rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-3"
                >
                  <p className="text-sm font-medium text-black">{artist.name}</p>
                  <p className="text-xs text-black/50">
                    {artist.genre || "Genre belum diisi"}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-lg font-semibold text-black">
              <FileText className="size-5" />
              Deskripsi
            </div>
            <p className="mt-5 whitespace-pre-line text-sm leading-7 text-black/65">
              {event.description || "Tidak ada deskripsi tambahan untuk event ini."}
            </p>
          </article>
        </div>

        <aside className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-lg font-semibold text-black">
            <Ticket className="size-5" />
            Kategori Tiket
          </div>

          <div className="mt-5 space-y-4">
            {event.tickets?.map((ticket) => (
              <div
                key={ticket.categoryId}
                className="rounded-2xl border border-black/10 bg-black/[0.02] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-black">
                      {ticket.categoryName}
                    </p>
                    <p className="text-xs text-black/50">
                      {ticket.quota.toLocaleString("id-ID")} tiket tersedia
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-black">
                    Rp {ticket.price.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}
