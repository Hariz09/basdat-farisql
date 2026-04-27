import Link from "next/link";
import { Database, ArrowRight } from "lucide-react";
import { NavLinks, type NavItem } from "./NavLinks";
import { UserMenu } from "./UserMenu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SessionUser } from "@/lib/session";

type Props = {
  items: NavItem[];
  user?: SessionUser | null;
  roleLabel?: string;
};

export function AppHeader({ items, user, roleLabel }: Props) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-6 md:px-10">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href={user ? `/${user.role}/dashboard` : "/"}
            className="group flex items-center gap-2.5 font-serif text-lg font-black tracking-tight"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded bg-primary transition-colors group-hover:bg-primary/90">
              <Database className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            TikTakTuk
          </Link>

          {roleLabel && (
            <>
              <div className="hidden h-4 w-px bg-border sm:block" />
              <Badge 
                variant="outline" 
                className="hidden px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground sm:inline-flex"
              >
                {roleLabel}
              </Badge>
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
            <Button asChild>
              <Link href="/login">
                Masuk <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}