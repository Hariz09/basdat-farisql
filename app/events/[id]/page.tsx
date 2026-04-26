import { notFound } from "next/navigation";
import CustomerEventDetail from "@/components/event/CustomerEventDetail";
import { getEventViewById } from "@/lib/mock-event-db";

type PublicEventDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PublicEventDetailPage({
  params,
}: PublicEventDetailPageProps) {
  const { id } = await params;
  const event = getEventViewById(id);

  if (!event) {
    notFound();
  }

  return <CustomerEventDetail event={event} backHref="/events" />;
}
