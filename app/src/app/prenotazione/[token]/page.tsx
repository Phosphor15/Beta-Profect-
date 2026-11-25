import type { Metadata } from "next";
import Link from "next/link";
import QRCode from "qrcode";
import { getDict } from "@/lib/lang";
import { bookingByToken, markPaid } from "@/lib/booking";
import { sendConfirmation } from "@/lib/email";
import { publicUrl, stripe, stripeEnabled, stripeTestMode } from "@/lib/stripe";
import { formatDate, formatEuro, VENUE } from "@/lib/i18n";
import { BookingActions } from "@/components/BookingActions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "La tua prenotazione", robots: { index: false } };

export default async function BookingPage({
  params, searchParams,
}: { params: Promise<{ token: string }>; searchParams: Promise<{ session_id?: string; paid?: string }> }) {
  const { token } = await params;
  const sp = await searchParams;
  const { lang, t } = await getDict();
  let b = await bookingByToken(token);

  // Ritorno da Stripe: verifichiamo subito il pagamento (il webhook resta la fonte principale).
  if (b && b.status === "hold" && sp.session_id && stripeEnabled() && sp.session_id === b.stripe_session) {
    try {
      const s = await stripe().checkout.sessions.retrieve(sp.session_id);
      if (s.payment_status === "paid" && await markPaid(token, s.id)) {
        b = (await bookingByToken(token))!;
        await sendConfirmation(b);
      }
    } catch (e) {
      console.error("[stripe] verifica sessione fallita", e);
    }
  }

  if (!b) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="display text-3xl">{t.page.notFound}</p>
        <Link href="/prenota" className="btn btn-primary mt-6">{t.page.back}</Link>
      </div>
    );
  }

  const ok = b.status === "confirmed" || b.status === "manual";
  const qr = ok ? await QRCode.toDataURL(`${publicUrl()}/staff/checkin/${b.token}`, { margin: 1, width: 640, color: { dark: "#2b1810", light: "#ffffff" } }) : null;
  const statusColor = ok ? "bg-pine/12 text-pine" : b.status === "hold" ? "bg-blush text-sunset" : "bg-danger/10 text-danger";

  return (
    <div className="mx-auto max-w-xl px-5 py-14 sm:py-20">
      <p className="eyebrow">{t.page.title}</p>
      <h1 className="display animate-page mt-3 text-5xl capitalize sm:text-6xl">{formatDate(b.date, lang)}</h1>
      <p className={`mt-4 inline-flex rounded-full px-4 py-1.5 text-sm font-semibold ${statusColor}`}>● {t.page.status[b.status]}</p>

      {ok && qr && (
        <section className="animate-page mt-8 overflow-hidden rounded-[2rem] bg-paper text-center shadow-[0_40px_80px_-40px_rgba(43,24,16,.55)]" style={{ animationDelay: "150ms" }}>
          <div className="bg-[linear-gradient(135deg,#7a1e2c,#2b1810)] px-6 pb-8 pt-7 text-white">
            <p className="display-italic text-3xl">Harald&rsquo;s</p>
            <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-gold-2">Après-Ski · Campo Smith</p>
          </div>
          <div className="relative border-t-2 border-dashed border-line">
            <span className="absolute -left-4 -top-4 h-8 w-8 rounded-full bg-snow" />
            <span className="absolute -right-4 -top-4 h-8 w-8 rounded-full bg-snow" />
          </div>
          <div className="p-6 text-navy">
          <h2 className="display text-3xl">{t.page.qrTitle}</h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr} alt={`QR ${b.code}`} className="mx-auto mt-4 w-full max-w-72" />
          <p className="mt-3 font-mono text-lg tracking-widest">{b.code}</p>
          <p className="mt-2 text-sm text-muted">{t.page.qrHint}</p>
          <p className="mt-1 text-xs text-muted/80">{t.page.brightness}</p>
          {b.checked_in_at && (
            <p className="mt-3 rounded-lg bg-pine/15 p-2 text-sm font-semibold text-pine">
              {t.page.checkedIn.replace("{time}", new Date(b.checked_in_at).toLocaleTimeString(lang === "en" ? "en-GB" : "it-IT", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Rome" }))}
            </p>
          )}
          </div>
        </section>
      )}

      <dl className="card mt-6 divide-y divide-line text-sm">
        {[
          [t.page.code, b.code],
          [t.page.time, `${VENUE.apresStart} – ${VENUE.apresEnd}`],
          [t.page.zone, t.booking.zones[b.zone]],
          ...(b.table_label && ok ? [[t.page.table, b.table_label]] : []),
          [t.page.guests, String(b.guests)],
          [ok ? t.page.paid : t.page.total, formatEuro(b.amount_cents / 100, lang)],
          [t.page.included, formatEuro(b.price_cents / 100, lang)],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 px-6 py-4"><dt className="text-muted">{k}</dt><dd className="text-right font-semibold">{v}</dd></div>
        ))}
      </dl>

      {ok && (
        <>
          {sp.paid && <p className="mt-4 text-sm text-pine">{t.page.emailSent}</p>}
          <a href={`/api/ics/${b.token}`} className="btn btn-ghost mt-4 w-full">📅 {t.page.ics}</a>
        </>
      )}

      {b.status === "hold" && (
        <BookingActions
          token={b.token}
          expiresAt={b.hold_expires_at ?? 0}
          t={t}
          paidReturn={!!sp.session_id}
          note={stripeEnabled() ? (stripeTestMode() ? t.page.testMode : null) : t.page.demoMode}
        />
      )}

      {(b.status === "expired" || b.status === "cancelled") && (
        <Link href="/prenota" className="btn btn-primary mt-6 w-full">{t.page.back}</Link>
      )}

      <p className="mt-6 text-xs text-muted">{t.page.nonRefundable}</p>
      <p className="mt-2 text-xs text-muted">{VENUE.name} · {VENUE.address}, {VENUE.city} · <a href={`tel:${VENUE.phoneHref}`} className="underline">{VENUE.phone}</a></p>
    </div>
  );
}
