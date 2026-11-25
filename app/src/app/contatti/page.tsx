import type { Metadata } from "next";
import { DemoLink } from "@/components/DemoLink";
import { getDict } from "@/lib/lang";
import { VENUE } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = { title: "Contatti", alternates: { canonical: "/contatti" } };

export default async function Contatti() {
  const { t } = await getDict();
  const rows: [string, React.ReactNode][] = [
    [t.contact.address, <>{VENUE.address}<br />{VENUE.city}<br /><DemoLink className="text-royal opacity-60">{t.contact.map}</DemoLink></>],
    [t.contact.phone, <DemoLink>{VENUE.phone}</DemoLink>],
    [t.contact.email, <DemoLink>{VENUE.email}</DemoLink>],
    ["Instagram", <DemoLink>{VENUE.instagramHandle}</DemoLink>],
    [t.contact.hours, t.contact.hoursText],
  ];
  return (
    <>
      <PageHero eyebrow={VENUE.name} title={t.contact.title} />
      <dl className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k} className="card p-6"><dt className="eyebrow">{k}</dt><dd className="mt-2 text-lg">{v}</dd></div>
        ))}
      </dl>
    </>
  );
}
