import { DashboardView } from "@/components/dashboard/DashboardView";
import { getDashboard } from "@/services/dashboardService";

export default async function CustomerDashboardPage() {
  const data = getDashboard("customer");

  return (
    <DashboardView
      data={data}
      heading={
        <div className="flex flex-col gap-4">
          <h1 className="font-serif text-6xl font-black tracking-tight text-black sm:text-7xl">
            Ringkasan
          </h1>
          <p className="max-w-md font-mono text-[10px] font-medium uppercase leading-relaxed tracking-widest text-black/50">
            Pantauan aktivitas, riwayat transaksi, dan status tiket Anda secara real-time.
          </p>
        </div>
      }
    />
  );
}