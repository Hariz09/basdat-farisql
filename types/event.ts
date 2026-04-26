import type { Artist } from "./artist";
import type { ticketCategory } from "./ticketCategory";
import type { Venue } from "./venue";

export interface Event {
  eventId: string;
  eventTitle: string;
  eventDatetime: string;
  venueId: string;
  organizerId: string;
  description?: string;
  artists?: string[];
  tickets?: ticketCategory[];
}

export interface OrganizerOption {
  organizerId: string;
  organizerName: string;
  contactEmail?: string;
}

export interface EventTicketInput {
  categoryId?: string;
  categoryName: string;
  price: number;
  quota: number;
}

export interface EventFormInput {
  eventTitle: string;
  date: string;
  time: string;
  venueId: string;
  organizerId?: string;
  artists: string[];
  tickets: EventTicketInput[];
  description: string;
}

export interface EventFormValues extends EventFormInput {
  eventId?: string;
}

export interface EventView extends Event {
  venue?: Venue;
  organizer: OrganizerOption;
  artistDetails: Artist[];
  totalQuota: number;
}
