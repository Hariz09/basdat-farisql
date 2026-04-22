import Link from "next/link";
import { CalendarCheck, UserRound, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const choices = [
  {
    href: "/register/customer",
    title: "Pelanggan",
    desc: "Membeli tiket acara, mengikuti promo, dan menyimpan tiket Anda secara digital.",
    Icon: UserRound,
  },
  {
    href: "/register/organizer",
    title: "Organizer",
    desc: "Membuat acara, mengelola venue, serta memantau penjualan tiket secara langsung.",
    Icon: CalendarCheck,
  },
];

export default function RegisterRolePage() {
  return (
    <div className="w-full max-w-md mx-auto font-sans text-black">
      {/* HEADER */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center gap-2 mb-6">
          <div className="h-px w-8 bg-black/15" />
          <span className="font-serif text-black/30 text-sm">✦</span>
          <div className="h-px w-8 bg-black/15" />
        </div>

        <h1 className="font-serif font-black text-4xl tracking-tight mb-3">
          Daftar
        </h1>
        <p className="text-[10px] font-mono tracking-widest uppercase text-black/50">
          Pilih tipe akun Anda
        </p>
      </div>

      <div className="grid gap-5 mb-10">
        {choices.map(({ href, title, desc, Icon }) => (
          <Link key={href} href={href} className="group block outline-none">
            <Card className="border-black/10 shadow-none transition-all duration-300 hover:border-black hover:bg-black/2 group-focus-visible:ring-2 group-focus-visible:ring-black/20 group-focus-visible:border-black">
              <CardHeader className="flex flex-row items-start gap-5 p-6 space-y-0">
                
                <div className="shrink-0 w-12 h-12 border border-black/10 bg-white flex items-center justify-center rounded-lg transition-colors duration-300 group-hover:bg-black group-hover:text-white group-hover:border-black">
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </div>
                
                <div className="flex-1">
                  <CardTitle className="font-serif font-bold text-2xl mb-2">
                    {title}
                  </CardTitle>
                  <CardDescription className="text-sm text-black/50 leading-relaxed mb-4">
                    {desc}
                  </CardDescription>
                  
                  <CardContent className="p-0">
                    <div className="flex items-center text-[10px] font-mono tracking-widest uppercase text-black/40 transition-colors group-hover:text-black font-medium">
                      Lanjutkan Pendaftaran
                      <ArrowRight className="ml-2 w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </div>

              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {/* FOOTER & CATATAN BADGE */}
      <div className="flex flex-col items-center gap-8">
        <div className="inline-flex items-center gap-2 text-[9px] font-mono tracking-widest uppercase text-black/40 border border-black/10 px-3 py-1.5 rounded-full bg-white">
          <span className="w-1.5 h-1.5 rounded-full bg-black/20" />
          Akun admin dibuat secara internal
        </div>

        <div className="text-center">
          <span className="text-[10px] font-mono tracking-widest uppercase text-black/40">
            Sudah punya akun?{" "}
          </span>
          <Link
            href="/login"
            className="text-[10px] font-mono tracking-widest uppercase text-black font-bold underline decoration-black/30 underline-offset-4 hover:decoration-black transition-colors"
          >
            Masuk Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}