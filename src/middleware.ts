import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const request = req as NextRequest & { auth?: unknown };
  const { pathname } = request.nextUrl;
  const isLogin = pathname.startsWith("/admin/login");
  const isAdmin = pathname.startsWith("/admin");

  // Server Actions POST to the current /admin page. A middleware redirect returns HTML,
  // which breaks the client with: "An unexpected response was received from the server."
  // Mutations are still protected by requireAdmin() inside each action.
  const isServerAction =
    request.method === "POST" &&
    (request.headers.has("next-action") || request.headers.has("Next-Action"));

  if (isServerAction) {
    return NextResponse.next();
  }

  if (isAdmin && !isLogin && !request.auth) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (isLogin && request.auth) {
    const origin = (process.env.AUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
    if (origin) {
      return NextResponse.redirect(new URL("/admin", origin));
    }
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
