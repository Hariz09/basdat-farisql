import { AppHeader } from "./AppHeader";
import type { SessionUser } from "@/lib/session";

const items = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/venues", label: "Manajemen Venue" },
  { href: "/admin/events", label: "Manajemen Event" },
  { href: "/admin/seats", label: "Manajemen Kursi" },
  { href: "/admin/ticket-categories", label: "Kategori Tiket" },
  { href: "/admin/tickets", label: "Manajemen Tiket" },
  { href: "/admin/orders", label: "Semua Order" },
  { href: "/admin/assets/tickets", label: "Tiket (Aset)" },
  { href: "/admin/assets/orders", label: "Order (Aset)" },
];

export function AdminNavbar({ user }: { user: SessionUser }) {
  return <AppHeader items={items} user={user} roleLabel="Admin" />;
}
