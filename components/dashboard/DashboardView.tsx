import { ArrowRight } from "lucide-react";
import { StatCard } from "./StatCard";
import type { DashboardData, Row } from "@/services/dashboardService";

type Props = {
  heading: React.ReactNode;
  data: DashboardData;
};

export function DashboardView({ heading, data }: Props) {
  return (
    <div className="w-full px-6 pt-10 pb-20 font-sans text-black md:px-10">
      <div className="mb-16">
        {heading}
      </div>

      <div className="mb-24 grid max-w-6xl gap-px overflow-hidden rounded-xl border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-4">
        {data.stats.map((stat) => (
          <div key={stat.label} className="bg-white">
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      <div className="grid max-w-6xl gap-16 lg:grid-cols-2">
        {data.tables.map((table) => (
          <DashboardTable key={table.title} table={table} />
        ))}
      </div>
    </div>
  );
}

function DashboardTable({ table }: { table: DashboardData["tables"][0] }) {
  const primaryColumn = table.columns[0];
  const metadataColumns = table.columns.slice(1);

  return (
    <div className="lg:col-span-1 only:lg:col-span-2 last:lg:col-span-2">
      <div className="mb-2 flex items-end justify-between border-b-2 border-black pb-4">
        <h2 className="font-serif text-3xl font-black tracking-tight">
          {table.title}
        </h2>
        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-black/60">
          [{table.rows.length}] Entri
        </span>
      </div>

      <div className="flex flex-col">
        {table.rows.length === 0 ? (
          <div className="flex items-center justify-center border-b border-black/10 py-12">
            <span className="font-serif italic text-black/40">Kosong.</span>
          </div>
        ) : (
          table.rows.map((row, idx) => (
            <DashboardRow
              key={idx}
              index={idx}
              row={row}
              primaryColumn={primaryColumn}
              metadataColumns={metadataColumns}
            />
          ))
        )}
      </div>
    </div>
  );
}

type DashboardRowProps = {
  index: number;
  row: Row;
  primaryColumn: string;
  metadataColumns: string[];
};

function DashboardRow({ index, row, primaryColumn, metadataColumns }: DashboardRowProps) {
  return (
    <button
      type="button"
      className="group flex flex-col justify-between gap-4 border-b border-black/10 py-6 text-left transition-colors hover:border-black focus-visible:bg-black/2 focus-visible:outline-none sm:flex-row sm:items-center"
    >
      <div className="flex flex-1 items-start gap-4 sm:items-baseline sm:gap-6">
        <span className="pt-1.5 font-mono text-[10px] text-black/40 sm:pt-0">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div>
          <p className="font-serif text-2xl font-bold leading-none transition-all duration-300 group-hover:-translate-y-0.5 group-hover:italic sm:text-3xl">
            {row[primaryColumn] ?? "—"}
          </p>

          {/* Tampilan Mobile untuk Metadata */}
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 sm:hidden">
            {metadataColumns.map((col) => row[col] && (
              <span key={col} className="font-mono text-[10px] uppercase tracking-widest text-black/60">
                {row[col]}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 self-end sm:self-auto">
        <div className="hidden items-center gap-5 text-right sm:flex">
          {metadataColumns.map((col, idx) => row[col] && (
            <div key={col} className="flex items-center gap-5">
              {idx > 0 && <span className="font-serif text-sm italic text-black/15">/</span>}
              <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-black/70">
                {row[col]}
              </span>
            </div>
          ))}
        </div>

        <div className="flex w-8 justify-end overflow-hidden">
          <ArrowRight
            className="h-5 w-5 text-black/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-black"
            strokeWidth={1.5}
          />
        </div>
      </div>
    </button>
  );
}
