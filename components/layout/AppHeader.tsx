import Link from "next/link";
import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href={user ? `/${user.role}/dashboard` : "/"} className="flex items-center gap-2 font-semibold">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Database className="size-3.5" />
          </span>
          <span>TikTakTuk</span>
          {roleLabel ? (
            <Badge variant="secondary" className="ml-1 hidden sm:inline-flex">
              {roleLabel}
            </Badge>
          ) : null}
        </Link>
        <div className="min-w-0 flex-1">
          <NavLinks items={items} />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {user ? (
            <UserMenu user={user} />
          ) : (
            <Button asChild size="sm">
              <Link href="/login">Masuk</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
