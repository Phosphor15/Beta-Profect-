import { NextResponse } from "next/server";
import { bookingByToken, markPaid } from "@/lib/booking";
import { sendConfirmation } from "@/lib/email";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "webhook non configurato" }, { status: 400 });
  const sig = req.headers.get("stripe-signature") ?? "";
  let event;
  try {
    event = stripe().webhooks.constructEvent(await req.text(), sig, secret);
  } catch {
    return NextResponse.json({ error: "firma non valida" }, { status: 400 });
  }
  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const s = event.data.object;
    const token = s.metadata?.token;
    if (token && s.payment_status === "paid" && markPaid(token, s.id)) {
      const b = bookingByToken(token);
      if (b) await sendConfirmation(b);
    }
  }
  return NextResponse.json({ received: true });
}
