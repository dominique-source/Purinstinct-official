"use client";
import { useEffect, useRef } from "react";

/**
 * Scroll-reveal via IntersectionObserver.
 *
 * Attach the returned ref to a container; when it enters the viewport it
 * gains `.is-visible`. Pair with the `.reveal` utilities in globals.css:
 * either on the container itself, or on children for staggered entrances
 * (stagger via `--reveal-delay` inline style).
 *
 * Falls back to instantly visible when the user prefers reduced motion or
 * IntersectionObserver is unavailable.
 */
export default function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options?: { threshold?: number; rootMargin?: string }
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
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
        threshold: options?.threshold ?? 0.12,
        rootMargin: options?.rootMargin ?? "0px 0px -8% 0px",
      }
    );
    io.observe(el);
    return () => io.disconnect();
    // options is intentionally read once — reveal runs a single time per mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
