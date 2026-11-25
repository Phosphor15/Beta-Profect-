"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { DayInfo } from "@/lib/booking";
import { formatDate, formatEuro, type Dict, type Lang } from "@/lib/i18n";
import { FloorPlan, type PlanTable } from "./FloorPlan";

type Zone = "terrazza" | "chalet";

interface Props {
  lang: Lang;
  t: Dict;
  tables: PlanTable[];
  events: DayInfo[];
  initialMonth: string;
  initialDays: DayInfo[];
  initialDate: string | null;
  minGuests: number;
  maxGuests: number;
  depositPct: number;
  demo: boolean;
}

const shiftMonth = (m: string, delta: number) => {
  const [y, mo] = m.split("-").map(Number);
  const d = new Date(Date.UTC(y, mo - 1 + delta, 1));
  return d.toISOString().slice(0, 7);
};

export function BookingClient(p: Props) {
  const { t, lang } = p;
  const [month, setMonth] = useState(p.initialMonth);
  const [days, setDays] = useState<DayInfo[]>(p.initialDays);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<string | null>(p.initialDate);
  const [zone, setZone] = useState<Zone | null>(null);
  const planRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async (m: string) => {
    setLoading(true);
    try {
      const r = await fetch(`/api/days?month=${m}`, { cache: "no-store" });
      const j = (await r.json()) as { days: DayInfo[] };
      setDays(j.days);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (month !== p.initialMonth) load(month); }, [month, p.initialMonth, load]);

  const day = useMemo(() => days.find((d) => d.date === date) ?? p.events.find((e) => e.date === date) ?? null, [days, date, p.events]);

  const pickDate = (d: string) => {
    setDate(d);
    setZone(null);
    if (d.slice(0, 7) !== month) setMonth(d.slice(0, 7));
    setTimeout(() => planRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const firstWeekday = (new Date(`${month}-01T12:00:00Z`).getUTCDay() + 6) % 7;
  const monthLabel = new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "it-IT", { month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${month}-01T12:00:00Z`));
  const anyOpen = days.some((d) => d.state === "open" || d.state === "soldout");

  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      {p.demo && (
        <p className="mb-8 inline-flex items-center gap-2 rounded-full bg-blush px-4 py-2 text-sm font-medium text-sunset">● {t.page.demoMode}</p>
      )}

      {p.events.length > 0 && (
        <section id="eventi" className="scroll-mt-20">
          <h2 className="display text-4xl">{t.booking.specialEvents}</h2>
          <div className="-mx-5 mt-6 flex snap-x gap-4 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8">
            {p.events.map((e) => {
              const name = (lang === "en" ? e.eventNameEn : e.eventName) ?? e.eventName;
              const ok = e.state === "open";
              return (
                <button
                  key={e.date}
                  onClick={() => ok && pickDate(e.date)}
                  disabled={!ok}
                  className={`card min-w-64 snap-start overflow-hidden p-0 text-left transition-all duration-500 ${date === e.date ? "ring-2 ring-royal" : ""} ${ok ? "card-hover" : "opacity-50"}`}
                >
                  <div className={`flex items-end justify-between px-5 py-4 text-white ${ok ? "bg-royal" : "bg-muted"}`}>
                    <span className="display text-5xl leading-none">{e.date.slice(8)}</span>
                    <span className="text-right text-[0.65rem] font-semibold uppercase tracking-[0.2em]">{formatDate(e.date, lang, { weekday: "short", month: "short" })}</span>
                  </div>
                  <p className="display px-5 pt-4 text-2xl leading-tight">{name}</p>
                  <p className="px-5 pb-5 pt-2 text-sm text-muted">
                    {ok ? `${t.booking.from} ${formatEuro(Math.min(e.prices.terrazza, e.prices.chalet), lang)}`
                      : e.state === "soldout" ? t.booking.soldOut : t.booking.closed}
                  </p>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <section aria-labelledby="cal-title">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="cal-title" className="display text-4xl">{t.booking.calendarTitle}</h2>
            <div className="flex items-center gap-1">
              <button onClick={() => setMonth(shiftMonth(month, -1))} aria-label={t.booking.prevMonth} className="grid h-10 w-10 place-items-center rounded-full border border-line transition hover:bg-navy hover:text-white">‹</button>
              <span className="min-w-36 text-center text-sm font-semibold capitalize">{monthLabel}</span>
              <button onClick={() => setMonth(shiftMonth(month, 1))} aria-label={t.booking.nextMonth} className="grid h-10 w-10 place-items-center rounded-full border border-line transition hover:bg-navy hover:text-white">›</button>
            </div>
          </div>
          <div className={`card mt-5 p-3 transition-opacity duration-300 sm:p-5 ${loading ? "opacity-50" : ""}`}>
            <div className="grid grid-cols-7 gap-1 text-center text-[0.7rem] font-semibold uppercase tracking-wider text-muted">
              {t.booking.weekdays.map((w) => <div key={w} className="py-1">{w}</div>)}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1">
              {Array.from({ length: firstWeekday }).map((_, i) => <div key={`e${i}`} />)}
              {days.map((d) => {
                const n = Number(d.date.slice(8));
                const sel = d.date === date;
                const bookable = d.state === "open";
                const label =
                  d.state === "soldout" ? t.booking.soldOut
                  : d.state === "closed" ? t.booking.closed
                  : d.state === "cutoff" ? t.booking.cutoff
                  : d.state === "open" ? formatEuro(Math.min(d.prices.terrazza, d.prices.chalet), lang)
                  : "";
                return (
                  <button
                    key={d.date}
                    disabled={!bookable}
                    onClick={() => pickDate(d.date)}
                    aria-pressed={sel}
                    aria-label={`${formatDate(d.date, lang)}${label ? ` · ${label}` : ""}${d.eventName ? ` · ${d.eventName}` : ""}`}
                    className={`relative flex aspect-square flex-col items-center justify-center rounded-2xl text-sm transition-all duration-300 sm:aspect-[1/0.9]
                      ${sel ? "scale-105 bg-royal text-white shadow-lg shadow-royal/30" : bookable ? "bg-snow hover:-translate-y-0.5 hover:bg-blush" : "text-muted/40"}
                      ${d.special && bookable && !sel ? "ring-1 ring-sunset/60" : ""}`}
                  >
                    <span className="font-semibold">{n}</span>
                    <span className={`hidden text-[0.6rem] leading-tight sm:block ${sel ? "text-white/80" : d.state === "soldout" ? "text-danger" : "text-muted"}`}>{label}</span>
                    {d.special && <span className={`absolute right-1 top-1 h-1.5 w-1.5 rounded-full ${sel ? "bg-gold-2" : "bg-sunset"}`} />}
                  </button>
                );
              })}
            </div>
            {!loading && !anyOpen && <p className="p-3 text-sm text-muted">{t.booking.noDays}</p>}
          </div>
          <p className="mt-3 flex items-center gap-2 text-xs text-muted">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-sunset" /> {t.booking.specialEvents}
          </p>
        </section>

        <section ref={planRef} className="scroll-mt-20" aria-labelledby="zone-title">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="zone-title" className="display text-4xl">{t.booking.pickZone}</h2>
            {day && <p className="rounded-full bg-royal px-3 py-1 text-xs font-semibold capitalize text-white">{formatDate(day.date, lang)}</p>}
          </div>
          <p className="mt-2 text-sm text-muted">{t.booking.zoneHint}</p>
          <div className="card relative mt-5 overflow-hidden p-2 sm:p-4">
            <FloorPlan
              tables={p.tables}
              free={day?.free ?? null}
              selected={zone}
              onSelect={setZone}
              t={t}
              disabled={!day || day.state !== "open"}
            />
            {!day && (
              <div className="absolute inset-0 grid place-items-center bg-snow/70 p-6 text-center font-medium backdrop-blur-[2px]">
                {t.booking.pickDayFirst}
              </div>
            )}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4">
            {(["terrazza", "chalet"] as Zone[]).map((z) => {
              const soldOut = day ? day.free[z] <= 0 : false;
              const ok = day?.state === "open" && !soldOut;
              return (
                <button
                  key={z}
                  disabled={!ok}
                  onClick={() => setZone(z)}
                  className={`card p-5 text-left transition-all duration-300 disabled:opacity-45 ${zone === z ? "ring-2 ring-royal" : "enabled:hover:-translate-y-1"}`}
                >
                  <span className={`inline-block h-2.5 w-2.5 rounded-full ${z === "terrazza" ? "bg-royal" : "bg-gold"}`} />
                  <p className="display mt-3 text-2xl">{t.booking.zones[z]}</p>
                  <p className="text-sm text-muted">
                    {day ? (soldOut ? t.booking.soldOut : `${formatEuro(day.prices[z], lang)} · ${day.free[z]} ${t.booking.freeTables}`) : "—"}
                  </p>
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-sm text-muted">{t.booking.legendNote}</p>
          <p className="mt-1 text-sm text-muted">
            {t.booking.menuNote} <Link href="/listino" className="link-underline font-semibold text-royal">{t.booking.seeDrinks} →</Link>
          </p>
        </section>
      </div>

      {day && zone && (
        <BookingDialog
          key={`${day.date}-${zone}`}
          {...p}
          day={day}
          zone={zone}
          onClose={() => setZone(null)}
          onChangeDay={() => { setZone(null); setDate(null); }}
          reload={() => load(month)}
        />
      )}
    </div>
  );
}

function BookingDialog({
  t, lang, day, zone, minGuests, maxGuests, depositPct, onClose, onChangeDay, reload,
}: Props & { day: DayInfo; zone: Zone; onClose: () => void; onChangeDay: () => void; reload: () => void }) {
  const router = useRouter();
  const ref = useRef<HTMLDialogElement>(null);
  const [guests, setGuests] = useState(minGuests);
  const [accepted, setAccepted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const d = ref.current;
    d?.showModal();
    return () => d?.close();
  }, []);

  const price = day.prices[zone];
  const due = Math.round((price * depositPct) / 100);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSending(true);
    const f = new FormData(e.currentTarget);
    try {
      const r = await fetch("/api/hold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: day.date, zone, guests, lang,
          name: f.get("name"), phone: f.get("phone"), email: f.get("email"), notes: f.get("notes"),
        }),
      });
      const j = (await r.json()) as { token?: string; error?: string };
      if (!r.ok || !j.token) {
        setError(t.booking.errors[j.error ?? "GENERIC"] ?? t.booking.errors.GENERIC);
        if (j.error === "TABLE_TAKEN") reload();
        setSending(false);
        return;
      }
      const pr = await fetch("/api/pay", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: j.token }) });
      const pj = (await pr.json()) as { url?: string };
      if (pj.url?.startsWith("http") && !pj.url.startsWith(window.location.origin)) window.location.href = pj.url;
      else router.push(pj.url ? new URL(pj.url, window.location.origin).pathname + new URL(pj.url, window.location.origin).search : `/prenotazione/${j.token}`);
    } catch {
      setError(t.booking.errors.GENERIC);
      setSending(false);
    }
  }

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
      className="animate-page m-auto w-[min(100%-1.5rem,34rem)] max-h-[92dvh] overflow-y-auto overscroll-contain rounded-[2rem] bg-paper p-0 text-navy shadow-2xl backdrop:bg-navy/60 backdrop:backdrop-blur-sm"
    >
      <form onSubmit={submit} className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow capitalize">{formatDate(day.date, lang)}</p>
            <h2 className="display mt-2 text-4xl">{t.booking.zones[zone]}</h2>
            <button type="button" onClick={onChangeDay} className="mt-1 text-xs text-muted underline">{t.booking.changeDay}</button>
          </div>
          <button type="button" onClick={onClose} aria-label={t.booking.close} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-snow transition hover:rotate-90 hover:bg-navy hover:text-white">✕</button>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-2xl bg-snow p-3 pl-5">
          <span className="text-sm font-semibold">{t.booking.guests}</span>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setGuests((g) => Math.max(minGuests, g - 1))} disabled={guests <= minGuests} className="grid h-10 w-10 place-items-center rounded-full bg-white shadow transition hover:bg-navy hover:text-white disabled:opacity-40" aria-label="−">−</button>
            <span className="display w-8 text-center text-3xl" aria-live="polite">{guests}</span>
            <button type="button" onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))} disabled={guests >= maxGuests} className="grid h-10 w-10 place-items-center rounded-full bg-white shadow transition hover:bg-navy hover:text-white disabled:opacity-40" aria-label="+">+</button>
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          <label className="grid gap-1 text-sm">{t.booking.name}<input name="name" required minLength={3} autoComplete="name" className="field" /></label>
          <label className="grid gap-1 text-sm">{t.booking.phone}<input name="phone" required type="tel" autoComplete="tel" placeholder="+39 …" className="field" /></label>
          <label className="grid gap-1 text-sm">{t.booking.email}<input name="email" required type="email" autoComplete="email" className="field" /></label>
          <label className="grid gap-1 text-sm">{t.booking.notes}<textarea name="notes" rows={2} maxLength={500} className="field" /></label>
        </div>

        <dl className="mt-6 space-y-2 rounded-2xl bg-sand/60 p-5 text-sm">
          <div className="flex justify-between"><dt className="text-muted">{t.booking.tablePrice}</dt><dd>{formatEuro(price, lang)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">{t.booking.included.replace("{amount}", formatEuro(price, lang))}</dt><dd>✓</dd></div>
          <div className="flex justify-between border-t border-line pt-2 text-base font-semibold"><dt>{t.booking.payNow}</dt><dd>{formatEuro(due, lang)}</dd></div>
          <p className="pt-1 text-xs text-muted">{t.booking.wholeNight} · <span className="font-semibold text-sunset">{t.booking.nonRefundable}</span></p>
        </dl>

        <label className="mt-4 flex items-start gap-2 text-sm">
          <input type="checkbox" required checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-1 accent-[#7a1e2c]" />
          <span>{t.booking.accept} <Link href="/termini" target="_blank" className="font-semibold text-royal underline">{t.booking.termsLink}</Link></span>
        </label>

        {error && <p role="alert" className="mt-4 rounded-lg bg-danger/15 p-3 text-sm text-danger">{error}</p>}

        <button type="submit" disabled={sending || !accepted} className="btn btn-primary mt-6 w-full">
          {sending ? t.booking.sending : `${t.booking.pay} · ${formatEuro(due, lang)}`}
        </button>
      </form>
    </dialog>
  );
}
