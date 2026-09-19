"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, Check, LoaderCircle, Mail, MapPin, Phone, X } from "lucide-react";
import { site } from "@/data/site";
import { contactSchema, type ContactInput } from "@/lib/validation/schemas";
import { cn } from "@/lib/utils";
import { lockPageScroll, unlockPageScroll } from "@/lib/page-scroll";

const TOPICS = [
  "Full Stack",
  "Frontend",
  "Backend & API",
  "E-Commerce",
  "Interactive / 3D",
] as const;

export function ContactModal({ onClose }: { onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    lockPageScroll();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      unlockPageScroll();
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[70] overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[#070808]/88 backdrop-blur-xl" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(34,179,215,0.18),transparent_42%),radial-gradient(ellipse_at_90%_100%,rgba(25,133,161,0.16),transparent_40%)]"
      />

      <div className="relative flex min-h-[100dvh] items-center justify-center px-3 py-16 sm:px-6 sm:py-12">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-modal-title"
          data-grid-ignore
          onClick={(event) => event.stopPropagation()}
          className="relative grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-[#101214]/92 shadow-[0_40px_120px_rgba(0,0,0,0.55)] md:grid-cols-[1.15fr_0.85fr] md:min-h-[min(640px,calc(100dvh-6rem))]"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close contact form"
            className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-black/40 text-foreground backdrop-blur-md transition-colors hover:border-accent-bright hover:text-accent-bright"
          >
            <X className="h-4 w-4" />
          </button>
          <FormColumn onClose={onClose} />
          <AsideColumn />
        </div>
      </div>
    </div>,
    document.body,
  );
}

function FormColumn({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const subject = watch("subject");

  const onSubmit = async (values: ContactInput) => {
    setStatus("idle");
    const body = {
      ...values,
      message: company.trim()
        ? `Company / studio: ${company.trim()}\n\n${values.message}`
        : values.message,
    };
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      setStatus("error");
      setMessage(payload.error ?? "Unable to send the message.");
      return;
    }
    setStatus("success");
    setMessage("Message received. I’ll get back to you soon.");
  };

  if (status === "success") {
    return (
      <div className="flex flex-col justify-center px-6 py-10 sm:px-10 md:px-12">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-accent-bright">
          <Check className="h-5 w-5" />
        </span>
        <h3 className="font-heading mt-5 text-3xl">Message sent</h3>
        <p className="mt-3 max-w-sm text-foreground-secondary italic">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-8 inline-flex w-fit rounded-full bg-foreground px-5 py-2.5 font-heading text-xs tracking-[0.14em] text-background uppercase"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-8 sm:px-10 sm:py-10 md:px-12 md:py-12">
      <p className="section-kicker">Contact</p>
      <h2 id="contact-modal-title" className="font-heading mt-3 pr-10 text-[clamp(1.8rem,4vw,2.7rem)] leading-[1.05]">
        Let’s partner up
      </h2>
      <p className="mt-2 max-w-md text-sm text-foreground-secondary italic sm:text-base">
        Tell me about the product. I’ll take it from there.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="font-heading text-[10px] tracking-[0.18em] text-muted uppercase">Name</span>
          <input {...register("name")} autoComplete="name" placeholder="Your name" className={inputClass(Boolean(errors.name))} />
          {errors.name ? <span className="text-sm text-accent-hover">{errors.name.message}</span> : null}
        </label>
        <label className="grid gap-1.5">
          <span className="font-heading text-[10px] tracking-[0.18em] text-muted uppercase">Company</span>
          <input
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            autoComplete="organization"
            placeholder="Studio or company"
            className={inputClass(false)}
          />
        </label>
      </div>

      <label className="mt-4 grid gap-1.5">
        <span className="font-heading text-[10px] tracking-[0.18em] text-muted uppercase">Email</span>
        <input
          {...register("email")}
          type="email"
          autoComplete="email"
          placeholder="you@studio.com"
          className={inputClass(Boolean(errors.email))}
        />
        {errors.email ? <span className="text-sm text-accent-hover">{errors.email.message}</span> : null}
      </label>

      <div className="mt-5">
        <p className="font-heading mb-2 text-[10px] tracking-[0.18em] text-muted uppercase">Interests</p>
        <input type="hidden" {...register("subject")} />
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((topic) => {
            const active = subject === topic;
            return (
              <button
                key={topic}
                type="button"
                onClick={() => setValue("subject", topic, { shouldValidate: true })}
                className={cn(
                  "rounded-full border px-3 py-1.5 font-heading text-[11px] tracking-[0.06em] uppercase transition-colors",
                  active
                    ? "border-accent-bright bg-accent/15 text-accent-bright"
                    : "border-white/12 text-foreground-secondary hover:border-white/30 hover:text-foreground",
                )}
              >
                {topic}
              </button>
            );
          })}
        </div>
        {errors.subject ? <p className="mt-2 text-sm text-accent-hover">{errors.subject.message}</p> : null}
      </div>

      <label className="mt-5 grid gap-1.5">
        <span className="font-heading text-[10px] tracking-[0.18em] text-muted uppercase">Message</span>
        <textarea
          {...register("message")}
          rows={4}
          placeholder="Tell me what you want to ship."
          className={cn(inputClass(Boolean(errors.message)), "min-h-[108px] resize-y rounded-2xl")}
        />
        {errors.message ? <span className="text-sm text-accent-hover">{errors.message.message}</span> : null}
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-3.5 font-heading text-xs tracking-[0.18em] text-background uppercase transition-colors hover:bg-accent-hover disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Sending
          </>
        ) : (
          <>
            Send brief
            <ArrowUpRight className="h-4 w-4" />
          </>
        )}
      </button>
      {status === "error" ? <p className="mt-3 text-sm text-accent-hover">{message}</p> : null}
    </form>
  );
}

