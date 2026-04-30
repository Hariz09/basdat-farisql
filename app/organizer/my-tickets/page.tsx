import TicketDirectory from "@/components/ticket/TicketDirectory";
import { getTicketsAction, getOrderOptionsAction } from "@/app/ticket-actions";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Manajemen Tiket | Organizer TikTakTuk",
  description: "Kelola tiket, ubah status, dan hapus tiket acara Anda",
};

export default async function OrganizerTicketsPage() {
  const session = await getSession();
  if (!session || session.role !== "organizer") redirect("/login");

  const result = await getTicketsAction(session);
  const orderOptions = await getOrderOptionsAction();
  
  if (!result.ok) {
    return <div className="p-6 text-red-500">Error: {result.message}</div>;
  }

  return (
    <div className="flex-1 bg-gray-50/30 min-h-screen">
      <TicketDirectory 
        initialTickets={result.tickets} 
        orderOptions={orderOptions} 
        mode="manage" 
      />
    </div>
  );
}