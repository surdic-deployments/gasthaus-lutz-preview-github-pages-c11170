/**
 * ZENTRALE BETRIEBSDATEN
 * ------------------------------------------------------------------
 * Alle veränderlichen Angaben werden ausschließlich hier gepflegt:
 * Kontakt, Öffnungszeiten, Links, Galerie und Bildnachweise.
 * Daraus entstehen Öffnungszeiten-Tabelle, „Jetzt geöffnet“-Anzeige,
 * strukturierte Daten (Schema.org), Sitemap und Galerie.
 *
 * Quelle aller Angaben: bisherige Website des Betriebs.
 * Felder mit `null` sind bewusst leer, weil die Information dort fehlte.
 */
import type { StaticImageData } from "next/image";

import schaeufele from "@/assets/img/schaeufele.webp";
import karpfen from "@/assets/img/karpfen.webp";
import bratwurst from "@/assets/img/bratwurst.webp";
import heroBiergarten from "@/assets/img/hero-biergarten.webp";
import biergartenBaeume from "@/assets/img/biergarten-baeume.webp";
import kirchweih from "@/assets/img/kirchweih.webp";
import kellerhaus from "@/assets/img/kellerhaus-bonnhof.webp";
import dorfstrasse from "@/assets/img/bonnhof-dorfstrasse.webp";
import muenster from "@/assets/img/muenster-heilsbronn.webp";
import weide from "@/assets/img/bonnhof-weide.webp";
import jakobsweg from "@/assets/img/jakobsweg.webp";
import jakobswegWald from "@/assets/img/jakobsweg-wald.webp";
import schaeufeleKloss from "@/assets/img/schaeufele-kloss.webp";

export const betrieb = {
  name: "Gasthaus Pension Biergarten Lutz",
  inhaber: "Dieter Lutz",
  gruendungsjahr: 1907, // „Ein fränkisches Gasthaus von 1907, in dritter Familiengeneration“
  // Produktiv-Domain - bei Umzug hier anpassen (Canonical, Sitemap, Open Graph, JSON-LD)
  url: "https://xn--fremdenzimmer-pension-bernachtung-lutz-heilsbronn-1cf.de",
  telefon: "09872 / 2366",
  telefonLink: "+4998722366",
  email: "dieter.lutz@gmx.de",
  strasse: "Bürgleiner Straße 23",
  plz: "91560",
  ort: "Heilsbronn",
  ortsteil: "Bonnhof",
  region: "Bayern",
  // Koordinaten laut OpenStreetMap (Eintrag „Gasthaus Lutz“ / „Pension Lutz“)
  lat: 49.36031,
  lng: 10.78925,
  facebook: "https://www.facebook.com/pension.lutz.de",
} as const;

export const adresseEinzeilig = `${betrieb.strasse}, ${betrieb.plz} ${betrieb.ort} / ${betrieb.ortsteil}`;

const ziel = encodeURIComponent(`${betrieb.strasse}, ${betrieb.plz} ${betrieb.ort}`);
export const routeUrl = `https://www.google.com/maps/dir/?api=1&destination=${ziel}`;
export const routeUrlApple = `https://maps.apple.com/?daddr=${ziel}&dirflg=d`;
export const osmUrl = `https://www.openstreetmap.org/?mlat=${betrieb.lat}&mlon=${betrieb.lng}#map=17/${betrieb.lat}/${betrieb.lng}`;

/**
 * ÖFFNUNGSZEITEN GASTSTÄTTE
 * tag: 1 = Montag … 7 = Sonntag · Zeiten "HH:MM" · leeres Array = Ruhetag
 * Stand laut alter Website: Di-Sa 16-22 Uhr, So 11-14 und 16-21 Uhr.
 */
export type Oeffnungstag = { tag: number; name: string; zeiten: [string, string][] };

