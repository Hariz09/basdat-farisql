import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getAllArtists } from "@/lib/mock-artist-db";
import ArtistDirectory from "@/components/artist/ArtistDirectory";

export default async function AdminArtistsPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  return (
    <ArtistDirectory
      mode="manage"
      title="Manajemen Artis"
      description="Admin dapat menambah, mengubah, dan menghapus data artis."
      initialArtists={getAllArtists()}
    />
  );
}
