import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatCard } from "./StatCard";
import type { DashboardData } from "@/services/dashboardService";

type Props = {
  heading: React.ReactNode;
  data: DashboardData;
};

export function DashboardView({ heading, data }: Props) {
  return (
    <div className="space-y-6">
      {heading}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {data.stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {data.tables.map((t) => (
          <Card key={t.title} className="lg:col-span-1 last:lg:col-span-2 only:lg:col-span-2">
            <CardHeader className="border-b">
              <CardTitle className="text-base">{t.title}</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    {t.columns.map((c) => (
                      <TableHead key={c}>{c}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {t.rows.map((row, idx) => (
                    <TableRow key={idx}>
                      {t.columns.map((c) => (
                        <TableCell key={c}>{row[c] ?? "—"}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
