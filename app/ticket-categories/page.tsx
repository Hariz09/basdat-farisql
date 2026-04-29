import { getEventOptions } from "@/lib/mock-event-db";
import { getTicketCategoryViews } from "@/lib/ticket-category-helpers";
import TicketCategoryDirectory from "@/components/ticket-category/TicketCategoryDirectory";

export default async function PublicTicketCategoriesPage() {
  const ticketCategoryViews = getTicketCategoryViews();
  const eventOptions = getEventOptions();

  return (
    <TicketCategoryDirectory
      mode="read"
      title="Daftar Kategori Tiket"
      description="Lihat daftar kategori tiket yang tersedia di TikTakTuk."
      initialTicketCategories={ticketCategoryViews}
      events={eventOptions}
    />
  );
}
