"use client";

import Link from "next/link";
import { Code2, Github, Linkedin, Mail } from "lucide-react";
import { site } from "@/data/site";
import { SectionLink } from "@/components/navigation/SectionLink";

const desktopColumns = [
  {
    label: "Pages",
    links: [
      { title: "Home", href: "/" },
      { title: "About Me", href: "/about" },
      { title: "Projects", href: "/projects" },
      { title: "Services", href: "/services" },
      { title: "Contact Me", href: "/contact" },
    ],
  },
  {
    label: "Work",
    links: [
      { title: "Skills", sectionId: "skills" },
      { title: "Achievements", sectionId: "achievements" },
      { title: "Certifications", sectionId: "certifications" },
      { title: "Featured", href: "/projects" },
    ],
  },
  {
    label: "Resources",
    links: [
      { title: "Resume", href: "/resume" },
      { title: "GitHub", href: site.github, external: true },
      { title: "LeetCode", href: site.leetcode, external: true },
      { title: "Email", href: `mailto:${site.email}` },
    ],
  },
  {
    label: "Connect",
    links: [
      { title: "LinkedIn", href: site.linkedin, external: true },
      { title: "CodeChef", href: site.codechef, external: true },
      { title: "Codeforces", href: site.codeforces, external: true },
      { title: "Hire Me", href: "/contact" },
    ],
  },
] as const;

const mobileGroups = [
  {
    label: "Pages",
    links: [
      { title: "Home", href: "/" },
      { title: "About Me", href: "/about" },
      { title: "Projects", href: "/projects" },
      { title: "Services", href: "/services" },
      { title: "Contact Me", href: "/contact" },
    ],
  },
  {
    label: "Work",
    links: [
      { title: "Skills", sectionId: "skills" },
      { title: "Achievements", sectionId: "achievements" },
      { title: "Certifications", sectionId: "certifications" },
      { title: "Resume", href: "/resume" },
    ],
  },
  {
    label: "Connect",
    links: [
      { title: "GitHub", href: site.github, external: true },
      { title: "LinkedIn", href: site.linkedin, external: true },
      { title: "LeetCode", href: site.leetcode, external: true },
      { title: "Hire Me", href: "/contact" },
    ],
  },
  {
    label: "Profiles",
    links: [
      { title: "CodeChef", href: site.codechef, external: true },
      { title: "Codeforces", href: site.codeforces, external: true },
      { title: "Email", href: `mailto:${site.email}` },
      { title: "Phone", href: `tel:${site.phoneRaw}` },
    ],
  },
] as const;

function FooterLink({
  title,
  href,
  sectionId,
  external,
}: {
  title: string;
  href?: string;
  sectionId?: string;
  external?: boolean;
}) {
  const className = "text-[13px] leading-6 text-foreground-secondary transition-colors hover:text-foreground";

  if (sectionId) {
    return (
      <SectionLink sectionId={sectionId} className={className}>
        {title}
      </SectionLink>
    );
  }

  if (external && href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {title}
      </a>
    );
  }

  if (href?.startsWith("mailto:") || href?.startsWith("tel:")) {
    return (
      <a href={href} className={className}>
        {title}
      </a>
    );
  }

  return (
    <Link href={href ?? "/"} className={className}>
      {title}
    </Link>
  );
}

function SocialButtons() {
  const items = [
    { href: site.linkedin, label: "LinkedIn", icon: Linkedin },
    { href: site.github, label: "GitHub", icon: Github },
    { href: site.leetcode, label: "LeetCode", icon: Code2 },
    { href: `mailto:${site.email}`, label: "Email", icon: Mail, external: false },
  ] as const;

  return (
    <div className="flex items-center gap-2">
      {items.map((item) => {
        const Icon = item.icon;
        const external = "external" in item ? item.external : true;
        return (
          <a
            key={item.label}
            href={item.href}
            aria-label={item.label}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-white/20 bg-transparent text-foreground transition-colors hover:border-accent-bright hover:text-accent-bright"
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
          </a>
        );
      })}
    </div>
  );
}

function BrandBlock() {
  return (
    <div className="max-w-sm">
      <Link href="/" className="font-heading inline-flex items-center gap-2 text-[13px] tracking-[0.22em] uppercase">
        <span className="flex h-7 w-7 items-center justify-center rounded-md border border-white/15 text-accent-bright">
          <Code2 className="h-3.5 w-3.5" />
        </span>
        {site.shortName}
      </Link>
      <h2 className="font-heading mt-8 text-[1.65rem] leading-[1.15] font-normal tracking-tight sm:text-[1.85rem]">
        {site.tagline.split(" into ")[0]}
        <br />
        <span className="text-accent-hover">into {site.tagline.split(" into ")[1]}</span>
      </h2>
      <div className="mt-8">
        <SocialButtons />
      </div>
    </div>
  );
}

export function FooterSection() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-background">
      <div className="container-page relative z-10 mx-auto max-w-6xl pt-12 pb-6 md:pt-16 md:pb-8">
        {/* Desktop */}
        <div className="hidden md:grid md:grid-cols-[minmax(220px,0.9fr)_1px_minmax(0,1.6fr)] md:items-start md:gap-12 lg:gap-16">
          <BrandBlock />
          <div className="self-stretch bg-white/12" aria-hidden />
          <div className="grid grid-cols-4 gap-8">
            {desktopColumns.map((column) => (
              <div key={column.label}>
                <p className="font-heading text-[11px] tracking-[0.16em] text-muted uppercase">{column.label}</p>
                <ul className="mt-5 space-y-1.5">
                  {column.links.map((link) => (
                    <li key={link.title}>
                      <FooterLink {...link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <BrandBlock />
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8">
            {mobileGroups.map((group) => (
              <div key={group.label}>
                <p className="font-heading border-b border-white/15 pb-2 text-[11px] tracking-[0.16em] text-muted uppercase">
                  {group.label}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {group.links.map((link) => (
                    <li key={link.title}>
                      <FooterLink {...link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 border-y border-white/12 py-4 md:mt-16 md:py-5">
          <div className="flex flex-col gap-3 text-[12px] text-foreground-secondary md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link href="/resume" className="hover:text-foreground">
                Resume
              </Link>
              <a href={`mailto:${site.email}`} className="hover:text-foreground">
                Email
              </a>
              <span>{site.location}</span>
            </div>
            <p>
              {year} © {site.name}. All Rights Reserved
            </p>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none relative -mt-4 select-none overflow-hidden px-2 pb-0 leading-none md:-mt-8"
      >
        <p className="font-heading text-center text-[22vw] font-semibold tracking-[-0.06em] text-white/[0.06] uppercase sm:text-[18vw] md:text-[16vw]">
          {site.shortName}
        </p>
      </div>
    </footer>
  );
}
