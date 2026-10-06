"use client";

import { oeffnungszeitenHinweis } from "@/data/betrieb";
import { gruppierteZeiten, jetztInDeutschland, oeffnungsstatus } from "@/lib/oeffnungszeiten";
import { useBrowserWert } from "@/lib/useBrowserWert";

// Status als primitiver Schlüssel "tag|offen|text", damit React Änderungen erkennt
const lesen = () => {
  const s = oeffnungsstatus();
  return s ? `${jetztInDeutschland().tag}|${s.offen ? 1 : 0}|${s.text}` : null;
};

/** Aktueller Öffnungsstatus: erst im Browser berechnet und jede Minute aktualisiert. */
function useStatus() {
  const wert = useBrowserWert(lesen, null, 60_000);
  if (!wert) return { heute: null, offen: false, text: null };
  const [tag, offen, text] = wert.split("|");
  return { heute: Number(tag), offen: offen === "1", text };
}

const gruppen = gruppierteZeiten();

/** Öffnungszeiten, gruppiert nach gleichen Zeiten; der heutige Tag ist hervorgehoben. */
export function OeffnungszeitenListe() {
  const { heute, offen, text } = useStatus();
  return (
    <>
      <p className="label">
        Öffnungszeiten Gaststätte
        {text && (
          <>
            {", "}
            <span className={`hours-status${offen ? " is-open" : ""}`} aria-live="polite">
              {text}
            </span>
          </>
        )}
      </p>
      <dl className="hours">
        {gruppen.map((g) => (
          <div key={g.tage} className={heute && g.tagNummern.includes(heute) ? "is-today" : undefined}>
            <dt>{g.tage}</dt>
            <dd>{g.zeiten}</dd>
          </div>
        ))}
      </dl>
      <p className="note">{oeffnungszeitenHinweis}</p>
    </>
  );
}
