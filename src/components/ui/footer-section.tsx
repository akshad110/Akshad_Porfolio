"use client";

import Link from "next/link";
import { Code2, Github, Linkedin } from "lucide-react";
import { site } from "@/data/site";
import { SectionLink } from "@/components/navigation/SectionLink";

const columns = [
  {
    label: "Menu",
    links: [
      { title: "Home", href: "/" },
      { title: "About", href: "/about" },
      { title: "Projects", href: "/projects" },
      { title: "Services", href: "/services" },
    ],
  },
  {
    label: "Work",
    links: [
      { title: "Skills", sectionId: "skills" },
      { title: "Achievements", sectionId: "achievements" },
      { title: "Certifications", sectionId: "certifications" },
    ],
  },
  {
    label: "Connect",
    links: [
      { title: "Hire Me", href: "/contact" },
      { title: "Email", href: `mailto:${site.email}` },
      { title: "GitHub", href: site.github, external: true },
    ],
  },
] as const;

export function FooterSection() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-background pt-16 pb-12 md:pt-36 md:pb-24">
      <div className="container-page relative z-10 mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:gap-20">
          <div className="max-w-xs">
            <p
              className="font-heading mb-5 text-3xl leading-none font-semibold tracking-[-0.05em] text-white sm:mb-6 sm:text-4xl md:text-5xl"
              style={{
                textShadow: "0 2px 0 #1a1b1e, 0 4px 0 #101114, 0 10px 22px rgba(0,0,0,0.45)",
              }}
            >
              akshad.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-foreground-secondary shadow-[0_10px_24px_rgba(0,0,0,0.35)] transition-colors hover:border-foreground hover:text-foreground"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-foreground-secondary shadow-[0_10px_24px_rgba(0,0,0,0.35)] transition-colors hover:border-foreground hover:text-foreground"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={site.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LeetCode"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-foreground-secondary shadow-[0_10px_24px_rgba(0,0,0,0.35)] transition-colors hover:border-foreground hover:text-foreground"
              >
                <Code2 className="h-4 w-4" />
              </a>
            </div>

            <p className="mt-8 text-sm leading-relaxed text-foreground-secondary">{site.location}</p>
            <a
              href={`mailto:${site.email}`}
              className="mt-4 block text-sm text-foreground-secondary transition-colors hover:text-foreground"
            >
              {site.email}
            </a>
            <a
              href={`tel:${site.phoneRaw}`}
              className="mt-3 block text-sm text-foreground-secondary transition-colors hover:text-foreground"
            >
              {site.phone}
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-14">
            {columns.map((column) => (
              <div key={column.label}>
                <p className="font-heading text-xs tracking-[0.18em] text-foreground uppercase">{column.label}</p>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.title}>
                      {"sectionId" in link ? (
                        <SectionLink
                          sectionId={link.sectionId}
                          className="text-sm text-foreground-secondary transition-colors hover:text-foreground"
                        >
                          {link.title}
                        </SectionLink>
                      ) : "external" in link && link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-foreground-secondary transition-colors hover:text-foreground"
                        >
                          {link.title}
                        </a>
                      ) : link.href.startsWith("mailto:") ? (
                        <a
                          href={link.href}
                          className="text-sm text-foreground-secondary transition-colors hover:text-foreground"
                        >
                          {link.title}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-foreground-secondary transition-colors hover:text-foreground"
                        >
                          {link.title}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-12 flex items-center md:mt-16">
          <div className="h-px flex-1 bg-white/15" />
          <Link
            href="/contact"
            prefetch={false}
            className="ml-4 shrink-0 rounded-full border border-white/20 px-5 py-2 font-heading text-xs tracking-[0.14em] text-foreground uppercase shadow-[0_12px_28px_rgba(0,0,0,0.4)] transition-colors hover:bg-foreground hover:text-background"
          >
            Hire Me
          </Link>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-4 md:mt-10 md:flex-row md:items-end">
          <p className="max-w-sm text-sm leading-relaxed text-foreground-secondary">{site.description}</p>
          <p className="text-xs tracking-wide text-foreground-secondary uppercase sm:text-sm">
            © {new Date().getFullYear()} {site.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
