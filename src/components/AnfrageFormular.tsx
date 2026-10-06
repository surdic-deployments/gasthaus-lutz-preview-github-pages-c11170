"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { betrieb, formularEndpunkt } from "@/data/betrieb";
import { useBrowserWert } from "@/lib/useBrowserWert";

type Art = "zimmer" | "kontakt";
type Anliegen = "allgemein" | "tisch" | "veranstaltung";

const ANLIEGEN: Record<Anliegen, string> = {
  allgemein: "Allgemeine Frage",
  tisch: "Tisch reservieren",
  veranstaltung: "Veranstaltung / Feier",
};

const EREIGNIS = "anliegen-setzen";

/** Link, der zum Kontaktformular springt und dort das passende Anliegen vorwählt. */
export function AnliegenLink({
  anliegen,
  className,
  children,
}: {
  anliegen: Anliegen;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href="/#kontakt"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent<Anliegen>(EREIGNIS, { detail: anliegen }))}
    >
      {children}
    </Link>
  );
}

const heuteISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const deutsch = (iso: string) => (iso ? iso.split("-").reverse().join(".") : "");

function fehlerText(el: HTMLInputElement | HTMLTextAreaElement): string {
  if (el.validity.valid) return "";
  if (el instanceof HTMLInputElement && el.type === "checkbox") return "Bitte bestätigen Sie die Einwilligung.";
  if (el.validity.valueMissing) return "Bitte füllen Sie dieses Feld aus.";
  if (el.validity.typeMismatch) return "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
  if (el.validity.rangeUnderflow) return el.type === "number" ? "Mindestens 1 Person." : "Bitte wählen Sie ein späteres Datum.";
  return el.validationMessage;
}

