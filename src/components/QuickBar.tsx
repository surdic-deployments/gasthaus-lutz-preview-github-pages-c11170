"use client";

import { Bed, MapPin, Phone } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { RouteLink } from "@/components/RouteLink";
import { betrieb } from "@/data/betrieb";

/** Mobile Schnellaktionen: sichtbar, sobald der Hero verlassen ist; am Seitenende (Footer) ausgeblendet. */
export function QuickBar() {
  const [heroSichtbar, setHeroSichtbar] = useState(true);
  const [footerSichtbar, setFooterSichtbar] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("start");
    const footer = document.querySelector("footer");
    const io = new IntersectionObserver(
      (eintraege) => {
        eintraege.forEach((e) => {
          if (e.target === hero) setHeroSichtbar(e.isIntersecting);
          if (e.target === footer) setFooterSichtbar(e.isIntersecting);
        });
      },
      { rootMargin: "0px 0px -40% 0px" },
    );
    if (hero) io.observe(hero);
    if (footer) io.observe(footer);
    return () => io.disconnect();
  }, []);

  const sichtbar = !heroSichtbar && !footerSichtbar;

  return (
    <nav className={`quickbar${sichtbar ? " is-visible" : ""}`} aria-label="Schnellaktionen" aria-hidden={!sichtbar} inert={!sichtbar}>
      <a href={`tel:${betrieb.telefonLink}`}>
        <Phone size={18} aria-hidden="true" />
        Anrufen
      </a>
      <Link href="/#zimmer-anfrage" className="quickbar__main">
        <Bed size={18} aria-hidden="true" />
        Zimmer anfragen
      </Link>
      <RouteLink>
        <MapPin size={18} aria-hidden="true" />
        Route
      </RouteLink>
    </nav>
  );
}
