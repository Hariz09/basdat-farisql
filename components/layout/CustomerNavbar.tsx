import { AppHeader } from "./AppHeader";
import type { SessionUser } from "@/lib/session";

const items = [
  { href: "/customer/dashboard", label: "Dashboard" },
  { href: "/customer/tickets", label: "Tiket Saya" },
  { href: "/customer/orders", label: "Pesanan" },
  { href: "/customer/events", label: "Cari Event" },
  { href: "/customer/promotions", label: "Promosi" },
  { href: "/customer/venues", label: "Venue" },
  { href: "/customer/artists", label: "Artis" },
];

export function CustomerNavbar({ user }: { user: SessionUser }) {
  return <AppHeader items={items} user={user} roleLabel="Customer" />;
}
