// Core Event type re-exported from Zod schema.
export type { Event } from "@/lib/schemas";
export { EventSchema } from "@/lib/schemas";

import type { Artist } from "./artist";
import type { TicketCategory } from "./ticketCategory";
import type { Venue } from "./venue";

// View / form helpers (not DB columns — UI layer only)

export interface OrganizerOption {
  organizerId: string;
  organizerName: string;
  contactEmail?: string;
}

export interface EventOption {
  eventId: string;
  eventTitle: string;
  venueCapacity: number;
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

/** Enriched event with joined venue/organizer/artist data for display. */
export interface EventView {
  eventId: string;
  eventTitle: string;
  eventDatetime: string;
  venueId: string;
  organizerId: string;
  description?: string;
  venue?: Venue;
  organizer: OrganizerOption;
  artistDetails: Artist[];
  tickets?: TicketCategory[];
  totalQuota: number;
}
