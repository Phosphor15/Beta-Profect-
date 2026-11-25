import type { Metadata } from "next";
import { getDict } from "@/lib/lang";
import { Photo } from "@/components/Photo";
import { PrivateEventForm } from "@/components/PrivateEventForm";

export const metadata: Metadata = { title: "Private Events", alternates: { canonical: "/eventi-privati" } };

export default async function EventiPrivati() {
  const { t } = await getDict();
  const p = t.privateEvents;
  const photos = ["apres", "chalet", "terrace", "restaurant"];
  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-14 sm:px-8 sm:pt-20">
      <p className="eyebrow animate-page">{p.eyebrow}</p>
      <h1 className="display-italic animate-page mt-4 text-6xl text-royal sm:text-8xl" style={{ animationDelay: "120ms" }}>{p.title}</h1>
      <p className="animate-page mt-6 max-w-2xl text-xl leading-relaxed text-muted" style={{ animationDelay: "220ms" }}>{p.intro}</p>

      <div className="mt-16 grid gap-5 sm:grid-cols-2">
        {p.types.map(([h, d], i) => (
          <div key={h} className="zoom-on-hover reveal group relative min-h-72 overflow-hidden rounded-[2rem] text-white" style={{ ["--d" as string]: `${i * 100}ms` }}>
            <Photo name={photos[i % photos.length]} className="absolute inset-0" veil="linear-gradient(180deg, transparent 30%, rgba(43,24,16,.88))" />
            <div className="relative z-10 flex h-full min-h-72 flex-col justify-end p-7">
              <h2 className="display text-3xl">{h}</h2>
              <p className="mt-2 max-w-md text-white/80">{d}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="card reveal mt-20 p-7 sm:p-10">
        <h2 className="display text-4xl">{p.formTitle}</h2>
        <PrivateEventForm t={p} kinds={p.types.map(([h]) => h)} />
      </section>
    </div>
  );
}
