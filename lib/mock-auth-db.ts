/**
 * mock-auth-db.ts — in-memory mirrors of USER_ACCOUNT, CUSTOMER, ORGANIZER tables.
 *
 * All types are derived from the Zod schemas in lib/schemas.ts (source of truth).
 * Replace with real DB queries (e.g. Neon) by swapping the function bodies
 * while keeping the exported signatures identical.
 */
import type { UserAccount, Customer, Organizer } from "@/lib/schemas";
import {
  UserAccountSchema,
  CustomerSchema,
  OrganizerSchema,
} from "@/lib/schemas";
import type { Role } from "./session";

// JOIN result returned by findUserProfile — not a DB table.

export type UserProfile = {
  userId: string;
  profileId: string; // organizerId | customerId | userId (admin)
  role: Role;
  username: string;
  password: string;
  name: string; // organizerName | fullName | "Admin"
  phone?: string; // Customer.phoneNumber only
};

// USER_ACCOUNT table

// The admin userId is the only account that has no Customer/Organizer row.
const ADMIN_USER_ID = "00000000-0000-0000-0000-000000000001";

const g = globalThis as unknown as {
  __userAccounts?: Map<string, UserAccount>;
  __customers?: Map<string, Customer>;
  __organizers?: Map<string, Organizer>;
};

if (!g.__userAccounts) {
  g.__userAccounts = new Map<string, UserAccount>([
    [
      "00000000-0000-0000-0000-000000000001",
      UserAccountSchema.parse({
        userId: "00000000-0000-0000-0000-000000000001",
        username: "admin",
        password: "admin123",
      }),
    ],
    [
      "00000000-0000-0000-0000-000000000002",
      UserAccountSchema.parse({
        userId: "00000000-0000-0000-0000-000000000002",
        username: "organizer",
        password: "organizer123",
      }),
    ],
    [
      "00000000-0000-0000-0000-000000000003",
      UserAccountSchema.parse({
        userId: "00000000-0000-0000-0000-000000000003",
        username: "organizer2",
        password: "organizer456",
      }),
    ],
    [
      "00000000-0000-0000-0000-000000000004",
      UserAccountSchema.parse({
        userId: "00000000-0000-0000-0000-000000000004",
        username: "organizer3",
        password: "organizer789",
      }),
    ],
    [
      "00000000-0000-0000-0000-000000000005",
      UserAccountSchema.parse({
        userId: "00000000-0000-0000-0000-000000000005",
        username: "customer",
        password: "customer123",
      }),
    ],
  ]);
}

// CUSTOMER table

if (!g.__customers) {
  g.__customers = new Map<string, Customer>([
    [
      "cus-00000000-0000-0000-0000-000000000001",
      CustomerSchema.parse({
        customerId: "cus-00000000-0000-0000-0000-000000000001",
        fullName: "Budi Pelanggan",
        phoneNumber: "081200000002",
        userId: "00000000-0000-0000-0000-000000000005",
      }),
    ],
  ]);
}

// ORGANIZER table

if (!g.__organizers) {
  g.__organizers = new Map<string, Organizer>([
    [
      "org-1",
      OrganizerSchema.parse({
        organizerId: "org-1",
        organizerName: "PT Panggung Nusantara",
        contactEmail: "organizer@tiktaktuk.id",
        userId: "00000000-0000-0000-0000-000000000002",
      }),
    ],
    [
      "org-2",
      OrganizerSchema.parse({
        organizerId: "org-2",
        organizerName: "Harmoni Entertainment",
        contactEmail: "harmoni@tiktaktuk.id",
        userId: "00000000-0000-0000-0000-000000000003",
      }),
    ],
    [
      "org-3",
      OrganizerSchema.parse({
        organizerId: "org-3",
        organizerName: "Nada Promotor",
        contactEmail: "nada@tiktaktuk.id",
        userId: "00000000-0000-0000-0000-000000000004",
      }),
    ],
  ]);
}

export const userAccounts = g.__userAccounts!;
export const customers = g.__customers!;
export const organizers = g.__organizers!;

// Lookup helpers (replace with SQL JOINs when using a real DB)

/** Find a UserAccount by username — equivalent to: SELECT * FROM USER_ACCOUNT WHERE username = ? */
export function findByUsername(username: string): UserAccount | undefined {
  for (const u of userAccounts.values()) {
    if (u.username === username) return u;
  }
  return undefined;
}

/**
 * Given a userId from USER_ACCOUNT, join to CUSTOMER or ORGANIZER to build
 * the session-ready profile. Returns null if the account does not exist.
 *
 * In a real DB this is a LEFT JOIN:
 *   SELECT ua.*, c.*, o.*
 *   FROM USER_ACCOUNT ua
 *   LEFT JOIN CUSTOMER c ON c.user_id = ua.user_id
 *   LEFT JOIN ORGANIZER o ON o.user_id = ua.user_id
 *   WHERE ua.user_id = ?
 */
export function findUserProfile(userId: string): UserProfile | null {
  const account = userAccounts.get(userId);
  if (!account) return null;

  // Admin — no Customer / Organizer row
  if (userId === ADMIN_USER_ID) {
    return {
      userId: account.userId,
      profileId: account.userId,
      role: "admin",
      username: account.username,
      password: account.password,
      name: "Admin",
    };
  }

  // Organizer
  for (const org of organizers.values()) {
    if (org.userId === userId) {
      return {
        userId: account.userId,
        profileId: org.organizerId,
        role: "organizer",
        username: account.username,
        password: account.password,
        name: org.organizerName,
      };
    }
  }

  // Customer
  for (const cus of customers.values()) {
    if (cus.userId === userId) {
      return {
        userId: account.userId,
        profileId: cus.customerId,
        role: "customer",
        username: account.username,
        password: account.password,
        name: cus.fullName,
        phone: cus.phoneNumber ?? undefined,
      };
    }
  }

  return null;
}
