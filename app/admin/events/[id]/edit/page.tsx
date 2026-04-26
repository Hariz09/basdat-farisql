import { notFound, redirect } from "next/navigation";
import EventForm from "@/components/event/EventForm";
import { getAllArtists } from "@/lib/mock-artist-db";
import { getEventById, getOrganizerOptions } from "@/lib/mock-event-db";
import { getSession } from "@/lib/session";
import { getAllVenues } from "@/lib/mock-venue-db";

type AdminEditEventPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditEventPage({
  params,
}: AdminEditEventPageProps) {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  const { id } = await params;
  const event = getEventById(id);

  if (!event) {
    notFound();
  }

  const [date, timeSection = ""] = event.eventDatetime.split("T");

  return (
    <EventForm
      mode="edit"
      role="admin"
      eventId={event.eventId}
      initialValues={{
        eventTitle: event.eventTitle,
        date,
        time: timeSection.slice(0, 5),
        venueId: event.venueId,
        organizerId: event.organizerId,
        artists: event.artists ?? [],
        tickets:
          event.tickets?.map((ticket) => ({
            categoryId: ticket.categoryId,
            categoryName: ticket.categoryName,
            price: ticket.price,
            quota: ticket.quota,
          })) ?? [{ categoryName: "", price: 0, quota: 0 }],
        description: event.description ?? "",
      }}
      venues={getAllVenues()}
      artists={getAllArtists()}
      organizers={getOrganizerOptions()}
      cancelHref={`/admin/events/${event.eventId}`}
    />
  );
}
