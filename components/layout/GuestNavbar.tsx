import { AppHeader } from "./AppHeader";

export function GuestNavbar() {
  return (
    <AppHeader
      items={[
        { href: "/", label: "Home" },
        { href: "/login", label: "Login" },
        { href: "/register", label: "Registrasi" },
      ]}
    />
  );
}
