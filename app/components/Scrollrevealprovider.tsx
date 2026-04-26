"use client";

import { useEffect } from "react";

/**
 * ScrollRevealProvider — THE FIX for the blank page.
 *
 * Root cause: globals.css sets .reveal { opacity: 0 }
 * but nothing was ever adding ".visible" to those elements.
 *
 * This component runs ONE global IntersectionObserver on the entire
 * document body. No per-component refs needed. Just put class="reveal"
 * on any element and it fades in automatically when scrolled into view.
 *
 * Place it inside <body> in layout.tsx.
 */
export function ScrollRevealProvider() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -30px 0px" }
    );

    const observe = () => {
      document.querySelectorAll<HTMLElement>(".reveal:not(.visible)").forEach((el) =>
        io.observe(el)
      );
    };

    observe();

    // Watch for elements added dynamically by React
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}