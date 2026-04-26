import VenueDirectory from "@/components/venue/VenueDirectory";
import { getAllVenues } from "@/lib/mock-venue-db";

export default async function AdminVenuesPage() {
  return (
    <VenueDirectory
      mode="manage"
      title="Manajemen Venue"
      description="Admin dapat menambah, mengubah, dan menghapus data venue."
      initialVenues={getAllVenues()}
    />
  );
}
