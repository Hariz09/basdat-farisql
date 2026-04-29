import { redirect } from "next/navigation";
import EventList from "@/components/event/EventList";
import { getAllEventViews } from "@/lib/mock-event-db";
import { getSession } from "@/lib/session";

export default async function AdminEventsPage() {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  const events = getAllEventViews();

  return (
    <EventList
      role="admin"
      sessionName={session.name}
      sessionId={session.profileId}
      events={events}
    />
  );
}
