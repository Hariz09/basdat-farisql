import Link from "next/link";
import { CalendarCheck, UserRound } from "lucide-react";
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
    title: "Saya Pelanggan",
    desc: "Membeli tiket acara, mengikuti promo, dan menyimpan tiket saya.",
    Icon: UserRound,
  },
  {
    href: "/register/organizer",
    title: "Saya Organizer",
    desc: "Membuat dan mengelola acara, venue, serta penjualan tiket.",
    Icon: CalendarCheck,
  },
];

export default function RegisterRolePage() {
  return (
    <div className="space-y-4">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold">Pilih Tipe Akun</h1>
        <p className="text-sm text-muted-foreground">
          Akun admin dibuat secara internal.
        </p>
      </div>
      <div className="grid gap-3">
        {choices.map(({ href, title, desc, Icon }) => (
          <Link key={href} href={href}>
            <Card className="transition-colors hover:bg-muted/40">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <CardTitle className="text-base">{title}</CardTitle>
                    <CardDescription>{desc}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <span className="text-xs text-muted-foreground underline-offset-4 group-hover:underline">
                  Lanjutkan pendaftaran →
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Sudah punya akun?{" "}
        <Link href="/login" className="underline-offset-4 hover:underline">
          Masuk
        </Link>
      </p>
    </div>
  );
}
