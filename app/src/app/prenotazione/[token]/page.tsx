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
  let b = bookingByToken(token);

  // Ritorno da Stripe: verifichiamo subito il pagamento (il webhook resta la fonte principale).
  if (b && b.status === "hold" && sp.session_id && stripeEnabled() && sp.session_id === b.stripe_session) {
    try {
      const s = await stripe().checkout.sessions.retrieve(sp.session_id);
      if (s.payment_status === "paid" && markPaid(token, s.id)) {
        b = bookingByToken(token)!;
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
  const qr = ok ? await QRCode.toDataURL(`${publicUrl()}/staff/checkin/${b.token}`, { margin: 1, width: 640, color: { dark: "#0e1940", light: "#f2ead6" } }) : null;
  const statusColor = ok ? "text-pine" : b.status === "hold" ? "text-gold" : "text-danger";

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <p className="eyebrow">{t.page.title}</p>
      <h1 className="display mt-2 text-4xl capitalize">{formatDate(b.date, lang)}</h1>
      <p className={`mt-2 font-semibold ${statusColor}`}>● {t.page.status[b.status]}</p>

      {ok && qr && (
        <section className="mt-8 bg-cream p-2 text-center text-ink shadow-2xl shadow-black/50" style={{ border: "1px solid #c9a45a" }}>
          <div className="p-6" style={{ border: "1px solid #c9a45a", outline: "3px double rgba(201,164,90,.6)", outlineOffset: "-8px" }}>
          <p className="caps text-[0.65rem] text-[#8a6a2a]">Harald&rsquo;s · Campo Smith</p>
          <h2 className="display mt-2 text-3xl italic">{t.page.qrTitle}</h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr} alt={`QR ${b.code}`} className="mx-auto mt-4 w-full max-w-72" />
          <p className="mt-3 font-mono text-lg tracking-widest">{b.code}</p>
          <p className="mt-2 text-sm text-ink/70">{t.page.qrHint}</p>
          <p className="mt-1 text-xs text-ink/50">{t.page.brightness}</p>
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
          <div key={k} className="flex justify-between gap-4 px-4 py-3"><dt className="text-muted">{k}</dt><dd className="text-right font-semibold">{v}</dd></div>
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
