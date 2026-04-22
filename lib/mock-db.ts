import type { Role } from "./session";

export type UserRecord = {
  id: string;
  role: Role;
  username: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
  contactEmail?: string;
};

const g = globalThis as unknown as { __users?: Map<string, UserRecord> };

if (!g.__users) {
  g.__users = new Map<string, UserRecord>([
    [
      "admin-1",
      {
        id: "admin-1",
        role: "admin",
        username: "admin",
        email: "admin@tiktaktuk.id",
        password: "admin123",
        name: "System Admin",
      },
    ],
    [
      "org-1",
      {
        id: "org-1",
        role: "organizer",
        username: "organizer",
        email: "organizer@tiktaktuk.id",
        password: "organizer123",
        name: "PT Panggung Nusantara",
        phone: "081200000001",
        contactEmail: "organizer@tiktaktuk.id",
      },
    ],
    [
      "cus-1",
      {
        id: "cus-1",
        role: "customer",
        username: "customer",
        email: "customer@tiktaktuk.id",
        password: "customer123",
        name: "Budi Pelanggan",
        phone: "081200000002",
      },
    ],
  ]);
}

export const users = g.__users!;

export function findByEmail(email: string) {
  for (const u of users.values()) if (u.email === email) return u;
  return undefined;
}

export function findByUsername(username: string) {
  for (const u of users.values()) if (u.username === username) return u;
  return undefined;
}