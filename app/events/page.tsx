import CustomerEventExplorer from "@/components/event/CustomerEventExplorer";
import { getAllEventViews } from "@/lib/mock-event-db";

export default async function PublicEventsPage() {
  const events = getAllEventViews();

  return <CustomerEventExplorer events={events} detailBaseHref="/events" />;
}
