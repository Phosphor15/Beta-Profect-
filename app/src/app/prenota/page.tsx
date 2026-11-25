import type { Metadata } from "next";
import { getDict } from "@/lib/lang";
import { getConfig, monthDays, romeNow, specialEvents, tables } from "@/lib/booking";
import { stripeEnabled } from "@/lib/stripe";
import { PageHero } from "@/components/PageHero";
import { BookingClient } from "@/components/BookingClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Prenota il tavolo",
  description: "Prenota il tuo tavolo après-ski da Harald's a Bardonecchia: Terrazza sulle piste o Sala chalet, 4–8 persone. Pagamento online, consumazione inclusa, QR all'ingresso.",
  alternates: { canonical: "/prenota" },
};

export default async function PrenotaPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const { lang, t } = await getDict();
  const sp = await searchParams;
  const cfg = await getConfig();
  const today = romeNow().date;
  const wanted = sp.date && /^\d{4}-\d{2}-\d{2}$/.test(sp.date) ? sp.date : null;
  const startMonth = (wanted ?? (today < cfg.seasonStart ? cfg.seasonStart : today)).slice(0, 7);

  return (
    <>
      <PageHero eyebrow={t.booking.eyebrow} title={t.booking.title} intro={t.booking.intro} />
      <BookingClient
        lang={lang}
        t={t}
        tables={await tables()}
        events={await specialEvents()}
        initialMonth={startMonth}
        initialDays={await monthDays(startMonth)}
        initialDate={wanted}
        minGuests={cfg.minGuests}
        maxGuests={cfg.maxGuests}
        depositPct={cfg.depositPct}
        demo={!stripeEnabled()}
      />
    </>
  );
}
