"use client";

import { CaretLeft, CaretRight, X } from "@phosphor-icons/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { galerie, kategorien, type Kategorie } from "@/data/betrieb";

/** Galerie mit Filtern (nur Kategorien mit Bildern) und Vollbild-Lightbox. */
export function Galerie() {
  const [filter, setFilter] = useState<Kategorie | "alle">("alle");
  const [index, setIndex] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);

  const genutzt = kategorien.filter((k) => galerie.some((g) => g.kategorie === k.id));
  const sichtbar = galerie.filter((g) => filter === "alle" || g.kategorie === filter);
  const aktuell = sichtbar[index];

  const zeige = (i: number) => setIndex((i + sichtbar.length) % sichtbar.length);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const tasten = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + sichtbar.length) % sichtbar.length);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % sichtbar.length);
    };
    d.addEventListener("keydown", tasten);
    return () => d.removeEventListener("keydown", tasten);
  }, [sichtbar.length]);

  return (
    <>
      {genutzt.length > 1 && (
        <div className="filters" role="group" aria-label="Galerie filtern">
          {[{ id: "alle" as const, label: "Alle" }, ...genutzt].map((k) => (
            <button key={k.id} type="button" aria-pressed={filter === k.id} onClick={() => setFilter(k.id)}>
              {k.label}
            </button>
          ))}
        </div>
      )}

      <ul className="gallery">
        {sichtbar.map(({ bild }, i) => (
          <li key={`${filter}-${bild.titel}`} style={{ "--i": i } as React.CSSProperties}>
            <button
              type="button"
              className="gallery__btn"
              aria-label={`Bild vergrößern: ${bild.alt}`}
              onClick={() => {
                setIndex(i);
                dialog.current?.showModal();
              }}
            >
              <Image src={bild.src} alt="" fill sizes="(min-width: 760px) 33vw, 50vw" placeholder="blur" />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        className="lightbox"
        aria-label="Bildansicht"
        onClick={(e) => {
          const ziel = e.target as HTMLElement;
          if (ziel === dialog.current || ziel.classList.contains("lightbox__figure")) dialog.current?.close();
        }}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) zeige(index + (dx < 0 ? 1 : -1));
          touchX.current = null;
        }}
      >
        {aktuell && (
          <figure className="lightbox__figure">
            <Image
              key={aktuell.bild.titel}
              className="lightbox__img"
              src={aktuell.bild.src}
              alt={aktuell.bild.alt}
              sizes="92vw"
            />
            <figcaption className="lightbox__caption">
              {aktuell.bild.alt} · Foto: {aktuell.bild.autor}, {aktuell.bild.lizenz}
            </figcaption>
          </figure>
        )}
        <button className="lightbox__btn lightbox__close" type="button" aria-label="Schließen" onClick={() => dialog.current?.close()}>
          <X size={22} aria-hidden="true" />
        </button>
        <button className="lightbox__btn lightbox__prev" type="button" aria-label="Vorheriges Bild" onClick={() => zeige(index - 1)}>
          <CaretLeft size={22} aria-hidden="true" />
        </button>
        <button className="lightbox__btn lightbox__next" type="button" aria-label="Nächstes Bild" onClick={() => zeige(index + 1)}>
          <CaretRight size={22} aria-hidden="true" />
        </button>
        <p className="lightbox__count">
          {index + 1} / {sichtbar.length}
        </p>
      </dialog>
    </>
  );
}
