import { getAllArtists } from "@/lib/mock-artist-db";
import ArtistDirectory from "@/components/artist/ArtistDirectory";

export default async function PublicArtistsPage() {
  return (
    <ArtistDirectory
      mode="read"
      title="Daftar Artis"
      description="Lihat daftar artis yang tersedia di TikTakTuk."
      initialArtists={getAllArtists()}
    />
  );
}
