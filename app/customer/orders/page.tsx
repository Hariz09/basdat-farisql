import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getOrdersByCustomer } from "@/lib/mock-order-db";
import OrderDirectory from "@/components/order/OrderDirectory";

export default async function CustomerOrdersPage() {
  const session = await getSession();
  if (!session || session.role !== "customer") redirect("/login");

  const orders = getOrdersByCustomer(session.profileId);

  return (
    <OrderDirectory
      role="customer"
      initialOrders={orders}
      title="Pesanan Saya"
    />
  );
}
