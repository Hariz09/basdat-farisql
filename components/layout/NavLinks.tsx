"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export type NavLeaf = { href: string; label: string };
export type NavGroup = { label: string; children: NavLeaf[] };
export type NavItem = NavLeaf | NavGroup;

function isGroup(item: NavItem): item is NavGroup {
  return "children" in item;
}

export function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const isGroupActive = (group: NavGroup) =>
    group.children.some((c) => isActive(c.href));

  return (
    <>
      {/* Desktop nav */}
      <NavigationMenu className="hidden lg:flex" viewport={false}>
        <NavigationMenuList className="gap-1">
          {items.map((item) =>
            isGroup(item) ? (
              <NavigationMenuItem key={item.label}>
                <NavigationMenuTrigger
                  className={cn(
                    isGroupActive(item) && "bg-accent text-accent-foreground",
                  )}
                >
                  {item.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="flex w-48 flex-col gap-1 p-2">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <NavigationMenuLink
                          asChild
                          active={isActive(child.href)}
                        >
                          <Link
                            href={child.href}
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              isActive(child.href) &&
                                "bg-accent text-accent-foreground",
                            )}
                          >
                            {child.label}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink asChild active={isActive(item.href)}>
                  <Link
                    href={item.href}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      isActive(item.href) && "bg-accent text-accent-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ),
          )}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Mobile nav trigger */}
      <div className="flex justify-end lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label="Buka menu navigasi"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="border-b px-5 py-4 text-left">
              <SheetTitle className="font-serif text-base font-black tracking-tight">
                Menu
              </SheetTitle>
              <SheetDescription className="sr-only">
                Navigasi menu
              </SheetDescription>
            </SheetHeader>
            <nav className="flex flex-col gap-1 p-4">
              {items.map((item) =>
                isGroup(item) ? (
                  <div key={item.label} className="mt-2 first:mt-0">
                    <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {item.label}
                    </p>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          isActive(child.href)
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
