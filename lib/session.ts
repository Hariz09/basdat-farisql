import { cookies } from "next/headers";

export type Role = "admin" | "organizer" | "customer";

export type SessionUser = {
  id: string;
  role: Role;
  username: string;
  email: string;
  name: string;
  phone?: string;
};

const COOKIE = "tiktaktuk_session";

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export async function setSession(user: SessionUser) {
  const store = await cookies();
  store.set(COOKIE, JSON.stringify(user), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export function dashboardPathFor(role: Role) {
  return `/${role}/dashboard`;
}
