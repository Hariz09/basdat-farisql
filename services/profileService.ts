"use server";

import { revalidatePath } from "next/cache";
import { getSession, setSession } from "@/lib/session";
import { users } from "@/lib/mock-db";
import type { ActionResult } from "./authService";

export async function updateProfileAction(
  _: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Sesi berakhir, silakan login kembali." };

  const user = users.get(session.id);
  if (!user) return { ok: false, error: "Pengguna tidak ditemukan." };

  if (user.role === "customer") {
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    if (!name || !phone) return { ok: false, error: "Nama dan nomor telepon wajib diisi." };
    user.name = name;
    user.phone = phone;
  } else if (user.role === "organizer") {
    const name = String(formData.get("name") ?? "").trim();
    const contactEmail = String(formData.get("contactEmail") ?? "").trim();
    if (!name || !contactEmail) return { ok: false, error: "Nama organizer dan contact email wajib diisi." };
    user.name = name;
    user.contactEmail = contactEmail;
  } else {
    return { ok: false, error: "Admin tidak dapat mengedit profil melalui form ini." };
  }

  await setSession({ ...session, name: user.name, phone: user.phone });
  revalidatePath(`/${user.role}/profile`);
  return { ok: true };
}

export async function updatePasswordAction(
  _: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Sesi berakhir, silakan login kembali." };
  const user = users.get(session.id);
  if (!user) return { ok: false, error: "Pengguna tidak ditemukan." };

  const oldPassword = String(formData.get("oldPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!oldPassword || !newPassword || !confirmPassword) {
    return { ok: false, error: "Seluruh field wajib diisi." };
  }
  if (user.password !== oldPassword) return { ok: false, error: "Password lama tidak cocok." };
  if (newPassword.length < 6) return { ok: false, error: "Password baru minimal 6 karakter." };
  if (newPassword !== confirmPassword) return { ok: false, error: "Konfirmasi password tidak cocok." };

  user.password = newPassword;
  return { ok: true };
}
