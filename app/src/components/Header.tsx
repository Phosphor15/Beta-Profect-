import Link from "next/link";
import { getDict } from "@/lib/lang";
import { LangSwitch } from "./LangSwitch";
import { MobileMenu } from "./MobileMenu";

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
    <header className="no-print wood-dark gold-trim-bottom sticky top-0 z-40 shadow-lg shadow-black/40">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="display whitespace-nowrap text-2xl leading-none">
          Harald&rsquo;s<span className="ml-1.5 hidden align-middle text-[0.6rem] sm:inline font-sans font-semibold tracking-[0.2em] text-gold">SKI · BAR</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-cream">{l.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LangSwitch lang={lang} />
          <Link href="/prenota" className="btn btn-primary hidden !py-2 !text-sm sm:inline-flex">{t.nav.book}</Link>
          <MobileMenu links={links} cta={t.nav.book} />
        </div>
      </div>
    </header>
  );
}
