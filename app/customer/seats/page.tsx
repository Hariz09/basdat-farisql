import SeatDirectory from "@/components/seat/SeatDirectory";
import { getSeatsAction, getVenueOptionsAction } from "@/app/seat-actions";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Daftar Kursi | TikTakTuk",
  description: "Lihat daftar kursi dan denah tempat duduk venue",
};

export default async function CustomerSeatsPage() {
  const session = await getSession();
  if (!session || session.role !== "customer") redirect("/login");

  const result = await getSeatsAction(session);
  const venueOptions = await getVenueOptionsAction();

  if (!result.ok) {
    return <div className="p-6 text-red-500">Error: {result.message}</div>;
  }

  return (
    <div className="flex-1 bg-gray-50/30 min-h-screen">
      <SeatDirectory 
        initialSeats={result.seats} 
        venueOptions={venueOptions} 
        mode="read" 
      />
    </div>
  );
}