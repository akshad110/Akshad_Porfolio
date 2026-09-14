import type { NextAuthConfig } from "next-auth";

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
    // Page protection is handled in middleware.ts so Server Actions are not redirected.
    authorized() {
      return true;
    },
  },
} satisfies NextAuthConfig;
