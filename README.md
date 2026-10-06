# Gasthaus Lutz: Website (Next.js)

Next.js 16 (App Router, TypeScript) mit eigenem CSS, ohne UI-Framework. Alle Seiten werden beim Build statisch erzeugt.

## Starten

```bash
npm install
npm run dev      # Entwicklung: http://localhost:3000
npm run build    # Produktions-Build
npm start        # Produktionsserver
```

Veröffentlichen: am einfachsten über Vercel (Repository verbinden, fertig). Die Bildoptimierung von `next/image` braucht einen Node-Server oder Vercel.

## Wo ändere ich was?

| Was | Wo |
|---|---|
| Kontakt, Adresse, Domain | `src/data/betrieb.ts` → `betrieb` |
| Öffnungszeiten | `src/data/betrieb.ts` → `oeffnungszeiten`. Daraus entstehen die gruppierte Anzeige, der Status „Jetzt geöffnet“ und die Google-Daten (JSON-LD). |
| Speisekarte | PDF nach `public/` legen, dann `speisekarteUrl` setzen, z. B. `"/speisekarte.pdf"`. Der Button erscheint automatisch. |
| Galerie | `src/data/betrieb.ts` → `galerie`. Bild nach `src/assets/img/` legen, oben importieren und eintragen. |
| Formular-Versand | Ohne Einstellung öffnet „Anfrage senden“ eine vorausgefüllte E-Mail. Für direkten Versand: Umgebungsvariable `NEXT_PUBLIC_FORM_ENDPOINT` auf ein Formular-Backend setzen und die Datenschutzerklärung anpassen. |
| Texte der Startseite | `src/app/page.tsx` |
| Farben, Abstände, Radien | `src/app/globals.css` → `:root` (hell) und `prefers-color-scheme: dark` (dunkel) |

## Aufbau

```
src/app/            page.tsx (Startseite), impressum/, datenschutz/, not-found.tsx,
                    layout.tsx (Schriften, Metadaten), sitemap.ts, robots.ts, icon.svg, opengraph-image.jpg
src/components/     SiteHeader, Tabs, Galerie (mit Lightbox), AnfrageFormular, Karte (OSM nach Klick),
                    Oeffnungszeiten, QuickBar (mobile Schnellaktionen), RouteLink, RevealObserver, SiteFooter
src/data/betrieb.ts Einzige Quelle für Betriebsdaten, Bilder und Bildnachweise
src/lib/            Öffnungszeiten-Logik, useBrowserWert (Browser-Werte ohne Hydration-Fehler)
src/assets/         Schriften (EB Garamond, Karla; lokal, keine Google-Fonts-Verbindung) und Bilder
.agents/skills/     Design-Skills, nach denen die Seite gestaltet und geprüft wurde
```

## Angewandte Design-Regeln (Skills)

Die Seite folgt `design-taste-frontend`, `redesign-existing-projects`, `high-end-visual-design` (Bewegung, Schatten, Körnung) und wurde mit `web-design-guidelines` geprüft.

- **Radien:** Buttons, Tabs und Filter sind Pillen. Flächen und Bilder haben 14px, Eingabefelder 10px.
- **Farbe:** ein einziger Akzent (Oliv). Holztöne nur für Details. Dark Mode folgt der Systemeinstellung.
- **Text:** keine Gedankenstriche im sichtbaren Text. Höchstens eine kleine Kapitälchen-Zeile pro drei Abschnitte.
- **Layout:** jeder Abschnitt hat eine eigene Layout-Form.
- **Icons:** ausschließlich aus Phosphor.
- **Technik:** kein `window.addEventListener("scroll")`, Einblendungen laufen über IntersectionObserver. Alle Animationen respektieren „Bewegung reduzieren“.

## Bilder

Alle Fotos stammen von Wikimedia Commons (CC BY / CC BY-SA). Der Bildnachweis unter `/impressum#bildnachweis` wird automatisch aus `src/data/betrieb.ts` erzeugt und darf nicht entfernt werden. Speisen-, Biergarten- und Festbilder sind **Symbolbilder**, nicht das Gasthaus Lutz. Eigene Fotos von Haus, Gaststube, Zimmern und Stodl sind die wichtigste nächste Verbesserung.

## Offen (fehlte auf der alten Website)

- Preise
- Gesamtzahl der Zimmer
- Speisekarte
- Bewertungen
- Veranstaltungstermine
- USt-IdNr. und Aufsichtsbehörde im Impressum
- Hoster in der Datenschutzerklärung

Montag ist als Ruhetag eingetragen, weil er auf der alten Website nicht als Öffnungstag genannt war. Bitte bestätigen.
