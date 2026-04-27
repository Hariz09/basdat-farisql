import VenueDirectory from "@/components/venue/VenueDirectory";
import { getAllVenues } from "@/lib/mock-venue-db";

export default async function CustomerVenuesPage() {
  return (
    <VenueDirectory
      mode="read"
      title="Daftar Venue"
      description="Lihat daftar venue yang tersedia untuk berbagai acara di TikTakTuk."
      initialVenues={getAllVenues()}
    />
  );
}
