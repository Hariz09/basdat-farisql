import Link from "next/link";
import { Database, ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const teamMembers = [
    { name: "Gerry Bima Putra", initials: "GB" },
    { name: "Muhammad Hariz Albaari", initials: "MH" },
    { name: "Fadhil Daffa Putra Irawan", initials: "FD" },
    { name: "Faris Huda", initials: "FH" },
  ];

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans">

      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-10 py-4 bg-white/80 backdrop-blur border-b border-black/8">
        <div className="flex items-center gap-2.5 font-serif font-black text-lg tracking-tight">
          <div className="w-7 h-7 bg-black rounded flex items-center justify-center">
            <Database size={13} className="text-white" />
          </div>
          FariSQL
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono tracking-widest uppercase text-black/40 border border-black/10 px-3 py-1 rounded-full">
            Kelompok 4
          </span>
          <Button asChild size="sm" className="rounded-md bg-black text-white hover:bg-black/80">
            <Link href="/login">Masuk <ArrowRight size={13} className="ml-1" /></Link>
          </Button>
        </div>
      </header>

      {/* HERO */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-32 pb-16">
        <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-black/50 border border-black/10 px-3 py-1.5 rounded mb-10">
          <Calendar size={10} />
          Sistem Manajemen Event
        </div>

        <h1 className="font-serif font-black leading-[0.88] tracking-tight mb-3" style={{ fontSize: "clamp(80px, 13vw, 140px)" }}>
          Tik<span className="text-transparent [-webkit-text-stroke:2px_black]">Tak</span>
          <span className="block italic">Tuk</span>
        </h1>

        <div className="flex items-center justify-center gap-4 my-8">
          <div className="h-px w-16 bg-black/15" />
          <span className="font-serif text-black/30 text-sm">✦</span>
          <div className="h-px w-16 bg-black/15" />
        </div>

        <p className="text-sm text-black/50 max-w-xs leading-relaxed mb-10">
          Proyek basis data untuk pengelolaan acara — tugas mata kuliah Basis Data B, Fasilkom UI.
        </p>

        <Button asChild className="rounded-md bg-black text-white hover:bg-black/80 px-6">
          <Link href="/login">Masuk ke Sistem <ArrowRight size={14} className="ml-2" /></Link>
        </Button>
      </main>

      {/* TEAM */}
      <section className="flex flex-col items-center pb-20 px-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px w-10 bg-black/10" />
          <span className="text-[10px] font-mono tracking-widest uppercase text-black/35">Anggota Kelompok</span>
          <div className="h-px w-10 bg-black/10" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 border border-black/10 rounded-2xl overflow-hidden max-w-3xl w-full">
          {teamMembers.map((m, i) => (
            <div
              key={i}
              className="p-8 border-r border-black/8 last:border-r-0 hover:bg-black/2 transition-colors group"
            >
              <div className="w-11 h-11 rounded-lg bg-black flex items-center justify-center font-serif italic font-bold text-white text-sm mb-4 group-hover:bg-black/70 transition-colors">
                {m.initials}
              </div>
              <p className="font-semibold text-xs leading-snug text-black">{m.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-black/8 px-10 py-5 flex items-center justify-between flex-wrap gap-3">
        <span className="text-[10px] font-mono tracking-widest uppercase text-black/35">
          © 2026 FariSQL · Fasilkom UI
        </span>
        <span className="font-serif italic text-[11px] text-black/25">
          Basis Data B — Genap 2025/2026
        </span>
      </footer>
    </div>
  );
}