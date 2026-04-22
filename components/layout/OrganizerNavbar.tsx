import { AppHeader } from "./AppHeader";
import type { SessionUser } from "@/lib/session";

const items = [
  { href: "/organizer/dashboard", label: "Dashboard" },
  { href: "/organizer/events", label: "Event Saya" },
  { href: "/organizer/venues", label: "Manajemen Venue" },
  { href: "/organizer/seats", label: "Manajemen Kursi" },
  { href: "/organizer/ticket-categories", label: "Kategori Tiket" },
  { href: "/organizer/tickets", label: "Manajemen Tiket" },
  { href: "/organizer/orders", label: "Semua Order" },
  { href: "/organizer/assets/tickets", label: "Tiket (Aset)" },
  { href: "/organizer/assets/orders", label: "Order (Aset)" },
];

export function OrganizerNavbar({ user }: { user: SessionUser }) {
  return <AppHeader items={items} user={user} roleLabel="Organizer" />;
}
