import "server-only";
import Stripe from "stripe";

export const stripeEnabled = () => !!process.env.STRIPE_SECRET_KEY;
export const stripeTestMode = () => (process.env.STRIPE_SECRET_KEY ?? "").startsWith("sk_test_");

let client: Stripe | null = null;
export function stripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY non impostata");
  client ??= new Stripe(process.env.STRIPE_SECRET_KEY);
  return client;
}

export const publicUrl = () =>
  (process.env.PUBLIC_URL || process.env.URL || "http://localhost:3000").replace(/\/$/, ""); // URL = indirizzo del sito su Netlify
