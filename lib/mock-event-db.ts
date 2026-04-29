import type {
  Event,
  EventFormInput,
  EventOption,
  EventTicketInput,
  EventView,
  OrganizerOption,
} from "@/types/event";
import { artists } from "@/lib/mock-artist-db";
import { eventArtists } from "@/lib/mock-eventartist-db";
import { ticketCategories } from "@/lib/mock-ticketCategory-db";
import { organizers } from "@/lib/mock-auth-db";
import { venues } from "@/lib/mock-venue-db";

/**
 * StoredEvent — in-memory representation only.
 * Extends Event with optional `artists` and `tickets` seed arrays.
 * These are hydrated into EventArtist / TicketCategory tables on first access.
 * In a real DB you would not store these columns; use JOIN queries instead.
 */
type StoredEvent = Event & {
  artists?: string[];
  tickets?: EventTicketInput[];
};

const g = globalThis as unknown as {
  __events?: Map<string, StoredEvent>;
};

if (!g.__events) {
  g.__events = new Map<string, Event>([
    [
      "1",
      {
        eventId: "1",
        eventTitle: "Konser Melodi Senja",
        eventDatetime: "2026-05-15T19:00",
        venueId: "1",
        organizerId: "org-2",
        description:
          "Konser pembuka pertengahan tahun dengan nuansa pop akustik.",
      },
    ],
    [
      "2",
      {
        eventId: "2",
        eventTitle: "Harmony Night",
        eventDatetime: "2026-06-01T20:00",
        venueId: "2",
        organizerId: "org-3",
        description:
          "Malam harmoni bersama musisi ternama di pusat kota Jakarta.",
      },
    ],
    [
      "3",
      {
        eventId: "3",
        eventTitle: "Festival Hati",
        eventDatetime: "2026-06-12T18:30",
        venueId: "3",
        organizerId: "org-1",
        description:
          "Festival lintas genre dengan performer indie dan pop pilihan.",
      },
    ],
    [
      "4",
      {
        eventId: "4",
        eventTitle: "Acoustic Bandung",
        eventDatetime: "2026-07-03T19:30",
        venueId: "4",
        organizerId: "org-1",
        description: "Panggung intim untuk pertunjukan akustik di Bandung.",
      },
    ],
    [
      "5",
      {
        eventId: "5",
        eventTitle: "Surabaya Pop",
        eventDatetime: "2026-07-20T20:00",
        venueId: "5",
        organizerId: "org-1",
        description: "Konser pop skala besar dengan energi penonton Surabaya.",
      },
    ],
    [
      "6",
      {
        eventId: "6",
        eventTitle: "Summer Sounds",
        eventDatetime: "2026-08-08T19:00",
        venueId: "1",
        organizerId: "org-1",
        description: "Pertunjukan musim panas dengan paket tiket bertingkat.",
      },
    ],
    [
      "7",
      {
        eventId: "7",
        eventTitle: "Grand Gala — TEST EVENT (Reserved + Voucher)",
        eventDatetime: "2026-05-10T19:00",
        venueId: "3",
        organizerId: "org-1",
        description:
          "Event khusus pengujian: venue reserved seating (Graha Sabha Pramana) + semua kode promo aktif. Gunakan DISKON10, HEMAT50K, atau KONSER20.",
      },
    ],
  ]);
}

export const events = g.__events!;

function getRelatedArtistIds(eventId: string, fallback: string[] = []) {
  const relatedArtistIds = eventArtists
    .filter((item) => item.eventId === eventId)
    .map((item) => item.artistId);

  if (relatedArtistIds.length > 0) {
    return Array.from(new Set(relatedArtistIds));
  }

  return Array.from(new Set(fallback));
}

