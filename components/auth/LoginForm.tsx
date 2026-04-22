"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2, AlertCircle, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { loginAction } from "@/services/authService";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, null);
  const params = useSearchParams();

  useEffect(() => {
    if (params.get("registered")) {
      toast.success("Registrasi berhasil. Silakan login.");
    }
  }, [params]);

  return (
    <div className="w-full max-w-sm mx-auto font-sans text-black">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center gap-2 mb-6">
          <div className="h-px w-8 bg-black/15" />
          <span className="font-serif text-black/30 text-sm">✦</span>
          <div className="h-px w-8 bg-black/15" />
        </div>

        <h1 className="font-serif font-black text-4xl tracking-tight mb-3">
          Masuk
        </h1>
        <p className="text-[10px] font-mono tracking-widest uppercase text-black/50">
          Akses Sistem Manajemen Event
        </p>
      </div>

      {/* FORM CONTENT */}
      <form action={formAction} className="space-y-6">
        {state && !state.ok && (
          <Alert variant="destructive" className="py-3 rounded-md bg-red-50 text-red-900 border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs font-medium">{state.error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-5">
          {/* Field Email */}
          <div className="space-y-2">
            <Label 
              htmlFor="email" 
              className="text-[10px] font-mono tracking-widest uppercase text-black/60"
            >
              Alamat Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="nama@contoh.com"
              autoComplete="email"
              required
              disabled={pending}
              className="border-black/10 focus-visible:ring-black/20 rounded-md shadow-none h-11 placeholder:text-black/30"
            />
          </div>

          <div className="space-y-2 mb-8">
            <Label 
              htmlFor="password" 
              className="text-[10px] font-mono tracking-widest uppercase text-black/60"
            >
              Kata Sandi
            </Label>
            <div className="relative">
             <PasswordInput
                id="password"
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
                disabled={pending}
                className="border-black/10 focus-visible:ring-black/20 rounded-md shadow-none h-11"
              />
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
                Memproses...
              </>
            ) : (
              <>
                Masuk <ArrowRight size={14} className="ml-2" />
              </>
            )}
          </Button>

          <div className="text-center mt-2">
            <span className="text-[10px] font-mono tracking-widest uppercase text-black/40">
              Belum punya akun?{" "}
            </span>
            <Link
              href="/register"
              className="text-[10px] font-mono tracking-widest uppercase text-black font-bold underline decoration-black/30 underline-offset-4 hover:decoration-black transition-colors"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}