"use server";

import { revalidatePath } from "next/cache";
import { getSession, setSession } from "@/lib/session";
import { userAccounts, customers, organizers } from "@/lib/mock-auth-db";
import type { ActionResult } from "./authService";

export async function updateProfileAction(
  _: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const session = await getSession();
  if (!session)
    return { ok: false, error: "Sesi berakhir, silakan login kembali." };

  if (session.role === "customer") {
    const customer = customers.get(session.profileId);
    if (!customer) return { ok: false, error: "Pengguna tidak ditemukan." };

    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    if (!name || !phone)
      return { ok: false, error: "Nama dan nomor telepon wajib diisi." };

    customer.fullName = name;
    customer.phoneNumber = phone;
    await setSession({ ...session, name, phone });
  } else if (session.role === "organizer") {
    const organizer = organizers.get(session.profileId);
    if (!organizer) return { ok: false, error: "Pengguna tidak ditemukan." };

    const name = String(formData.get("name") ?? "").trim();
    const contactEmail = String(formData.get("contactEmail") ?? "").trim();
    if (!name || !contactEmail)
      return {
        ok: false,
        error: "Nama organizer dan email kontak wajib diisi.",
      };

    organizer.organizerName = name;
    organizer.contactEmail = contactEmail;
    await setSession({ ...session, name });
  } else {
    return {
      ok: false,
      error: "Admin tidak dapat mengedit profil melalui form ini.",
    };
  }

  revalidatePath(`/${session.role}/profile`);
  return { ok: true };
}

export async function updatePasswordAction(
  _: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const session = await getSession();
  if (!session)
    return { ok: false, error: "Sesi berakhir, silakan login kembali." };

  const account = userAccounts.get(session.userId);
  if (!account) return { ok: false, error: "Pengguna tidak ditemukan." };

  const oldPassword = String(formData.get("oldPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!oldPassword || !newPassword || !confirmPassword)
    return { ok: false, error: "Seluruh field wajib diisi." };
  if (account.password !== oldPassword)
    return { ok: false, error: "Password lama tidak cocok." };
  if (newPassword.length < 6)
    return { ok: false, error: "Password baru minimal 6 karakter." };
  if (newPassword !== confirmPassword)
    return { ok: false, error: "Konfirmasi password tidak cocok." };

  account.password = newPassword;
  return { ok: true };
}
