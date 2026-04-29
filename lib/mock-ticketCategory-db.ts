import "server-only";

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { TicketCategory } from "@/lib/schemas";
import { TicketCategorySchema } from "@/lib/schemas";

const RUNTIME_DIRECTORY = path.join(process.cwd(), ".runtime");
const TICKET_CATEGORIES_FILE_PATH = path.join(
  RUNTIME_DIRECTORY,
  "mock-ticket-categories.json",
);

// Each row validated against TicketCategorySchema (teventId = DB column tevent_id).
// Replace with `db.query(...)` rows for Neon/PostgreSQL.
const tc = (
  categoryId: string,
  categoryName: string,
  quota: number,
  price: number,
  teventId: string,
): TicketCategory =>
  TicketCategorySchema.parse({
    categoryId,
    categoryName,
    quota,
    price,
    teventId,
  });

const seededTicketCategories: TicketCategory[] = [
  tc("1", "Regular", 300, 100000, "1"),
  tc("2", "VIP", 100, 250000, "1"),

  tc("3", "Regular", 500, 150000, "2"),
  tc("4", "VIP", 150, 400000, "2"),
  tc("5", "VVIP", 50, 750000, "2"),

  tc("6", "Festival", 700, 120000, "3"),
  tc("7", "Premium", 200, 300000, "3"),

  tc("8", "Regular", 250, 90000, "4"),
  tc("9", "VIP", 80, 200000, "4"),

  tc("10", "Tribune", 400, 110000, "5"),
  tc("11", "Festival", 250, 175000, "5"),
  tc("12", "VIP", 100, 350000, "5"),

  tc("13", "Regular", 350, 130000, "6"),
  tc("14", "VIP", 120, 320000, "6"),

  // Event 7 — TEST EVENT (reserved seating + voucher testing)
  tc("15", "WVIP", 20, 750000, "7"),
  tc("16", "VIP", 80, 400000, "7"),
  tc("17", "Category 1", 500, 150000, "7"),
];

const g = globalThis as unknown as {
  __ticketCategories?: TicketCategory[];
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
    const parsed = JSON.parse(raw) as TicketCategory[];

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

export function getTicketCategoriesByEventId(teventId: string) {
  return ticketCategories.filter((tc) => tc.teventId === teventId);
}

export function getTotalQuotaByEventId(teventId: string) {
  return ticketCategories
    .filter((tc) => tc.teventId === teventId)
    .reduce((sum, tc) => sum + tc.quota, 0);
}

export function createTicketCategory(
  data: Omit<TicketCategory, "categoryId">,
): TicketCategory {
  const id = crypto.randomUUID();
  const newTicketCategory: TicketCategory = TicketCategorySchema.parse({
    categoryId: id,
    ...data,
  });
  ticketCategories.push(newTicketCategory);
  persistTicketCategories();
  return newTicketCategory;
}

export function updateTicketCategory(
  id: string,
  data: Omit<TicketCategory, "categoryId">,
): TicketCategory | null {
  const index = ticketCategories.findIndex((tc) => tc.categoryId === id);

  if (index === -1) {
    return null;
  }

  const updatedTicketCategory: TicketCategory = TicketCategorySchema.parse({
    categoryId: id,
    ...data,
  });

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
