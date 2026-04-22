"use client";

import { useUpdatePassword } from "@/hooks/useUpdatePassword";
import { Loader2, Save, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function UpdatePasswordForm() {
  const { state, action, pending } = useUpdatePassword();

  return (
    <div className="w-full max-w-2xl font-sans text-black">
      <div className="mb-10 border-b border-black/10 pb-6">
        <h2 className="font-serif text-3xl font-black tracking-tight">
          Keamanan Akun
        </h2>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-black/50">
          Perbarui kata sandi Anda secara berkala
        </p>
      </div>

      <form action={action} className="space-y-8">
        {state && !state.ok && (
          <Alert variant="destructive" className="rounded-md border-red-200 bg-red-50 py-3 text-red-900">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs font-medium">{state.error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="oldPassword" className="font-mono text-[10px] uppercase tracking-widest text-black/80">
              Kata Sandi Lama <span className="text-red-500">*</span>
            </Label>
            <PasswordInput
              id="oldPassword"
              name="oldPassword"
              autoComplete="current-password"
              placeholder="••••••••"
              required
              disabled={pending}
              className="h-11 rounded-md border-black/10 shadow-none placeholder:text-sm placeholder:tracking-[0.3em] placeholder:text-black/25 focus-visible:border-black focus-visible:ring-1 focus-visible:ring-black/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="font-mono text-[10px] uppercase tracking-widest text-black/80">
              Kata Sandi Baru (Min. 6) <span className="text-red-500">*</span>
            </Label>
            <PasswordInput
              id="newPassword"
              name="newPassword"
              autoComplete="new-password"
              placeholder="••••••••"
              minLength={6}
              required
              disabled={pending}
              className="h-11 rounded-md border-black/10 shadow-none placeholder:text-sm placeholder:tracking-[0.3em] placeholder:text-black/25 focus-visible:border-black focus-visible:ring-1 focus-visible:ring-black/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="font-mono text-[10px] uppercase tracking-widest text-black/80">
              Konfirmasi Kata Sandi Baru <span className="text-red-500">*</span>
            </Label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="••••••••"
              required
              disabled={pending}
              className="h-11 rounded-md border-black/10 shadow-none placeholder:text-sm placeholder:tracking-[0.3em] placeholder:text-black/25 focus-visible:border-black focus-visible:ring-1 focus-visible:ring-black/20"
            />
          </div>
        </div>

        <div className="mt-10 flex items-center justify-end border-t border-black/10 pt-6">
          <Button
            type="submit"
            disabled={pending}
            className="h-11 w-full rounded-md bg-black px-8 font-medium text-white transition-all hover:bg-black/80 sm:w-auto"
          >
            {pending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" strokeWidth={1.5} />
                Simpan Password
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}