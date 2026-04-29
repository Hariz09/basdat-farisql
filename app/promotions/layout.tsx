import { AdminNavbar } from "@/components/layout/AdminNavbar";
import { CustomerNavbar } from "@/components/layout/CustomerNavbar";
import { GuestNavbar } from "@/components/layout/GuestNavbar";
import { OrganizerNavbar } from "@/components/layout/OrganizerNavbar";
import { Toaster } from "@/components/ui/sonner";
import { getSession } from "@/lib/session";

export default async function PublicPromotionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();

  return (
    <div className="flex min-h-screen flex-col">
      {!user ? <GuestNavbar /> : null}
      {user?.role === "customer" ? <CustomerNavbar user={user} /> : null}
      {user?.role === "organizer" ? <OrganizerNavbar user={user} /> : null}
      {user?.role === "admin" ? <AdminNavbar user={user} /> : null}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