export const oeffnungszeiten: Oeffnungstag[] = [
  { tag: 1, name: "Montag", zeiten: [] },
  { tag: 2, name: "Dienstag", zeiten: [["16:00", "22:00"]] },
  { tag: 3, name: "Mittwoch", zeiten: [["16:00", "22:00"]] },
  { tag: 4, name: "Donnerstag", zeiten: [["16:00", "22:00"]] },
  { tag: 5, name: "Freitag", zeiten: [["16:00", "22:00"]] },
  { tag: 6, name: "Samstag", zeiten: [["16:00", "22:00"]] },
  { tag: 7, name: "Sonntag", zeiten: [["11:00", "14:00"], ["16:00", "21:00"]] },
];
export const oeffnungszeitenHinweis = "Anreisetermine für Übernachtungsgäste bitte gesondert vereinbaren.";

/** Speisekarte: Pfad (z. B. "/speisekarte.pdf" in /public) eintragen, dann erscheint der Button. */
export const speisekarteUrl: string | null = null;

/**
 * Anfrageformulare
 * null → „Anfrage senden“ öffnet eine vorausgefüllte E-Mail.
 * URL  → Formular wird per POST (FormData) an diesen Dienst gesendet.
 */
export const formularEndpunkt: string | null = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? null;

/* ------------------------------------------------------------------
   Bilder & Bildnachweis
   Alle Fotos: Wikimedia Commons, Creative-Commons-Lizenzen.
   `symbolbild: true` = zeigt NICHT das Gasthaus Lutz.
   ------------------------------------------------------------------ */
export type Lizenz = "CC BY 3.0" | "CC BY-SA 3.0" | "CC BY-SA 4.0";
export const lizenzLinks: Record<Lizenz, string> = {
  "CC BY 3.0": "https://creativecommons.org/licenses/by/3.0/deed.de",
  "CC BY-SA 3.0": "https://creativecommons.org/licenses/by-sa/3.0/deed.de",
  "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/deed.de",
};

export type Bild = {
  src: StaticImageData;
  alt: string;
  titel: string;
  autor: string;
  lizenz: Lizenz;
  quelle: string;
  symbolbild: boolean;
};

const commons = (datei: string) => `https://commons.wikimedia.org/wiki/File:${datei.replace(/ /g, "_")}`;

export const bilder = {
  heroBiergarten: { src: heroBiergarten, alt: "Sonniger Biergarten mit Holzstühlen und Tischen vor einem Fachwerkhaus", titel: "Neudrossenfeld Bräuwerck Biergarten", autor: "Benreis", lizenz: "CC BY 3.0", quelle: commons("Neudrossenfeld Bräuwerck Biergarten.JPG"), symbolbild: true },
  biergartenBaeume: { src: biergartenBaeume, alt: "Biergarten unter grünen Bäumen mit Bierbänken", titel: "Klosterbrauerei Biergarten", autor: "Benreis", lizenz: "CC BY-SA 3.0", quelle: commons("Klosterbrauerei Biergarten.JPG"), symbolbild: true },
  kellerhaus: { src: kellerhaus, alt: "Altes Kellerhaus aus Sandstein mit Holztor in Bonnhof", titel: "Kellerhaus, Bonnhof (Heilsbronn)", autor: "Peidakiwi17", lizenz: "CC BY-SA 4.0", quelle: commons("Kellerhaus, Bonnhof (Heilsbronn).jpg"), symbolbild: false },
  schaeufele: { src: schaeufele, alt: "Schäuferle mit knuspriger Kruste, Kloß und Soße", titel: "Schäufele with crispy crust", autor: "Burkhard Mücke", lizenz: "CC BY-SA 4.0", quelle: commons("Schäufele with crispy crust.jpg"), symbolbild: true },
  schaeufeleKloss: { src: schaeufeleKloss, alt: "Schäuferle mit Kloß in dunkler Soße", titel: "Schäufele", autor: "Benreis", lizenz: "CC BY-SA 3.0", quelle: commons("Schäufele.JPG"), symbolbild: true },
  karpfen: { src: karpfen, alt: "Karpfen blau mit Zwiebelringen und Salat auf einem Holztisch", titel: "Karpfen blau Zum Hirschen Bad Windsheim", autor: "Benreis", lizenz: "CC BY 3.0", quelle: commons("Karpfen blau Zum Hirschen Bad Windsheim.JPG"), symbolbild: true },
  bratwurst: { src: bratwurst, alt: "Fränkische Bratwürste mit Sauerkraut auf einem Zinnteller", titel: "Bratwurst Glöckl", autor: "JIP", lizenz: "CC BY-SA 3.0", quelle: commons("Bratwurst Glöckl.jpg"), symbolbild: true },
  kirchweih: { src: kirchweih, alt: "Kirchweihfest unter Sonnenschirmen vor einem Fachwerkhaus", titel: "Moritzberg (Mittelfranken) Kirchweih", autor: "Klaus M.", lizenz: "CC BY 3.0", quelle: commons("Moritzberg(Mittelfranken) Kirchweih1.jpg"), symbolbild: true },
  jakobsweg: { src: jakobsweg, alt: "Waldweg mit Markierung des Jakobswegs an einem Baum", titel: "Pflugsbühl Jakobsweg", autor: "Allexkoch", lizenz: "CC BY-SA 3.0", quelle: commons("PflugsbühlJakobsweg.JPG"), symbolbild: true },
  jakobswegWald: { src: jakobswegWald, alt: "Sonniger Waldweg auf dem fränkischen Jakobsweg", titel: "Fränkischer Jakobsweg im Feuchter Forst", autor: "Derzno", lizenz: "CC BY-SA 4.0", quelle: commons("2019 Fränkischer Jakobsweg im Feuchter Forst 01.jpg"), symbolbild: true },
  muenster: { src: muenster, alt: "Das Münster in Heilsbronn unter blauem Himmel", titel: "Münster Heilsbronn", autor: "Burkhard Mücke", lizenz: "CC BY-SA 4.0", quelle: commons("2023-07-01 Münster Heilsbronn am Bachkantatenwochende 10.jpg"), symbolbild: false },
  dorfstrasse: { src: dorfstrasse, alt: "Dorfstraße in Bonnhof mit alten Scheunen und Wald im Hintergrund", titel: "Zum Weinberg (Bonnhof)", autor: "Alexander Rahm", lizenz: "CC BY 3.0", quelle: commons("Zum Weinberg (Bonnhof) 0649.jpg"), symbolbild: false },
  weide: { src: weide, alt: "Trauerweide in Bonnhof", titel: "Trauerweide in Bonnhof", autor: "Alexander Rahm", lizenz: "CC BY 3.0", quelle: commons("Trauerweide in Bonnhof 0663.jpg"), symbolbild: false },
} satisfies Record<string, Bild>;

