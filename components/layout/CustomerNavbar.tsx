import { AppHeader } from "./AppHeader";
import type { SessionUser } from "@/lib/session";
import type { NavItem } from "./NavLinks";

const items: NavItem[] = [
  { href: "/customer/dashboard", label: "Dashboard" },
  {
    label: "Aktivitas",
    children: [
      { href: "/customer/my-tickets", label: "Tiket Saya" },
      { href: "/customer/orders", label: "Pesanan" },
    ],
  },
  {
    label: "Jelajah",
    children: [
      { href: "/customer/events", label: "Cari Event" },
      { href: "/customer/promotions", label: "Promosi" },
      { href: "/customer/venues", label: "Venue" },
      { href: "/customer/artists", label: "Artis" },
      { href: "/customer/ticket-categories", label: "Kategori Tiket" },
    ],
  },
];

export function CustomerNavbar({ user }: { user: SessionUser }) {
  return <AppHeader items={items} user={user} roleLabel="Customer" />;
}
