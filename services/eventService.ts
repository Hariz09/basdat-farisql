import { events } from "@/lib/mock-event-db";
import { eventArtists } from "@/lib/mock-eventartist-db";
import { ticketCategories } from "@/lib/mock-ticketCategory-db";

export function createEventFull(data: {
  title: string;
  datetime: string;
  venueId: string;
  organizerId: string;
  artistIds: string[];
  categories: {
    name: string;
    quota: number;
    price: number;
  }[];
}) {
  const eventId = Date.now().toString();

  // 1. insert event
  events.set(eventId, {
    eventId,
    eventTitle: data.title,
    eventDatetime: data.datetime,
    venueId: data.venueId,
    organizerId: data.organizerId,
  });

  // 2. insert event_artist
  data.artistIds.forEach((artistId) => {
    eventArtists.push({
      eventId,
      artistId,
    });
  });

  // 3. insert ticket_category
  data.categories.forEach((cat) => {
    ticketCategories.push({
      categoryId: crypto.randomUUID(),
      categoryName: cat.name,
      quota: cat.quota,
      price: cat.price,
      eventId,
    });
  });
}