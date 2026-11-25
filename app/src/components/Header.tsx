import Link from "next/link";
import { getDict } from "@/lib/lang";
import { LangSwitch } from "./LangSwitch";
import { MobileMenu } from "./MobileMenu";
import { HeaderShell } from "./HeaderShell";
import { NavLinks } from "./NavLinks";

export async function Header() {
  const { lang, t } = await getDict();
  const links = [
    { href: "/apres-ski", label: t.nav.apres },
    { href: "/ristorante", label: t.nav.restaurant },
    { href: "/eventi-privati", label: t.nav.privateEvents },
  ];
  // nel menu mobile anche le altre pagine
  const mobileLinks = [
    ...links,
    { href: "/listino", label: t.nav.drinks },
    { href: "/prenota#eventi", label: t.nav.events },
    { href: "/contatti", label: t.nav.contact },
  ];
  return (
    <HeaderShell>
      <div className="relative mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" className="group flex items-baseline gap-2" aria-label="Harald's — home">
          <span className="display-italic text-[1.75rem] leading-none tracking-tight">HARALD&rsquo;S</span>
          <span className="hidden text-[0.55rem] font-semibold uppercase tracking-[0.42em] text-white/70 sm:inline">Campo Smith</span>
        </Link>
        <NavLinks links={links} />
        <div className="flex items-center gap-3">
          <LangSwitch lang={lang} />
          <Link href="/prenota" className="btn btn-primary hidden !px-5 !py-2.5 !text-[0.72rem] sm:inline-flex">{t.nav.book}</Link>
          <MobileMenu links={mobileLinks} cta={t.nav.book} />
        </div>
      </div>
    </HeaderShell>
  );
}
