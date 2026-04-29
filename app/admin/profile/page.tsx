import { UpdatePasswordForm } from "@/components/profile/UpdatePasswordForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getSession } from "@/lib/session";

export default async function AdminProfilePage() {
  const user = (await getSession())!;
  return (
    <div className="mx-auto grid max-w-2xl gap-6">
      <h1 className="text-2xl font-semibold">Profil Admin</h1>
      <Card>
        <CardHeader>
          <CardTitle>Informasi Akun</CardTitle>
          <CardDescription>
            Akun admin dibuat secara internal. Data profil bersifat read-only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>Username</FieldLabel>
              <Input defaultValue={user.username} readOnly disabled />
              <FieldDescription>Tidak dapat diubah.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel>Nama</FieldLabel>
              <Input defaultValue={user.name} readOnly disabled />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
      <UpdatePasswordForm />
    </div>
  );
}