function getRelatedTickets(eventId: string, fallback: EventTicketInput[] = []) {
  const relatedTickets = ticketCategories
    .filter((item) => item.teventId === eventId)
    .map((item) => ({ ...item }));

  if (relatedTickets.length > 0) {
    return relatedTickets;
  }

  return fallback.map((ticket) => ({
    categoryId: ticket.categoryId ?? crypto.randomUUID(),
    categoryName: ticket.categoryName,
    quota: Number(ticket.quota),
    price: Number(ticket.price),
    teventId: eventId,
  }));
}

function hydrateEvent(event: StoredEvent): StoredEvent {
  return {
    ...event,
    artists: getRelatedArtistIds(event.eventId, event.artists ?? []),
    tickets: getRelatedTickets(event.eventId, event.tickets ?? []),
  };
}

function createOrganizerOption(organizerId: string): OrganizerOption {
  const organizer = organizers.get(organizerId);

  return {
    organizerId,
    organizerName: organizer?.organizerName ?? `Organizer ${organizerId}`,
    contactEmail: organizer?.contactEmail ?? undefined,
  };
}

function toEventView(event: StoredEvent): EventView {
  const hydratedEvent = hydrateEvent(event);
  const artistIds: string[] = hydratedEvent.artists ?? [];
  const artistDetails = artistIds
    .map((artistId) => artists.get(artistId))
    .filter((artist): artist is NonNullable<typeof artist> => Boolean(artist));

  const tickets = hydratedEvent.tickets ?? [];
  return {
    ...hydratedEvent,
    venue: venues.get(hydratedEvent.venueId),
    organizer: createOrganizerOption(hydratedEvent.organizerId),
    artistDetails,
    tickets: getRelatedTickets(hydratedEvent.eventId, hydratedEvent.tickets),
    totalQuota: tickets.reduce(
      (sum: number, ticket: EventTicketInput) => sum + ticket.quota,
      0,
    ),
  };
}

function sortByDatetime(eventsToSort: Event[]) {
  return [...eventsToSort].sort((left, right) =>
    left.eventDatetime.localeCompare(right.eventDatetime),
  );
}

function sanitizeTicketInput(tickets: EventTicketInput[]) {
  return tickets
    .map((ticket) => ({
      categoryId: ticket.categoryId,
      categoryName: ticket.categoryName.trim(),
      price: Number(ticket.price),
      quota: Number(ticket.quota),
    }))
    .filter((ticket) => ticket.categoryName);
}

function sanitizeEventInput(input: EventFormInput) {
  return {
    eventTitle: input.eventTitle.trim(),
    date: input.date,
    time: input.time,
    venueId: input.venueId,
    organizerId: input.organizerId?.trim(),
    description: input.description.trim(),
    artists: Array.from(new Set(input.artists.filter(Boolean))),
    tickets: sanitizeTicketInput(input.tickets),
  };
}

function replaceEventArtists(eventId: string, artistIds: string[]) {
  for (let index = eventArtists.length - 1; index >= 0; index -= 1) {
    if (eventArtists[index].eventId === eventId) {
      eventArtists.splice(index, 1);
    }
  }

  for (const artistId of artistIds) {
    eventArtists.push({
      eventId,
      artistId,
    });
  }
}

function replaceTicketCategories(eventId: string, tickets: EventTicketInput[]) {
  for (let index = ticketCategories.length - 1; index >= 0; index -= 1) {
    if (ticketCategories[index].teventId === eventId) {
      ticketCategories.splice(index, 1);
    }
  }

  for (const ticket of tickets) {
    ticketCategories.push({
      categoryId: ticket.categoryId ?? crypto.randomUUID(),
      categoryName: ticket.categoryName,
      quota: Number(ticket.quota),
      price: Number(ticket.price),
      teventId: eventId,
    });
  }
}

export function getAllEvents() {
  return sortByDatetime(Array.from(events.values()).map(hydrateEvent));
}

export function getEventById(eventId: string) {
  const event = events.get(eventId);
  return event ? hydrateEvent(event) : undefined;
}

export function getEventsByOrganizer(organizerId: string) {
  return getAllEvents().filter((event) => event.organizerId === organizerId);
}

