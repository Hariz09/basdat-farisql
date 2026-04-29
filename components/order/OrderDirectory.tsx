"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  deleteOrderAction,
  updateOrderStatusAction,
} from "@/app/order-actions";
import type { OrderView, PaymentStatus } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const isAdmin = role === "admin";
  const [isPending, startTransition] = useTransition();
  const [orders, setOrders] = useState<OrderView[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PaymentStatus>(
    "all",
  );

  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderView | null>(null);
  const [newStatus, setNewStatus] = useState<PaymentStatus>("Pending");

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

  const handleOpenUpdate = (order: OrderView) => {
    setSelectedOrder(order);
    setNewStatus(order.paymentStatus);
    setUpdateOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedOrder) return;
    startTransition(async () => {
      const result = await updateOrderStatusAction(
        selectedOrder.orderId,
        newStatus,
      );
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      setOrders(result.orders);
      setUpdateOpen(false);
      setSelectedOrder(null);
      toast.success(result.message);
    });
  };

  const handleOpenDelete = (order: OrderView) => {
    setSelectedOrder(order);
    setDeleteOpen(true);
  };

  const handleDelete = () => {
    if (!selectedOrder) return;
    startTransition(async () => {
      const result = await deleteOrderAction(selectedOrder.orderId);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      setOrders(result.orders);
      setDeleteOpen(false);
      setSelectedOrder(null);
      toast.success(result.message);
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      <div
        className={`grid grid-cols-1 gap-4 ${isAdmin || role === "organizer" ? "md:grid-cols-4" : "md:grid-cols-3"}`}
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
        {(isAdmin || role === "organizer") && (
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
                <th className="text-left px-4 py-3 font-medium">Event</th>
                <th className="text-left px-4 py-3 font-medium">Kategori</th>
                <th className="text-left px-4 py-3 font-medium">Qty</th>
                <th className="text-left px-4 py-3 font-medium">Kursi</th>
                <th className="text-left px-4 py-3 font-medium">Total</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                {isAdmin && (
                  <th className="text-left px-4 py-3 font-medium">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={isAdmin ? 9 : 8}
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
                    <td className="px-4 py-3">{order.eventTitle}</td>
                    <td className="px-4 py-3">{order.categoryName}</td>
                    <td className="px-4 py-3">{order.quantity}</td>
                    <td className="px-4 py-3 text-xs">
                      {order.seatLabel ?? (
                        <span className="text-muted-foreground">—</span>
                      )}
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
                    {isAdmin && (
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleOpenUpdate(order)}
                          >
                            Update
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleOpenDelete(order)}
                            disabled={isPending}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={updateOpen} onOpenChange={setUpdateOpen}>
        <DialogContent className="sm:max-w-100">
          <DialogHeader>
            <DialogTitle>Update Status Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Order ID:{" "}
              <span className="font-mono">{selectedOrder?.orderId}</span>
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status Pembayaran</label>
              <select
                className="flex h-10 w-full rounded-md border bg-white px-3 text-sm"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as PaymentStatus)}
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Lunas</option>
                <option value="Cancelled">Dibatalkan</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setUpdateOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleUpdate} disabled={isPending}>
              {isPending ? "Memproses..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-100">
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Order</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Apakah Anda yakin ingin menghapus order ini?
            </p>
            {selectedOrder && (
              <div className="mt-4 rounded-lg border bg-muted/50 p-4 space-y-1">
                <p className="text-xs font-mono">{selectedOrder.orderId}</p>
                <p className="text-sm">
                  {selectedOrder.eventTitle} — {selectedOrder.categoryName}
                </p>
                <p className="text-sm font-medium">
                  {formatPrice(selectedOrder.totalAmount)}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Memproses..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