/* ------------------------------------------------------------------
   Galerie - Filter erscheinen nur für Kategorien mit Bildern.
   Eigene Fotos (Gaststube, Zimmer, Stodl) hier ergänzen.
   ------------------------------------------------------------------ */
export type Kategorie = "kueche" | "pension" | "biergarten" | "feste" | "umgebung";
export const kategorien: { id: Kategorie; label: string }[] = [
  { id: "kueche", label: "Küche" },
  { id: "pension", label: "Pension" },
  { id: "biergarten", label: "Biergarten" },
  { id: "feste", label: "Feste" },
  { id: "umgebung", label: "Umgebung" },
];

export const galerie: { kategorie: Kategorie; bild: Bild }[] = [
  { kategorie: "kueche", bild: bilder.schaeufele },
  { kategorie: "kueche", bild: bilder.karpfen },
  { kategorie: "kueche", bild: bilder.bratwurst },
  { kategorie: "biergarten", bild: bilder.heroBiergarten },
  { kategorie: "biergarten", bild: bilder.biergartenBaeume },
  { kategorie: "feste", bild: bilder.kirchweih },
  { kategorie: "umgebung", bild: bilder.kellerhaus },
  { kategorie: "umgebung", bild: bilder.dorfstrasse },
  { kategorie: "umgebung", bild: bilder.muenster },
  { kategorie: "umgebung", bild: bilder.weide },
  { kategorie: "umgebung", bild: bilder.jakobsweg },
  { kategorie: "umgebung", bild: bilder.jakobswegWald },
];

export const navigation = [
  { href: "/#start", label: "Startseite" },
  { href: "/#gasthaus", label: "Gasthaus" },
  { href: "/#pension", label: "Pension" },
  { href: "/#biergarten", label: "Biergarten" },
  { href: "/#veranstaltungen", label: "Veranstaltungen" },
  { href: "/#umgebung", label: "Umgebung" },
  { href: "/#kontakt", label: "Kontakt" },
];