export function getAllEventViews() {
  return getAllEvents().map(toEventView);
}

export function getEventViewById(eventId: string) {
  const event = getEventById(eventId);
  return event ? toEventView(event) : undefined;
}

export function getEventViewsByOrganizer(organizerId: string) {
  return getEventsByOrganizer(organizerId).map(toEventView);
}

export function getOrganizerOptions() {
  const organizerMap = new Map<string, OrganizerOption>();

  for (const org of organizers.values()) {
    organizerMap.set(org.organizerId, createOrganizerOption(org.organizerId));
  }

  for (const event of events.values()) {
    if (!organizerMap.has(event.organizerId)) {
      organizerMap.set(
        event.organizerId,
        createOrganizerOption(event.organizerId),
      );
    }
  }

  return Array.from(organizerMap.values()).sort((left, right) =>
    left.organizerName.localeCompare(right.organizerName, "id-ID"),
  );
}

export function getEventOptions(): EventOption[] {
  return Array.from(events.values())
    .map((event) => ({
      eventId: event.eventId,
      eventTitle: event.eventTitle,
      venueCapacity: venues.get(event.venueId)?.capacity ?? 0,
    }))
    .sort((a, b) => a.eventTitle.localeCompare(b.eventTitle));
}

export function createEvent(input: EventFormInput, organizerId: string) {
  const sanitizedInput = sanitizeEventInput(input);
  const eventId = crypto.randomUUID();

  const newEvent: StoredEvent = {
    eventId,
    eventTitle: sanitizedInput.eventTitle,
    eventDatetime: `${sanitizedInput.date}T${sanitizedInput.time}`,
    venueId: sanitizedInput.venueId,
    organizerId,
    description: sanitizedInput.description,
    artists: sanitizedInput.artists,
    tickets: sanitizedInput.tickets.map((ticket) => ({
      categoryId: ticket.categoryId ?? crypto.randomUUID(),
      categoryName: ticket.categoryName,
      price: ticket.price,
      quota: ticket.quota,
      teventId: eventId,
    })),
  };

  events.set(eventId, newEvent);
  replaceEventArtists(eventId, sanitizedInput.artists);
  replaceTicketCategories(eventId, sanitizedInput.tickets);

  return hydrateEvent(newEvent);
}

export function updateEvent(
  eventId: string,
  input: EventFormInput,
  organizerId?: string,
) {
  const existingEvent = events.get(eventId);

  if (!existingEvent) {
    return null;
  }

  const sanitizedInput = sanitizeEventInput(input);

  const updatedEvent: StoredEvent = {
    ...existingEvent,
    eventTitle: sanitizedInput.eventTitle,
    eventDatetime: `${sanitizedInput.date}T${sanitizedInput.time}`,
    venueId: sanitizedInput.venueId,
    organizerId: organizerId ?? existingEvent.organizerId,
    description: sanitizedInput.description,
    artists: sanitizedInput.artists,
    tickets: sanitizedInput.tickets.map((ticket) => ({
      categoryId: ticket.categoryId ?? crypto.randomUUID(),
      categoryName: ticket.categoryName,
      price: ticket.price,
      quota: ticket.quota,
      teventId: eventId,
    })),
  };

  events.set(eventId, updatedEvent);
  replaceEventArtists(eventId, sanitizedInput.artists);
  replaceTicketCategories(eventId, sanitizedInput.tickets);

  return hydrateEvent(updatedEvent);
}

export function deleteEvent(eventId: string) {
  const deleted = events.delete(eventId);

  if (!deleted) {
    return false;
  }

  for (let index = eventArtists.length - 1; index >= 0; index -= 1) {
    if (eventArtists[index].eventId === eventId) {
      eventArtists.splice(index, 1);
    }
  }

  for (let index = ticketCategories.length - 1; index >= 0; index -= 1) {
    if (ticketCategories[index].teventId === eventId) {
      ticketCategories.splice(index, 1);
    }
  }

  return true;
}
