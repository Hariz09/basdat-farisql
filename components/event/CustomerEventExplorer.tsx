"use client";

import Link from "next/link";
import { startTransition, useDeferredValue, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  Clock3,
  Guitar,
  Heart,
  MapPin,
  MicVocal,
  Music4,
  Palette,
  Search,
  Sparkles,
  Ticket,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { EventView } from "@/types/event";

type CustomerEventExplorerProps = {
  events: EventView[];
  detailBaseHref?: string;
};

const eventVisuals: { Icon: LucideIcon; accentClassName: string }[] = [
  { Icon: Music4, accentClassName: "from-blue-700 via-blue-600 to-sky-500" },
  { Icon: Palette, accentClassName: "from-cyan-700 via-sky-600 to-blue-500" },
  { Icon: Guitar, accentClassName: "from-indigo-700 via-blue-600 to-cyan-500" },
  { Icon: MicVocal, accentClassName: "from-slate-800 via-blue-700 to-sky-500" },
  { Icon: Sparkles, accentClassName: "from-blue-800 via-indigo-600 to-sky-500" },
];

function getEventVisual(seed: string) {
  const score = seed
    .split("")
    .reduce((total, character) => total + character.charCodeAt(0), 0);

  return eventVisuals[score % eventVisuals.length];
}

function formatStartingPrice(event: EventView) {
  const prices = (event.tickets ?? []).map((ticket) => ticket.price);

  if (prices.length === 0) {
    return null;
  }

  return Math.min(...prices);
}

export default function CustomerEventExplorer({
  events,
  detailBaseHref = "/customer/events",
}: CustomerEventExplorerProps) {
  const [query, setQuery] = useState("");
  const [venueFilter, setVenueFilter] = useState("all");
  const [artistFilter, setArtistFilter] = useState("all");

  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const venueOptions = Array.from(
    new Map(
      events
        .filter((event) => event.venue)
        .map((event) => [event.venue!.venueId, event.venue!]),
    ).values(),
  ).sort((left, right) =>
    left.venueName.localeCompare(right.venueName, "id-ID"),
  );

  const artistOptions = Array.from(
    new Map(
      events.flatMap((event) =>
        event.artistDetails.map((artist) => [artist.artistId, artist]),
      ),
    ).values(),
  ).sort((left, right) => left.name.localeCompare(right.name, "id-ID"));

  const filteredEvents = events.filter((event) => {
    const artistNames = event.artistDetails.map((artist) => artist.name.toLowerCase());
    const matchesQuery =
      deferredQuery.length === 0 ||
      event.eventTitle.toLowerCase().includes(deferredQuery) ||
      artistNames.some((artistName) => artistName.includes(deferredQuery));

    const matchesVenue =
      venueFilter === "all" || event.venue?.venueId === venueFilter;

    const matchesArtist =
      artistFilter === "all" ||
      event.artistDetails.some((artist) => artist.artistId === artistFilter);

    return matchesQuery && matchesVenue && matchesArtist;
  });

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[30px] border border-blue-100 bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_55%,#f8fbff_100%)] shadow-sm">
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <span className="inline-flex w-fit rounded-full border border-blue-200 bg-white/80 px-3 py-1 text-[11px] font-medium text-blue-700">
              Jelajahi Acara
            </span>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">
                Temukan event yang tersedia
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
                Cari berdasarkan judul atau artis, lalu filter berdasarkan venue
                dan performer. Semua kartu event tetap memakai struktur mock data
                event yang sama dengan fitur CRUD sebelumnya.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-3xl border border-blue-100 bg-white/90 p-4">
              <p className="text-sm text-black/50">Event Tersedia</p>
              <p className="mt-2 text-3xl font-semibold text-black">
                {events.length}
              </p>
            </div>
            <div className="rounded-3xl border border-blue-100 bg-white/90 p-4">
              <p className="text-sm text-black/50">Venue Aktif</p>
              <p className="mt-2 text-3xl font-semibold text-black">
                {venueOptions.length}
              </p>
            </div>
            <div className="rounded-3xl border border-blue-100 bg-white/90 p-4">
              <p className="text-sm text-black/50">Artis Tersedia</p>
              <p className="mt-2 text-3xl font-semibold text-black">
                {artistOptions.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 rounded-[28px] border border-black/10 bg-white p-4 shadow-sm lg:grid-cols-[minmax(0,1.4fr)_220px_220px]">
        <label className="relative block">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-black/35" />
          <Input
            value={query}
            onChange={(event) =>
              startTransition(() => setQuery(event.target.value))
            }
            placeholder="Cari acara atau artis..."
            className="h-11 border-black/10 bg-white pl-10 shadow-none"
          />
        </label>

        <select
          value={venueFilter}
          onChange={(event) =>
            startTransition(() => setVenueFilter(event.target.value))
          }
          className="h-11 rounded-lg border border-black/10 bg-white px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="all">Semua Venue</option>
          {venueOptions.map((venue) => (
            <option key={venue.venueId} value={venue.venueId}>
              {venue.venueName}
            </option>
          ))}
        </select>

        <select
          value={artistFilter}
          onChange={(event) =>
            startTransition(() => setArtistFilter(event.target.value))
          }
          className="h-11 rounded-lg border border-black/10 bg-white px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="all">Semua Artis</option>
          {artistOptions.map((artist) => (
            <option key={artist.artistId} value={artist.artistId}>
              {artist.name}
            </option>
          ))}
        </select>
      </section>

      <div className="flex items-center justify-between">
        <p className="text-sm text-black/55">
          Menampilkan {filteredEvents.length} dari {events.length} event.
        </p>
      </div>

      {filteredEvents.length === 0 ? (
        <section className="rounded-[28px] border border-dashed border-black/15 bg-white px-6 py-20 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-black">Event tidak ditemukan</h2>
          <p className="mt-2 text-sm text-black/55">
            Ubah kata kunci pencarian atau reset filter venue dan artis.
          </p>
        </section>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.map((event) => {
            const visual = getEventVisual(event.eventId);
            const startingPrice = formatStartingPrice(event);
            const formattedDate = new Date(event.eventDatetime).toLocaleDateString(
              "id-ID",
              {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              },
            );
            const formattedTime = new Date(event.eventDatetime).toLocaleTimeString(
              "id-ID",
              {
                hour: "2-digit",
                minute: "2-digit",
              },
            );

            return (
              <article
                key={event.eventId}
                className="overflow-hidden rounded-[26px] border border-black/10 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1"
              >
                <div
                  className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${visual.accentClassName}`}
                >
                  <visual.Icon className="size-11 text-white/90" strokeWidth={1.8} />
                  <button
                    type="button"
                    className="absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-full bg-white/90 text-blue-600 shadow-sm"
                    aria-label="Simpan event"
                  >
                    <Heart className="size-4" />
                  </button>
                </div>

                <div className="space-y-4 p-5">
                  <div>
                    <h2 className="text-lg font-semibold leading-tight text-black">
                      {event.eventTitle}
                    </h2>
                    <p className="mt-2 text-xs text-black/50">
                      {event.artistDetails.map((artist) => artist.name).join(", ")}
                    </p>
                  </div>

                  <div className="space-y-2.5 text-sm text-black/60">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="size-4 text-blue-600" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock3 className="size-4 text-blue-600" />
                      <span>{formattedTime}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 size-4 text-blue-600" />
                      <span>
                        {event.venue?.venueName ?? `Venue ${event.venueId}`}
                        {event.venue?.city ? `, ${event.venue.city}` : null}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(event.tickets ?? []).slice(0, 3).map((ticket) => (
                      <Badge
                        key={ticket.categoryId}
                        variant="outline"
                        className="border-blue-100 bg-blue-50 text-blue-700"
                      >
                        {ticket.categoryName}
                      </Badge>
                    ))}
                  </div>

                  <div className="rounded-2xl bg-blue-50/70 p-3">
                    <div className="flex items-center gap-2 text-sm text-blue-700">
                      <Ticket className="size-4" />
                      <span>
                        {startingPrice !== null
                          ? `Mulai Rp ${startingPrice.toLocaleString("id-ID")}`
                          : "Kategori tiket belum tersedia"}
                      </span>
                    </div>
                  </div>

                  <Button asChild className="h-11 w-full bg-blue-600 text-white hover:bg-blue-700">
                    <Link href={`${detailBaseHref}/${event.eventId}`}>Beli Tiket</Link>
                  </Button>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
