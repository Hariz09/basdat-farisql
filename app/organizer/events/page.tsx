import { getEventsForUser } from "@/services/eventService";
import { users } from "@/lib/mock-db";
import { CreateEventModal } from "@/components/CreateEventModal";
import { DeleteEventButton } from "@/components/DeleteEventButton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function OrganizerEventsPage() {
  // --- GANTI ID DI SINI BUAT TES ---
  // Pake "org-1" buat login sbg Organizer
  // Pake ID admin (cek di mock-db.ts) buat login sbg Admin
  const USER_ID = "org-1"; 
  const user = users.get(USER_ID);
  const data = getEventsForUser(USER_ID);

  return (
    <div className="p-10 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Event</h1>
          <p className="text-sm text-gray-500">
            Login sbg: <b>{user?.name}</b> ({user?.role})
          </p>
        </div>
        <CreateEventModal />
      </div>

      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Event</TableHead>
              {user?.role === "admin" && <TableHead>Organizer ID</TableHead>}
              <TableHead>Kategori Tiket</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((ev: any) => (
              <TableRow key={ev.eventId}>
                <TableCell className="font-medium">{ev.eventTitle}</TableCell>
                {user?.role === "admin" && (
                  <TableCell><Badge variant="outline">{ev.organizerId}</Badge></TableCell>
                )}
                <TableCell>
                  {ev.categories.map((c: any) => (
                    <div key={c.categoryId} className="text-xs">
                      {c.categoryName}: Rp{c.price.toLocaleString()}
                    </div>
                  ))}
                </TableCell>
                <TableCell className="text-right">
                  <DeleteEventButton eventId={ev.eventId} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}