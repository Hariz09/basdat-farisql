"use client";

import { useProfileEdit } from "@/hooks/useProfileEdit";
import { Loader2, Save, AlertCircle, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Props = {
  username: string;
  name: string;
  contactEmail: string;
};

export function EditOrganizerProfileForm({ username, name, contactEmail }: Props) {
  const { state, action, pending } = useProfileEdit();

  return (
    <div className="w-full max-w-2xl font-sans text-black">
      <div className="mb-10 border-b border-black/10 pb-6">
        <h2 className="font-serif text-3xl font-black tracking-tight">
          Profil Organizer
        </h2>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-black/50">
          Kelola informasi entitas penyelenggara acara
        </p>
      </div>

      <form action={action} className="space-y-8">
        {state && !state.ok && (
          <Alert variant="destructive" className="rounded-md border-red-200 bg-red-50 py-3 text-red-900">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs font-medium">{state.error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-5 rounded-xl border border-black/5 bg-black/2 p-6">
          <div className="mb-2 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-black/40">
            <Lock className="h-3 w-3" />
            Data Permanen
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username" className="font-mono text-[10px] uppercase tracking-widest text-black/60">
              Username
            </Label>
            <Input 
              id="username" 
              defaultValue={username} 
              readOnly 
              disabled 
              className="h-11 cursor-not-allowed border-transparent bg-black/3 text-black/50 shadow-none focus-visible:ring-0"
            />
          </div>
        </div>

        <div className="space-y-5 px-1 sm:px-0">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-mono text-[10px] uppercase tracking-widest text-black/80">
              Nama Organizer <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="name" 
              name="name" 
              defaultValue={name} 
              required 
              disabled={pending}
              className="h-11 rounded-md border-black/10 shadow-none focus-visible:border-black focus-visible:ring-1 focus-visible:ring-black/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail" className="font-mono text-[10px] uppercase tracking-widest text-black/80">
              Email Kontak <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="contactEmail" 
              name="contactEmail" 
              type="email"
              defaultValue={contactEmail} 
              required 
              disabled={pending}
              className="h-11 rounded-md border-black/10 shadow-none focus-visible:border-black focus-visible:ring-1 focus-visible:ring-black/20"
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
                Simpan Perubahan
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}