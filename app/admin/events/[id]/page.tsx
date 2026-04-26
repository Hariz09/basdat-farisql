import { notFound, redirect } from "next/navigation";
import EventDetail from "@/components/event/EventDetail";
import { getEventViewById } from "@/lib/mock-event-db";
import { getSession } from "@/lib/session";

type AdminEventDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEventDetailPage({
  params,
}: AdminEventDetailPageProps) {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  const { id } = await params;
  const event = getEventViewById(id);

  if (!event) {
    notFound();
  }

  return <EventDetail role="admin" event={event} />;
}
