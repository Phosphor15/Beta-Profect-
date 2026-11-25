import type { Metadata } from "next";
import { getDict } from "@/lib/lang";
import { VENUE } from "@/lib/i18n";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = { title: "Ristorante", alternates: { canonical: "/ristorante" } };

export default async function Ristorante() {
  const { t } = await getDict();
  return (
    <InfoPage
      {...t.restaurant}
      photo="restaurant" position="center 25%"
      cta={{ href: `tel:${VENUE.phoneHref}`, label: `☎ ${VENUE.phone}` }}
      extra={<p className="mt-10 text-muted">{t.restaurant.reserve} <a className="font-semibold text-royal underline" href={`tel:${VENUE.phoneHref}`}>{VENUE.phone}</a>.</p>}
    />
  );
}
