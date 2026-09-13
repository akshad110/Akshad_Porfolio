"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { queueHomeSection } from "@/components/navigation/HomeSectionScroller";

type SectionLinkProps = {
  sectionId: string;
  children: ReactNode;
  className?: string;
};

/** Navigate to a homepage section without putting a #hash in the URL. */
export function SectionLink({ sectionId, children, className }: SectionLinkProps) {
  const pathname = usePathname();
  const router = useRouter();

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (pathname === "/") {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    queueHomeSection(sectionId);
    router.push("/");
  };

  return (
    <Link href="/" prefetch={false} onClick={onClick} className={cn(className)}>
      {children}
    </Link>
  );
}
