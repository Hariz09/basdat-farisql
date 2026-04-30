import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getEventViewById } from "@/lib/mock-event-db";
import { getAvailableSeatsByVenue } from "@/lib/mock-seat-db";
import CheckoutForm from "@/components/order/CheckoutForm";

type CheckoutPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const session = await getSession();
  if (!session || session.role !== "customer") redirect("/login");

  const { id } = await params;
  const event = getEventViewById(id);

  if (!event) notFound();

  const venueId = event.venue?.venueId ?? "";
  const availableSeats =
    venueId && event.venue?.seatingType === "reserved"
      ? getAvailableSeatsByVenue(venueId, id)
      : [];

  return <CheckoutForm event={event} availableSeats={availableSeats} />;
}
