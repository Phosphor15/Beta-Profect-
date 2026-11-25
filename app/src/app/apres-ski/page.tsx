import type { Metadata } from "next";
import { getDict } from "@/lib/lang";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = { title: "Après-Ski", alternates: { canonical: "/apres-ski" } };

export default async function Apres() {
  const { t } = await getDict();
  return <InfoPage {...t.apres} photo="apres" position="center 40%" cta={{ href: "/prenota", label: t.nav.book }} />;
}
