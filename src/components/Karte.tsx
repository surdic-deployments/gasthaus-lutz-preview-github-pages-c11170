"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { betrieb, bilder } from "@/data/betrieb";

/** Karte wird erst nach Klick von OpenStreetMap geladen (vorher keine Datenübertragung an Dritte). */
export function Karte() {
  const [geladen, setGeladen] = useState(false);
  const d = 0.006;
  const bbox = [betrieb.lng - d * 1.6, betrieb.lat - d, betrieb.lng + d * 1.6, betrieb.lat + d].map((n) => n.toFixed(5)).join("%2C");

  return (
    <div className="map">
      {geladen ? (
        <iframe
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${betrieb.lat}%2C${betrieb.lng}`}
          title="Karte: Lage des Gasthauses Lutz in Heilsbronn-Bonnhof"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="map__placeholder">
          <Image src={bilder.muenster.src} alt={bilder.muenster.alt} fill sizes="(min-width: 960px) 45vw, 100vw" placeholder="blur" />
          <div className="map__consent">
            <p>Das Münster in Heilsbronn, rund 1,5 km von uns entfernt.</p>
            <button className="btn btn--light btn--sm" type="button" onClick={() => setGeladen(true)}>
              Karte anzeigen
            </button>
            <p className="map__legal">
              Die Karte wird von OpenStreetMap geladen. <Link href="/datenschutz#karte">Datenschutz</Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
