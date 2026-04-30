import { AppHeader } from "./AppHeader";
import type { SessionUser } from "@/lib/session";
import type { NavItem } from "./NavLinks";

const items: NavItem[] = [
  { href: "/organizer/dashboard", label: "Dashboard" },
  { href: "/organizer/artists", label: "Artis" },
  { href: "/organizer/events", label: "Event Saya" },
  {
    label: "Manajemen",
    children: [
      { href: "/organizer/venues", label: "Venue" },
      { href: "/organizer/seats", label: "Kursi" },
      { href: "/organizer/ticket-categories", label: "Kategori Tiket" },
      { href: "/organizer/tickets", label: "Tiket" },
    ],
  },
  {
    label: "Order & Aset",
    children: [
      { href: "/organizer/orders", label: "Semua Order" },
      { href: "/organizer/assets/tickets", label: "Tiket (Aset)" },
      { href: "/organizer/assets/orders", label: "Order (Aset)" },
    ],
  },
  { href: "/organizer/promotions", label: "Promosi" },
];

export function OrganizerNavbar({ user }: { user: SessionUser }) {
  return <AppHeader items={items} user={user} roleLabel="Organizer" />;
}
