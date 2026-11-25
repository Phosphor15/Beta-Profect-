import Link from "next/link";
import { getDict } from "@/lib/lang";
import { VENUE } from "@/lib/i18n";
import { CookiePrefsButton } from "./CookieBanner";

export async function Footer() {
  const { t } = await getDict();
  return (
    <footer className="no-print mt-8 overflow-hidden bg-navy text-white">
      <div className="mx-auto max-w-7xl px-5 pt-20 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="display-italic text-5xl">Harald&rsquo;s</p>
            <p className="mt-4 max-w-sm text-white/70">{t.footer.tagline}</p>
            <Link href="/prenota" className="btn btn-primary mt-8">{t.nav.book}</Link>
          </div>
          <div className="space-y-2 text-white/80">
            <p className="eyebrow !text-gold-2">{t.contact.title}</p>
            <p className="pt-2">{VENUE.address}<br />{VENUE.city}</p>
            <p><a href={`tel:${VENUE.phoneHref}`} className="link-underline">{VENUE.phone}</a></p>
            <p><a href={`mailto:${VENUE.email}`} className="link-underline">{VENUE.email}</a></p>
            <p><a href={VENUE.instagram} target="_blank" rel="noopener noreferrer" className="link-underline">Instagram {VENUE.instagramHandle}</a></p>
          </div>
          <ul className="space-y-2 text-white/80">
            <li className="eyebrow !text-gold-2">Harald&rsquo;s</li>
            <li className="pt-2"><Link href="/apres-ski" className="link-underline">{t.nav.apres}</Link></li>
            <li><Link href="/ristorante" className="link-underline">{t.nav.restaurant}</Link></li>
            <li><Link href="/listino" className="link-underline">{t.nav.drinks}</Link></li>
            <li><Link href="/privacy" className="link-underline">{t.footer.privacy}</Link></li>
            <li><Link href="/termini" className="link-underline">{t.footer.terms}</Link></li>
            <li><CookiePrefsButton label={t.footer.cookies} /></li>
            <li><Link href="/staff" className="link-underline">{t.nav.staff}</Link></li>
          </ul>
        </div>
        <p aria-hidden className="display-italic pointer-events-none mt-16 select-none text-center text-[24vw] leading-[0.75] text-white/[0.06] sm:text-[17rem]">
          Harald&rsquo;s
        </p>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {VENUE.name} · {t.footer.rights} · <span className="text-gold-2">{t.footer.beta}</span>
      </div>
    </footer>
  );
}
