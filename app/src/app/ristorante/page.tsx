import type { Metadata } from "next";
import { DemoLink } from "@/components/DemoLink";
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
      cta={{ href: "/prenota", label: t.nav.book }}
      extra={<p className="mt-10 text-muted">{t.restaurant.reserve} <DemoLink className="font-semibold text-royal">{VENUE.phone}</DemoLink>.</p>}
    />
  );
}
