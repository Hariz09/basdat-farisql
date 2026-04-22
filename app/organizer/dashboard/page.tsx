import Link from "next/link";
import { CalendarPlus, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { getDashboard } from "@/services/dashboardService";
import { getSession } from "@/lib/session";

export default async function OrganizerDashboardPage() {
  const user = await getSession();
  const data = getDashboard("organizer");
  return (
    <DashboardView
      data={data}
      heading={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Selamat datang,</p>
            <h1 className="text-2xl font-semibold">{user?.name}</h1>
          </div>
          <div className="flex gap-2">
            <Button asChild size="sm">
              <Link href="/organizer/events">
                <CalendarPlus /> Kelola Acara
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/organizer/venues">
                <Building2 /> Venue
              </Link>
            </Button>
          </div>
        </div>
      }
    />
  );
}
