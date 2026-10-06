import type { Metadata } from "next";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { betrieb, bilder, lizenzLinks } from "@/data/betrieb";

export const metadata: Metadata = {
  title: "Impressum",
  alternates: { canonical: "/impressum" },
  robots: { index: false, follow: true },
};

export default function Impressum() {
  return (
    <>
      <SiteHeader solid />
      <main id="inhalt" className="container legal">
        <h1>Impressum</h1>

        <h2>Angaben gemäß § 5 DDG</h2>
        <p>
          {betrieb.inhaber}<br />{betrieb.name}<br />{betrieb.strasse}<br />
          {betrieb.plz} {betrieb.ort} / {betrieb.ortsteil}
        </p>

        <h2>Kontakt</h2>
        <p>
          Telefon: <a href={`tel:${betrieb.telefonLink}`}>{betrieb.telefon}</a><br />
          E-Mail: <a href={`mailto:${betrieb.email}`}>{betrieb.email}</a>
        </p>
        <span className="placeholder">
          <strong>Vom Betreiber zu ergänzen bzw. zu prüfen:</strong> ggf. Umsatzsteuer-Identifikationsnummer nach § 27a UStG, zuständige
          Aufsichtsbehörde (Gaststättenerlaubnis), Angaben zur Verbraucherstreitbeilegung. Diese Angaben waren auf der bisherigen Website
          nicht enthalten.
        </span>

        <h2>Inhaltlich verantwortlich</h2>
        <p>{betrieb.inhaber}, Anschrift wie oben</p>

        <h2 id="bildnachweis">Bildnachweis</h2>
        <p>
          Die Fotos auf dieser Website stammen von Wikimedia Commons und stehen unter freien Creative-Commons-Lizenzen. Sie zeigen Bonnhof,
          Heilsbronn und typische fränkische Motive. Speisen-, Biergarten- und Festbilder sind Symbolbilder und zeigen nicht unser Haus.
        </p>
        <ul className="credits">
          {Object.values(bilder).map((b) => (
            <li key={b.titel}>
              „{b.titel}“, Foto: {b.autor},{" "}
              <a href={b.quelle} target="_blank" rel="noopener">Wikimedia Commons</a>, Lizenz{" "}
              <a href={lizenzLinks[b.lizenz]} target="_blank" rel="noopener">{b.lizenz}</a>
              {b.symbolbild ? " (Symbolbild)" : ""}. Bearbeitet (Ausschnitt, Farbanpassung, Größe).
            </li>
          ))}
        </ul>
        <p>Bearbeitete Fassungen der unter CC BY-SA stehenden Bilder stehen unter derselben Lizenz.</p>
      </main>
      <SiteFooter />
    </>
  );
}
