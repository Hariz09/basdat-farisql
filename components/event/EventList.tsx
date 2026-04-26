import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Music4,
  Plus,
  ShieldUser,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import EventActions from "@/components/event/EventActions";
import type { EventView } from "@/types/event";

type EventListProps = {
  role: "admin" | "organizer";
  sessionName: string;
  sessionId: string;
  events: EventView[];
};

export default function EventList({
  role,
  sessionName,
  sessionId,
  events,
}: EventListProps) {
  const createHref = `/${role}/events/create`;
  const totalQuota = events.reduce((sum, event) => sum + event.totalQuota, 0);
  const uniqueVenueCount = new Set(events.map((event) => event.venueId)).size;
  const pageTitle = role === "admin" ? "Manajemen Event" : "Acara Saya";

  return (
    <div className="space-y-8">
      <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <span className="inline-flex w-fit rounded-full border border-black/10 px-3 py-1 text-[11px] font-medium text-black/60">
              {role === "admin" ? "Admin access" : "Organizer access"}
            </span>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-black">
                {pageTitle}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-black/55">
                Kelola data event menggunakan mock data relasional yang sudah
                tersedia di folder <code>lib/</code>.
              </p>
            </div>
            <p className="text-xs text-black/45">
              Sesi aktif: {sessionName} ({sessionId})
            </p>
          </div>

          <Button asChild size="lg">
            <Link href={createHref}>
              <Plus />
              Buat Acara
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
          <p className="text-sm text-black/55">Total Event</p>
          <p className="mt-2 text-3xl font-semibold text-black">{events.length}</p>
        </div>
        <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
          <p className="text-sm text-black/55">Total Kategori & Kuota</p>
          <p className="mt-2 text-3xl font-semibold text-black">
            {totalQuota.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
          <p className="text-sm text-black/55">Venue Terpakai</p>
          <p className="mt-2 text-3xl font-semibold text-black">
            {uniqueVenueCount.toLocaleString("id-ID")}
          </p>
        </div>
      </section>

      {events.length === 0 ? (
        <section className="rounded-[28px] border border-dashed border-black/15 bg-white px-6 py-20 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-black">Belum ada event</h2>
          <p className="mt-2 text-sm text-black/55">
            Tambahkan event baru untuk mulai mengelola jadwal, artis, dan kategori
            tiket.
          </p>
        </section>
      ) : (
        <section className="grid gap-5 xl:grid-cols-2">
          {events.map((event) => (
            <article
              key={event.eventId}
              className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-black px-3 py-1 text-[11px] font-medium text-white">
                        Event {event.eventId.slice(0, 8)}
                      </span>
                      <span className="rounded-full border border-black/10 px-3 py-1 text-[11px] font-medium text-black/60">
                        {event.tickets?.length ?? 0} kategori tiket
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold leading-tight text-black">
                        {event.eventTitle}
                      </h2>
                      <p className="mt-2 text-sm text-black/55">
                        {event.description || "Belum ada deskripsi event."}
                      </p>
                    </div>
                  </div>

                  <EventActions
                    eventId={event.eventId}
                    eventTitle={event.eventTitle}
                    role={role}
                    compact
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-black/[0.03] p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-black/60">
                      <CalendarDays className="size-4" />
                      Jadwal
                    </div>
                    <p className="mt-2 text-sm font-medium text-black">
                      {new Date(event.eventDatetime).toLocaleString("id-ID", {
                        dateStyle: "medium",
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
                      {event.venue?.city ?? "Kota tidak tersedia"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
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
                      Total Kuota
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

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-black/60">
                    <Music4 className="size-4" />
                    Artis & Kategori
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {event.artistDetails.map((artist) => (
                      <span
                        key={artist.artistId}
                        className="rounded-full border border-black/10 px-3 py-1 text-xs text-black/70"
                      >
                        {artist.name}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {event.tickets?.map((ticket) => (
                      <span
                        key={ticket.categoryId}
                        className="rounded-full bg-black/[0.04] px-3 py-1 text-xs text-black/70"
                      >
                        {ticket.categoryName} · Rp{" "}
                        {ticket.price.toLocaleString("id-ID")}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-black/10 pt-4">
                  <p className="text-xs text-black/45">
                    Diperbarui langsung dari mock store di memori server.
                  </p>
                  <Button asChild variant="ghost">
                    <Link href={`/${role}/events/${event.eventId}`}>Lihat detail</Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
