import { AppHeader } from "./AppHeader";

export function GuestNavbar() {
  return (
    <AppHeader
      items={[
        { href: "/ticket-categories", label: "Kategori Tiket" },
        { href: "/login", label: "Login" },
        { href: "/register", label: "Registrasi" },
      ]}
    />
  );
}
