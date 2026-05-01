import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getAllPromotions } from "@/lib/mock-promotion-db";
import PromotionDirectory from "@/components/promotion/PromotionDirectory";

export default async function OrganizerPromotionsPage() {
  const session = await getSession();
  if (!session || session.role !== "organizer") redirect("/login");

  const promotions = getAllPromotions();

  return <PromotionDirectory mode="read" initialPromotions={promotions} />;
}
