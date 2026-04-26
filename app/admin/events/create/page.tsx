import { redirect } from "next/navigation";
import EventForm from "@/components/event/EventForm";
import { getAllArtists } from "@/lib/mock-artist-db";
import { getOrganizerOptions } from "@/lib/mock-event-db";
import { getSession } from "@/lib/session";
import { getAllVenues } from "@/lib/mock-venue-db";

export default async function AdminCreateEventPage() {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  return (
    <EventForm
      mode="create"
      role="admin"
      initialValues={{
        eventTitle: "",
        date: "",
        time: "",
        venueId: "",
        organizerId: "",
        artists: [],
        tickets: [{ categoryName: "", price: 0, quota: 0 }],
        description: "",
      }}
      venues={getAllVenues()}
      artists={getAllArtists()}
      organizers={getOrganizerOptions()}
      cancelHref="/admin/events"
    />
  );
}
