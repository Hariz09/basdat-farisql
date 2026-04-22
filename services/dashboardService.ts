import type { Role } from "@/lib/session";

export type Stat = { label: string; value: string; hint?: string };
export type Row = Record<string, string>;

export type DashboardData = {
  stats: Stat[];
  tables: { title: string; columns: string[]; rows: Row[] }[];
};

const admin: DashboardData = {
  stats: [
    { label: "Total Pengguna", value: "12.847", hint: "+3.2% bulan ini" },
    { label: "Total Acara", value: "523", hint: "42 berjalan" },
    { label: "Omzet Platform", value: "Rp 8,2 M", hint: "GMV akumulatif" },
    { label: "Promosi Aktif", value: "17", hint: "6 kampanye besar" },
  ],
  tables: [
    {
      title: "Ringkasan Infrastruktur Venue",
      columns: ["Venue", "Kota", "Kapasitas", "Utilisasi"],
      rows: [
        { Venue: "Istora Senayan", Kota: "Jakarta", Kapasitas: "7.500", Utilisasi: "82%" },
        { Venue: "GOR Sritex Arena", Kota: "Solo", Kapasitas: "5.000", Utilisasi: "64%" },
        { Venue: "Grand Ballroom Sheraton", Kota: "Bandung", Kapasitas: "1.200", Utilisasi: "47%" },
      ],
    },
    {
      title: "Ringkasan Marketing & Promosi",
      columns: ["Kode", "Redeem", "Diskon", "Status"],
      rows: [
        { Kode: "NEWYEAR26", Redeem: "1.204", Diskon: "15%", Status: "Aktif" },
        { Kode: "KONSER50", Redeem: "872", Diskon: "10%", Status: "Aktif" },
        { Kode: "EARLYBIRD", Redeem: "533", Diskon: "20%", Status: "Berakhir" },
      ],
    },
  ],
};

const organizer: DashboardData = {
  stats: [
    { label: "Acara Aktif", value: "4", hint: "2 minggu mendatang" },
    { label: "Tiket Terjual", value: "6.120", hint: "+18% WoW" },
    { label: "Revenue Bulan Ini", value: "Rp 412 Jt", hint: "Target 80%" },
    { label: "Venue Mitra", value: "7", hint: "3 kota" },
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
