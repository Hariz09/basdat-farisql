import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getOrdersByOrganizer } from "@/lib/mock-order-db";
import OrderDirectory from "@/components/order/OrderDirectory";

export default async function OrganizerOrdersPage() {
  const session = await getSession();
  if (!session || session.role !== "organizer") redirect("/login");

  const orders = getOrdersByOrganizer(session.profileId);

  return (
    <OrderDirectory
      role="organizer"
      initialOrders={orders}
      title="Order Event Saya"
    />
  );
}
