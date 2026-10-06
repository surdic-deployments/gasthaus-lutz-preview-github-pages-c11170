import Link from "next/link";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { betrieb } from "@/data/betrieb";

export default function NichtGefunden() {
  return (
    <>
      <SiteHeader solid />
      <main id="inhalt" className="container not-found">
        <h1 className="h2">Diese Seite gibt es bei uns nicht.</h1>
        <p className="lead">
          Vielleicht hat sich die Adresse geändert. Auf der Startseite finden Sie Gasthaus, Pension, Biergarten und alle Kontaktdaten.
        </p>
        <div className="actions">
          <Link className="btn btn--primary" href="/">Zur Startseite</Link>
          <a className="btn btn--outline" href={`tel:${betrieb.telefonLink}`}>Anrufen</a>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
