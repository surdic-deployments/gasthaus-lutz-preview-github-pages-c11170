import Link from "next/link";

import { betrieb, navigation } from "@/data/betrieb";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <p className="site-footer__name">{betrieb.name}</p>
          <p>
            {betrieb.strasse}
            <br />
            {betrieb.plz} {betrieb.ort} / {betrieb.ortsteil}
          </p>
          <p>
            <a href={`tel:${betrieb.telefonLink}`}>{betrieb.telefon}</a>
            <br />
            <a href={`mailto:${betrieb.email}`}>{betrieb.email}</a>
          </p>
        </div>
        <nav aria-label="Footer-Navigation">
          <p className="label">Navigation</p>
          <ul className="site-footer__list">
            {navigation.map((n) => (
              <li key={n.href}>
                <Link href={n.href}>{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="label">Rechtliches</p>
          <ul className="site-footer__list">
            <li><Link href="/impressum">Impressum</Link></li>
            <li><Link href="/datenschutz">Datenschutz</Link></li>
            <li><Link href="/impressum#bildnachweis">Bildnachweis</Link></li>
            <li><a href={betrieb.facebook} target="_blank" rel="noopener">Facebook</a></li>
          </ul>
        </div>
      </div>
      <div className="container site-footer__bottom">
        <p>
          © {new Date().getFullYear()} {betrieb.name} · Inhaber {betrieb.inhaber} · Langzeitübernachter willkommen
        </p>
      </div>
    </footer>
  );
}
