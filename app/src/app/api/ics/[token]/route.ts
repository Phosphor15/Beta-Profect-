import { bookingByToken } from "@/lib/booking";
import { VENUE } from "@/lib/i18n";
import { publicUrl } from "@/lib/stripe";

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const b = bookingByToken(token);
  if (!b || !["confirmed", "manual"].includes(b.status)) return new Response("Not found", { status: 404 });
  const d = b.date.replace(/-/g, "");
  const hm = (s: string) => s.replace(":", "") + "00";
  const esc = (s: string) => s.replace(/[,;\\]/g, (m) => `\\${m}`);
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Haralds//Booking//IT", "BEGIN:VEVENT",
    `UID:${b.code}@haraldsrestaurant.com`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
    `DTSTART;TZID=Europe/Rome:${d}T${hm(VENUE.apresStart)}`,
    `DTEND;TZID=Europe/Rome:${d}T${hm(VENUE.apresEnd)}`,
    `SUMMARY:${esc(`Après-ski · ${VENUE.short} (${b.code})`)}`,
    `LOCATION:${esc(`${VENUE.name}, ${VENUE.address}, ${VENUE.city}`)}`,
    `DESCRIPTION:${esc(`${publicUrl()}/prenotazione/${b.token}`)}`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  return new Response(ics, {
    headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": `attachment; filename="haralds-${b.code}.ics"` },
  });
}
