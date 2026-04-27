import { redirect } from "next/navigation";
import EventList from "@/components/event/EventList";
import { getEventViewsByOrganizer } from "@/lib/mock-event-db";
import { getSession } from "@/lib/session";

export default async function OrganizerEventsPage() {
  const session = await getSession();

  if (!session || session.role !== "organizer") {
    redirect("/login");
  }

  const events = getEventViewsByOrganizer(session.id);

  return (
    <EventList
      role="organizer"
      sessionName={session.name}
      sessionId={session.id}
      events={events}
    />
  );
}
