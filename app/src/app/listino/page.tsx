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
      <nav className="sticky top-[4.5rem] z-30 border-y border-line bg-snow/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-3 sm:px-8">
          {DRINKS.map((c) => (
            <a key={c.id} href={`#${c.id}`} className="shrink-0 rounded-full border border-line bg-paper px-4 py-2 text-sm font-medium transition hover:border-navy hover:bg-navy hover:text-white">
              {lang === "en" ? c.en : c.it}
            </a>
          ))}
        </div>
      </nav>
      <div className="mx-auto grid max-w-7xl gap-6 px-5 pt-10 sm:px-8 lg:grid-cols-2">
        <p className="inline-flex w-fit items-center gap-2 rounded-full bg-blush px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-sunset lg:col-span-2">● {t.drinks.beta}</p>
        {DRINKS.map((c, idx) => (
          <section key={c.id} id={c.id} className={`card reveal scroll-mt-40 p-7 sm:p-10 ${idx === 0 ? "lg:col-span-2 bg-[linear-gradient(135deg,#1f43c9,#101c45)] !border-transparent text-white" : ""}`}>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className={`display-italic text-5xl ${idx === 0 ? "text-gold-2" : "text-royal"}`}>{lang === "en" ? c.en : c.it}</h2>
              <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${idx === 0 ? "text-white/60" : "text-muted"}`}>{c.items.length} {lang === "en" ? "items" : "voci"}</span>
            </div>
            <ul className={`mt-6 ${idx === 0 ? "grid gap-x-12 sm:grid-cols-2" : ""}`}>
              {c.items.map((i) => (
                <li key={i.name + (i.size ?? "")} className="flex items-baseline gap-3 py-2.5">
                  <span className="text-lg">{i.name}</span>
                  {i.size && <span className={`text-sm ${idx === 0 ? "text-white/60" : "text-muted"}`}>{i.size}</span>}
                  {i.top && <span className="rounded-full bg-sunset px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-white">{t.drinks.featured}</span>}
                  <span className={`leader ${idx === 0 ? "!border-white/25" : ""}`} aria-hidden />
                  <span className="font-semibold tabular-nums">{fmt(i.price)}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <section className="mx-auto max-w-7xl px-5 pt-24 sm:px-8">
        <h2 className="display reveal text-5xl">{t.drinks.zonesTitle}</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {(["terrazza", "chalet"] as const).map((z, i) => (
            <Link key={z} href="/prenota" className="zoom-on-hover reveal group relative block min-h-[26rem] overflow-hidden rounded-[2rem] text-white" style={{ ["--d" as string]: `${i * 120}ms` }}>
              <Photo name={z === "terrazza" ? "terrace" : "chalet"} className="absolute inset-0" veil="linear-gradient(180deg, transparent 35%, rgba(16,28,69,.85))" />
              <div className="relative z-10 flex h-full min-h-[26rem] flex-col justify-end p-8">
                <span className={`mb-4 h-2 w-10 rounded-full ${z === "terrazza" ? "bg-royal-2" : "bg-gold"}`} />
                <p className="display text-4xl">{t.booking.zones[z]}</p>
                <p className="mt-2 max-w-sm text-white/80">{t.drinks.zonesText[z]}</p>
              </div>
            </Link>
          ))}
        </div>
        <Link href="/prenota" className="btn btn-primary mt-10">{t.nav.book}</Link>
      </section>
    </>
  );
}
