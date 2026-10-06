import { oeffnungszeiten, type Oeffnungstag } from "@/data/betrieb";

const kurz = (t: string) => t.replace(/^0/, "").replace(":00", "");

export function zeitenText(tag: Oeffnungstag): string {
  if (!tag.zeiten.length) return "Ruhetag";
  return tag.zeiten.map(([von, bis]) => `${kurz(von)}-${kurz(bis)} Uhr`).join(" und ");
}

export type Gruppe = { tage: string; zeiten: string; tagNummern: number[] };

/** Fasst aufeinanderfolgende Tage mit gleichen Zeiten zusammen, z. B. „Dienstag bis Samstag“. */
export function gruppierteZeiten(): Gruppe[] {
  const gruppen: { von: Oeffnungstag; bis: Oeffnungstag; nummern: number[] }[] = [];
  for (const tag of oeffnungszeiten) {
    const letzte = gruppen[gruppen.length - 1];
    if (letzte && zeitenText(letzte.bis) === zeitenText(tag) && letzte.bis.tag + 1 === tag.tag) {
      letzte.bis = tag;
      letzte.nummern.push(tag.tag);
    } else {
      gruppen.push({ von: tag, bis: tag, nummern: [tag.tag] });
    }
  }
  // Geöffnete Tage zuerst, Ruhetage am Ende
  gruppen.sort((a, b) => Number(!a.von.zeiten.length) - Number(!b.von.zeiten.length));
  return gruppen.map((g) => ({
    tage: g.von === g.bis ? g.von.name : `${g.von.name} bis ${g.bis.name}`,
    zeiten: zeitenText(g.von),
    tagNummern: g.nummern,
  }));
}

const minuten = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

/** Aktueller Wochentag (1-7) und Minuten in deutscher Zeit, unabhängig von der Zeitzone des Besuchers. */
export function jetztInDeutschland(datum = new Date()): { tag: number; minuten: number } {
  const teile = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Berlin",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(datum);
  const wert = (typ: string) => teile.find((t) => t.type === typ)?.value ?? "";
  const tage: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };
  return { tag: tage[wert("weekday")], minuten: (Number(wert("hour")) % 24) * 60 + Number(wert("minute")) };
}

export type Status = { offen: boolean; text: string };

export function oeffnungsstatus(datum = new Date()): Status | null {
  const jetzt = jetztInDeutschland(datum);
  const heute = oeffnungszeiten.find((t) => t.tag === jetzt.tag);

  for (const [von, bis] of heute?.zeiten ?? []) {
    if (jetzt.minuten >= minuten(von) && jetzt.minuten < minuten(bis)) {
      return { offen: true, text: `Jetzt geöffnet bis ${kurz(bis)} Uhr` };
    }
    if (jetzt.minuten < minuten(von)) {
      return { offen: false, text: `Heute ab ${kurz(von)} Uhr geöffnet` };
    }
  }
  for (let k = 1; k <= 7; k++) {
    const tagNr = ((jetzt.tag - 1 + k) % 7) + 1;
    const naechster = oeffnungszeiten.find((t) => t.tag === tagNr && t.zeiten.length);
    if (naechster) {
      const wann = k === 1 ? "morgen" : naechster.name;
      return { offen: false, text: `Geschlossen · ${wann} ab ${kurz(naechster.zeiten[0][0])} Uhr` };
    }
  }
  return null;
}

const englisch = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/** Öffnungszeiten im Schema.org-Format für die strukturierten Daten. */
export function oeffnungszeitenSchema() {
  return oeffnungszeiten.flatMap((t) =>
    t.zeiten.map(([von, bis]) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${englisch[t.tag]}`,
      opens: von,
      closes: bis,
    })),
  );
}
