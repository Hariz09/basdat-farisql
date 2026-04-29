import { EditCustomerProfileForm } from "@/components/profile/EditCustomerProfileForm";
import { UpdatePasswordForm } from "@/components/profile/UpdatePasswordForm";
import { getSession } from "@/lib/session";

export default async function CustomerProfilePage() {
  const session = (await getSession())!;
  return (
    <div className="mx-auto grid max-w-2xl gap-6">
      <h1 className="text-2xl font-semibold">Profil Saya</h1>
      <EditCustomerProfileForm
        username={session.username}
        name={session.name}
        phone={session.phone}
      />
      <UpdatePasswordForm />
    </div>
  );
}
