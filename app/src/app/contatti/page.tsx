import type { Metadata } from "next";
import { getDict } from "@/lib/lang";
import { VENUE } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = { title: "Contatti", alternates: { canonical: "/contatti" } };

export default async function Contatti() {
  const { t } = await getDict();
  const rows: [string, React.ReactNode][] = [
    [t.contact.address, <>{VENUE.address}<br />{VENUE.city}<br /><a className="text-gold underline" href={VENUE.maps} target="_blank" rel="noopener noreferrer">{t.contact.map}</a></>],
    [t.contact.phone, <a className="hover:text-gold" href={`tel:${VENUE.phoneHref}`}>{VENUE.phone}</a>],
    [t.contact.email, <a className="hover:text-gold" href={`mailto:${VENUE.email}`}>{VENUE.email}</a>],
    ["Instagram", <a className="hover:text-gold" href={VENUE.instagram} target="_blank" rel="noopener noreferrer">{VENUE.instagramHandle}</a>],
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
