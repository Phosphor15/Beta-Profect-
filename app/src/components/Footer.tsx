import Link from "next/link";
import { DemoLink } from "@/components/DemoLink";
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
            <span aria-hidden className="mt-4 flex h-1.5 w-24 overflow-hidden rounded-full"><span className="flex-1 bg-brand" /><span className="flex-1 bg-gold" /></span>
            <p className="mt-4 max-w-sm text-white/70">{t.footer.tagline}</p>
            <Link href="/prenota" className="btn btn-primary mt-8">{t.nav.book}</Link>
          </div>
          <div className="space-y-2 text-white/80">
            <p className="eyebrow !text-gold-2">{t.contact.title}</p>
            <p className="pt-2">{VENUE.address}<br />{VENUE.city}</p>
            <p><DemoLink>{VENUE.phone}</DemoLink></p>
            <p><DemoLink>{VENUE.email}</DemoLink></p>
            <p><DemoLink>Instagram {VENUE.instagramHandle}</DemoLink></p>
          </div>
          <ul className="space-y-2 text-white/80">
            <li className="eyebrow !text-gold-2">Harald&rsquo;s</li>
            <li className="pt-2"><Link href="/apres-ski" className="link-underline">{t.nav.apres}</Link></li>
            <li><Link href="/ristorante" className="link-underline">{t.nav.restaurant}</Link></li>
            <li><Link href="/eventi-privati" className="link-underline">{t.nav.privateEvents}</Link></li>
            <li><Link href="/listino" className="link-underline">{t.nav.drinks}</Link></li>
            <li><Link href="/contatti" className="link-underline">{t.nav.contact}</Link></li>
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
      <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 px-5 py-6 text-xs text-white/50 sm:flex-row sm:px-8">
        <span>© {new Date().getFullYear()} {VENUE.name} · {t.footer.rights} · <span className="text-gold-2">{t.footer.beta}</span></span>
        <span className="text-white/70">{t.footer.poweredBy} <span className="display-italic text-base text-white">Bardo.</span></span>
      </div>
    </footer>
  );
}
