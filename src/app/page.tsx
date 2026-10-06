import {
  ArrowUpRight,
  BeerStein,
  Bicycle,
  Car,
  Coffee,
  Confetti,
  Door,
  Fish,
  ForkKnife,
  MicrophoneStage,
  Tree,
  Users,
  WifiHigh,

} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";

import { AnfrageFormular, AnliegenLink } from "@/components/AnfrageFormular";
import { Galerie } from "@/components/Galerie";
import { Karte } from "@/components/Karte";
import { OeffnungszeitenListe } from "@/components/Oeffnungszeiten";
import { QuickBar } from "@/components/QuickBar";
import { RouteLink } from "@/components/RouteLink";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Tabs, type Tab } from "@/components/Tabs";
import { betrieb, bilder, speisekarteUrl, type Bild } from "@/data/betrieb";
import { oeffnungszeitenSchema } from "@/lib/oeffnungszeiten";

const tel = `tel:${betrieb.telefonLink}`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["Restaurant", "LodgingBusiness"],
  "@id": `${betrieb.url}/#betrieb`,
  name: "Gasthaus Pension Biergarten Lutz",
  alternateName: ["Pension Lutz", "Gasthaus Lutz"],
  description:
    "Fränkisches Gasthaus von 1907 in dritter Familiengeneration mit Gaststube, Nebenzimmern, Fremdenzimmern und Ferienwohnungen, Biergarten mit altem Baumbestand und dem Stodl für Feiern bis 80 Personen.",
  url: `${betrieb.url}/`,
  image: `${betrieb.url}/opengraph-image.jpg`,
  telephone: "+49 9872 2366",
  email: betrieb.email,
  foundingDate: String(betrieb.gruendungsjahr),
  address: {
    "@type": "PostalAddress",
    streetAddress: betrieb.strasse,
    postalCode: betrieb.plz,
    addressLocality: betrieb.ort,
    addressRegion: betrieb.region,
    addressCountry: "DE",
  },
  geo: { "@type": "GeoCoordinates", latitude: betrieb.lat, longitude: betrieb.lng },
  areaServed: ["Heilsbronn", "Bonnhof", "Ansbach", "Nürnberg"],
  servesCuisine: ["Fränkisch", "Deutsch", "Fisch"],
  acceptsReservations: "True",
  openingHoursSpecification: oeffnungszeitenSchema(),
  amenityFeature: ["WLAN", "TV im Zimmer", "Dusche und WC", "Kostenlose Parkplätze", "Biergarten", "Rollstuhlgerechtes Doppelzimmer"].map(
    (name) => ({ "@type": "LocationFeatureSpecification", name, value: true }),
  ),
  containsPlace: {
    "@type": "EventVenue",
    name: "Stodl",
    description: "Rustikaler Veranstaltungsraum mit Bühne, Tanzfläche, Ausschank und Bedienung.",
    maximumAttendeeCapacity: 80,
  },
  sameAs: [betrieb.facebook],
};

function Foto({ bild, sizes, unterschrift, className = "" }: { bild: Bild; sizes: string; unterschrift?: string; className?: string }) {
  return (
    <figure className={`photo ${className}`.trim()}>
      <Image src={bild.src} alt={bild.alt} sizes={sizes} placeholder="blur" />
      {unterschrift && <figcaption>{unterschrift}</figcaption>}
    </figure>
  );
}

