import { redirect } from "next/navigation";
import EventForm from "@/components/event/EventForm";
import { getAllArtists } from "@/lib/mock-artist-db";
import { getOrganizerOptions } from "@/lib/mock-event-db";
import { getSession } from "@/lib/session";
import { getAllVenues } from "@/lib/mock-venue-db";

export default async function OrganizerCreateEventPage() {
  const session = await getSession();

  if (!session || session.role !== "organizer") {
    redirect("/login");
  }

  return (
    <EventForm
      mode="create"
      role="organizer"
      initialValues={{
        eventTitle: "",
        date: "",
        time: "",
        venueId: "",
        organizerId: session.id,
        artists: [],
        tickets: [{ categoryName: "", price: 0, quota: 0 }],
        description: "",
      }}
      venues={getAllVenues()}
      artists={getAllArtists()}
      organizers={getOrganizerOptions()}
      cancelHref="/organizer/events"
    />
  );
}
