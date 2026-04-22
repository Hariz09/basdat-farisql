import Link from "next/link";
import { Database, ArrowRight } from "lucide-react";
import { NavLinks, type NavItem } from "./NavLinks";
import { UserMenu } from "./UserMenu";
import type { SessionUser } from "@/lib/session";

type Props = {
  items: NavItem[];
  user?: SessionUser | null;
  roleLabel?: string;
};

export function AppHeader({ items, user, roleLabel }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-6 font-sans text-black md:px-10">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href={user ? `/${user.role}/dashboard` : "/"}
            className="group flex items-center gap-2.5 font-serif text-lg font-black tracking-tight"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded bg-black transition-colors group-hover:bg-black/80">
              <Database size={13} className="text-white" />
            </div>
            TikTakTuk
          </Link>

          {roleLabel && (
            <>
              <div className="hidden h-4 w-px bg-black/15 sm:block" />
              <span className="hidden rounded-full border border-black/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-black/50 sm:block">
                {roleLabel}
              </span>
            </>
          )}
        </div>

        <div className="flex-1">
          <NavLinks items={items} />
        </div>

        <div className="flex shrink-0 items-center">
          {user ? (
            <UserMenu user={user} />
          ) : (
            <Link
              href="/login"
              className="inline-flex h-9 items-center justify-center rounded-md bg-black px-5 text-sm font-medium text-white transition-colors hover:bg-black/80"
            >
              Masuk <ArrowRight size={14} className="ml-2" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}