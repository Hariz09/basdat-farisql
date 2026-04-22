"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { registerAction } from "@/services/authService";

export function RegisterOrganizerForm() {
  const [state, formAction, pending] = useActionState(registerAction, null);

  return (
    <div className="w-full max-w-sm mx-auto font-sans text-black">
      {/* HEADER FORM */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center gap-2 mb-6">
          <div className="h-px w-8 bg-black/15" />
          <span className="font-serif text-black/30 text-sm">✦</span>
          <div className="h-px w-8 bg-black/15" />
        </div>

        <h1 className="font-serif font-black text-4xl tracking-tight mb-3">
          Organizer
        </h1>
        <p className="text-[10px] font-mono tracking-widest uppercase text-black/50">
          Kelola acara dan penjualan tiket
        </p>
      </div>

      <form action={formAction} className="space-y-6">
        {/* Hidden Input Role */}
        <input type="hidden" name="role" value="organizer" />

        {/* Indikator Wajib Isi */}
        <div className="text-[10px] font-mono tracking-widest uppercase text-red-600/80 mb-2">
          * Seluruh kolom wajib diisi
        </div>

        {/* Alert Error */}
        {state && !state.ok && (
          <Alert variant="destructive" className="py-3 rounded-md bg-red-50 text-red-900 border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs font-medium">{state.error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-5">
          {/* Field Nama */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[10px] font-mono tracking-widest uppercase text-black/60">
              Nama Organizer / Penyelenggara <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="name" 
              name="name" 
              placeholder="NAMA LENGKAP ATAU INSTANSI"
              required 
              disabled={pending}
              className="border-black/10 focus-visible:ring-black/20 rounded-md shadow-none h-11 placeholder:font-mono placeholder:text-[10px] placeholder:tracking-widest placeholder:text-black/25"
            />
          </div>

          {/* Field Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[10px] font-mono tracking-widest uppercase text-black/60">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="NAMA@CONTOH.COM"
              required 
              disabled={pending}
              className="border-black/10 focus-visible:ring-black/20 rounded-md shadow-none h-11 placeholder:font-mono placeholder:text-[10px] placeholder:tracking-widest placeholder:text-black/25"
            />
          </div>

          {/* Field Telepon */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-[10px] font-mono tracking-widest uppercase text-black/60">
              Nomor Telepon <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="phone" 
              name="phone" 
              inputMode="tel" 
              placeholder="08123456789"
              required 
              disabled={pending}
              className="border-black/10 focus-visible:ring-black/20 rounded-md shadow-none h-11 placeholder:font-mono placeholder:text-[10px] placeholder:tracking-widest placeholder:text-black/25"
            />
          </div>

          {/* Field Username */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-[10px] font-mono tracking-widest uppercase text-black/60">
              Username <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="username" 
              name="username" 
              placeholder="NAMA_PENGGUNA"
              required 
              disabled={pending}
              className="border-black/10 focus-visible:ring-black/20 rounded-md shadow-none h-11 placeholder:font-mono placeholder:text-[10px] placeholder:tracking-widest placeholder:text-black/25"
            />
          </div>

          {/* Field Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[10px] font-mono tracking-widest uppercase text-black/60">
              Kata Sandi (Min. 6) <span className="text-red-500">*</span>
            </Label>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              placeholder="••••••••"
              minLength={6}
              required
              disabled={pending}
              className="border-black/10 focus-visible:ring-black/20 rounded-md shadow-none h-11 placeholder:text-black/25 placeholder:tracking-[0.3em] placeholder:text-sm"
            />
          </div>

          {/* Field Konfirmasi Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-[10px] font-mono tracking-widest uppercase text-black/60">
              Konfirmasi Kata Sandi <span className="text-red-500">*</span>
            </Label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="••••••••"
              required
              disabled={pending}
              className="border-black/10 focus-visible:ring-black/20 rounded-md shadow-none h-11 placeholder:text-black/25 placeholder:tracking-[0.3em] placeholder:text-sm"
            />
          </div>

          {/* Field Syarat & Ketentuan (Checkbox) */}
          <div className="flex items-start space-x-3 bg-black/2 border border-black/10 p-4 rounded-lg mb-8">
            <Checkbox 
              id="agree" 
              name="agree" 
              required 
              disabled={pending}
              className="mt-0.5 border-black/20 data-[state=checked]:bg-black data-[state=checked]:text-white data-[state=checked]:border-black" 
            />
            <div className="grid gap-1.5 leading-none">
              <Label 
                htmlFor="agree" 
                className="text-sm font-medium text-black/80 cursor-pointer"
              >
                Saya setuju dengan Syarat & Ketentuan <span className="text-red-500">*</span>
              </Label>
              <p className="text-[10px] font-mono uppercase tracking-widest text-black/40">
                Wajib disetujui untuk membuat acara
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER FORM */}
        <div className="flex flex-col gap-5 pt-2">
          <Button 
            type="submit" 
            disabled={pending} 
            className="w-full rounded-md bg-black text-white hover:bg-black/80 h-11 font-medium transition-all"
          >
            {pending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mendaftar...
              </>
            ) : (
              <>
                Selesaikan Pendaftaran <ArrowRight size={14} className="ml-2" />
              </>
            )}
          </Button>

          {/* Tombol Kembali */}
          <div className="text-center mt-2">
            <Link
              href="/register"
              className="inline-flex items-center text-[10px] font-mono tracking-widest uppercase text-black/50 hover:text-black transition-colors"
            >
              <ArrowLeft size={12} className="mr-2" />
              Kembali ke Pemilihan Akun
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}