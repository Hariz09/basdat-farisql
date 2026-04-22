import { Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { getDashboard } from "@/services/dashboardService";

export default function AdminDashboardPage() {
  const data = getDashboard("admin");
  return (
    <DashboardView
      data={data}
      heading={
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Terminal className="size-4" /> System Console
            </div>
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          </div>
          <Badge variant="outline">Realtime</Badge>
        </div>
      }
    />
  );
}
