"use client";

import { useId, useRef, useState } from "react";

export type Tab = { id: string; label: string; inhalt: React.ReactNode };

/** Barrierefreie Tabs (Pfeiltasten links/rechts), Inhalte werden serverseitig gerendert übergeben. */
export function Tabs({
  tabs,
  label,
  klein = false,
  panelClassName,
}: {
  tabs: Tab[];
  label: string;
  klein?: boolean;
  panelClassName: string;
}) {
  const [aktiv, setAktiv] = useState(tabs[0]?.id);
  const basis = useId();
  const knoepfe = useRef<(HTMLButtonElement | null)[]>([]);

  function tasten(e: React.KeyboardEvent, i: number) {
    const schritt = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!schritt) return;
    e.preventDefault();
    const n = (i + schritt + tabs.length) % tabs.length;
    setAktiv(tabs[n].id);
    knoepfe.current[n]?.focus();
  }

  return (
    <>
      <div className={`tabs__list${klein ? " tabs__list--small" : ""}`} role="tablist" aria-label={label}>
        {tabs.map((t, i) => {
          const an = t.id === aktiv;
          return (
            <button
              key={t.id}
              ref={(el) => {
                knoepfe.current[i] = el;
              }}
              type="button"
              role="tab"
              className="tabs__tab"
              id={`${basis}-t-${t.id}`}
              aria-controls={`${basis}-p-${t.id}`}
              aria-selected={an}
              tabIndex={an ? 0 : -1}
              onClick={() => setAktiv(t.id)}
              onKeyDown={(e) => tasten(e, i)}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          className={panelClassName}
          role="tabpanel"
          id={`${basis}-p-${t.id}`}
          aria-labelledby={`${basis}-t-${t.id}`}
          hidden={t.id !== aktiv}
        >
          {t.inhalt}
        </div>
      ))}
    </>
  );
}
