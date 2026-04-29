import { AppHeader } from "./AppHeader";
import type { SessionUser } from "@/lib/session";
import type { NavItem } from "./NavLinks";

const items: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard" },
  {
    label: "Manajemen",
    children: [
      { href: "/admin/venues", label: "Venue" },
      { href: "/admin/artists", label: "Manajemen Artis" },
      { href: "/admin/seats", label: "Kursi" },
      { href: "/admin/ticket-categories", label: "Kategori Tiket" },
      { href: "/admin/tickets", label: "Tiket" },
    ],
  },
  {
    label: "Order & Aset",
    children: [
      { href: "/admin/orders", label: "Semua Order" },
      { href: "/admin/assets/tickets", label: "Tiket (Aset)" },
      { href: "/admin/assets/orders", label: "Order (Aset)" },
    ],
  },
];

export function AdminNavbar({ user }: { user: SessionUser }) {
  return <AppHeader items={items} user={user} roleLabel="Admin" />;
}
