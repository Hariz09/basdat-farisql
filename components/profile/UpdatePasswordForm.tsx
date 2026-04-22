"use client";

import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
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
import { useUpdatePassword } from "@/hooks/useUpdatePassword";

export function UpdatePasswordForm() {
  const { state, action, pending } = useUpdatePassword();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Password</CardTitle>
        <CardDescription>
          Ubah password akun Anda secara berkala.
        </CardDescription>
      </CardHeader>
      <form action={action}>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="oldPassword">Password Lama</FieldLabel>
              <PasswordInput
                id="oldPassword"
                name="oldPassword"
                autoComplete="current-password"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="newPassword">Password Baru</FieldLabel>
              <PasswordInput
                id="newPassword"
                name="newPassword"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Konfirmasi Password Baru
              </FieldLabel>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                autoComplete="new-password"
                required
              />
            </Field>
            {state && !state.ok ? <FieldError>{state.error}</FieldError> : null}
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={pending} className="ml-auto">
            {pending ? "Menyimpan..." : "Simpan Password"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
