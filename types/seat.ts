import type { Seat } from "@/lib/schemas";

export type SeatView = Seat & {
  venueName: string;
  status: "Terisi" | "Tersedia";
  isAssigned: boolean;
};

export type SeatFormState = {
  venueId: string;
  section: string;
  rowNumber: string;
  seatNumber: string;
};

export type VenueOption = {
  venueId: string;
  venueName: string;
};

export type SeatStats = {
  totalSeat: number;
  totalTersedia: number;
  totalTerisi: number;
};

export type SeatActionResult =
  | { ok: true; message: string; seats: SeatView[] }
  | { ok: false; message: string };