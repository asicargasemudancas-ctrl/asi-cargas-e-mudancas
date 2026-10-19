"use client";

import { useSyncExternalStore } from "react";

function subscribeScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  window.addEventListener("resize", callback);
  return () => {
    window.removeEventListener("scroll", callback);
    window.removeEventListener("resize", callback);
  };
}

// Lê um valor derivado do scroll sem setState em efeito; no servidor usa o fallback.
export function useScrollState<T extends string | number | boolean>(read: () => T, fallback: T) {
  return useSyncExternalStore(subscribeScroll, read, () => fallback);
}

const reducedQuery = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void) {
  const media = window.matchMedia(reducedQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(reducedQuery).matches,
    () => false,
  );
}
