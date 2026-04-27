"use client";

import { useState } from "react";
import { Venue } from "@/types/venue";

type Props = {
  initial?: Venue | null;
  onSubmit: (data: Omit<Venue, "venueId">) => void;
};

export default function VenueForm({ initial, onSubmit }: Props) {
  const [venueName, setVenueName] = useState(initial?.venueName ?? "");
  const [city, setCity] = useState(initial?.city ?? "");
  const [capacity, setCapacity] = useState(initial?.capacity ?? 0);
  const [address, setAddress] = useState(initial?.address ?? "");
  const [seatingType, setSeatingType] = useState<"reserved" | "free">(
    initial?.seatingType ?? "reserved"
  );

  return (
    <div className="space-y-2">
      <input
        placeholder="Nama Venue"
        value={venueName}
        onChange={(e) => setVenueName(e.target.value)}
        className="border p-2 w-full rounded"
      />

      <input
        placeholder="Kota"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="border p-2 w-full rounded"
      />

      <input
        type="number"
        placeholder="Kapasitas"
        value={capacity}
        onChange={(e) => setCapacity(Number(e.target.value))}
        className="border p-2 w-full rounded"
      />

      <input
        placeholder="Alamat"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="border p-2 w-full rounded"
      />

      <select
        value={seatingType}
        onChange={(e) =>
          setSeatingType(e.target.value as "reserved" | "free")
        }
        className="border p-2 w-full rounded"
      >
        <option value="reserved">Reserved Seating</option>
        <option value="free">Free Seating</option>
      </select>

      <button
        onClick={() =>
          onSubmit({
            venueName,
            city,
            capacity,
            address,
            seatingType,
          })
        }
        className="bg-black text-white px-4 py-2 rounded"
      >
        Simpan
      </button>
    </div>
  );
}