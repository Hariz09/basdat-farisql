import TicketDirectory from "@/components/ticket/TicketDirectory";
import { getTicketsAction } from "@/app/ticket-actions";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Tiket Saya | TikTakTuk",
  description: "Kelola dan akses tiket pertunjukan Anda",
};

export default async function CustomerTicketsPage() {
  const session = await getSession();
  if (!session || session.role !== "customer") redirect("/login");

  const result = await getTicketsAction(session);
  
  if (!result.ok) {
    return <div className="p-6 text-red-500">Error: {result.message}</div>;
  }

  return (
    <div className="flex-1 bg-gray-50/30 min-h-screen">
      <TicketDirectory 
        initialTickets={result.tickets} 
        mode="read" 
      />
    </div>
  );
}