export function AnfrageFormular({ art }: { art: Art }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [anliegen, setAnliegen] = useState<Anliegen>("allgemein");
  const [fehler, setFehler] = useState<Record<string, string>>({});
  const minDatum = useBrowserWert(heuteISO, null, 60 * 60_000) ?? undefined;
  const [abreiseMin, setAbreiseMin] = useState<string>();
  const [status, setStatus] = useState<{ typ: "ok" | "fehler"; text: React.ReactNode } | null>(null);
  const [sendet, setSendet] = useState(false);
  const p = art === "zimmer" ? "z" : "k";

  useEffect(() => {
    if (art !== "kontakt") return;
    const setzen = (e: Event) => setAnliegen((e as CustomEvent<Anliegen>).detail);
    window.addEventListener(EREIGNIS, setzen);
    return () => window.removeEventListener(EREIGNIS, setzen);
  }, [art]);

  function pruefen(el: HTMLInputElement | HTMLTextAreaElement) {
    setFehler((f) => ({ ...f, [el.name]: fehlerText(el) }));
  }

  function anreiseGeaendert(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.value) return;
    const d = new Date(`${e.target.value}T12:00:00`);
    d.setDate(d.getDate() + 1);
    const min = d.toISOString().slice(0, 10);
    setAbreiseMin(min);
    const abreise = formRef.current?.elements.namedItem("abreise") as HTMLInputElement | null;
    if (abreise && (!abreise.value || abreise.value < min)) abreise.value = min;
  }

  async function absenden(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus(null);
    const fd = new FormData(form);
    if (fd.get("website")) return; // Spam-Schutz (Honeypot)

    const felder = Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input:not([name=website]), textarea"));
    const neu: Record<string, string> = {};
    felder.forEach((el) => (neu[el.name] = fehlerText(el)));
    setFehler(neu);
    const erstes = felder.find((el) => neu[el.name]);
    if (erstes) {
      erstes.focus();
      return;
    }

    fd.delete("website");
    const w = (k: string) => String(fd.get(k) ?? "").trim();
    let betreff: string;
    let zeilen: string[];
    if (art === "zimmer") {
      betreff = `Zimmeranfrage ${deutsch(w("anreise"))} - ${deutsch(w("abreise"))} (${w("personen")} Pers.)`;
      zeilen = ["Zimmeranfrage über die Website", "", `Name: ${w("name")}`, `E-Mail: ${w("email")}`, `Telefon: ${w("telefon") || "keine Angabe"}`,
        `Anreise: ${deutsch(w("anreise"))}`, `Abreise: ${deutsch(w("abreise"))}`, `Personen: ${w("personen")}`, "", "Nachricht:", w("nachricht") || "keine Angabe"];
    } else {
      const thema = { allgemein: "Allgemeine Anfrage", tisch: "Tischreservierung", veranstaltung: "Anfrage Veranstaltung / Feier" }[anliegen];
      betreff = `${thema} - ${w("name")}`;
      zeilen = [`${thema} über die Website`, "", `Name: ${w("name")}`, `E-Mail: ${w("email")}`, `Telefon: ${w("telefon") || "keine Angabe"}`];
      if (anliegen !== "allgemein") zeilen.push(`Wunschdatum: ${deutsch(w("datum")) || "keine Angabe"}`, `Personen: ${w("personen") || "keine Angabe"}`);
      zeilen.push("", "Nachricht:", w("nachricht"));
    }
    fd.append("betreff", betreff);

    const telefon = <a href={`tel:${betrieb.telefonLink}`}>{betrieb.telefon}</a>;

    if (formularEndpunkt) {
      setSendet(true);
      try {
        const r = await fetch(formularEndpunkt, { method: "POST", body: fd, headers: { Accept: "application/json" } });
        if (!r.ok) throw new Error(String(r.status));
        form.reset();
        setAnliegen("allgemein");
        setStatus({ typ: "ok", text: "Vielen Dank! Ihre Anfrage ist bei uns eingegangen. Wir melden uns so bald wie möglich." });
      } catch {
        setStatus({ typ: "fehler", text: <>Leider konnte die Anfrage nicht gesendet werden. Bitte rufen Sie uns an: {telefon}</> });
      } finally {
        setSendet(false);
      }
      return;
    }

    // Ohne Server: vorausgefüllte E-Mail im Mailprogramm öffnen
    window.location.href = `mailto:${betrieb.email}?subject=${encodeURIComponent(betreff)}&body=${encodeURIComponent(zeilen.join("\n"))}`;
    setStatus({
      typ: "ok",
      text: (
        <>
          Ihr E-Mail-Programm öffnet sich mit der vorbereiteten Anfrage, bitte dort nur noch auf „Senden“ klicken. Falls sich
          nichts öffnet: <a href={`mailto:${betrieb.email}`}>{betrieb.email}</a> oder {telefon}.
        </>
      ),
    });
  }

  const feld = (name: string) => ({
    name,
    id: `${p}-${name}`,
    "aria-invalid": fehler[name] ? true : undefined,
    "aria-describedby": fehler[name] ? `${p}-${name}-fehler` : undefined,
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => fehler[name] !== undefined && pruefen(e.target),
    onInput: (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => fehler[name] && pruefen(e.currentTarget),
  });
  const meldung = (name: string) =>
    fehler[name] ? (
      <span className="field__error" id={`${p}-${name}-fehler`}>
        {fehler[name]}
      </span>
    ) : null;

  const mitDatum = art === "kontakt" && anliegen !== "allgemein";

  return (
    <form ref={formRef} className="form" noValidate onSubmit={absenden}>
      {art === "kontakt" && (
        <fieldset className="topics">
          <legend>Worum geht es?</legend>
          {(Object.keys(ANLIEGEN) as Anliegen[]).map((a) => (
            <label className="chip" key={a}>
              <input type="radio" name="anliegen" value={a} checked={anliegen === a} onChange={() => setAnliegen(a)} />
              <span>{ANLIEGEN[a]}</span>
            </label>
          ))}
        </fieldset>
      )}

      <div className="form__grid">
        <div className="field">
          <label htmlFor={`${p}-name`}>Name *</label>
          <input {...feld("name")} type="text" autoComplete="name" required />
          {meldung("name")}
        </div>
        <div className="field">
          <label htmlFor={`${p}-email`}>E-Mail *</label>
          <input {...feld("email")} type="email" autoComplete="email" inputMode="email" spellCheck={false} required />
          {meldung("email")}
        </div>
        <div className={`field${art === "kontakt" ? " field--full" : ""}`}>
          <label htmlFor={`${p}-telefon`}>Telefonnummer</label>
          <input {...feld("telefon")} type="tel" autoComplete="tel" inputMode="tel" />
        </div>

        {art === "zimmer" && (
          <>
            <div className="field">
              <label htmlFor="z-personen">Anzahl Personen *</label>
              <input {...feld("personen")} type="number" min={1} max={30} defaultValue={1} inputMode="numeric" required />
              {meldung("personen")}
            </div>
            <div className="field">
              <label htmlFor="z-anreise">Anreise *</label>
              <input {...feld("anreise")} type="date" min={minDatum} required onChange={anreiseGeaendert} />
              {meldung("anreise")}
            </div>
            <div className="field">
              <label htmlFor="z-abreise">Abreise *</label>
              <input {...feld("abreise")} type="date" min={abreiseMin ?? minDatum} required />
              {meldung("abreise")}
            </div>
          </>
        )}

        {mitDatum && (
          <>
            <div className="field">
              <label htmlFor="k-datum">Wunschdatum</label>
              <input {...feld("datum")} type="date" min={minDatum} />
              {meldung("datum")}
            </div>
            <div className="field">
              <label htmlFor="k-personen">Anzahl Personen</label>
              <input {...feld("personen")} type="number" min={1} inputMode="numeric" />
              {meldung("personen")}
            </div>
          </>
        )}

        <div className="field field--full">
          <label htmlFor={`${p}-nachricht`}>Nachricht{art === "kontakt" ? " *" : ""}</label>
          <textarea {...feld("nachricht")} rows={4} required={art === "kontakt"} />
          {meldung("nachricht")}
        </div>

        {art === "kontakt" && anliegen === "tisch" && (
          <p className="field field--full note">
            Per E-Mail bitte mindestens eine Woche im Voraus. Kurzfristig reservieren Sie am besten telefonisch (mind. 24 Stunden
            vorher).
          </p>
        )}

        <div className="field field--full field--check">
          <input {...feld("datenschutz")} type="checkbox" required />
          <label htmlFor={`${p}-datenschutz`}>
            Meine Angaben dürfen zur Bearbeitung der Anfrage verwendet werden (<Link href="/datenschutz">Datenschutz</Link>). *
          </label>
          {meldung("datenschutz")}
        </div>
        <div className="hp" aria-hidden="true">
          <label htmlFor={`${p}-website`}>Website</label>
          <input id={`${p}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      <button className="btn btn--primary" type="submit" disabled={sendet}>
        {sendet ? "Wird gesendet…" : "Anfrage senden"}
      </button>
      {art === "zimmer" && !formularEndpunkt && (
        <p className="form__hint">
          Ihre Anfrage wird als E-Mail an {betrieb.email} vorbereitet. Telefonisch: {betrieb.telefon}.
        </p>
      )}
      <p className={`form__status${status ? (status.typ === "ok" ? " is-success" : " is-error") : ""}`} role="status" aria-live="polite">
        {status?.text}
      </p>
    </form>
  );
}
