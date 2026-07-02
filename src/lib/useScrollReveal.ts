"use client";
import { useCallback, useRef } from "react";

/**
 * Scroll-reveal via IntersectionObserver.
 *
 * Attach the returned ref to a container; when it enters the viewport it
 * gains `.is-visible`. Pair with the `.reveal` utilities in globals.css:
 * either on the container itself, or on children for staggered entrances
 * (stagger via `--reveal-delay` inline style).
 *
 * Implemented as a callback ref so it also works for elements that mount
 * later than the component (e.g. after a responsive mode switch).
 *
 * Falls back to instantly visible when the user prefers reduced motion or
 * IntersectionObserver is unavailable.
 */
export default function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options?: { threshold?: number; rootMargin?: string }
) {
  const cleanup = useRef<(() => void) | null>(null);
  // Options are read once (first render) — reveal thresholds never change at runtime
  const opts = useRef(options);

  return useCallback((el: T | null) => {
    cleanup.current?.();
    cleanup.current = null;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      el.classList.add("is-visible");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      {
        threshold: opts.current?.threshold ?? 0.12,
        rootMargin: opts.current?.rootMargin ?? "0px 0px -8% 0px",
      }
    );
    io.observe(el);
    cleanup.current = () => io.disconnect();
  }, []);
}
