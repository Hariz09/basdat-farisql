"use server";

import { revalidatePath } from "next/cache";
import { createEventFull, deleteEvent } from "@/services/eventService";

export async function handleCreateEventAction(data: any) {
  const newId = createEventFull(data);
  revalidatePath("/organizer/events");
  return newId;
}

export async function handleDeleteEventAction(eventId: string) {
  const success = deleteEvent(eventId);
  revalidatePath("/organizer/events");
  return success;
}