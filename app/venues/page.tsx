import VenueDirectory from "@/components/venue/VenueDirectory";
import { getAllVenues } from "@/lib/mock-venue-db";

export default async function PublicVenuesPage() {
  return (
    <VenueDirectory
      mode="read"
      title="Daftar Venue"
      description="Semua pengguna dapat melihat daftar venue dan kapasitasnya."
      initialVenues={getAllVenues()}
    />
  );
}
