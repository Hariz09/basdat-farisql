"use server";

import { redirect } from "next/navigation";
import {
  dashboardPathFor,
  clearSession,
  setSession,
  type Role,
} from "@/lib/session";
import {
  findByUsername,
  findUserProfile,
  userAccounts,
  customers,
  organizers,
} from "@/lib/mock-auth-db";
import {
  UserAccountSchema,
  CustomerSchema,
  OrganizerSchema,
} from "@/lib/schemas";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function loginAction(
  _: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!username || !password)
    return { ok: false, error: "Username dan password wajib diisi." };

  const account = findByUsername(username);
  if (!account || account.password !== password)
    return { ok: false, error: "Kredensial tidak valid." };

  const profile = findUserProfile(account.userId);
  if (!profile) return { ok: false, error: "Profil pengguna tidak ditemukan." };

  await setSession({
    userId: profile.userId,
    profileId: profile.profileId,
    role: profile.role,
    username: profile.username,
    name: profile.name,
    phone: profile.phone,
  });
  redirect(dashboardPathFor(profile.role));
}

type RegisterInput = {
  role: Exclude<Role, "admin">;
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
  /** Customer.phoneNumber */
  phone?: string;
  /** Organizer.contactEmail */
  contactEmail?: string;
  agree?: boolean;
};

function validateRegister(input: RegisterInput): string | null {
  const {
    name,
    username,
    password,
    confirmPassword,
    phone,
    contactEmail,
    agree,
    role,
  } = input;
  if (!name || !username || !password || !confirmPassword)
    return "Seluruh field wajib diisi.";
  if (role === "customer" && !phone) return "Nomor telepon wajib diisi.";
  if (role === "organizer" && !contactEmail) return "Email kontak wajib diisi.";
  if (role === "organizer" && !agree)
    return "Anda harus menyetujui syarat & ketentuan.";
  if (password.length < 6) return "Password minimal 6 karakter.";
  if (password !== confirmPassword) return "Konfirmasi password tidak cocok.";
  if (findByUsername(username)) return "Username sudah digunakan.";
  return null;
}

export async function registerAction(
  _: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const role = String(formData.get("role") ?? "") as RegisterInput["role"];
  if (role !== "organizer" && role !== "customer")
    return { ok: false, error: "Role tidak valid." };

  const input: RegisterInput = {
    role,
    name: String(formData.get("name") ?? "").trim(),
    username: String(formData.get("username") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
    phone: String(formData.get("phone") ?? "").trim() || undefined,
    contactEmail:
      String(formData.get("contactEmail") ?? "").trim() || undefined,
    agree: formData.get("agree") === "on",
  };

  const err = validateRegister(input);
  if (err) return { ok: false, error: err };

  // Insert USER_ACCOUNT row
  const userId = crypto.randomUUID();
  const account = UserAccountSchema.parse({
    userId,
    username: input.username,
    password: input.password,
  });
  userAccounts.set(userId, account);

  // Insert CUSTOMER or ORGANIZER row
  if (role === "customer") {
    const customerId = crypto.randomUUID();
    const customer = CustomerSchema.parse({
      customerId,
      fullName: input.name,
      phoneNumber: input.phone ?? null,
      userId,
    });
    customers.set(customerId, customer);
  } else {
    const organizerId = crypto.randomUUID();
    const organizer = OrganizerSchema.parse({
      organizerId,
      organizerName: input.name,
      contactEmail: input.contactEmail ?? null,
      userId,
    });
    organizers.set(organizerId, organizer);
  }

  redirect("/login?registered=1");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
