import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

function readCredential(value: unknown) {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return "";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = readCredential(credentials?.email).trim().toLowerCase();
        const password = readCredential(credentials?.password);
        if (!email || password.length < 8) return null;

        const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const envPassword = process.env.ADMIN_PASSWORD?.trim();
        const envMatch = Boolean(envEmail && envPassword && email === envEmail && password === envPassword);

        if (envMatch && envEmail && envPassword) {
          try {
            const { tryConnectDb } = await import("@/lib/db/connect");
            const db = await tryConnectDb();
            if (db) {
              const { AdminModel } = await import("@/models/Admin");
              const passwordHash = await bcrypt.hash(envPassword, 12);
              const saved = await AdminModel.findOneAndUpdate(
                { email: envEmail },
                { email: envEmail, passwordHash, name: "Akshad Vengurlekar" },
                { upsert: true, new: true },
              );
              return { id: String(saved._id), email: saved.email, name: saved.name };
            }
          } catch {
            // Env credentials are enough when Mongo is unavailable.
          }
          return { id: "local-admin", email: envEmail, name: "Admin" };
        }

        try {
          const { tryConnectDb } = await import("@/lib/db/connect");
          const db = await tryConnectDb();
          if (!db) return null;
          const { AdminModel } = await import("@/models/Admin");
          const admin = await AdminModel.findOne({ email }).lean();
          if (!admin?.passwordHash) return null;
          const valid = await bcrypt.compare(password, admin.passwordHash);
          if (!valid) return null;
          return { id: String(admin._id), email: admin.email, name: admin.name };
        } catch {
          return null;
        }
      },
    }),
  ],
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
  },
});
