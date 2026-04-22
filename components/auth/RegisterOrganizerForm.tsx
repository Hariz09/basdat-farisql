"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { registerAction } from "@/services/authService";

export function RegisterOrganizerForm() {
  const [state, formAction, pending] = useActionState(registerAction, null);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar sebagai Organizer</CardTitle>
        <CardDescription>
          Kelola acara dan penjualan tiket di TikTakTuk.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <input type="hidden" name="role" value="organizer" />
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Nama Lengkap</FieldLabel>
              <Input id="name" name="name" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" name="email" type="email" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="phone">Nomor Telepon</FieldLabel>
              <Input id="phone" name="phone" inputMode="tel" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input id="username" name="username" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">
                Password (min. 6 karakter)
              </FieldLabel>
              <PasswordInput
                id="password"
                name="password"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Konfirmasi Password
              </FieldLabel>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                autoComplete="new-password"
                required
              />
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="agree" name="agree" required />
              <FieldLabel htmlFor="agree" className="text-sm font-normal">
                Saya setuju dengan Syarat & Ketentuan.
              </FieldLabel>
            </Field>
            {state && !state.ok ? <FieldError>{state.error}</FieldError> : null}
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-2">
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Mendaftar..." : "Daftar"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            <Link
              href="/register"
              className="underline-offset-4 hover:underline"
            >
              ← Kembali pilih tipe akun
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
