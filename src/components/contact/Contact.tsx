"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { Container } from "@/components/ui/Section";
import { ContactModal } from "@/components/contact/ContactModal";

export function Contact({ autoOpen = false }: { autoOpen?: boolean }) {
  const [open, setOpen] = useState(autoOpen);

  return (
    <section id="contact" className="relative flex items-center bg-background md:min-h-[100dvh]">
      <Container className="relative mx-auto max-w-4xl py-16 text-center sm:py-20 md:py-28">
        <p className="section-kicker">Let’s work</p>
        <h2 className="font-heading mt-4 text-[clamp(2.1rem,9vw,6rem)] leading-[0.95] font-semibold tracking-tight sm:mt-5">
          Let’s build
          <br />
          something that lasts.
        </h2>
        <p className="font-display mt-6 text-2xl text-accent-soft sm:mt-8 sm:text-3xl md:text-4xl">{site.tagline}</p>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-foreground-secondary italic sm:mt-6 sm:text-lg md:text-xl">
          Full-stack product work, interfaces, and interactive experiences — from first conversation to a shipped
          release. If you have a brief, a problem, or a product in mind, start here.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:mt-12 sm:gap-5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            data-grid-ignore
            className="group inline-flex w-full max-w-xs items-center justify-center gap-3 rounded-full bg-foreground px-6 py-3.5 font-heading text-xs tracking-[0.14em] text-background uppercase transition-colors hover:bg-accent-hover sm:w-auto sm:px-8 sm:py-4 sm:text-sm sm:tracking-[0.16em]"
          >
            Start a conversation
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
          <p className="max-w-[22rem] text-sm break-words text-muted">
            {site.location}
            <span className="mx-2 text-white/20">·</span>
            {site.email}
          </p>
        </div>
      </Container>

      {open ? <ContactModal onClose={() => setOpen(false)} /> : null}
    </section>
  );
}
