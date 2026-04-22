import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROLES = ["admin", "organizer", "customer"] as const;
type Role = (typeof ROLES)[number];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("tiktaktuk_session")?.value;
  let role: Role | null = null;
  if (sessionCookie) {
    try {
      const parsed = JSON.parse(sessionCookie) as { role?: Role };
      if (parsed.role && ROLES.includes(parsed.role)) role = parsed.role;
    } catch {
      role = null;
    }
  }

  const segment = pathname.split("/")[1] as Role | undefined;
  const isPrivate = segment && ROLES.includes(segment as Role);
  const isAuthPage = pathname === "/login" || pathname.startsWith("/register");

  if (isPrivate && !role) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isPrivate && role && segment !== role) {
    const url = request.nextUrl.clone();
    url.pathname = `/${role}/dashboard`;
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (isAuthPage && role) {
    const url = request.nextUrl.clone();
    url.pathname = `/${role}/dashboard`;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/organizer/:path*",
    "/customer/:path*",
    "/login",
    "/register/:path*",
  ],
};
