"use client";

import Link from "next/link";
import { LogOut, User as UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/services/authService";
import type { SessionUser } from "@/lib/session";

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function UserMenu({ user }: { user: SessionUser }) {
  const profileHref = `/${user.role}/profile`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group flex items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-black/20">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-black font-serif text-xs font-bold italic text-white transition-colors group-hover:bg-black/80">
          {getInitials(user.name)}
        </div>
        <span className="hidden font-serif text-sm font-bold sm:inline group-hover:italic transition-all">
          {user.name}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 rounded-xl border border-black/10 bg-white shadow-none p-2"
      >
        <DropdownMenuLabel className="flex flex-col gap-1 pb-3 pt-2 px-2">
          <span className="font-serif text-lg font-black leading-none text-black">
            {user.name}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-black/40">
            @{user.username}
          </span>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-black/10" />
        
        <div className="py-1">
          <DropdownMenuItem asChild className="cursor-pointer focus:bg-black/3 focus:text-black">
            <Link href={profileHref} className="flex items-center gap-3 px-2 py-2">
              <UserIcon className="h-4 w-4 text-black/50" strokeWidth={1.5} /> 
              <span className="font-medium text-sm">Profil Saya</span>
            </Link>
          </DropdownMenuItem>
          
          <form action={logoutAction}>
            <DropdownMenuItem asChild className="cursor-pointer focus:bg-red-50 focus:text-red-600">
              <button type="submit" className="flex w-full items-center gap-3 px-2 py-2">
                <LogOut className="h-4 w-4 text-black/50 group-focus:text-red-500" strokeWidth={1.5} /> 
                <span className="font-medium text-sm">Keluar Sistem</span>
              </button>
            </DropdownMenuItem>
          </form>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}