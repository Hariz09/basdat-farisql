import type {
  Event,
  EventFormInput,
  EventTicketInput,
  EventView,
  OrganizerOption,
} from "@/types/event";
import { artists } from "@/lib/mock-artist-db";
import { eventArtists } from "@/lib/mock-eventartist-db";
import { ticketCategories } from "@/lib/mock-ticketCategory-db";
import { users } from "@/lib/mock-db";
import { venues } from "@/lib/mock-venue-db";

const g = globalThis as unknown as {
  __events?: Map<string, Event>;
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
        description: "Konser pembuka pertengahan tahun dengan nuansa pop akustik.",
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
        description: "Malam harmoni bersama musisi ternama di pusat kota Jakarta.",
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
        description: "Festival lintas genre dengan performer indie dan pop pilihan.",
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
    .filter((item) => item.eventId === eventId)
    .map((item) => ({ ...item }));

  if (relatedTickets.length > 0) {
    return relatedTickets;
  }

  return fallback.map((ticket) => ({
    categoryId: ticket.categoryId ?? crypto.randomUUID(),
    categoryName: ticket.categoryName,
    quota: Number(ticket.quota),
    price: Number(ticket.price),
    eventId,
  }));
}

function hydrateEvent(event: Event): Event {
  return {
    ...event,
    artists: getRelatedArtistIds(event.eventId, event.artists ?? []),
    tickets: getRelatedTickets(event.eventId, event.tickets ?? []),
  };
}

function createOrganizerOption(organizerId: string): OrganizerOption {
  const organizerUser = users.get(organizerId);

  return {
    organizerId,
    organizerName: organizerUser?.name ?? `Organizer ${organizerId}`,
    contactEmail: organizerUser?.contactEmail ?? organizerUser?.email,
  };
}

function toEventView(event: Event): EventView {
  const hydratedEvent = hydrateEvent(event);
  const artistDetails = (hydratedEvent.artists ?? [])
    .map((artistId) => artists.get(artistId))
    .filter((artist): artist is NonNullable<typeof artist> => Boolean(artist));

  return {
    ...hydratedEvent,
    venue: venues.get(hydratedEvent.venueId),
    organizer: createOrganizerOption(hydratedEvent.organizerId),
    artistDetails,
    totalQuota: (hydratedEvent.tickets ?? []).reduce(
      (sum, ticket) => sum + ticket.quota,
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
    if (ticketCategories[index].eventId === eventId) {
      ticketCategories.splice(index, 1);
    }
  }

  for (const ticket of tickets) {
    ticketCategories.push({
      categoryId: ticket.categoryId ?? crypto.randomUUID(),
      categoryName: ticket.categoryName,
      quota: Number(ticket.quota),
      price: Number(ticket.price),
      eventId,
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

  for (const user of users.values()) {
    if (user.role === "organizer") {
      organizerMap.set(user.id, createOrganizerOption(user.id));
    }
  }

  for (const event of events.values()) {
    if (!organizerMap.has(event.organizerId)) {
      organizerMap.set(event.organizerId, createOrganizerOption(event.organizerId));
    }
  }

  return Array.from(organizerMap.values()).sort((left, right) =>
    left.organizerName.localeCompare(right.organizerName, "id-ID"),
  );
}

export function createEvent(input: EventFormInput, organizerId: string) {
  const sanitizedInput = sanitizeEventInput(input);
  const eventId = crypto.randomUUID();

  const newEvent: Event = {
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
      eventId,
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

  const updatedEvent: Event = {
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
      eventId,
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
    if (ticketCategories[index].eventId === eventId) {
      ticketCategories.splice(index, 1);
    }
  }

  return true;
}
