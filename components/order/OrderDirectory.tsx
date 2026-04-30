"use client";

import { useMemo, useState } from "react";
import type { OrderView, PaymentStatus } from "@/types/order";
import { Input } from "@/components/ui/input";

type OrderDirectoryProps = {
  role: "admin" | "organizer" | "customer";
  initialOrders: OrderView[];
  title: string;
};

const STATUS_LABELS: Record<PaymentStatus, string> = {
  Paid: "Lunas",
  Pending: "Pending",
  Cancelled: "Dibatalkan",
};

const STATUS_COLORS: Record<PaymentStatus, string> = {
  Paid: "bg-green-100 text-green-700 border-green-200",
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Cancelled: "bg-red-100 text-red-700 border-red-200",
};

export default function OrderDirectory({
  role,
  initialOrders,
  title,
}: OrderDirectoryProps) {
  const [orders] = useState<OrderView[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PaymentStatus>(
    "all",
  );

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch = o.orderId
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchStatus =
        statusFilter === "all" || o.paymentStatus === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  const totalOrders = orders.length;
  const paidCount = orders.filter((o) => o.paymentStatus === "Paid").length;
  const pendingCount = orders.filter(
    (o) => o.paymentStatus === "Pending",
  ).length;
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "Paid")
    .reduce((s, o) => s + o.totalAmount, 0);

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(p);

  const formatDate = (d: string) =>
    new Date(d).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      <div
        className={`grid grid-cols-1 gap-4 ${role === "organizer" ? "md:grid-cols-4" : "md:grid-cols-3"}`}
      >
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Order</p>
          <p className="mt-2 text-3xl font-bold">{totalOrders}</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Lunas</p>
          <p className="mt-2 text-3xl font-bold text-green-600">{paidCount}</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {pendingCount}
          </p>
        </div>
        {role === "organizer" && (
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="mt-2 text-2xl font-bold">
              {formatPrice(totalRevenue)}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm lg:flex-row lg:items-center">
        <div className="w-full lg:flex-1">
          <Input
            placeholder="Cari Order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="h-10 rounded-md border bg-white px-3 text-sm"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as typeof statusFilter)
          }
        >
          <option value="all">Semua Status</option>
          <option value="Paid">Lunas</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Dibatalkan</option>
        </select>
      </div>

      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Order ID</th>
                <th className="text-left px-4 py-3 font-medium">Tanggal</th>
                <th className="text-left px-4 py-3 font-medium">Total</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    Tidak ada order yang ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr
                    key={order.orderId}
                    className="border-b last:border-0 hover:bg-muted/20"
                  >
                    <td className="px-4 py-3 font-mono text-xs">
                      {order.orderId.slice(0, 8)}...
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {formatDate(order.orderDate)}
                    </td>
                    <td className="px-4 py-3">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[order.paymentStatus]}`}
                      >
                        {STATUS_LABELS[order.paymentStatus]}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
