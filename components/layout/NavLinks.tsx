"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export type NavItem = { href: string; label: string };

export function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden items-center gap-1 overflow-x-auto lg:flex">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-md px-2.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
              isActive(item.href)
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Mobile nav trigger */}
      <div className="flex justify-end lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Buka menu navigasi"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-black/10 text-black transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
          >
            <Menu size={18} />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-white p-0">
            <SheetHeader className="border-b border-black/10 px-5 py-4">
              <SheetTitle className="font-serif text-base font-black tracking-tight">
                Menu
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 p-3">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
