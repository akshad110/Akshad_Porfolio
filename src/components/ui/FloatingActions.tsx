"use client";

import { FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { ArrowUp, X } from "lucide-react";
import { site } from "@/data/site";
import { scrollToTop } from "@/lib/page-scroll";
import { cn } from "@/lib/utils";

const WA_GREEN = "#25D366";
const WA_GREEN_DARK = "#1ebe57";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function buildWhatsAppUrl(name: string, phone: string, message: string) {
  const lines = [
    `Hi Akshad, I'm ${name.trim()}.`,
    phone.trim() ? `My phone: ${phone.trim()}` : "",
    message.trim() || "I'd like to discuss a project with you.",
  ].filter(Boolean);

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/91${site.phoneRaw}?text=${text}`;
}

export function FloatingActions() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!mounted || pathname?.startsWith("/admin")) return null;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    window.open(buildWhatsAppUrl(name, phone, message), "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  return createPortal(
    <div data-grid-ignore className="pointer-events-none fixed right-4 bottom-4 z-[60] flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {open ? (
        <div
          role="dialog"
          aria-label="WhatsApp chat"
          className="pointer-events-auto w-[min(100vw-2rem,340px)] overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
        >
          <div className="flex items-start gap-3 px-4 py-3.5 text-white" style={{ background: WA_GREEN }}>
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
              <WhatsAppIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-heading text-sm font-semibold tracking-wide">Chat with us</p>
              <p className="text-xs text-white/85">We typically reply instantly.</p>
            </div>
            <button
              type="button"
              aria-label="Close WhatsApp form"
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-white/90 transition hover:bg-white/15"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-3 bg-white px-4 py-4 text-[#1a1a1a]">
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">
                Name <span className="text-red-500">*</span>
              </span>
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className="w-full rounded-lg border border-[#d8dde3] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">
                Phone <span className="text-red-500">*</span>
              </span>
              <input
                required
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Your phone number"
                className="w-full rounded-lg border border-[#d8dde3] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">Message</span>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="How can we help you?"
                rows={3}
                className="w-full resize-none rounded-lg border border-[#d8dde3] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20"
              />
            </label>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white transition hover:brightness-105"
              style={{ background: WA_GREEN }}
              onMouseEnter={(event) => {
                event.currentTarget.style.background = WA_GREEN_DARK;
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.background = WA_GREEN;
              }}
            >
              <WhatsAppIcon className="h-4 w-4" />
              Start Chat
            </button>
          </form>
        </div>
      ) : null}

      <div className="pointer-events-auto flex flex-col items-center gap-3">
        <button
          type="button"
          aria-label="Scroll to top"
          onClick={() => scrollToTop()}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full bg-accent-bright text-[#0e0f0f] shadow-[0_10px_28px_rgba(0,0,0,0.35)] transition-all duration-300 hover:bg-accent-hover",
            showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
          )}
        >
          <ArrowUp className="h-5 w-5" strokeWidth={2.4} />
        </button>

        <button
          type="button"
          aria-label={open ? "Close WhatsApp chat" : "Open WhatsApp chat"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_12px_30px_rgba(37,211,102,0.45)] transition hover:scale-[1.04]"
          style={{ background: WA_GREEN }}
        >
          {open ? <X className="h-6 w-6" /> : <WhatsAppIcon className="h-7 w-7" />}
        </button>
      </div>
    </div>,
    document.body,
  );
}
