import "server-only";

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { ticketCategory } from "@/types/ticketCategory";

const RUNTIME_DIRECTORY = path.join(process.cwd(), ".runtime");
const TICKET_CATEGORIES_FILE_PATH = path.join(
  RUNTIME_DIRECTORY,
  "mock-ticket-categories.json",
);

const seededTicketCategories: ticketCategory[] = [
  { categoryId: "1", categoryName: "Regular", quota: 300, price: 100000, eventId: "1" },
  { categoryId: "2", categoryName: "VIP", quota: 100, price: 250000, eventId: "1" },

  { categoryId: "3", categoryName: "Regular", quota: 500, price: 150000, eventId: "2" },
  { categoryId: "4", categoryName: "VIP", quota: 150, price: 400000, eventId: "2" },
  { categoryId: "5", categoryName: "VVIP", quota: 50, price: 750000, eventId: "2" },

  { categoryId: "6", categoryName: "Festival", quota: 700, price: 120000, eventId: "3" },
  { categoryId: "7", categoryName: "Premium", quota: 200, price: 300000, eventId: "3" },

  { categoryId: "8", categoryName: "Regular", quota: 250, price: 90000, eventId: "4" },
  { categoryId: "9", categoryName: "VIP", quota: 80, price: 200000, eventId: "4" },

  { categoryId: "10", categoryName: "Tribune", quota: 400, price: 110000, eventId: "5" },
  { categoryId: "11", categoryName: "Festival", quota: 250, price: 175000, eventId: "5" },
  { categoryId: "12", categoryName: "VIP", quota: 100, price: 350000, eventId: "5" },

  { categoryId: "13", categoryName: "Regular", quota: 350, price: 130000, eventId: "6" },
  { categoryId: "14", categoryName: "VIP", quota: 120, price: 320000, eventId: "6" },
];

const g = globalThis as unknown as {
  __ticketCategories?: ticketCategory[];
};

function ensureTicketCategoryFile() {
  mkdirSync(RUNTIME_DIRECTORY, { recursive: true });

  if (!existsSync(TICKET_CATEGORIES_FILE_PATH)) {
    writeFileSync(
      TICKET_CATEGORIES_FILE_PATH,
      JSON.stringify(seededTicketCategories, null, 2),
      "utf8",
    );

    return seededTicketCategories;
  }

  try {
    const raw = readFileSync(TICKET_CATEGORIES_FILE_PATH, "utf8");
    const parsed = JSON.parse(raw) as ticketCategory[];

    if (!Array.isArray(parsed)) {
      throw new Error("Ticket category runtime store is not an array.");
    }

    return parsed;
  } catch {
    writeFileSync(
      TICKET_CATEGORIES_FILE_PATH,
      JSON.stringify(seededTicketCategories, null, 2),
      "utf8",
    );

    return seededTicketCategories;
  }
}

function getTicketCategoryStore() {
  if (!g.__ticketCategories) {
    const persistedTicketCategories = ensureTicketCategoryFile();
    g.__ticketCategories = persistedTicketCategories;
  }

  return g.__ticketCategories;
}

function persistTicketCategories() {
  const store = getTicketCategoryStore();
  mkdirSync(RUNTIME_DIRECTORY, { recursive: true });
  writeFileSync(
    TICKET_CATEGORIES_FILE_PATH,
    JSON.stringify(store, null, 2),
    "utf8",
  );
}

export const ticketCategories = getTicketCategoryStore();

export function getAllTicketCategories() {
  return [...ticketCategories];
}

export function getTicketCategoriesByEventId(eventId: string) {
  return ticketCategories.filter((tc) => tc.eventId === eventId);
}

export function getTotalQuotaByEventId(eventId: string) {
  return ticketCategories
    .filter((tc) => tc.eventId === eventId)
    .reduce((sum, tc) => sum + tc.quota, 0);
}

export function createTicketCategory(data: Omit<ticketCategory, "categoryId">) {
  const id = crypto.randomUUID();

  const newTicketCategory: ticketCategory = {
    categoryId: id,
    ...data,
  };

  ticketCategories.push(newTicketCategory);
  persistTicketCategories();

  return newTicketCategory;
}

export function updateTicketCategory(
  id: string,
  data: Omit<ticketCategory, "categoryId">,
) {
  const index = ticketCategories.findIndex((tc) => tc.categoryId === id);

  if (index === -1) {
    return null;
  }

  const updatedTicketCategory: ticketCategory = {
    categoryId: id,
    ...data,
  };

  ticketCategories[index] = updatedTicketCategory;
  persistTicketCategories();

  return updatedTicketCategory;
}

export function deleteTicketCategory(id: string) {
  const index = ticketCategories.findIndex((tc) => tc.categoryId === id);

  if (index === -1) {
    return false;
  }

  ticketCategories.splice(index, 1);
  persistTicketCategories();

  return true;
}
