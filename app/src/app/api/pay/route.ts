import { NextResponse } from "next/server";
import { bookingByToken, markPaid, setStripeSession } from "@/lib/booking";
import { sendConfirmation } from "@/lib/email";
import { publicUrl, stripe, stripeEnabled } from "@/lib/stripe";
import { dicts, formatDate, VENUE } from "@/lib/i18n";

export async function POST(req: Request) {
  const { token } = (await req.json().catch(() => ({}))) as { token?: string };
  const b = token ? bookingByToken(token) : undefined;
  if (!b) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  if (b.status !== "hold") return NextResponse.json({ error: "NOT_PAYABLE", status: b.status }, { status: 409 });

  const back = `${publicUrl()}/prenotazione/${b.token}`;

  if (!stripeEnabled()) {
    // MODALITÀ DEMO: nessun pagamento reale, la prenotazione viene confermata subito.
    if (markPaid(b.token)) await sendConfirmation({ ...b, status: "confirmed" });
    return NextResponse.json({ url: `${back}?paid=1` });
  }

  const t = dicts[b.lang === "en" ? "en" : "it"];
  // Stripe richiede almeno 30 minuti di validità per il checkout: l'hold viene allungato di conseguenza.
  const expiresAt = Date.now() + 31 * 60_000;
  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    customer_email: b.email,
    locale: b.lang === "en" ? "en" : "it",
    line_items: [{
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: b.amount_cents,
        product_data: {
          name: `${VENUE.short} · ${t.booking.zones[b.zone]} · ${b.guests} ${t.page.guests.toLowerCase()}`,
          description: `${formatDate(b.date, b.lang === "en" ? "en" : "it")} · ${t.page.code} ${b.code}`,
        },
      },
    }],
    metadata: { token: b.token, code: b.code },
    // La sessione scade con l'hold (minimo consentito da Stripe: 30 minuti)
    expires_at: Math.floor(expiresAt / 1000),
    success_url: `${back}?paid=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: back,
  });
  setStripeSession(b.token, session.id, expiresAt + 60_000);
  return NextResponse.json({ url: session.url });
}
