import Link from "next/link";
import { getDict } from "@/lib/lang";
import { LangSwitch } from "./LangSwitch";
import { MobileMenu } from "./MobileMenu";
import { Crest } from "./Crest";

export async function Header() {
  const { lang, t } = await getDict();
  const links = [
    { href: "/apres-ski", label: t.nav.apres },
    { href: "/ristorante", label: t.nav.restaurant },
    { href: "/prenota#eventi", label: t.nav.events },
    { href: "/listino", label: t.nav.drinks },
    { href: "/contatti", label: t.nav.contact },
  ];
  return (
    <header className="no-print wood-dark gold-trim-bottom sticky top-0 z-40">
      <div className="relative mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-3 whitespace-nowrap" aria-label="Harald's — home">
          <Crest size={40} ring={false} />
          <span className="leading-none">
            <span className="caps block text-[1.05rem] tracking-[0.3em] text-cream">Harald&rsquo;s</span>
            <span className="caps mt-1 hidden text-[0.58rem] tracking-[0.34em] text-gold sm:block">Ski Restaurant · Bar</span>
          </span>
        </Link>
        <nav className="caps hidden items-center gap-7 text-[0.72rem] text-muted lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-gold-2">{l.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LangSwitch lang={lang} />
          <Link href="/prenota" className="btn btn-primary hidden !px-4 !py-2.5 !text-[0.68rem] sm:inline-flex">{t.nav.book}</Link>
          <MobileMenu links={links} cta={t.nav.book} />
        </div>
      </div>
    </header>
  );
}
