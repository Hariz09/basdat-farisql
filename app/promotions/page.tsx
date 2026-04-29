import { getAllPromotions } from "@/lib/mock-promotion-db";
import PromotionDirectory from "@/components/promotion/PromotionDirectory";

export default async function PublicPromotionsPage() {
  const promotions = getAllPromotions();
  return <PromotionDirectory mode="read" initialPromotions={promotions} />;
}
