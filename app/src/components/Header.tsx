import Link from "next/link";
import { getDict } from "@/lib/lang";
import { LangSwitch } from "./LangSwitch";
import { MobileMenu } from "./MobileMenu";
import { HeaderShell } from "./HeaderShell";

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
    <HeaderShell>
      <div className="relative mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" className="group flex items-baseline gap-2" aria-label="Harald's — home">
          <span className="display-italic text-[1.9rem] leading-none">Harald&rsquo;s</span>
          <span className="hidden text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-gold sm:inline">Campo Smith</span>
        </Link>
        <nav className="hidden items-center gap-8 text-[0.8rem] font-medium uppercase tracking-[0.14em] lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="link-underline pb-0.5 opacity-90 hover:opacity-100">{l.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LangSwitch lang={lang} />
          <Link href="/prenota" className="btn btn-primary hidden !px-5 !py-2.5 !text-[0.72rem] sm:inline-flex">{t.nav.book}</Link>
          <MobileMenu links={links} cta={t.nav.book} />
        </div>
      </div>
    </HeaderShell>
  );
}
