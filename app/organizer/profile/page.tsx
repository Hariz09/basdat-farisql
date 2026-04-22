import { EditOrganizerProfileForm } from "@/components/profile/EditOrganizerProfileForm";
import { UpdatePasswordForm } from "@/components/profile/UpdatePasswordForm";
import { getSession } from "@/lib/session";
import { users } from "@/lib/mock-db";

export default async function OrganizerProfilePage() {
  const session = (await getSession())!;
  const record = users.get(session.id);
  return (
    <div className="mx-auto grid max-w-2xl gap-6">
      <h1 className="text-2xl font-semibold">Profil Organizer</h1>
      <EditOrganizerProfileForm
        username={session.username}
        name={record?.name ?? session.name}
        contactEmail={record?.contactEmail ?? session.email}
      />
      <UpdatePasswordForm />
    </div>
  );
}
