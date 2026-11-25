import Link from "next/link";
import { getDict } from "@/lib/lang";
import { specialEvents } from "@/lib/booking";
import { VENUE } from "@/lib/i18n";
import { Photo } from "@/components/Photo";
import { EventCard } from "@/components/EventCard";
import { Crest } from "@/components/Crest";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { lang, t } = await getDict();
  const events = (await specialEvents()).slice(0, 3);
  return (
    <>
      <Photo name="hero" className="-mt-[4.5rem] min-h-[94svh]" label="Harald's, Campo Smith" position="center 38%" veil={0.55}>
        <div className="mx-auto flex min-h-[94svh] max-w-4xl flex-col items-center justify-center px-4 pb-16 pt-32 text-center">
          <Crest size={132} />
          <p className="eyebrow mt-8">{t.hero.eyebrow}</p>
          <h1 className="display mt-3 text-6xl leading-none sm:text-8xl md:text-9xl">{t.hero.title1}</h1>
          <p className="caps mt-5 text-[0.7rem] text-gold-2 sm:text-sm">{t.hero.title2}</p>
          <div className="rule mt-8 w-full max-w-md text-xs" aria-hidden>✦</div>
          <p className="mt-6 max-w-xl text-xl italic text-cream/85">{t.hero.subtitle}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/prenota" className="btn btn-primary">{t.hero.ctaBook}</Link>
            <Link href="/listino" className="btn btn-ghost bg-ink/40">{t.hero.ctaMenu}</Link>
          </div>
        </div>
      </Photo>

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
        <Photo name="apres" className="frame aspect-[4/5]" label="Après-ski" />
        <div>
          <p className="eyebrow">{t.home.apresEyebrow}</p>
          <h2 className="display mt-3 text-4xl">{t.home.apresTitle}</h2>
          <p className="mt-4 text-lg text-muted">{t.home.apresText}</p>
          <Link href="/apres-ski" className="btn btn-ghost mt-6">{t.nav.apres} →</Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-24">
        <div className="wood p-8 text-center sm:p-14">
          <p className="eyebrow">{t.home.stepsEyebrow}</p>
          <h2 className="display mx-auto mt-3 max-w-2xl text-3xl italic sm:text-5xl">{t.home.stepsTitle}</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-4">
            {t.home.steps.map(([title, text], i) => (
              <li key={title}>
                <span className="display text-4xl italic text-gold-2">{["I", "II", "III", "IV"][i]}</span>
                <h3 className="mt-2 font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-cream/75">{text}</p>
              </li>
            ))}
          </ol>
          <Link href="/prenota" className="btn btn-primary mt-8">{t.nav.book}</Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 pt-24 md:grid-cols-2">
        <div className="md:order-2"><Photo name="restaurant" className="frame aspect-[4/5]" label="Ristorante" position="center 30%" /></div>
        <div>
          <p className="eyebrow">{t.home.restEyebrow}</p>
          <h2 className="display mt-3 text-4xl">{t.home.restTitle}</h2>
          <p className="mt-4 text-lg text-muted">{t.home.restText}</p>
          <Link href="/ristorante" className="btn btn-ghost mt-6">{t.nav.restaurant} →</Link>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pt-24"><div className="rule text-xs" aria-hidden>✦</div></div>
      <section className="mx-auto max-w-6xl px-4 pt-16">
        <p className="eyebrow">{t.home.igEyebrow}</p>
        <h2 className="display mt-2 text-3xl sm:text-4xl">{t.home.igTitle}</h2>
        <p className="mt-3 max-w-xl text-muted">{t.home.igText}</p>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <a key={n} href={VENUE.instagram} target="_blank" rel="noopener noreferrer" aria-label={`Instagram ${n}`}>
              <Photo name={`gallery-${n}`} className="aspect-square border border-gold/30 transition hover:opacity-80" />
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
