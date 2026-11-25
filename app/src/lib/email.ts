import "server-only";
import QRCode from "qrcode";
import type { BookingRow } from "./db";
import { dicts, formatDate, formatEuro, VENUE, type Lang } from "./i18n";
import { publicUrl } from "./stripe";

export async function sendConfirmation(b: BookingRow) {
  const lang = (b.lang === "en" ? "en" : "it") as Lang;
  const t = dicts[lang];
  const link = `${publicUrl()}/prenotazione/${b.token}`;
  const subject = lang === "en"
    ? `Booking confirmed · ${VENUE.short} · ${formatDate(b.date, lang)}`
    : `Prenotazione confermata · ${VENUE.short} · ${formatDate(b.date, lang)}`;
  const qr = await QRCode.toDataURL(`${publicUrl()}/staff/checkin/${b.token}`, { margin: 1, width: 280 });
  const html = `
    <div style="font-family:Georgia,serif;max-width:520px;margin:auto;color:#0e1940">
      <h1 style="font-weight:500;color:#1e3c9c;border-bottom:2px solid #c9a45a;padding-bottom:8px">${VENUE.short}</h1>
      <p><strong>${t.page.status.confirmed}</strong> — ${t.page.code}: <strong>${b.code}</strong></p>
      <p>${t.page.date}: ${formatDate(b.date, lang)} · ${VENUE.apresStart}–${VENUE.apresEnd}<br/>
         ${t.page.zone}: ${t.booking.zones[b.zone]}<br/>
         ${t.page.guests}: ${b.guests}<br/>
         ${t.page.paid}: ${formatEuro(b.amount_cents / 100, lang)}</p>
      <p><img src="${qr}" alt="QR" width="220" height="220"/></p>
      <p>${t.page.qrHint}</p>
      <p><a href="${link}">${link}</a></p>
      <p style="font-size:12px;color:#6b7499">${VENUE.name} · ${VENUE.address}, ${VENUE.city} · ${VENUE.phone}</p>
    </div>`;

  if (!process.env.RESEND_API_KEY) {
    console.log(`[email:demo] A: ${b.email} · ${subject} · ${link}`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.EMAIL_FROM || "Harald's <onboarding@resend.dev>", to: [b.email], subject, html }),
  });
  if (!res.ok) console.error("[email] invio fallito", res.status, await res.text());
}
