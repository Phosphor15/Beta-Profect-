import Link from "next/link";
import { getDict } from "@/lib/lang";
import { VENUE } from "@/lib/i18n";
import { CookiePrefsButton } from "./CookieBanner";

export async function Footer() {
  const { t } = await getDict();
  return (
    <footer className="no-print mt-24 border-t border-line bg-wood/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-3">
        <div>
          <p className="display text-2xl">Harald&rsquo;s</p>
          <p className="mt-2 text-sm text-muted">{t.footer.tagline}</p>
          <p className="mt-4 text-sm">{VENUE.address}<br />{VENUE.city}</p>
          <p className="mt-2 text-sm">
            <a href={`tel:${VENUE.phoneHref}`} className="hover:text-gold">{VENUE.phone}</a><br />
            <a href={`mailto:${VENUE.email}`} className="hover:text-gold">{VENUE.email}</a>
          </p>
        </div>
        <ul className="space-y-2 text-sm text-muted">
          <li><Link href="/apres-ski" className="hover:text-cream">{t.nav.apres}</Link></li>
          <li><Link href="/ristorante" className="hover:text-cream">{t.nav.restaurant}</Link></li>
          <li><Link href="/prenota" className="hover:text-cream">{t.nav.book}</Link></li>
          <li><Link href="/listino" className="hover:text-cream">{t.nav.drinks}</Link></li>
          <li><Link href="/contatti" className="hover:text-cream">{t.nav.contact}</Link></li>
        </ul>
        <ul className="space-y-2 text-sm text-muted">
          <li><Link href="/privacy" className="hover:text-cream">{t.footer.privacy}</Link></li>
          <li><Link href="/termini" className="hover:text-cream">{t.footer.terms}</Link></li>
          <li><CookiePrefsButton label={t.footer.cookies} /></li>
          <li><a href={VENUE.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-cream">Instagram</a></li>
          <li><Link href="/staff" className="hover:text-cream">{t.nav.staff}</Link></li>
        </ul>
      </div>
      <div className="border-t border-line/60 px-4 py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} {VENUE.name} · {t.footer.rights} · <span className="text-gold">{t.footer.beta}</span>
      </div>
    </footer>
  );
}
