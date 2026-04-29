import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getEventOptions } from "@/lib/mock-event-db";
import { getTicketCategoryViews } from "@/lib/ticket-category-helpers";
import TicketCategoryDirectory from "@/components/ticket-category/TicketCategoryDirectory";

export default async function AdminTicketCategoriesPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  const ticketCategoryViews = getTicketCategoryViews();
  const eventOptions = getEventOptions();

  return (
    <TicketCategoryDirectory
      mode="manage"
      title="Manajemen Kategori Tiket"
      description="Admin dan Organizer dapat menambah, mengubah, dan menghapus kategori tiket."
      initialTicketCategories={ticketCategoryViews}
      events={eventOptions}
    />
  );
}
