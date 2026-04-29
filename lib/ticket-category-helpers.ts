import { getAllEvents } from "@/lib/mock-event-db";
import { getAllTicketCategories } from "@/lib/mock-ticketCategory-db";
import { venues } from "@/lib/mock-venue-db";
import type { TicketCategory } from "@/types/ticketCategory";

export type TicketCategoryView = TicketCategory & {
  eventTitle: string;
  venueCapacity: number;
};

export function getTicketCategoryViews(): TicketCategoryView[] {
  const events = getAllEvents();
  const eventMap = new Map(events.map((e) => [e.eventId, e]));
  const categories = getAllTicketCategories();

  return categories
    .map((tc) => {
      const event = eventMap.get(tc.teventId);
      return {
        ...tc,
        eventTitle: event?.eventTitle ?? "Unknown Event",
        venueCapacity: venues.get(event?.venueId ?? "")?.capacity ?? 0,
      } as TicketCategoryView;
    })
    .sort((a, b) => {
      const eventCompare = a.eventTitle.localeCompare(b.eventTitle);
      if (eventCompare !== 0) return eventCompare;
      return a.categoryName.localeCompare(b.categoryName);
    });
}
