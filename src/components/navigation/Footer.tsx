"use client";

import { usePathname } from "next/navigation";
import { FooterSection } from "@/components/ui/footer-section";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <div className="relative z-10">
      <FooterSection />
    </div>
  );
}
