"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { Certification } from "@/types";
import { cn } from "@/lib/utils";

export function CertificationScatter({ items }: { items: Certification[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [open, setOpen] = useState<Certification | null>(null);

  if (!items.length) return null;

  return (
    <section id="certifications" className="flex flex-col pt-16 pb-12 md:min-h-[100dvh] md:pt-24 md:pb-16">
      <div className="container-page pointer-events-none shrink-0">
        <p className="section-kicker mb-2">Learning</p>
        <h2 className="font-heading text-[clamp(1.6rem,5.5vw,2.5rem)] leading-tight font-semibold tracking-tight">
          Featured Certifications
        </h2>
      </div>

      <div className="pointer-events-none mt-16 hidden flex-1 justify-center px-6 md:flex lg:mt-20">
        <div className="grid w-full max-w-[1120px] grid-cols-2 items-start justify-items-center gap-x-28 gap-y-24 lg:gap-x-36 lg:gap-y-28">
          {items.slice(0, 3).map((item, index) => {
            const active = item.id === activeId;
            return (
              <div
                key={item.id}
                className={cn(
                  "pointer-events-none flex w-full max-w-[300px] flex-col items-start gap-4",
                  index === 2 && "col-span-2 justify-self-center",
                )}
              >
                <button
                  type="button"
                  data-grid-ignore
                  onMouseEnter={() => setActiveId(item.id)}
                  onFocus={() => setActiveId(item.id)}
                  onClick={() => setOpen(item)}
                  className={cn(
                    "pointer-events-auto flex items-center gap-2 rounded-full bg-surface py-1 pr-3.5 pl-1 shadow-[0_12px_30px_rgba(0,0,0,0.28)] transition-transform duration-300",
                    active && "scale-[1.03]",
                  )}
                >
                  <Avatar item={item} />
                  <span className="font-heading text-sm text-foreground">{item.title}</span>
                </button>

                <button
                  type="button"
                  data-grid-ignore
                  onMouseEnter={() => setActiveId(item.id)}
                  onFocus={() => setActiveId(item.id)}
                  onClick={() => setOpen(item)}
                  className={cn(
                    "pointer-events-auto w-full overflow-hidden rounded-[24px] bg-surface p-2.5 text-left shadow-[0_20px_50px_rgba(0,0,0,0.32)] transition-all duration-300",
                    active ? "scale-[1.02]" : "opacity-90",
                  )}
                >
                  <div className="overflow-hidden rounded-[18px] bg-[#111111]">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.title}
                        className="aspect-[16/10] max-h-[148px] w-full object-cover object-top"
                      />
                    ) : (
                      <div className="flex aspect-[16/10] max-h-[148px] items-center justify-center font-heading text-3xl text-white/20">
                        {item.title[0]}
                      </div>
                    )}
                  </div>
                  <div className="px-2 pt-2.5 pb-1.5">
                    <h3 className="font-heading text-base text-foreground">{item.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">{item.description}</p>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="container-page mt-8 space-y-5 sm:mt-12 sm:space-y-8 md:hidden">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setOpen(item)}
            className="w-full overflow-hidden rounded-[24px] bg-surface p-2.5 text-left"
          >
            <div className="mb-2.5 flex items-center gap-2">
              <Avatar item={item} />
              <span className="font-heading text-sm text-foreground">{item.title}</span>
            </div>
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.image} alt="" className="aspect-[16/10] w-full rounded-[16px] object-cover object-top" />
            ) : null}
            <h3 className="mt-2 px-1 font-heading text-base text-foreground">{item.title}</h3>
            <p className="mt-1 line-clamp-2 px-1 text-sm text-muted">{item.description}</p>
          </button>
        ))}
      </div>

      {open ? <CertificateModal item={open} onClose={() => setOpen(null)} /> : null}
    </section>
  );
}

function CertificateModal({ item, onClose }: { item: Certification; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md md:p-8"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="certificate-modal-title"
        data-grid-ignore
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/10 bg-[#141618] p-3 shadow-[0_40px_100px_rgba(0,0,0,0.55)] md:p-4"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close certificate"
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#0e0f0f] text-foreground transition-colors hover:border-accent-bright hover:text-accent-bright"
        >
          <X className="h-5 w-5" />
        </button>
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={item.title}
            className="max-h-[min(78dvh,820px)] w-full rounded-[20px] object-contain bg-[#111111]"
          />
        ) : (
          <div className="flex min-h-[240px] items-center justify-center rounded-[20px] bg-[#111111] font-heading text-4xl text-white/20">
            {item.title[0]}
          </div>
        )}
        <h3 id="certificate-modal-title" className="mt-3 px-2 font-heading text-lg text-foreground md:text-xl">
          {item.title}
        </h3>
      </div>
    </div>,
    document.body,
  );
}

function Avatar({ item }: { item: Certification }) {
  if (item.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={item.image} alt="" className="h-7 w-7 rounded-full object-cover" />
    );
  }
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs text-background">
      {item.title[0]}
    </span>
  );
}
