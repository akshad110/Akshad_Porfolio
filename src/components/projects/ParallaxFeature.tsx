"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

type Item = {
  id: string;
  title: string;
  description: string;
  href: string;
  meta: string;
  image?: string;
  index: number;
  reverse?: boolean;
};

export function ParallaxFeature({ items }: { items: Item[] }) {
  const refs = useRef<Array<HTMLElement | null>>([]);

  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      refs.current.forEach((section) => {
        if (!section) return;
        const image = section.querySelector("[data-image]");
        const copy = section.querySelector("[data-copy]");
        if (!image || !copy) return;

        const tween = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "center 35%",
            scrub: 0.7,
          },
        });
        tween.fromTo(
          image,
          { clipPath: "inset(0 100% 0 0)", opacity: 0.2 },
          { clipPath: "inset(0 0% 0 0)", opacity: 1, ease: "none" },
        );
        tween.fromTo(copy, { y: 48, opacity: 0.2 }, { y: 0, opacity: 1, ease: "none" }, 0);
      });
    });

    return () => ctx.revert();
  }, [items]);

  return (
    <div className="space-y-8">
      {items.map((item, index) => (
        <article
          key={item.id}
          ref={(node) => {
            refs.current[index] = node;
          }}
          className={`grid items-center gap-10 py-10 md:grid-cols-2 ${item.reverse ? "md:[&>*:first-child]:order-2" : ""}`}
        >
          <div data-copy>
            <p className="section-kicker">0{index + 1}</p>
            <h3 className="font-heading mt-3 text-4xl md:text-6xl">{item.title}</h3>
            <p className="mt-5 max-w-md text-lg text-foreground-secondary italic">{item.description}</p>
            <p className="mt-4 text-sm text-muted">{item.meta}</p>
            <Link
              href={item.href}
              className="mt-6 inline-block font-heading text-sm tracking-[0.16em] uppercase hover:text-accent-hover"
            >
              Explore Project →
            </Link>
          </div>
          <div data-image className="relative overflow-hidden rounded-lg bg-blue-slate-200">
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.image} alt="" className="aspect-[4/3] w-full object-cover" />
            ) : (
              <div className="flex aspect-[4/3] items-end p-8">
                <span className="font-heading text-7xl text-white/20">0{index + 1}</span>
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
