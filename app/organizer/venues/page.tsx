import VenueDirectory from "@/components/venue/VenueDirectory";
import { getAllVenues } from "@/lib/mock-venue-db";

export default async function OrganizerVenuesPage() {
  return (
    <VenueDirectory
      mode="manage"
      title="Manajemen Venue"
      description="Organizer dapat menambah, mengubah, dan menghapus data venue yang tersedia."
      initialVenues={getAllVenues()}
    />
  );
}
