"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { useProfileEdit } from "@/hooks/useProfileEdit";

type Props = {
  username: string;
  email: string;
  name: string;
  phone?: string;
};

export function EditCustomerProfileForm({ username, email, name, phone }: Props) {
  const { state, action, pending } = useProfileEdit();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil Pelanggan</CardTitle>
        <CardDescription>
          Username dan email tidak dapat diubah. Anda hanya dapat mengubah nama lengkap
          dan nomor telepon.
        </CardDescription>
      </CardHeader>
      <form action={action}>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input id="username" defaultValue={username} readOnly disabled />
              <FieldDescription>Tidak dapat diubah.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" defaultValue={email} readOnly disabled />
            </Field>
            <Field>
              <FieldLabel htmlFor="name">Nama Lengkap</FieldLabel>
              <Input id="name" name="name" defaultValue={name} required />
            </Field>
            <Field>
              <FieldLabel htmlFor="phone">Nomor Telepon</FieldLabel>
              <Input id="phone" name="phone" defaultValue={phone ?? ""} inputMode="tel" required />
            </Field>
            {state && !state.ok ? <FieldError>{state.error}</FieldError> : null}
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={pending} className="ml-auto">
            {pending ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
