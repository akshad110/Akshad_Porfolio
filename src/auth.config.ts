import type { NextAuthConfig } from "next-auth";

function publicOrigin() {
  const raw = process.env.AUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || "";
  return raw.replace(/\/$/, "");
}

/**
 * Edge-compatible auth config only.
 * No Node-only imports (mongoose, bcrypt) — used by middleware.
 */
export const authConfig = {
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = "admin";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = typeof token.role === "string" ? token.role : "admin";
      }
      return session;
    },
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLogin = pathname.startsWith("/admin/login");
      const isAdmin = pathname.startsWith("/admin");
      const origin = publicOrigin();

      if (isAdmin && !isLogin) return Boolean(auth);
      if (isLogin && auth) {
        // Never redirect to 0.0.0.0 (Docker bind host). Prefer public site URL.
        const target = origin ? new URL("/admin", origin) : new URL("/admin", request.nextUrl);
        return Response.redirect(target);
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
