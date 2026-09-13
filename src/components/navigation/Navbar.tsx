"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { mobileNavItems, navItems, site } from "@/data/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-40 transition-colors duration-500",
        scrolled || open
          ? "border-b border-border/80 bg-background/80 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="container-page relative flex items-center justify-between py-4">
        <Link href="/" prefetch={false} className="font-heading relative z-10 text-sm tracking-[0.22em] uppercase">
          {site.shortName}
        </Link>

        <nav
          className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 lg:flex"
          aria-label="Primary"
        >
          {navItems.map((item) => {
            const isHash = item.href.includes("#");
            const active =
              item.href === "/"
                ? pathname === "/"
                : !isHash && pathname.startsWith(item.href);
            return isHash ? (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "font-heading text-xs tracking-[0.2em] uppercase transition-colors",
                  active ? "text-accent-bright" : "text-muted hover:text-foreground",
                )}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className={cn(
                  "font-heading text-xs tracking-[0.2em] uppercase transition-colors",
                  active ? "text-accent-bright" : "text-muted hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="relative z-10 flex items-center gap-3">
          <Button href="/contact" className="hidden px-4 py-2 text-[11px] lg:inline-flex">
            Hire Me
          </Button>
          <button
            type="button"
            className="lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>
      {open ? (
        <nav
          id="mobile-menu"
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border bg-background/95 py-6 backdrop-blur-xl lg:hidden"
          aria-label="Mobile"
        >
          <ul className="container-page flex flex-col gap-4">
            {mobileNavItems.map((item) => (
              <li key={item.href}>
                {item.href.includes("#") ? (
                  <a href={item.href} className="font-heading text-base tracking-wide uppercase sm:text-lg">
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    prefetch={false}
                    className="font-heading text-base tracking-wide uppercase sm:text-lg"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <a
                href="/contact"
                onClick={() => setOpen(false)}
                className="font-heading mt-2 inline-flex rounded-md bg-foreground px-4 py-2 text-[11px] tracking-[0.14em] text-background uppercase"
              >
                Hire Me
              </a>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
