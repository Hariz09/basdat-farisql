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
  name: string;
  contactEmail: string;
};

export function EditOrganizerProfileForm({ username, name, contactEmail }: Props) {
  const { state, action, pending } = useProfileEdit();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil Organizer</CardTitle>
        <CardDescription>
          Username tidak dapat diubah. Anda hanya dapat mengubah Nama Organizer dan
          Contact Email.
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
              <FieldLabel htmlFor="name">Nama Organizer</FieldLabel>
              <Input id="name" name="name" defaultValue={name} required />
            </Field>
            <Field>
              <FieldLabel htmlFor="contactEmail">Contact Email</FieldLabel>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                defaultValue={contactEmail}
                required
              />
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
