"use server";

import { redirect } from "next/navigation";
import { dashboardPathFor, clearSession, setSession, type Role } from "@/lib/session";
import { findByEmail, findByUsername, users, type UserRecord } from "@/lib/mock-db";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function loginAction(_: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { ok: false, error: "Email dan password wajib diisi." };

  const user = findByEmail(email);
  if (!user || user.password !== password) {
    return { ok: false, error: "Kredensial tidak valid." };
  }

  await setSession({
    id: user.id,
    role: user.role,
    username: user.username,
    email: user.email,
    name: user.name,
    phone: user.phone,
  });
  redirect(dashboardPathFor(user.role));
}

type RegisterInput = {
  role: Exclude<Role, "admin">;
  name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  agree?: boolean;
};

function validateRegister(input: RegisterInput): string | null {
  const { name, email, username, password, confirmPassword, phone, agree, role } = input;
  if (!name || !email || !username || !password || !confirmPassword) return "Seluruh field wajib diisi.";
  if (role === "organizer" && !phone) return "Nomor telepon wajib diisi.";
  if (role === "organizer" && !agree) return "Anda harus menyetujui syarat & ketentuan.";
  if (password.length < 6) return "Password minimal 6 karakter.";
  if (password !== confirmPassword) return "Konfirmasi password tidak cocok.";
  if (findByEmail(email)) return "Email sudah terdaftar.";
  if (findByUsername(username)) return "Username sudah digunakan.";
  return null;
}

export async function registerAction(
  _: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const role = String(formData.get("role") ?? "") as RegisterInput["role"];
  if (role !== "organizer" && role !== "customer") {
    return { ok: false, error: "Role tidak valid." };
  }
  const input: RegisterInput = {
    role,
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    username: String(formData.get("username") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
    phone: String(formData.get("phone") ?? "").trim() || undefined,
    agree: formData.get("agree") === "on",
  };
  const err = validateRegister(input);
  if (err) return { ok: false, error: err };

  const id = `${role}-${Date.now()}`;
  const record: UserRecord = {
    id,
    role,
    username: input.username,
    email: input.email,
    password: input.password,
    name: input.name,
    phone: input.phone,
    contactEmail: role === "organizer" ? input.email : undefined,
  };
  users.set(id, record);
  redirect("/login?registered=1");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
