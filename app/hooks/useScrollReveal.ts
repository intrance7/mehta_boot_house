"use client";

import { useEffect, useRef } from "react";

/**
 * useScrollReveal
 * Attaches an IntersectionObserver to a container ref.
 * Any child element with class "reveal" gets class "visible"
 * when it enters the viewport — triggering the CSS transition
 * defined in globals.css.
 *
 * Usage:
 *   const ref = useScrollReveal();
 *   <section ref={ref} className="reveal-group">
 *     <div className="reveal">...</div>
 *     <div className="reveal">...</div>
 *   </section>
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.12
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            // Once revealed, stop observing (fire once)
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    const targets = container.querySelectorAll<HTMLElement>(".reveal");
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}

/**
 * useRevealSelf
 * Reveals the element itself (not its children).
 */
export function useRevealSelf<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.12
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.classList.add("reveal");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}