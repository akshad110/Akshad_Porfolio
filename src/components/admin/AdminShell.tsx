"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SessionProvider, signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { Bell, Calendar, ChevronDown, LogOut, Menu, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/achievements", label: "Achievements" },
  { href: "/admin/certifications", label: "Certifications" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/testimonials", label: "Testimonials" },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

export function AdminShell({
  children,
  unread = 0,
  session,
}: {
  children: React.ReactNode;
  unread?: number;
  session: Session | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const isLogin = pathname.startsWith("/admin/login");

  function handleSignOut() {
    void signOut({ redirect: false }).then(() => {
      // Avoid NextAuth absolute URL built from Docker HOSTNAME (0.0.0.0:10000).
      window.location.assign("/admin/login");
    });
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "/" && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function jump(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = String(new FormData(event.currentTarget).get("q") ?? "").toLowerCase().trim();
    const match = links.find((link) => link.label.toLowerCase().includes(query));
    if (match) router.push(match.href);
  }

  const body = isLogin ? (
    <div className="admin-console">{children}</div>
  ) : (
      <div className="admin-console">
        <header className="admin-bar">
          <Link href="/admin" className="flex shrink-0 items-center gap-2.5">
            <span className="admin-logo" aria-hidden>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 10.5 6.2 7.2 8.4 9.4 13 4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="13" cy="4.5" r="1.3" fill="white" />
              </svg>
            </span>
            <span className="admin-heading text-[17px] font-extrabold tracking-tight">Studio</span>
          </Link>

          <nav className="mx-auto hidden min-w-0 items-center gap-1 overflow-x-auto md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                className={cn("admin-nav-pill whitespace-nowrap", isActive(pathname, link.href) && "is-active")}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <form onSubmit={jump} className="admin-search hidden sm:flex">
              <Search className="size-3.5 shrink-0" />
              <input ref={searchRef} name="q" className="admin-search-field" placeholder="Search console" />
              <kbd>/</kbd>
            </form>
            <span className="admin-chip hidden lg:inline-flex">
              <Calendar className="size-3.5" />
              Last 30 days
              <ChevronDown className="size-3.5" />
            </span>
            <Link href="/admin/messages" className="admin-icon-btn" aria-label="Messages">
              <Bell className="size-4" />
              {unread > 0 ? <span className="admin-dot" /> : null}
            </Link>
            <button type="button" className="admin-avatar" title="Akshad Vengurlekar" aria-label="Account">
              AV
            </button>
            <button
              type="button"
              className="admin-icon-btn hidden md:grid"
              onClick={handleSignOut}
              aria-label="Sign out"
            >
              <LogOut className="size-4" />
            </button>
            <button type="button" className="admin-icon-btn md:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu className="size-4" />
            </button>
          </div>
        </header>

        {open ? (
          <div className="fixed inset-0 z-50 bg-[#0e0f0f]/92 p-5 backdrop-blur-md md:hidden">
            <div className="mb-6 flex items-center justify-between">
              <p className="admin-heading text-lg">Studio</p>
              <button type="button" className="admin-icon-btn" onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="size-4" />
              </button>
            </div>
            <nav className="grid gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn("admin-nav-pill", isActive(pathname, link.href) && "is-active")}
                >
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={handleSignOut}
                className="admin-nav-pill mt-4 text-left"
              >
                Sign out
              </button>
            </nav>
          </div>
        ) : null}

        <div className="admin-page">{children}</div>
      </div>
  );

  return (
    <SessionProvider
      session={session}
      basePath="/api/auth"
      refetchInterval={0}
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
    >
      {body}
    </SessionProvider>
  );
}
