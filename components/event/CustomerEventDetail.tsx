import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  FileText,
  MapPin,
  Music4,
  ShieldUser,
  Ticket,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EventView } from "@/types/event";

type CustomerEventDetailProps = {
  event: EventView;
  backHref?: string;
  showCheckout?: boolean;
};

function getStartingPrice(event: EventView) {
  const prices = (event.tickets ?? []).map((ticket) => ticket.price);

  if (prices.length === 0) {
    return null;
  }

  return Math.min(...prices);
}

export default function CustomerEventDetail({
  event,
  backHref = "/customer/events",
  showCheckout = false,
}: CustomerEventDetailProps) {
  const startingPrice = getStartingPrice(event);

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost">
        <Link href={backHref}>
          <ArrowLeft />
          Kembali ke jelajahi acara
        </Link>
      </Button>

      <section className="overflow-hidden rounded-[30px] border border-blue-100 bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_55%,#f8fbff_100%)] shadow-sm">
        <div className="grid gap-8 p-6 sm:p-8 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-4">
            <span className="inline-flex w-fit rounded-full border border-blue-200 bg-white/80 px-3 py-1 text-[11px] font-medium text-blue-700">
              Detail Event
            </span>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">
                {event.eventTitle}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-black/60">
                {event.description || "Belum ada deskripsi untuk event ini."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {event.artistDetails.map((artist) => (
                <Badge
                  key={artist.artistId}
                  variant="outline"
                  className="border-blue-100 bg-white text-blue-700"
                >
                  {artist.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-blue-100 bg-white/90 p-5 shadow-sm">
            <p className="text-sm text-black/50">Mulai dari</p>
            <p className="mt-2 text-3xl font-semibold text-black">
              {startingPrice !== null
                ? `Rp ${startingPrice.toLocaleString("id-ID")}`
                : "Belum tersedia"}
            </p>
            <p className="mt-2 text-sm text-black/55">
              Pilih kategori tiket yang tersedia di bagian bawah halaman ini.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              {showCheckout ? (
                <Button
                  asChild
                  className="h-11 bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Link href={`/customer/events/${event.eventId}/checkout`}>
                    Beli Tiket
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  className="h-11 bg-blue-600 text-white hover:bg-blue-700"
                >
                  <a href="#ticket-categories">Pilih Kategori Tiket</a>
                </Button>
              )}
              <Button asChild variant="outline" className="h-11">
                <Link href={backHref}>Lihat Event Lain</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
        <div className="space-y-6">
          <article className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-black">
              Informasi Utama
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-black/3 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-black/60">
                  <CalendarDays className="size-4 text-blue-600" />
                  Tanggal
                </div>
                <p className="mt-2 text-sm font-medium text-black">
                  {new Date(event.eventDatetime).toLocaleDateString("id-ID", {
                    dateStyle: "full",
                  })}
                </p>
              </div>

              <div className="rounded-2xl bg-black/3 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-black/60">
                  <Clock3 className="size-4 text-blue-600" />
                  Waktu
                </div>
                <p className="mt-2 text-sm font-medium text-black">
                  {new Date(event.eventDatetime).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div className="rounded-2xl border border-black/10 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-black/60">
                  <MapPin className="size-4 text-blue-600" />
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
                  <ShieldUser className="size-4 text-blue-600" />
                  Organizer
                </div>
                <p className="mt-2 text-sm font-medium text-black">
                  {event.organizer.organizerName}
                </p>
                <p className="text-xs text-black/50">
                  {event.organizer.contactEmail ?? event.organizer.organizerId}
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-lg font-semibold text-black">
              <Music4 className="size-5 text-blue-600" />
              Daftar Artist / Performer
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {event.artistDetails.map((artist) => (
                <div
                  key={artist.artistId}
                  className="rounded-2xl border border-black/10 bg-black/2 px-4 py-3"
                >
                  <p className="text-sm font-medium text-black">
                    {artist.name}
                  </p>
                  <p className="text-xs text-black/50">
                    {artist.genre || "Genre belum diisi"}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-lg font-semibold text-black">
              <FileText className="size-5 text-blue-600" />
              Deskripsi Event
            </div>
            <p className="mt-5 whitespace-pre-line text-sm leading-7 text-black/65">
              {event.description ||
                "Tidak ada deskripsi tambahan untuk event ini."}
            </p>
          </article>
        </div>

        <aside
          id="ticket-categories"
          className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 text-lg font-semibold text-black">
            <Ticket className="size-5 text-blue-600" />
            Kategori Tiket
          </div>

          <div className="mt-5 space-y-4">
            {(event.tickets ?? []).map((ticket) => (
              <div
                key={ticket.categoryId}
                className="rounded-2xl border border-black/10 bg-black/2 p-4"
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
