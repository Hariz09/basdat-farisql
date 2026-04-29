"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createOrderAction } from "@/app/order-actions";
import type { EventView } from "@/types/event";
import type { Seat } from "@/types/seat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CheckoutFormProps = {
  event: EventView;
  availableSeats: Seat[]; // pre-filtered by venue + eventId (non-taken)
};

export default function CheckoutForm({
  event,
  availableSeats,
}: CheckoutFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Ticket
  const [categoryId, setCategoryId] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Seat — cascading: section → row → seat
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedRow, setSelectedRow] = useState("");
  const [selectedSeatId, setSelectedSeatId] = useState("");

  // Promo
  const [promoCode, setPromoCode] = useState("");

  const isReserved = event.venue?.seatingType === "reserved";

  const selectedCategory = (event.tickets ?? []).find(
    (t) => t.categoryId === categoryId,
  );
  const subtotal = selectedCategory ? selectedCategory.price * quantity : 0;

  // Cascading seat options derived from availableSeats
  const sections = useMemo(
    () => [...new Set(availableSeats.map((s) => s.section))].sort(),
    [availableSeats],
  );

  const rowsInSection = useMemo(
    () =>
      selectedSection
        ? [
            ...new Set(
              availableSeats
                .filter((s) => s.section === selectedSection)
                .map((s) => s.rowNumber),
            ),
          ].sort()
        : [],
    [availableSeats, selectedSection],
  );

  const seatsInRow = useMemo(
    () =>
      selectedSection && selectedRow
        ? availableSeats
            .filter(
              (s) =>
                s.section === selectedSection && s.rowNumber === selectedRow,
            )
            .sort((a, b) => Number(a.seatNumber) - Number(b.seatNumber))
        : [],
    [availableSeats, selectedSection, selectedRow],
  );

  const selectedSeat = availableSeats.find((s) => s.seatId === selectedSeatId);

  const handleSectionChange = (section: string) => {
    setSelectedSection(section);
    setSelectedRow("");
    setSelectedSeatId("");
  };

  const handleRowChange = (row: string) => {
    setSelectedRow(row);
    setSelectedSeatId("");
  };

  const handleSeatChange = (seatId: string) => {
    setSelectedSeatId(seatId);
  };

  const handleSubmit = () => {
    if (!categoryId) {
      toast.error("Pilih kategori tiket terlebih dahulu.");
      return;
    }
    startTransition(async () => {
      const result = await createOrderAction({
        categoryId,
        quantity,
        seatId: selectedSeatId || undefined,
        promoCode: promoCode || undefined,
      });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      router.push("/customer/orders");
    });
  };

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(p);

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="text-sm text-muted-foreground mt-1">{event.eventTitle}</p>
        {event.venue && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {event.venue.venueName} · {event.venue.city}
            {isReserved && (
              <span className="ml-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200 px-2 py-0.5 text-[10px] font-medium">
                Reserved Seating
              </span>
            )}
          </p>
        )}
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm space-y-5">
        {/* Ticket category */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Kategori Tiket *</label>
          <select
            className="flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Pilih kategori tiket</option>
            {(event.tickets ?? []).map((ticket) => (
              <option key={ticket.categoryId} value={ticket.categoryId}>
                {ticket.categoryName} — {formatPrice(ticket.price)} (
                {ticket.quota} tersedia)
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Jumlah Tiket * (maks. 10)
          </label>
          <Input
            type="number"
            min={1}
            max={10}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        {/* ── Cascading seat picker (reserved venues only) ─────────────── */}
        {isReserved && (
          <div className="space-y-3 rounded-lg border border-blue-100 bg-blue-50/50 p-4">
            <p className="text-sm font-medium text-blue-800">
              Pilih Kursi
              <span className="ml-1 text-xs font-normal text-blue-600">
                (opsional)
              </span>
            </p>

            {/* Step 1 — Section */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Seksi
              </label>
              <select
                className="flex h-10 w-full rounded-md border bg-white px-3 text-sm"
                value={selectedSection}
                onChange={(e) => handleSectionChange(e.target.value)}
              >
                <option value="">— Pilih seksi —</option>
                {sections.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2 — Row */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Baris
              </label>
              <select
                className="flex h-10 w-full rounded-md border bg-white px-3 text-sm disabled:opacity-40"
                value={selectedRow}
                onChange={(e) => handleRowChange(e.target.value)}
                disabled={!selectedSection}
              >
                <option value="">— Pilih baris —</option>
                {rowsInSection.map((r) => (
                  <option key={r} value={r}>
                    Baris {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 3 — Seat */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Nomor Kursi
              </label>
              <select
                className="flex h-10 w-full rounded-md border bg-white px-3 text-sm disabled:opacity-40"
                value={selectedSeatId}
                onChange={(e) => handleSeatChange(e.target.value)}
                disabled={!selectedRow}
              >
                <option value="">— Pilih kursi —</option>
                {seatsInRow.map((s) => (
                  <option key={s.seatId} value={s.seatId}>
                    Kursi {s.seatNumber}
                  </option>
                ))}
              </select>
            </div>

            {/* Confirmation badge */}
            {selectedSeat && (
              <div className="flex items-center gap-2 rounded-md border border-blue-200 bg-white px-3 py-2 text-sm text-blue-800">
                <span className="text-base">🪑</span>
                <span className="font-medium">
                  {selectedSeat.section} · Baris {selectedSeat.rowNumber} ·
                  Kursi {selectedSeat.seatNumber}
                </span>
                <button
                  type="button"
                  className="ml-auto text-xs text-muted-foreground hover:text-red-500"
                  onClick={() => {
                    setSelectedSection("");
                    setSelectedRow("");
                    setSelectedSeatId("");
                  }}
                >
                  ✕ Reset
                </button>
              </div>
            )}
          </div>
        )}

        {/* Promo code */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Kode Promo (opsional)</label>
          <Input
            placeholder="Contoh: DISKON10"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
          />
        </div>

        {/* Price summary */}
        {selectedCategory && (
          <div className="rounded-lg border bg-muted/40 p-4 space-y-1">
            <div className="flex justify-between text-sm">
              <span>
                Harga ({quantity} × {selectedCategory.categoryName})
              </span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            {promoCode && (
              <p className="text-xs text-green-700">
                Kode promo{" "}
                <span className="font-mono font-semibold">{promoCode}</span>{" "}
                akan divalidasi saat pemesanan.
              </p>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1"
          >
            {isPending ? "Memproses..." : "Buat Order"}
          </Button>
        </div>
      </div>
    </div>
  );
}
