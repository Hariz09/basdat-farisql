import { events } from "@/lib/mock-event-db";
import { eventArtists } from "@/lib/mock-eventartist-db";
import { ticketCategories } from "@/lib/mock-ticketCategory-db";
import { venues } from "@/lib/mock-venue-db";
import { artists } from "@/lib/mock-artist-db";
import { users } from "@/lib/mock-db";

// FUNGSI UTAMA: Ambil data sesuai Role
export function getEventsForUser(userId: string) {
  const user = users.get(userId);
  const allEventsArray = Array.from(events.values());

  // LOGIKA FILTER: Admin liat semua, Organizer liat punya sendiri
  const filteredEvents = user?.role === "admin" 
    ? allEventsArray 
    : allEventsArray.filter((ev) => ev.organizerId === userId);

  return filteredEvents.map((event) => {
    return {
      ...event,
      venue: venues.get(event.venueId),
      artists: eventArtists
        .filter((ea) => ea.eventId === event.eventId)
        .map((ea) => artists.get(ea.artistId))
        .filter(Boolean),
      categories: ticketCategories.filter(
        (tc: any) => tc.tevent_id === event.eventId || tc.eventId === event.eventId
      ),
    };
  });
}

// FUNGSI CREATE
export function createEventFull(data: any) {
  const eventId = crypto.randomUUID();
  events.set(eventId, {
    eventId,
    eventTitle: data.eventTitle,
    eventDatetime: data.eventDatetime,
    venueId: data.venueId,
    organizerId: data.organizerId,
    description: data.description,
  });
  data.categories?.forEach((cat: any) => {
    ticketCategories.push({
      categoryId: crypto.randomUUID(),
      categoryName: cat.categoryName,
      quota: Number(cat.quota),
      price: Number(cat.price),
      tevent_id: eventId,
    } as any);
  });
  return eventId;
}

// FUNGSI DELETE
export function deleteEvent(eventId: string) {
  events.delete(eventId);
  return true;
}