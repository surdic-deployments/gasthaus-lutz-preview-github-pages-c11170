import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { betrieb } from "@/data/betrieb";
import { RevealObserver } from "@/components/RevealObserver";
import "./globals.css";

// EB Garamond: klassische Buchschrift, passend zu einem Traditionsgasthaus von 1907
const garamond = localFont({
  src: [
    { path: "../assets/fonts/eb-garamond-var.woff2", style: "normal" },
    { path: "../assets/fonts/eb-garamond-var-italic.woff2", style: "italic" },
  ],
  weight: "400 800",
  variable: "--font-garamond",
  display: "swap",
});

const karla = localFont({
  src: "../assets/fonts/karla-var.woff2",
  weight: "200 800",
  variable: "--font-karla",
  display: "swap",
});

const titel = "Gasthaus, Pension & Biergarten Lutz | Heilsbronn-Bonnhof";
const beschreibung =
  "Fränkisches Gasthaus von 1907 in Heilsbronn-Bonnhof am Jakobsweg: fränkische Küche, Forelle und Karpfen aus eigenen Gewässern, Pension mit Zimmern und Ferienwohnungen, Biergarten und Stodl für Feiern bis 80 Personen.";

export const metadata: Metadata = {
  metadataBase: new URL(betrieb.url),
  title: { default: titel, template: "%s | Gasthaus Lutz, Heilsbronn-Bonnhof" },
  description: beschreibung,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "Gasthaus · Pension · Biergarten Lutz",
    title: "Gasthaus, Pension & Biergarten Lutz in Heilsbronn-Bonnhof",
    description:
      "Fränkisches Gasthaus seit 1907: Gaststube, Pension, Biergarten und Stodl für Feiern, direkt am Jakobsweg bei Heilsbronn.",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  other: {
    "geo.region": "DE-BY",
    "geo.placename": "Heilsbronn-Bonnhof",
    "geo.position": `${betrieb.lat};${betrieb.lng}`,
    ICBM: `${betrieb.lat}, ${betrieb.lng}`,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f4ec" },
    { media: "(prefers-color-scheme: dark)", color: "#1b1916" },
  ],
  colorScheme: "light dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" data-scroll-behavior="smooth" className={`${garamond.variable} ${karla.variable}`}>
      <body>
        <a className="skip-link" href="#inhalt">
          Zum Inhalt springen
        </a>
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
