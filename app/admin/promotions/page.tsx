import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getAllPromotions } from "@/lib/mock-promotion-db";
import PromotionDirectory from "@/components/promotion/PromotionDirectory";

export default async function AdminPromotionsPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");

  const promotions = getAllPromotions();

  return <PromotionDirectory mode="manage" initialPromotions={promotions} />;
}