function AsideColumn() {
  return (
    <aside className="relative flex min-h-[280px] flex-col justify-between overflow-hidden border-t border-white/8 bg-[#152026] px-6 py-8 sm:px-8 md:min-h-full md:border-t-0 md:border-l md:border-white/8 md:px-10 md:py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(34,179,215,0.22),transparent_36%),linear-gradient(180deg,rgba(21,32,38,0)_40%,rgba(8,12,14,0.55)_100%)]"
      />
      <div className="relative">
        <p className="font-heading text-[11px] tracking-[0.2em] text-accent-soft uppercase">Studio</p>
        <h3 className="font-heading mt-3 text-2xl leading-tight md:text-3xl">{site.name}</h3>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-foreground-secondary italic">{site.tagline}</p>
        <ul className="mt-8 space-y-5">
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/12 bg-black/20 text-accent-bright">
              <Mail className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="font-heading text-[10px] tracking-[0.16em] text-muted uppercase">Email</p>
              <a href={`mailto:${site.email}`} className="mt-1 block text-sm break-all text-foreground hover:text-accent-bright">
                {site.email}
              </a>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/12 bg-black/20 text-accent-bright">
              <MapPin className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="font-heading text-[10px] tracking-[0.16em] text-muted uppercase">Based in</p>
              <p className="mt-1 text-sm text-foreground">{site.location}</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/12 bg-black/20 text-accent-bright">
              <Phone className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="font-heading text-[10px] tracking-[0.16em] text-muted uppercase">Phone</p>
              <a href={`tel:${site.phoneRaw}`} className="mt-1 block text-sm text-foreground hover:text-accent-bright">
                {site.phone}
              </a>
            </div>
          </li>
        </ul>
      </div>

      <div className="relative mt-10">
        <a
          href={site.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-heading text-xs tracking-[0.16em] text-accent-bright uppercase"
        >
          Connect on LinkedIn
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
        <p className="font-heading mt-8 text-[12vw] leading-none font-semibold tracking-[-0.06em] text-white/6 uppercase md:text-[4.6rem]">
          {site.shortName}
        </p>
      </div>
    </aside>
  );
}

function inputClass(invalid: boolean) {
  return cn(
    "w-full rounded-full border bg-[#0b0c0d]/80 px-4 py-2.5 text-sm text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-white/25",
    invalid
      ? "border-accent-hover/70"
      : "border-white/10 focus:border-accent-bright focus:shadow-[0_0_0_4px_rgba(34,179,215,0.12)]",
  );
}
