import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import { auth } from "@/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminStats } from "@/lib/content/admin-queries";
import "./admin.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-admin-sans",
  display: "swap",
});

const plex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-admin-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const stats = session ? await getAdminStats() : { unread: 0 };
  return (
    <div className={`${manrope.variable} ${plex.variable}`}>
      <AdminShell session={session} unread={stats.unread}>
        {children}
      </AdminShell>
    </div>
  );
}
