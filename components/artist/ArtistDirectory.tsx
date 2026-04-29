"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  createArtistAction,
  deleteArtistAction,
  updateArtistAction,
} from "@/app/artist-actions";
import type { Artist } from "@/types/artist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ArtistDirectoryProps = {
  mode: "manage" | "read";
  title: string;
  description: string;
  initialArtists: Artist[];
};

export default function ArtistDirectory({
  mode,
  title,
  description,
  initialArtists,
}: ArtistDirectoryProps) {
  const canManage = mode === "manage";
  const [isPending, startTransition] = useTransition();
  const [artists, setArtists] = useState<Artist[]>(initialArtists);

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState<Artist | null>(null);

  const [artistName, setArtistName] = useState("");
  const [genre, setGenre] = useState("");

  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");

  const resetForm = () => {
    setArtistName("");
    setGenre("");
  };

  const validateArtistForm = () => {
    if (!artistName.trim()) {
      toast.error("Nama artist wajib diisi.");
      return false;
    }

    return true;
  };

  const handleCreate = () => {
    if (!validateArtistForm()) {
      return;
    }

    startTransition(async () => {
      const result = await createArtistAction({
        name: artistName.trim(),
        genre: genre.trim() || undefined,
      });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      resetForm();
      setOpen(false);
      setArtists(result.artists);
      toast.success(result.message);
    });
  };

  const handleOpenEdit = (artist: Artist) => {
    setEditingArtist(artist);
    setArtistName(artist.name);
    setGenre(artist.genre || "");
    setEditOpen(true);
  };

  const handleEditSave = () => {
    if (!editingArtist) {
      return;
    }

    if (!validateArtistForm()) {
      return;
    }

    startTransition(async () => {
      const result = await updateArtistAction(editingArtist.artistId, {
        name: artistName.trim(),
        genre: genre.trim() || undefined,
      });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setEditOpen(false);
      setEditingArtist(null);
      resetForm();
      setArtists(result.artists);
      toast.success(result.message);
    });
  };

  const handleDelete = (artist: Artist) => {
    setArtistToDelete(artist);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!artistToDelete) return;

    startTransition(async () => {
      const result = await deleteArtistAction(artistToDelete.artistId);

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setArtists(result.artists);
      toast.success(result.message);
      setDeleteOpen(false);
      setArtistToDelete(null);
    });
  };

  const genreOptions = useMemo(() => {
    const genres = new Set(artists.map((artist) => artist.genre).filter(Boolean));
    return Array.from(genres).sort();
  }, [artists]);

  const filteredArtists = useMemo(() => {
    return artists
      .filter((artist) => {
        const matchSearch = artist.name
          .toLowerCase()
          .includes(search.toLowerCase());

        const matchGenre =
          genreFilter === "all" ||
          (artist.genre && artist.genre === genreFilter);

        return matchSearch && matchGenre;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [artists, search, genreFilter]);

  const totalArtist = artists.length;

  const heading = title;
  const subheading = canManage
    ? description
    : `${description} Gunakan pencarian dan filter untuk menemukan artist yang relevan.`;

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{heading}</h1>
        <p className="text-sm text-muted-foreground">{subheading}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Artis</p>
          <p className="mt-2 text-3xl font-bold">{totalArtist}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full lg:flex-1">
          <Input
            placeholder="Cari nama artist..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            className="h-10 rounded-md border bg-white px-3 text-sm"
            value={genreFilter}
            onChange={(event) => setGenreFilter(event.target.value)}
          >
            <option value="all">Semua Genre</option>
            {genreOptions.map((genreOption) => (
              <option key={genreOption} value={genreOption}>
                {genreOption}
              </option>
            ))}
          </select>

          {canManage ? (
            <Dialog
              open={open}
              onOpenChange={(value) => {
                setOpen(value);
                if (!value) {
                  resetForm();
                }
              }}
            >
              <DialogTrigger asChild>
                <Button>+ Tambah Artis</Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Tambah Artis Baru</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-2">
                  <Input
                    placeholder="Nama Artist"
                    value={artistName}
                    onChange={(event) => setArtistName(event.target.value)}
                  />

                  <Input
                    placeholder="Genre (opsional)"
                    value={genre}
                    onChange={(event) => setGenre(event.target.value)}
                  />
                </div>

                <DialogFooter>
                  <Button onClick={handleCreate} disabled={isPending}>
                    {isPending ? "Menyimpan..." : "Simpan"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredArtists.map((artist) => (
          <div
            key={artist.artistId}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold">{artist.name}</h2>

                  {artist.genre ? (
                    <span className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                      {artist.genre}
                    </span>
                  ) : null}
                </div>

                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>ID: {artist.artistId}</p>
                </div>
              </div>

              {canManage ? (
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => handleOpenEdit(artist)}
                  >
                    Update
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(artist)}
                    disabled={isPending}
                  >
                    {isPending ? "Memproses..." : "Delete"}
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        ))}

        {filteredArtists.length === 0 ? (
          <div className="rounded-xl border bg-white p-10 text-center text-sm text-muted-foreground">
            Tidak ada artist yang sesuai dengan pencarian atau filter.
          </div>
        ) : null}
      </div>

      {canManage ? (
        <Dialog
          open={editOpen}
          onOpenChange={(value) => {
            setEditOpen(value);
            if (!value) {
              setEditingArtist(null);
              resetForm();
            }
          }}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Update Artist</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              <Input
                placeholder="Nama Artist"
                value={artistName}
                onChange={(event) => setArtistName(event.target.value)}
              />

              <Input
                placeholder="Genre (opsional)"
                value={genre}
                onChange={(event) => setGenre(event.target.value)}
              />
            </div>

            <DialogFooter>
              <Button onClick={handleEditSave} disabled={isPending}>
                {isPending ? "Menyimpan..." : "Update"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}

      {canManage ? (
        <Dialog
          open={deleteOpen}
          onOpenChange={(value) => {
            setDeleteOpen(value);
            if (!value) {
              setArtistToDelete(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Konfirmasi Hapus Artist</DialogTitle>
            </DialogHeader>

            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                Apakah Anda yakin ingin menghapus artist ini?
              </p>
              {artistToDelete && (
                <div className="mt-4 rounded-lg border bg-muted/50 p-4">
                  <p className="font-medium">{artistToDelete.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    ID: {artistToDelete.artistId}
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => {
                  setDeleteOpen(false);
                  setArtistToDelete(null);
                }}
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={isPending}
              >
                {isPending ? "Memproses..." : "Hapus"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}
