import { notFound, redirect } from "next/navigation";
import EventDetail from "@/components/event/EventDetail";
import { getEventViewById } from "@/lib/mock-event-db";
import { getSession } from "@/lib/session";

type OrganizerEventDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrganizerEventDetailPage({
  params,
}: OrganizerEventDetailPageProps) {
  const session = await getSession();

  if (!session || session.role !== "organizer") {
    redirect("/login");
  }

  const { id } = await params;
  const event = getEventViewById(id);

  if (!event || event.organizerId !== session.id) {
    notFound();
  }

  return <EventDetail role="organizer" event={event} />;
}
