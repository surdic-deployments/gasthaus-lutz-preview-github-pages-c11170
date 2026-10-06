"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { betrieb, navigation } from "@/data/betrieb";

/** Sticky-Navigation: transparent über dem Hero, beim Scrollen kompakt; mobil als Vollbild-Menü. */
export function SiteHeader({ solid = false }: { solid?: boolean }) {
  const [gescrollt, setGescrollt] = useState(false);
  const [offen, setOffen] = useState(false);
  const [aktiv, setAktiv] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menueRef = useRef<HTMLDivElement>(null);

  // Kompakter Header, sobald die Marke 40px unter dem Seitenanfang aus dem Bild ist (ohne Scroll-Listener)
  const markeRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const marke = markeRef.current;
    if (!marke) return;
    const io = new IntersectionObserver(([e]) => setGescrollt(!e.isIntersecting));
    io.observe(marke);
    return () => io.disconnect();
  }, []);

  // Aktiven Menüpunkt anhand des sichtbaren Abschnitts markieren
  useEffect(() => {
    if (solid) return;
    const zuordnung: [string, string][] = [
      ["start", "start"], ["gasthaus", "gasthaus"], ["pension", "pension"], ["biergarten", "biergarten"],
      ["veranstaltungen", "veranstaltungen"], ["galerie", "veranstaltungen"], ["umgebung", "umgebung"], ["kontakt", "kontakt"],
    ];
    const io = new IntersectionObserver(
      (eintraege) => {
        eintraege.forEach((e) => {
          if (e.isIntersecting) setAktiv(zuordnung.find(([id]) => id === e.target.id)?.[1] ?? null);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    zuordnung.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [solid]);

  // Menü öffnen/schließen inkl. Fokusführung, Escape und Scroll-Sperre
  useEffect(() => {
    document.body.classList.toggle("menu-open", offen);
    if (offen) {
      const t = setTimeout(() => menueRef.current?.querySelector("a")?.focus({ preventScroll: true }), 60);
      const tasten = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOffen(false);
        if (e.key === "Tab" && menueRef.current && toggleRef.current) {
          const ziele = [toggleRef.current, ...Array.from(menueRef.current.querySelectorAll<HTMLElement>("a"))];
          const i = ziele.indexOf(document.activeElement as HTMLElement);
          if (e.shiftKey && i <= 0) { e.preventDefault(); ziele[ziele.length - 1].focus(); }
          else if (!e.shiftKey && i === ziele.length - 1) { e.preventDefault(); ziele[0].focus(); }
        }
      };
      document.addEventListener("keydown", tasten);
      return () => { clearTimeout(t); document.removeEventListener("keydown", tasten); };
    }
  }, [offen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1141px)");
    const zu = () => mq.matches && setOffen(false);
    mq.addEventListener("change", zu);
    return () => mq.removeEventListener("change", zu);
  }, []);

  const schliessen = () => {
    setOffen(false);
    toggleRef.current?.focus({ preventScroll: true });
  };

  return (
    <>
      <span ref={markeRef} className="scroll-marke" aria-hidden="true" />
      <header
        className={`site-header${solid ? " site-header--solid" : ""}${gescrollt && !solid ? " is-scrolled" : ""}`}
      >
        <div className="site-header__inner">
          <Link className="brand" href="/#start" aria-label="Gasthaus Lutz, zur Startseite">
            <span className="brand__name" translate="no">Gasthaus Lutz</span>
            <span className="brand__meta">Pension und Biergarten in Bonnhof</span>
          </Link>

          <nav className="nav" aria-label="Hauptnavigation">
            <ul className="nav__list">
              {navigation.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="nav__link"
                    aria-current={aktiv && n.href.endsWith(`#${aktiv}`) ? "true" : undefined}
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link className="btn btn--primary btn--sm header-cta" href="/#zimmer-anfrage">
            Zimmer anfragen
          </Link>

          <button
            ref={toggleRef}
            className="menu-toggle"
            type="button"
            aria-expanded={offen}
            aria-controls="mobile-menu"
            onClick={() => setOffen((o) => !o)}
          >
            <span className="menu-toggle__label">{offen ? "Schließen" : "Menü"}</span>
            <span className="menu-toggle__icon" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>

      <div
        ref={menueRef}
        className={`mobile-menu${offen ? " is-open" : ""}`}
        id="mobile-menu"
        aria-hidden={!offen}
      >
        <nav aria-label="Mobile Navigation">
          <ul className="mobile-menu__list">
            {navigation.map((n) => (
              <li key={n.href}>
                <Link href={n.href} onClick={schliessen}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mobile-menu__foot">
          <Link className="btn btn--light btn--block" href="/#zimmer-anfrage" onClick={schliessen}>
            Zimmer anfragen
          </Link>
          <a className="btn btn--ghost-light btn--block" href={`tel:${betrieb.telefonLink}`}>
            {betrieb.telefon} anrufen
          </a>
          <p className="mobile-menu__addr">
            {betrieb.strasse}, {betrieb.plz} {betrieb.ort}-{betrieb.ortsteil}
          </p>
        </div>
      </div>
    </>
  );
}
