import type { Role } from "@/lib/session";

export type Stat = { label: string; value: string; hint?: string };
export type Row = Record<string, string>;
export type InfoCard = {
  title: string;
  stats: { label: string; value: string }[];
  button: { label: string; href: string };
};

export type DashboardData = {
  stats: Stat[];
  tables: { title: string; columns: string[]; rows: Row[] }[];
  cards?: InfoCard[];
};

const admin: DashboardData = {
  stats: [
    { label: "Total Pengguna", value: "12.847", hint: "Pengguna Aktif" },
    { label: "Total Acara", value: "523", hint: "Bulan Ini" },
    { label: "Omzet Platform", value: "Rp 8,2 M", hint: "Pendapatan Kotor" },
    { label: "Promosi Aktif", value: "17", hint: "Kampanye berlangsung" },
  ],
  tables: [],
  cards: [
    {
      title: "Infrastruktur Venue",
      stats: [
        { label: "Total Venue Terdaftar", value: "3 Lokasi" },
        { label: "Reserved Seating", value: "2 Venue" },
        { label: "Kapasitas Terbesar", value: "1.000 Kursi" },
      ],
      button: { label: "Kelola Venue", href: "/admin/venues" },
    },
    {
      title: "Marketing & Promosi",
      stats: [
        { label: "Promo Persentase", value: "1 Aktif" },
        { label: "Promo Potongan Nominal", value: "1 Aktif" },
        { label: "Total Penggunaan", value: "57 Kali" },
      ],
      button: { label: "Kelola Promosi", href: "/admin/promotions" },
    },
  ],
};

const organizer: DashboardData = {
  stats: [
    { label: "Acara Aktif", value: "4", hint: "Dalam koordinasi" },
    { label: "Tiket Terjual", value: "6.120", hint: "Total Terjual" },
    { label: "Revenue", value: "Rp 412 Jt", hint: "Bulan Ini" },
    { label: "Venue Mitra", value: "7", hint: "Lokasi Aktif" },
  ],
  tables: [
    {
      title: "Performa Acara",
      columns: ["Acara", "Status", "% Terjual", "Lokasi"],
      rows: [
        { Acara: "Pesta Rakyat Fest", Status: "On Sale", "% Terjual": "78%", Lokasi: "Jakarta" },
        { Acara: "Java Jazz Side Stage", Status: "Draft", "% Terjual": "—", Lokasi: "Jakarta" },
        { Acara: "Solo Kustik Night", Status: "On Sale", "% Terjual": "54%", Lokasi: "Solo" },
      ],
    },
  ],
};

const customer: DashboardData = {
  stats: [
    { label: "Tiket Aktif", value: "3", hint: "Siap digunakan" },
    { label: "Acara Diikuti", value: "12", hint: "Total Pengalaman" },
    { label: "Kode Promo", value: "2", hint: "Dapat digunakan" },
    { label: "Total Belanja", value: "Rp 2,4 Jt", hint: "Bulan ini" },
  ],
  tables: [
    {
      title: "Tiket Mendatang",
      columns: ["Acara", "Tanggal", "Venue", "Kategori"],
      rows: [
        { Acara: "Pesta Rakyat Fest", Tanggal: "12 Mei 2026", Venue: "Istora Senayan", Kategori: "Festival" },
        { Acara: "Solo Kustik Night", Tanggal: "27 Mei 2026", Venue: "GOR Sritex", Kategori: "VIP" },
        { Acara: "Java Jazz Side", Tanggal: "03 Jun 2026", Venue: "JIExpo", Kategori: "Regular" },
      ],
    },
  ],
};

export function getDashboard(role: Role): DashboardData {
  if (role === "admin") return admin;
  if (role === "organizer") return organizer;
  return customer;
}