function Bereich({ bild, titel, text, fakten, href, cta }: {
  bild: Bild; titel: string; text: string; fakten: [Icon, string][]; href: string; cta: string;
}) {
  return (
    <>
      <div className="area__media">
        <Image src={bild.src} alt={bild.alt} fill sizes="(min-width: 960px) 52vw, 100vw" placeholder="blur" />
      </div>
      <div className="area__body">
        <h3 className="h3">{titel}</h3>
        <p>{text}</p>
        <ul className="area__facts">
          {fakten.map(([Symbol, t]) => (
            <li key={t}>
              <Symbol size={20} weight="light" aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
        <Link className="btn btn--primary" href={href}>{cta}</Link>
      </div>
    </>
  );
}

function Gerichte({ titel, untertitel, gerichte, bild }: { titel: string; untertitel: string; gerichte: string[]; bild: Bild }) {
  return (
    <>
      <div>
        <p className="dish__title">{titel}</p>
        <p className="dish__sub">{untertitel}</p>
        <ul className="dish__list">{gerichte.map((g) => <li key={g}>{g}</li>)}</ul>
      </div>
      <Image className="dish__img" src={bild.src} alt={bild.alt} sizes="(min-width: 820px) 40vw, 100vw" placeholder="blur" />
    </>
  );
}

const bereiche: Tab[] = [
  {
    id: "gasthaus", label: "Gaststube & Küche",
    inhalt: <Bereich bild={bilder.bratwurst} titel="Fränkische Küche & gemütliches Beisammensein"
      text="Gewachster Dielenboden, ein frisch gezapftes Bier und gute fränkische Küche, vom Schäuferle bis zum Karpfen aus eigenen Gewässern."
      fakten={[[ForkKnife, "Schäuferle, Braten und Brotzeit"], [Fish, "Forelle und Karpfen aus eigenen Gewässern"], [Door, "Zwei Nebenzimmer für Feiern"]]}
      href="#gasthaus" cta="Zum Gasthaus" />,
  },
  {
    id: "pension", label: "Pension & Zimmer",
    inhalt: <Bereich bild={bilder.jakobsweg} titel="Gemütlich übernachten in Heilsbronn-Bonnhof"
      text="Sieben Zimmer im Neubau von 2018, modernisierte Zimmer im Altbau und Ferienwohnungen. Für Pilger, Urlauber und Monteure."
      fakten={[[Coffee, "Frühstück nach Mamas Art"], [WifiHigh, "WLAN, TV, Dusche und WC"], [Car, "Kostenlose Parkplätze am Haus"]]}
      href="#pension" cta="Zimmer entdecken" />,
  },
  {
    id: "biergarten", label: "Biergarten & Gärtla",
    inhalt: <Bereich bild={bilder.biergartenBaeume} titel="Fränkische Gemütlichkeit unter freiem Himmel"
      text="Alter Baumbestand, kühle Biere, Schnapserl und fränkische Brotzeit. Laue Abende, wie sie in Franken sein sollen."
      fakten={[[Tree, "Schatten unter alten Bäumen"], [BeerStein, "Frisch gezapft, dazu Vesperplatte"], [Bicycle, "Radler und Motorradfahrer willkommen"]]}
      href="#biergarten" cta="Zum Biergarten" />,
  },
  {
    id: "stodl", label: "Stodl & Feste",
    inhalt: <Bereich bild={bilder.kirchweih} titel="Gemeinsam feiern und besondere Momente erleben"
      text="Der „Stodl“ bietet Platz für bis zu 80 Personen. Dazu Kärwa, Faschingsball, Fischkärwa und Silvesterfeier."
      fakten={[[Users, "Familienfeiern und Firmenausflüge"], [MicrophoneStage, "Bühne und Tanzfläche"], [Confetti, "Feste von Frühling bis Winter"]]}
      href="#veranstaltungen" cta="Zu den Feiern" />,
  },
];

const schmankerl: Tab[] = [
  {
    id: "ofen", label: "Aus Ofen & Pfanne",
    inhalt: <Gerichte titel="Aus Ofen & Pfanne" untertitel="Fränkisch, deftig, hausgemacht" bild={bilder.schaeufeleKloss}
      gerichte={["Schäuferle", "Schweinebraten mit Kloß", "Sauerbraten", "Schnitzel mit Kartoffelsalat", "Bratwurst mit Sauerkraut", "Schaschlik"]} />,
  },
  {
    id: "fisch", label: "Aus eigenen Gewässern",
    inhalt: <Gerichte titel="Aus eigenen Gewässern" untertitel="Das Herzensthema des Chefs" bild={bilder.karpfen}
      gerichte={["Forelle, das ganze Jahr", "Karpfen", "Karpfenfilet", "Immer frisch zubereitet"]} />,
  },
  {
    id: "brotzeit", label: "Fränkische Brotzeit",
    inhalt: <Gerichte titel="Fränkische Brotzeit" untertitel="Zum Bier im Gärtla" bild={bilder.bratwurst}
      gerichte={["Fränkische Vesperplatte", "Stadtwurst mit Musik", "Pressack", "Sonntags Braten und warme Speisen"]} />,
  },
];

const feste = [
  "Faschingsball im Stodl",
  "Kärwa mit Livemusik",
  "Fischkärwa, nur bei uns",
  "Weißwurstfrühschoppen",
  "Weinfahrt",
  "Kulturelle Veranstaltungen",
  "Adventsausstellung",
  "Silvesterfeier im Stodl",
];

export default function Startseite() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <SiteHeader />

      <main id="inhalt">
        {/* HERO: Badge, Überschrift, Unterzeile, zwei Buttons */}
        <section className="hero" id="start" aria-labelledby="hero-title">
          <Image className="hero__img" src={bilder.heroBiergarten.src} alt={bilder.heroBiergarten.alt} fill sizes="100vw" preload placeholder="blur" />
          <div className="hero__shade" aria-hidden="true" />
          <div className="container hero__content">
            <p className="hero__badge">Grüß Gott in Bonnhof, seit {betrieb.gruendungsjahr}</p>
            <h1 id="hero-title" className="hero__title">Fränkische Gastlichkeit erleben.</h1>
            <p className="hero__sub">Gasthaus · Pension · Biergarten · Veranstaltungen</p>
            <div className="hero__actions">
              <Link className="btn btn--primary btn--lg" href="#pension">
                Zimmer entdecken
                <span className="btn__icon" aria-hidden="true"><ArrowUpRight size={16} weight="bold" /></span>
              </Link>
              <Link className="btn btn--ghost-light btn--lg" href="#kontakt">Kontakt aufnehmen</Link>
            </div>
          </div>
        </section>

        {/* WILLKOMMEN: Statement + versetztes Bildpaar */}
        <section className="section" aria-labelledby="welcome-title">
          <div className="container">
            <h2 id="welcome-title" className="h2 welcome__title reveal">Ein fränkisches Gasthaus von 1907, in dritter Familiengeneration.</h2>
            <div className="welcome__grid">
              <div className="reveal">
                <div className="prose">
                  <p>
                    Unser Haus liegt am Rande des Jakobswegs und steht für fränkisch Kulinarisches genauso wie für ländliches Flair.
                    Gaststube und Nebenzimmer, Fremdenzimmer, der „Stodl“ für größere Anlässe und ein Biergarten mit altem
                    Baumbestand gehören bei uns zusammen, für Jung und Alt.
                  </p>
                  <p>
                    Wir modernisieren Schritt für Schritt, ohne das gemütliche Flair zu verlieren. Seit 2018 gibt es zum Beispiel einen
                    weiteren Neubau mit sieben Zimmern.
                  </p>
                </div>
                <p className="quote">„…ob drinn oder drauß, fühlen Sie sich wie zu Haus…“</p>
                <p className="signature">{betrieb.inhaber} und Team</p>
              </div>
              <div className="welcome__photos reveal">
                <Foto bild={bilder.kellerhaus} className="photo--tall" sizes="(min-width: 960px) 30vw, (min-width: 560px) 50vw, 100vw" unterschrift="Altes Kellerhaus in Bonnhof" />
                <Foto bild={bilder.dorfstrasse} sizes="(min-width: 960px) 26vw, (min-width: 560px) 45vw, 100vw" unterschrift="Bonnhof, Zum Weinberg" />
              </div>
            </div>
          </div>
        </section>

        {/* BEREICHE: Tabs */}
        <section className="section section--alt" aria-labelledby="areas-title">
          <div className="container">
            <div className="reveal">
              <h2 id="areas-title" className="h2">Vier Bereiche, ein Gasthaus.</h2>
              <p className="areas__intro">Tippen Sie sich durch und gehen Sie direkt dorthin, wo Sie hinmöchten.</p>
            </div>
            <div className="reveal">
              <Tabs tabs={bereiche} label="Bereiche des Hauses" panelClassName="area" />
            </div>
          </div>
        </section>

        {/* GASTHAUS: Bild bis zum linken Rand */}
        <section className="section" id="gasthaus" aria-labelledby="gasthaus-title">
          <div className="bleed">
            <Foto bild={bilder.schaeufele} className="bleed__media photo--shadow reveal" sizes="(min-width: 960px) 52vw, 100vw" />
            <div className="bleed__text reveal">
              <h2 id="gasthaus-title" className="h2">Fränkische Küche &amp; gemütliches Beisammensein</h2>
              <div className="prose">
                <p>
                  Urig ist sie, unsere Gaststube: gewachster alter Dielenboden, ein Hauch von „früher“ und ein frisch gezapftes Bier.
                  Angrenzend liegen zwei gemütliche Nebenzimmer für Feiern und Anlässe aller Art.
                </p>
                <p>
                  Die gute deutsche und fränkische Küche ist uns ans Herz gewachsen. Ein besonderes Anliegen des Chefs sind die Fische:
                  Forelle, Karpfen und Karpfenfilet aus hauseigenen Gewässern, stets frisch zubereitet.
                </p>
              </div>
              <div className="actions">
                <a className="btn btn--primary" href={tel}>Tisch reservieren</a>
                {speisekarteUrl && <a className="btn btn--outline" href={speisekarteUrl} target="_blank" rel="noopener">Speisekarte ansehen</a>}
              </div>
              <p className="note">
                Telefonisch bitte mindestens 24 Stunden vorher. Per E-Mail mindestens eine Woche vorher über das{" "}
                <AnliegenLink anliegen="tisch" className="text-link">Kontaktformular</AnliegenLink>.
              </p>
            </div>
          </div>

          <div className="container menu-block reveal">
            <h3 className="h2 h2--sm">Was bei uns auf den Tisch kommt.</h3>
            <div className="dishes">
              <Tabs tabs={schmankerl} label="Schmankerl" panelClassName="dish" />
              <p className="note dishes__note">Gerichte von unserer bisherigen Karte. Fragen Sie gern nach den Tagesgerichten.</p>
            </div>
          </div>
        </section>

        {/* PENSION: Text + Anfrageformular */}
        <section className="section section--alt" id="pension" aria-labelledby="pension-title">
          <div className="container contact">
            <div className="reveal">
              <h2 id="pension-title" className="h2">Gemütlich übernachten in Heilsbronn-Bonnhof</h2>
              <div className="prose">
                <p>
                  Ob Pilger auf dem Jakobsweg, Urlauber, Monteure oder beruflich Reisende: Bei uns findet jeder ein wohnliches
                  Plätzchen. WLAN, TV, Dusche und WC gehören in den modernisierten und neuen Zimmern dazu, ebenso in den
                  Ferienwohnungen.
                </p>
                <p>
                  Der Neubau von 2018 hat sieben Zimmer, fünf Einzel- und zwei Doppelzimmer, davon eines rollstuhlgerecht. Einige
                  Zimmer haben eine Küchenzeile. Dauergäste und Montagearbeiter sind ausdrücklich willkommen, das Frühstück machen wir
                  noch nach „Mamas Art“. Parkplätze am Haus und Unterstellmöglichkeiten für Fahr- und Motorräder sind kostenlos.
                </p>
                <p className="note">
                  Die Preise für Zimmer und Ferienwohnungen nennen wir Ihnen gern am Telefon: <a href={tel}>{betrieb.telefon}</a>.
                </p>
              </div>
              <Foto bild={bilder.jakobswegWald} className="pension__photo" sizes="(min-width: 960px) 40vw, 100vw" unterschrift="Auf dem fränkischen Jakobsweg" />
            </div>

            <div className="form-card reveal" id="zimmer-anfrage">
              <h3 className="h3">Zimmer anfragen</h3>
              <p className="form-card__intro">Senden Sie uns Ihre Wunschtermine, wir melden uns zurück.</p>
              <AnfrageFormular art="zimmer" />
            </div>
          </div>
        </section>

        {/* BIERGARTEN: Fotoband */}
        <section className="biergarten" id="biergarten" aria-labelledby="biergarten-title">
          <Image className="biergarten__img" src={bilder.biergartenBaeume.src} alt="" fill sizes="100vw" placeholder="blur" />
          <div className="biergarten__shade" aria-hidden="true" />
          <div className="container biergarten__content reveal">
            <p className="eyebrow eyebrow--light">Unser „Gärtla“</p>
            <h2 id="biergarten-title" className="h2">Unser Biergarten</h2>
            <p className="biergarten__sub">Genießen, entspannen und fränkische Gemütlichkeit erleben.</p>
            <div className="biergarten__cols">
              <p>
                Neben einer Auswahl kühler Biere gibt es Weine, verschiedene Schnapserl, Fruchtsäfte, Radler und andere spritzige
                Getränke. Die Küche hält warme und kalte Köstlichkeiten bereit: fränkische Vesperplatte, Stadtwurst mit Musik, Pressack
                und mehr. Sonntags natürlich auch Braten und warme Speisen.
              </p>
              <p>
                Im Sommer lassen sich hier sonnige Nachmittage und laue Abende genießen, Schatten spenden alte Bäume und Schirme. Radler
                und Motorradfahrer sind stets willkommen, Unterstellmöglichkeiten für die Gefährte sind vorhanden.
              </p>
            </div>
            <a className="btn btn--ghost-light" href={tel}>Tisch reservieren</a>
          </div>
        </section>

        {/* VERANSTALTUNGEN: Bento */}
        <section className="section" id="veranstaltungen" aria-labelledby="events-title">
          <div className="container">
            <div className="events__head reveal">
              <h2 id="events-title" className="h2">Gemeinsam feiern und besondere Momente erleben</h2>
              <p className="lead">
                Für feierliche Anlässe stehen unsere Nebenzimmer und unser ganzer Stolz zur Verfügung: der „Stodl“. Rustikal, wandelbar,
                mit Ausschank und Bedienung, auch für Firmenevents und Tagungen.
              </p>
            </div>

            <div className="bento reveal">
              <figure className="bento__photo">
                <Image src={bilder.kirchweih.src} alt={bilder.kirchweih.alt} fill sizes="(min-width: 760px) 50vw, 100vw" placeholder="blur" />
                <figcaption>Kärwa-Zeit in Mittelfranken</figcaption>
              </figure>
              <div className="stat stat--accent">
                <p className="stat__value">80</p>
                <p className="stat__label">Personen finden im Stodl Platz</p>
              </div>
              <div className="stat stat--soft">
                <MicrophoneStage size={32} weight="light" aria-hidden="true" />
                <p className="stat__label">Bühne für viel „Musi“ und reichlich Fläche zum Tanzen</p>
              </div>
              <div className="bento__feste">
                <h3 className="h3">Feste durchs Jahr</h3>
                <ul className="feste">{feste.map((f) => <li key={f}>{f}</li>)}</ul>
              </div>
            </div>

            <div className="events__foot reveal">
              <p className="note">
                Der Stodl ist sehr begehrt, bitte frühzeitig anfragen. Aktuelle Termine auf{" "}
                <a href={betrieb.facebook} target="_blank" rel="noopener">Facebook</a>.
              </p>
              <div className="actions">
                <AnliegenLink anliegen="veranstaltung" className="btn btn--primary">Veranstaltung anfragen</AnliegenLink>
              </div>
            </div>
          </div>
        </section>

        {/* GALERIE */}
        <section className="section section--alt" id="galerie" aria-labelledby="gallery-title">
          <div className="container">
            <h2 id="gallery-title" className="h2 reveal">Einblicke in Franken</h2>
            <Galerie />
          </div>
        </section>

        {/* UMGEBUNG: Kartenband */}
        <section className="section" id="umgebung" aria-labelledby="location-title">
          <div className="container">
            <div className="location__head reveal">
              <h2 id="location-title" className="h2">Heilsbronn &amp; Umgebung entdecken</h2>
              <p className="lead">
                Bonnhof liegt zwischen Wald und Flur. Das Städtchen Heilsbronn mit dem bekannten Münster ist nah, der Jakobsweg führt
                direkt an uns vorbei.
              </p>
            </div>
            <div className="reveal">
              <Karte />
            </div>
            <dl className="distances reveal">
              <div><dt>ca. 1,5 km</dt><dd>nach Heilsbronn, mit Münster und Einkaufsmöglichkeiten</dd></div>
              <div><dt>ca. 20 km</dt><dd>nach Nürnberg und nach Ansbach</dd></div>
              <div><dt>am Haus</dt><dd>der Jakobsweg, Wander- und Radwege</dd></div>
              <div><dt>Anreise</dt><dd>mit Bahn oder Bus, per Auto über die Autobahnausfahrt Heilsbronn</dd></div>
            </dl>
            <div className="location__foot reveal">
              <address className="address">
                <strong>{betrieb.name}</strong>
                {betrieb.strasse}, {betrieb.plz} {betrieb.ort} / {betrieb.ortsteil}
              </address>
              <RouteLink className="btn btn--primary">Route planen</RouteLink>
            </div>
          </div>
        </section>

        {/* KONTAKT */}
        <section className="section section--alt" id="kontakt" aria-labelledby="contact-title">
          <div className="container">
            <div className="reveal">
              <p className="eyebrow">Kontakt</p>
              <h2 id="contact-title" className="h2">Wir freuen uns auf Ihren Besuch.</h2>
            </div>
            <div className="kontakt__info reveal">
              <div>
                <p className="label">Adresse</p>
                <address>
                  {betrieb.name}<br />{betrieb.strasse}<br />{betrieb.plz} {betrieb.ort} / {betrieb.ortsteil}
                </address>
              </div>
              <div>
                <p className="label">Telefon und E-Mail</p>
                <p>
                  <a href={tel}>{betrieb.telefon}</a><br />
                  <a href={`mailto:${betrieb.email}`}>{betrieb.email}</a>
                </p>
              </div>
              <div>
                <OeffnungszeitenListe />
              </div>
            </div>
            <div className="actions reveal">
              <a className="btn btn--primary" href={tel}>Anrufen</a>
              <Link className="btn btn--outline" href="#zimmer-anfrage">Zimmer anfragen</Link>
              <RouteLink className="btn btn--outline">Route planen</RouteLink>
            </div>
            <div className="form-card kontakt__form reveal">
              <h3 className="h3">Ihre Nachricht</h3>
              <p className="form-card__intro">Tisch, Feier oder eine Frage? Schreiben Sie uns.</p>
              <AnfrageFormular art="kontakt" />
            </div>
          </div>
        </section>

        {/* ABSCHLUSS */}
        <section className="closing" aria-labelledby="closing-title">
          <div className="container closing__inner reveal">
            <h2 id="closing-title" className="h2">Ihr nächster Besuch beginnt hier.</h2>
            <p>Zimmer anfragen, Tisch reservieren oder einfach kurz anrufen. Wir freuen uns.</p>
            <div className="actions actions--center">
              <Link className="btn btn--primary" href="#zimmer-anfrage">Zimmer anfragen</Link>
              <a className="btn btn--outline" href={tel}>Tisch reservieren</a>
              <Link className="btn btn--outline" href="#kontakt">Kontakt aufnehmen</Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <QuickBar />
    </>
  );
}
