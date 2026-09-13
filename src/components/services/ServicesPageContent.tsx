import { ArrowDown, ArrowUpRight } from "lucide-react";
import { processSteps, services, site } from "@/data/site";
import { Button } from "@/components/ui/Button";

const MARQUEE_PRIMARY = [
  "FULL STACK",
  "FRONTEND",
  "BACKEND",
  "E-COMMERCE",
  "INTERACTIVE",
  "CI/CD",
];

const MARQUEE_SECONDARY = processSteps.map((step) => step.title.toUpperCase());

export function ServicesPageContent() {
  return (
    <div className="overflow-x-hidden">
      <section className="flex min-h-[55dvh] flex-col bg-black text-white sm:min-h-[70dvh]">
        <div className="flex flex-1 items-center justify-center px-4 pt-24 pb-8 sm:px-5">
          <h1 className="font-heading text-center text-[clamp(2.5rem,12vw,9vw)] leading-[0.85] font-bold tracking-[-0.04em] uppercase">
            Services
          </h1>
        </div>
        <div className="grid items-center gap-6 border-t-2 border-white/25 px-5 py-6 sm:px-8 md:grid-cols-3 md:px-10">
          <p className="font-heading text-center text-[11px] tracking-[-0.02em] text-white/80 uppercase md:text-left">
            Based in {site.location}
          </p>
          <div className="flex justify-center">
            <ScrollRing />
          </div>
          <p className="font-heading text-center text-[11px] leading-relaxed tracking-[-0.02em] text-white/80 uppercase md:text-right">
            {site.role}
            <br />
            1.5+ years freelance
          </p>
        </div>
      </section>

      <section className="overflow-hidden bg-background py-16">
        <div className="origin-center -skew-y-2">
          <div className="overflow-hidden">
            <p className="marquee font-heading flex w-max gap-[0.4em] text-[10vw] leading-none font-bold tracking-[-0.04em] text-accent-bright uppercase">
              {[...MARQUEE_PRIMARY, ...MARQUEE_PRIMARY].map((word, index) => (
                <span key={`${word}-${index}`} className="flex items-center gap-[0.4em]">
                  {word}
                  <span aria-hidden className="text-white">•</span>
                </span>
              ))}
            </p>
          </div>
          <div className="mt-2 overflow-hidden">
            <p className="marquee-reverse font-heading flex w-max gap-[0.4em] text-[10vw] leading-none font-bold tracking-[-0.04em] text-white/80 uppercase">
              {[...MARQUEE_SECONDARY, ...MARQUEE_SECONDARY, ...MARQUEE_SECONDARY, ...MARQUEE_SECONDARY].map(
                (word, index) => (
                  <span key={`${word}-${index}`} className="flex items-center gap-[0.4em]">
                    {word}
                    <span aria-hidden className="text-white/50">•</span>
                  </span>
                ),
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-background px-4 pb-8 sm:px-8 lg:px-10">
        <ul>
          {services.map((service, index) => (
            <li key={service.title} className="group border-t border-white/20 last:border-b">
              <a
                href="/contact"
                className="grid gap-3 py-6 transition-colors duration-300 hover:bg-white/5 sm:gap-4 sm:py-8 md:grid-cols-[88px_1fr_auto] md:items-center md:py-10"
              >
                <p className="font-heading text-sm tracking-[-0.02em] text-white/50">
                  ({String(index + 1).padStart(2, "0")})
                </p>
                <div>
                  <h2 className="font-heading text-[clamp(1.45rem,7vw,4.5rem)] leading-[0.95] font-bold tracking-[-0.04em] uppercase transition-transform duration-300 md:group-hover:translate-x-4">
                    {service.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55">{service.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {service.deliverables.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/20 px-3 py-1 font-heading text-[10px] tracking-[-0.02em] text-white/70 uppercase"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowUpRight className="hidden h-16 w-16 text-white opacity-0 transition-all duration-300 group-hover:rotate-45 group-hover:opacity-100 md:block" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-white/20 bg-background px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-8 md:grid-cols-4">
          {processSteps.map((step, index) => (
            <article key={step.title}>
              <p className="font-heading text-sm text-white/50">({String(index + 1).padStart(2, "0")})</p>
              <h3 className="font-heading mt-3 text-3xl font-bold tracking-[-0.04em] uppercase">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{step.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-14">
          <Button href="/contact">Hire Me</Button>
        </div>
      </section>
    </div>
  );
}

function ScrollRing() {
  const label = "SCROLL DOWN • ".repeat(3);

  return (
    <div className="relative size-[7.5rem] rounded-full border-2 border-white/70 text-white md:size-36">
      <svg viewBox="0 0 144 144" className="services-scroll-spin size-full" aria-hidden>
        <defs>
          <path id="services-scroll-path" d="M 72,72 m -54,0 a 54,54 0 1,1 108,0 a 54,54 0 1,1 -108,0" />
        </defs>
        <text fill="currentColor" fontSize="9" fontWeight="700" letterSpacing="1.4">
          <textPath href="#services-scroll-path">{label}</textPath>
        </text>
      </svg>
      <ArrowDown className="absolute inset-0 m-auto h-5 w-5" />
    </div>
  );
}
