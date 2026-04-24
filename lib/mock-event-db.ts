import { Event } from "@/types/event";

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
      },
    ],
  ]);
}

export const events = g.__events!;

export function getAllEvents() {
  return Array.from(events.values());
}