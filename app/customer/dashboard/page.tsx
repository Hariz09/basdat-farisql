import { DashboardView } from "@/components/dashboard/DashboardView";
import { getDashboard } from "@/services/dashboardService";
import { getSession } from "@/lib/session";

export default async function CustomerDashboardPage() {
  const user = await getSession();
  const data = getDashboard("customer");
  return (
    <DashboardView
      data={data}
      heading={
        <div>
          <p className="text-sm text-muted-foreground">Halo,</p>
          <h1 className="text-2xl font-semibold">
            Selamat datang kembali, {user?.name} 👋
          </h1>
        </div>
      }
    />
  );
}
