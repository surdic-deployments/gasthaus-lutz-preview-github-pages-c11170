"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Blendet Elemente mit der Klasse `reveal` beim Scrollen dezent ein.
 * Ohne JavaScript und bei „Bewegung reduzieren“ bleibt alles sofort sichtbar.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const elemente = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)"));
    const reduziert = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduziert || !("IntersectionObserver" in window)) {
      elemente.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    // Bereits sichtbare Elemente sofort zeigen, damit nichts aufblitzt
    elemente.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-visible");
    });
    document.documentElement.classList.add("reveal-ready");

    const io = new IntersectionObserver(
      (eintraege) => {
        eintraege.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    elemente.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
