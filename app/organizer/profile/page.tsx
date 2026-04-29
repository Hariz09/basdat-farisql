import { EditOrganizerProfileForm } from "@/components/profile/EditOrganizerProfileForm";
import { UpdatePasswordForm } from "@/components/profile/UpdatePasswordForm";
import { getSession } from "@/lib/session";
import { organizers } from "@/lib/mock-auth-db";

export default async function OrganizerProfilePage() {
  const session = (await getSession())!;
  const organizer = organizers.get(session.profileId);
  return (
    <div className="mx-auto grid max-w-2xl gap-6">
      <h1 className="text-2xl font-semibold">Profil Organizer</h1>
      <EditOrganizerProfileForm
        username={session.username}
        name={organizer?.organizerName ?? session.name}
        contactEmail={organizer?.contactEmail ?? ""}
      />
      <UpdatePasswordForm />
    </div>
  );
}
