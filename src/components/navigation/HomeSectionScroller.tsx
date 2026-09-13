"use client";

import { useEffect } from "react";

const KEY = "portfolio-scroll-section";

export function queueHomeSection(sectionId: string) {
  try {
    sessionStorage.setItem(KEY, sectionId);
  } catch {
    // ignore
  }
}

export function HomeSectionScroller() {
  useEffect(() => {
    let sectionId = "";
    try {
      sectionId = sessionStorage.getItem(KEY) || "";
      if (sectionId) sessionStorage.removeItem(KEY);
    } catch {
      return;
    }
    if (!sectionId) return;

    const run = () => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const timer = window.setTimeout(run, 80);
    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
