import type { Metadata } from "next";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { betrieb } from "@/data/betrieb";

export const metadata: Metadata = {
  title: "Datenschutz",
  alternates: { canonical: "/datenschutz" },
  robots: { index: false, follow: true },
};

export default function Datenschutz() {
  return (
    <>
      <SiteHeader solid />
      <main id="inhalt" className="container legal">
        <h1>Datenschutzerklärung</h1>
        <span className="placeholder">
          <strong>Hinweis für den Betreiber:</strong> Dieses Dokument beschreibt den technischen Stand dieser Website und ersetzt keine
          rechtliche Prüfung. Bitte vor Veröffentlichung vollständig ausarbeiten lassen und die Angaben zum Hoster ergänzen.
        </span>

        <h2>1. Verantwortlicher</h2>
        <p>
          {betrieb.inhaber}, {betrieb.strasse}, {betrieb.plz} {betrieb.ort}<br />
          Telefon: {betrieb.telefon} · E-Mail: {betrieb.email}
        </p>

        <h2>2. Hosting und Server-Logfiles</h2>
        <span className="placeholder">Name und Anschrift des Hosting-Anbieters (z. B. Vercel), Art und Speicherdauer der Server-Logfiles ergänzen.</span>

        <h2>3. Keine Cookies, keine Tracking-Dienste</h2>
        <p>
          Diese Website setzt keine Cookies und verwendet keine Analyse- oder Tracking-Dienste. Schriftarten werden vom eigenen Server
          geladen; es findet keine Verbindung zu Google Fonts statt.
        </p>

        <h2>4. Anfrageformulare und Kontakt per E-Mail</h2>
        <p>
          Die Formulare für Zimmer- und Kontaktanfragen öffnen eine vorausgefüllte E-Mail in Ihrem E-Mail-Programm. Die Daten werden erst
          übertragen, wenn Sie diese E-Mail selbst absenden. Wir verwenden Ihre Angaben ausschließlich zur Bearbeitung Ihrer Anfrage
          (Art. 6 Abs. 1 lit. b DSGVO).
        </p>
        <span className="placeholder">
          Falls später ein Formular-Dienst eingesetzt wird (Umgebungsvariable <code>NEXT_PUBLIC_FORM_ENDPOINT</code>), ist dieser Abschnitt
          anzupassen.
        </span>

        <h2 id="karte">5. Kartendarstellung (OpenStreetMap)</h2>
        <p>
          Die interaktive Karte wird erst geladen, wenn Sie auf „Karte anzeigen“ klicken. Erst dann wird Ihre IP-Adresse an die
          OpenStreetMap Foundation, St John’s Innovation Centre, Cowley Road, Cambridge, CB4 0WS, Vereinigtes Königreich, übermittelt.
          Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).
        </p>

        <h2>6. Externe Links</h2>
        <p>
          Links zu Facebook, Google Maps, Apple Karten und Wikimedia Commons sind einfache Verweise. Daten werden erst übertragen, wenn Sie
          den Link anklicken.
        </p>

        <h2>7. Ihre Rechte</h2>
        <p>
          Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit, Widerspruch sowie
          auf Beschwerde bei einer Aufsichtsbehörde (in Bayern: Bayerisches Landesamt für Datenschutzaufsicht, Ansbach).
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
