import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getAllOrders } from "@/lib/mock-order-db";
import OrderDirectory from "@/components/order/OrderDirectory";

export default async function AdminOrdersPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");

  const orders = getAllOrders();

  return (
    <OrderDirectory
      role="admin"
      initialOrders={orders}
      title="Semua Order"
    />
  );
}
