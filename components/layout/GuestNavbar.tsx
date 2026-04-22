import { AppHeader } from "./AppHeader";

export function GuestNavbar() {
  return (
    <AppHeader
      items={[
        { href: "/login", label: "Login" },
        { href: "/register", label: "Registrasi" },
      ]}
    />
  );
}
