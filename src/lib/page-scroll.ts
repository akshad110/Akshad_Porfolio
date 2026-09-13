"use client";

import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;
let lockCount = 0;

export function registerLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

export function lockPageScroll() {
  lockCount += 1;
  if (lockCount === 1) {
    lenisInstance?.stop();
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }
}

export function unlockPageScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    lenisInstance?.start();
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }
}

export function scrollToTop() {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { duration: 1.15 });
    return;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}
