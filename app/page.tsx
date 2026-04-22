import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Database, Users, ArrowRight, Sparkles } from "lucide-react";

export default function LandingPage() {
  const teamMembers = [
    { name: "Gerry Bima Putra", initials: "GB" },
    { name: "Muhammad Hariz Albaari", initials: "MH" },
    { name: "Fadhil Daffa Putra Irawan", initials: "FD" },
    { name: "Faris Huda", initials: "FH" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden selection:bg-primary/20">
      {/* Efek Ambient Background */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-250 h-125 bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* NAVIGATION */}
      <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 py-5 backdrop-blur-xl bg-background/40 border-b border-border/10">
        <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">
          <div className="bg-primary w-6 h-6 rounded-sm flex items-center justify-center">
            <Database className="text-primary-foreground" size={14} />
          </div>
          FariSQL<span className="text-primary">.</span>
        </div>
        
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <span className="text-primary/80 font-bold uppercase tracking-widest text-[10px]">Kode Kelompok: 4</span>
          </nav>
          <Button asChild className="rounded-full px-7 font-bold shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
            <Link href="/login">
              Masuk Sistem <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center pt-48 pb-24 px-6 z-10">
        <div className="text-center space-y-10 max-w-6xl mx-auto w-full">
          
          <div className="space-y-6 flex flex-col items-center">
            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm">
              <Sparkles size={12} className="mr-2" />
              Basis Data B — Genap 2025/2026
            </Badge>
            
            <h1 className="text-8xl md:text-[10rem] font-black tracking-[ -0.05em] leading-[0.85] py-4">
              TikTak
              <span className="block md:inline bg-linear-to-t from-primary to-primary/60 bg-clip-text text-transparent">
                Tuk
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-xl mx-auto leading-relaxed opacity-80 mt-4">
              Platform manajemen data kolaboratif yang mengintegrasikan efisiensi struktur dengan performa tinggi.
            </p>
          </div>

          {/* COLLABORATORS SECTION */}
          <div className="pt-20 w-full">
            <div className="flex flex-col items-center mb-12">
              <div className="h-px w-24 bg-linear-to-r from-transparent via-primary/50 to-transparent mb-6" />
              <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                <Users size={14} />
                Kolaborator
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {teamMembers.map((member, index) => (
                <div key={index} className="group relative p-8 rounded-3xl bg-card/30 border border-border/40 hover:border-primary/30 transition-all duration-500">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-16 h-16 border-2 border-background shadow-xl group-hover:scale-110 transition-transform duration-500">
                      <AvatarFallback className="font-black bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <h3 className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors italic">
                        {member.name}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-10 text-center z-10 border-t border-border/5 bg-muted/20">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/50">
          &copy; 2026 FariSQL • Fasilkom Universitas Indonesia
        </p>
      </footer>
    </div>
  );
}