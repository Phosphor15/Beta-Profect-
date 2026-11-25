import type { Metadata } from "next";
import Link from "next/link";
import { getDict } from "@/lib/lang";
import { DRINKS } from "@/lib/drinks";
import { formatEuro } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";
import { Photo } from "@/components/Photo";

export const metadata: Metadata = { title: "Listino bevande", alternates: { canonical: "/listino" } };

export default async function Listino() {
  const { lang, t } = await getDict();
  const fmt = (n: number) =>
    Number.isInteger(n) ? formatEuro(n, lang) : new Intl.NumberFormat(lang === "en" ? "en-GB" : "it-IT", { style: "currency", currency: "EUR" }).format(n);
  return (
    <>
      <PageHero eyebrow={t.drinks.eyebrow} title={t.drinks.title} intro={t.drinks.intro} />
      <nav className="wood-dark gold-trim-bottom sticky top-[4.5rem] z-30">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3">
          {DRINKS.map((c) => (
            <a key={c.id} href={`#${c.id}`} className="shrink-0 border border-gold/40 bg-black/25 px-3.5 py-1.5 text-sm hover:border-gold">
              {lang === "en" ? c.en : c.it}
            </a>
          ))}
        </div>
      </nav>
      <div className="mx-auto max-w-2xl px-4">
        <p className="mt-6 inline-block caps border border-gold/50 px-3 py-1 text-[0.65rem] text-gold">{t.drinks.beta}</p>
        {DRINKS.map((c) => (
          <section key={c.id} id={c.id} className="scroll-mt-36 pt-10">
            <div className="rule caps text-xs">✦</div>
            <h2 className="display mt-3 text-center text-4xl italic">{lang === "en" ? c.en : c.it}</h2>
            <ul className="mt-4">
              {c.items.map((i) => (
                <li key={i.name + (i.size ?? "")} className="flex items-baseline gap-3 py-2.5">
                  <span className="text-lg">{i.name}</span>
                  {i.size && <span className="text-sm italic text-muted">{i.size}</span>}
                  {i.top && <span className="caps text-[0.6rem] text-gold">✦ {t.drinks.featured}</span>}
                  <span className="leader" aria-hidden />
                  <span className="tabular-nums">{fmt(i.price)}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <section className="mx-auto max-w-6xl px-4 pt-20">
        <h2 className="display text-3xl">{t.drinks.zonesTitle}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {(["terrazza", "chalet"] as const).map((z) => (
            <Photo key={z} name={z === "terrazza" ? "terrace" : "chalet"} className="frame min-h-64">
              <div className="flex h-full min-h-64 flex-col justify-end p-6">
                <p className="display text-2xl">{t.booking.zones[z]}</p>
                <p className="mt-1 text-sm text-cream/80">{t.drinks.zonesText[z]}</p>
              </div>
            </Photo>
          ))}
        </div>
        <Link href="/prenota" className="btn btn-primary mt-8">{t.nav.book}</Link>
      </section>
    </>
  );
}
