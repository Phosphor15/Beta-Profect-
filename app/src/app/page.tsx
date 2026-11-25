import Link from "next/link";
import { getDict } from "@/lib/lang";
import { getConfig, specialEvents } from "@/lib/booking";
import { formatDate, formatEuro, VENUE } from "@/lib/i18n";
import { Photo } from "@/components/Photo";
import { Marquee } from "@/components/Marquee";
import { RotatingWord } from "@/components/RotatingWord";

export const dynamic = "force-dynamic";

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default async function Home() {
  const { lang, t } = await getDict();
  const events = (await specialEvents()).slice(0, 4);
  const cfg = await getConfig();

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative -mt-[4.5rem] h-[100svh] min-h-[640px] overflow-hidden bg-navy text-white">
        <Photo
          name="hero"
          kenburns
          position="center 35%"
          className="absolute inset-0"
          label="Harald's, Campo Smith"
          veil="linear-gradient(180deg, rgba(16,28,69,.55) 0%, rgba(16,28,69,.1) 35%, rgba(16,28,69,.25) 60%, rgba(16,28,69,.92) 100%)"
        />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-24 sm:px-8 sm:pb-28">
          <p className="eyebrow animate-page !text-gold-2" style={{ animationDelay: "150ms" }}>{t.hero2.eyebrow}</p>
          <h1 className="display-italic animate-page mt-4 text-[22vw] leading-[0.82] sm:text-[11rem] lg:text-[13rem]" style={{ animationDelay: "250ms" }}>
            Harald&rsquo;s
          </h1>
          <div className="animate-page mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between" style={{ animationDelay: "450ms" }}>
            <p className="max-w-xl text-2xl font-light leading-snug sm:text-3xl">
              {t.hero2.lead}{" "}
              <RotatingWord words={t.hero2.words} className="display-italic text-gold-2" />
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/prenota" className="btn btn-primary">{t.hero2.ctaBook} <Arrow /></Link>
              <Link href="/listino" className="btn btn-glass">{t.hero2.ctaMenu}</Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.62rem] uppercase tracking-[0.3em] text-white/70 sm:flex">
          {t.hero2.scroll}
          <span className="h-10 w-px animate-pulse bg-white/60" />
        </div>
      </section>

      {/* ---------- NASTRO ---------- */}
      <Marquee items={t.hero2.marquee} className="bg-royal py-4 text-sm font-medium uppercase tracking-[0.2em] text-white" />

      {/* ---------- INTRO ---------- */}
      <section className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <p className="eyebrow reveal">{t.intro.eyebrow}</p>
        <p className="display reveal mt-6 text-4xl leading-[1.12] sm:text-6xl" style={{ ["--d" as string]: "100ms" }}>
          {t.intro.a} <span className="display-italic text-sunset">{t.intro.b}</span>{t.intro.c}{" "}
          <span className="display-italic text-royal">{t.intro.d}</span>{t.intro.e}
        </p>
        <dl className="mt-16 grid gap-8 border-t border-line pt-10 sm:grid-cols-3">
          {t.intro.stats.map(([n, l], i) => (
            <div key={l} className="reveal" style={{ ["--d" as string]: `${i * 120}ms` }}>
              <dt className="display text-6xl text-royal">{n}</dt>
              <dd className="mt-2 text-muted">{l}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---------- DUE ESPERIENZE (archi) ---------- */}
      <section className="mx-auto grid max-w-7xl gap-14 px-5 pb-28 sm:px-8 md:grid-cols-2 md:gap-10">
        {[
          { photo: "restaurant", pos: "center 25%", title: t.duo.restTitle, text: t.duo.restText, cta: t.duo.restCta, href: "/ristorante", accent: "text-gold" },
          { photo: "apres", pos: "center 40%", title: t.duo.apresTitle, text: t.duo.apresText, cta: t.duo.apresCta, href: "/apres-ski", accent: "text-sunset" },
        ].map((x, i) => (
          <Link key={x.href} href={x.href} className={`group reveal block ${i === 1 ? "md:mt-24" : ""}`} style={{ ["--d" as string]: `${i * 150}ms` }}>
            <div className="zoom-on-hover arch relative aspect-[4/5] overflow-hidden">
              <Photo name={x.photo} position={x.pos} className="absolute inset-0" label={x.title} />
            </div>
            <div className="mt-6 flex items-end justify-between gap-6">
              <div>
                <h2 className="display text-5xl">{x.title}</h2>
                <p className="mt-3 max-w-md text-muted">{x.text}</p>
              </div>
              <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-full border border-line transition-all duration-500 group-hover:bg-navy group-hover:text-white ${x.accent}`}>
                <Arrow />
              </span>
            </div>
          </Link>
        ))}
      </section>

      {/* ---------- EVENTI ---------- */}
      {events.length > 0 && (
        <section className="bg-sand py-24 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="reveal">
                <p className="eyebrow">{t.home.eventsEyebrow}</p>
                <h2 className="display mt-3 text-5xl sm:text-6xl">{t.home.eventsTitle}</h2>
              </div>
              <Link href="/prenota#eventi" className="link-underline reveal text-sm font-semibold uppercase tracking-[0.14em] text-royal">
                {t.home.allEvents} →
              </Link>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {events.map((e, i) => {
                const name = (lang === "en" ? e.eventNameEn : e.eventName) ?? e.eventName ?? "";
                const open = e.state === "open";
                return (
                  <Link
                    key={e.date}
                    href={open ? `/prenota?date=${e.date}` : "/contatti"}
                    className="card card-hover reveal group flex min-h-72 flex-col overflow-hidden p-0"
                    style={{ ["--d" as string]: `${i * 100}ms` }}
                  >
                    <div className={`flex items-end justify-between p-6 text-white ${["bg-royal", "bg-sunset", "bg-navy", "bg-gold"][i % 4]}`}>
                      <span className="display text-7xl leading-none">{e.date.slice(8)}</span>
                      <span className="text-right text-xs font-semibold uppercase tracking-[0.2em]">
                        {formatDate(e.date, lang, { month: "short" })}<br />{formatDate(e.date, lang, { weekday: "short" })}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-6">
                      <h3 className="display text-2xl leading-tight transition-colors group-hover:text-royal">{name}</h3>
                      <p className="mt-6 text-sm text-muted">
                        {open ? `${t.booking.from} ${formatEuro(Math.min(e.prices.terrazza, e.prices.chalet), lang)}` : e.state === "soldout" ? t.booking.soldOut : t.booking.closed}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ---------- TAVOLI ---------- */}
      <section className="relative overflow-hidden bg-royal text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 sm:px-8 md:grid-cols-[1.1fr_1fr] md:py-32">
          <div>
            <p className="eyebrow reveal !text-gold-2">{t.tables.eyebrow}</p>
            <h2 className="display reveal mt-4 text-5xl sm:text-7xl" style={{ ["--d" as string]: "80ms" }}>
              {t.tables.title} <span className="display-italic text-gold-2">{t.tables.titleItalic}</span>
            </h2>
            <p className="reveal mt-6 max-w-lg text-lg text-white/80" style={{ ["--d" as string]: "160ms" }}>{t.tables.text}</p>
            <ol className="mt-12 grid gap-6 sm:grid-cols-2">
              {t.home.steps.map(([title, text], i) => (
                <li key={title} className="reveal flex gap-4" style={{ ["--d" as string]: `${200 + i * 90}ms` }}>
                  <span className="display-italic grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/10 text-xl text-gold-2">{i + 1}</span>
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-1 text-sm text-white/70">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link href="/prenota" className="btn btn-primary reveal mt-12">{t.tables.cta} <Arrow /></Link>
          </div>
          <div className="reveal relative" style={{ ["--d" as string]: "150ms" }}>
            <div className="zoom-on-hover arch relative aspect-[3/4] overflow-hidden">
              <Photo name="terrace" position="center 60%" className="absolute inset-0" label={t.booking.zones.terrazza} />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-3xl bg-white p-5 text-navy shadow-2xl sm:block">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{t.booking.zones.terrazza}</p>
              <p className="display mt-1 text-3xl">{t.booking.from} {formatEuro(cfg.prices.standard.terrazza, lang)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- INSTAGRAM ---------- */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="reveal">
            <p className="eyebrow">{t.home.igEyebrow}</p>
            <h2 className="display mt-3 text-5xl">{t.home.igTitle}</h2>
            <p className="mt-2 font-medium text-royal">{VENUE.instagramHandle}</p>
          </div>
          <a href={VENUE.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost reveal">{t.home.igCta}</a>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {[1, 2, 3, 4].map((n, i) => (
            <a
              key={n}
              href={VENUE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram ${n}`}
              className={`zoom-on-hover reveal relative block aspect-square overflow-hidden rounded-3xl ${i % 2 ? "sm:translate-y-8" : ""}`}
              style={{ ["--d" as string]: `${i * 90}ms` }}
            >
              <Photo name={`gallery-${n}`} className="absolute inset-0" />
            </a>
          ))}
        </div>
      </section>

      {/* ---------- FINALE ---------- */}
      <section className="px-5 pb-8 sm:px-8">
        <div className="grain relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[linear-gradient(120deg,#ff6b4a_0%,#ff8a5c_35%,#f0cf85_100%)] px-6 py-20 text-center text-navy sm:py-28">
          <h2 className="display reveal text-5xl sm:text-8xl">
            {t.finale.title} <span className="display-italic text-white">{t.finale.titleItalic}</span>
          </h2>
          <p className="reveal mx-auto mt-6 max-w-md text-lg text-navy/80" style={{ ["--d" as string]: "100ms" }}>{t.finale.text}</p>
          <Link href="/prenota" className="btn btn-royal reveal mt-10" style={{ ["--d" as string]: "200ms" }}>{t.finale.cta} <Arrow /></Link>
        </div>
      </section>
    </>
  );
}
