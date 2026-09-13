"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, LoaderCircle, Mail, MapPin, Phone, X } from "lucide-react";
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
      className="fixed inset-0 z-[70] overflow-y-auto overscroll-contain bg-black/70 backdrop-blur-md [-webkit-overflow-scrolling:touch]"
      onClick={onClose}
    >
      <div className="flex min-h-[100dvh] items-start justify-center p-3 sm:items-center sm:p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-modal-title"
          data-grid-ignore
          onClick={(event) => event.stopPropagation()}
          className="relative my-3 grid w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[#141618] shadow-[0_40px_100px_rgba(0,0,0,0.5)] sm:my-6 md:grid-cols-[1.15fr_0.85fr] md:max-h-[min(640px,calc(100dvh-3rem))]"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close contact form"
            className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-[#0e0f0f] text-foreground transition-colors hover:border-accent-bright hover:text-accent-bright"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="md:min-h-0 md:overflow-y-auto md:overscroll-contain md:[-webkit-overflow-scrolling:touch]">
            <FormColumn onClose={onClose} />
          </div>
          <div className="md:min-h-0 md:overflow-y-auto md:overscroll-contain">
            <AsideColumn />
          </div>
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
      <div className="flex flex-col justify-center px-5 py-8 sm:px-6 sm:py-10 md:px-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-accent-bright">
          <Check className="h-5 w-5" />
        </span>
        <h3 className="font-heading mt-4 text-2xl">Message sent</h3>
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
    <form onSubmit={handleSubmit(onSubmit)} className="px-5 py-6 pb-8 sm:px-6 sm:py-7 md:px-8 md:py-8">
      <h2 id="contact-modal-title" className="font-heading pr-10 text-2xl leading-tight md:text-3xl">
        Let’s partner up
      </h2>
      <p className="mt-1.5 text-sm text-foreground-secondary italic">Tell me about the product. I’ll take it from there.</p>

      <label className="mt-5 grid gap-1.5">
        <span className="font-heading text-[10px] tracking-[0.18em] text-muted uppercase">Name</span>
        <input
          {...register("name")}
          autoComplete="name"
          placeholder="Your name"
          className={inputClass(Boolean(errors.name))}
        />
        {errors.name ? <span className="text-sm text-accent-hover">{errors.name.message}</span> : null}
      </label>

      <label className="mt-3 grid gap-1.5">
        <span className="font-heading text-[11px] tracking-[0.18em] text-muted uppercase">Company</span>
        <input
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          autoComplete="organization"
          placeholder="Studio or company"
          className={inputClass(false)}
        />
      </label>

      <label className="mt-3 grid gap-1.5">
        <span className="font-heading text-[11px] tracking-[0.18em] text-muted uppercase">Email</span>
        <input
          {...register("email")}
          type="email"
          autoComplete="email"
          placeholder="you@studio.com"
          className={inputClass(Boolean(errors.email))}
        />
        {errors.email ? <span className="text-sm text-accent-hover">{errors.email.message}</span> : null}
      </label>

      <div className="mt-3">
        <p className="font-heading mb-2 text-[11px] tracking-[0.18em] text-muted uppercase">Interests</p>
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
                  "rounded-full border px-2.5 py-1 font-heading text-[11px] tracking-[0.04em] transition-colors",
                  active
                    ? "border-accent-bright bg-accent/20 text-accent-bright"
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

      <label className="mt-3 grid gap-1.5">
        <span className="font-heading text-[11px] tracking-[0.18em] text-muted uppercase">Message</span>
        <textarea
          {...register("message")}
          rows={3}
          placeholder="Tell me what you want to ship."
          className={cn(inputClass(Boolean(errors.message)), "min-h-[72px] resize-y rounded-2xl")}
        />
        {errors.message ? <span className="text-sm text-accent-hover">{errors.message.message}</span> : null}
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-2.5 font-heading text-xs tracking-[0.16em] text-background uppercase transition-colors hover:bg-accent-hover disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Sending
          </>
        ) : (
          "Submit"
        )}
      </button>
      {status === "error" ? <p className="mt-3 text-sm text-accent-hover">{message}</p> : null}
    </form>
  );
}

function AsideColumn() {
  return (
    <aside className="relative flex flex-col justify-between overflow-hidden border-t border-white/8 bg-[#1a2228] px-5 py-6 sm:px-6 sm:py-7 md:border-t-0 md:border-l md:border-white/8 md:px-7 md:py-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(34,179,215,0.16),transparent_42%)]"
      />
      <div className="relative">
        <h3 className="font-heading text-xl">Contacts</h3>
        <ul className="mt-5 space-y-4">
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/12 text-accent-bright">
              <Mail className="h-3.5 w-3.5" />
            </span>
            <a href={`mailto:${site.email}`} className="pt-1 text-sm break-all text-foreground-secondary hover:text-accent-bright">
              {site.email}
            </a>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/12 text-accent-bright">
              <MapPin className="h-3.5 w-3.5" />
            </span>
            <p className="pt-1 text-sm text-foreground-secondary">{site.location}</p>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/12 text-accent-bright">
              <Phone className="h-3.5 w-3.5" />
            </span>
            <a href={`tel:${site.phoneRaw}`} className="pt-1 text-sm text-foreground-secondary hover:text-accent-bright">
              {site.phone}
            </a>
          </li>
        </ul>
        <a
          href={site.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm text-accent-bright underline decoration-accent/40 underline-offset-4 hover:decoration-accent-bright"
        >
          Connect on LinkedIn
        </a>
      </div>

      <MessageMark />
    </aside>
  );
}

function MessageMark() {
  return (
    <svg viewBox="0 0 260 160" className="relative mx-auto mt-6 w-[min(100%,160px)] text-accent-soft" aria-hidden>
      <path d="M20 118c36 18 70 8 110-2 40-10 78-8 110 8" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.35" />
      <path d="M20 128c40 14 80 6 120-2" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.2" />
      <ellipse cx="168" cy="96" rx="28" ry="10" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M140 96c0-18 12-42 28-42s28 24 28 42" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M156 58l12-22 12 22" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="168" cy="34" r="3" fill="currentColor" />
      <path d="M78 52c18-10 34-6 40 8-16 4-28 16-30 28-8-6-18-12-10-36z" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function inputClass(invalid: boolean) {
  return cn(
    "w-full rounded-full border bg-[#0e0f0f] px-4 py-2 text-sm text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-white/25",
    invalid
      ? "border-accent-hover/70"
      : "border-white/8 focus:border-accent-bright focus:shadow-[0_0_0_4px_rgba(34,179,215,0.12)]",
  );
}
