import Link from "next/link";
import { getDict } from "@/lib/lang";
import { specialEvents } from "@/lib/booking";
import { VENUE } from "@/lib/i18n";
import { Photo } from "@/components/Photo";
import { EventCard } from "@/components/EventCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { lang, t } = await getDict();
  const events = specialEvents().slice(0, 3);
  return (
    <>
      <Photo name="hero" className="-mt-16 min-h-[92svh]" label="Harald's, Campo Smith">
        <div className="mx-auto flex min-h-[92svh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28">
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1 className="display mt-4 text-5xl leading-[0.95] sm:text-7xl md:text-8xl">
            {t.hero.title1}<br /><span className="italic text-gold">{t.hero.title2}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-cream/85">{t.hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/prenota" className="btn btn-primary">{t.hero.ctaBook}</Link>
            <Link href="/listino" className="btn btn-ghost bg-ink/40">{t.hero.ctaMenu}</Link>
          </div>
        </div>
      </Photo>
      <div className="beam rounded-none" aria-hidden />

      {events.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">{t.home.eventsEyebrow}</p>
              <h2 className="display mt-2 text-3xl sm:text-4xl">{t.home.eventsTitle}</h2>
            </div>
            <Link href="/prenota#eventi" className="text-sm text-gold hover:underline">{t.home.allEvents} →</Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {events.map((e) => <EventCard key={e.date} e={e} lang={lang} t={t} href={`/prenota?date=${e.date}`} />)}
          </div>
        </section>
      )}

      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 pt-24 md:grid-cols-2">
        <Photo name="apres" className="aspect-[4/5] rounded-3xl" label="Après-ski" />
        <div>
          <p className="eyebrow">{t.home.apresEyebrow}</p>
          <h2 className="display mt-3 text-4xl">{t.home.apresTitle}</h2>
          <p className="mt-4 text-lg text-muted">{t.home.apresText}</p>
          <Link href="/apres-ski" className="btn btn-ghost mt-6">{t.nav.apres} →</Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-24">
        <div className="wood gold-trim rounded-3xl p-6 shadow-2xl shadow-black/50 sm:p-10">
          <p className="eyebrow">{t.home.stepsEyebrow}</p>
          <h2 className="display mt-3 max-w-2xl text-3xl sm:text-4xl">{t.home.stepsTitle}</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-4">
            {t.home.steps.map(([title, text], i) => (
              <li key={title}>
                <span className="display text-3xl text-gold">{["I", "II", "III", "IV"][i]}</span>
                <h3 className="mt-2 font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-cream/75">{text}</p>
              </li>
            ))}
          </ol>
          <Link href="/prenota" className="btn btn-primary mt-8">{t.nav.book}</Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 pt-24 md:grid-cols-2">
        <div className="md:order-2"><Photo name="restaurant" className="aspect-[4/5] rounded-3xl" label="Ristorante" /></div>
        <div>
          <p className="eyebrow">{t.home.restEyebrow}</p>
          <h2 className="display mt-3 text-4xl">{t.home.restTitle}</h2>
          <p className="mt-4 text-lg text-muted">{t.home.restText}</p>
          <Link href="/ristorante" className="btn btn-ghost mt-6">{t.nav.restaurant} →</Link>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pt-24"><div className="beam" aria-hidden /></div>
      <section className="mx-auto max-w-6xl px-4 pt-16">
        <p className="eyebrow">{t.home.igEyebrow}</p>
        <h2 className="display mt-2 text-3xl sm:text-4xl">{t.home.igTitle}</h2>
        <p className="mt-3 max-w-xl text-muted">{t.home.igText}</p>
        <div className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <a key={n} href={VENUE.instagram} target="_blank" rel="noopener noreferrer" aria-label={`Instagram ${n}`}>
              <Photo name={`gallery-${n}`} className="aspect-square rounded-xl transition hover:opacity-80" />
            </a>
          ))}
        </div>
        <a href={VENUE.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-6">
          {t.home.igCta} {VENUE.instagramHandle}
        </a>
      </section>
    </>
  );
}
