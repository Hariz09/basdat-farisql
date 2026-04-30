import TicketDirectory from "@/components/ticket/TicketDirectory";
import { getTicketsAction } from "@/app/ticket-actions";

export const metadata = {
  title: "Manajemen Tiket | Admin TikTakTuk",
  description: "Kelola tiket, ubah status, dan hapus tiket",
};

export default async function AdminTicketsPage() {
  const result = await getTicketsAction();
  
  if (!result.ok) {
    return <div className="p-6 text-red-500">Error: {result.message}</div>;
  }

  return (
    <div className="flex-1 bg-gray-50/30 min-h-screen">
      <TicketDirectory initialTickets={result.tickets} mode="manage" />
    </div>
  );
}