import { redirect } from "next/navigation";
import { OrganizerNavbar } from "@/components/layout/OrganizerNavbar";
import { Toaster } from "@/components/ui/sonner";
import { getSession } from "@/lib/session";

export default async function OrganizerLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user || user.role !== "organizer") redirect("/login");
  return (
    <div className="flex min-h-screen flex-col">
      <OrganizerNavbar user={user} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">{children}</main>
      <Toaster />
    </div>
  );
}
