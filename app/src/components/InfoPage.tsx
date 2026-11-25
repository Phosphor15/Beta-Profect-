import Link from "next/link";
import { Photo } from "./Photo";

export function InfoPage({
  eyebrow, title, intro, blocks, photo, cta, extra,
}: {
  eyebrow: string; title: string; intro: string; blocks: [string, string][];
  photo: string; cta: { href: string; label: string }; extra?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-12">
      <div className="grid items-end gap-8 md:grid-cols-2">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display mt-3 text-5xl sm:text-6xl">{title}</h1>
          <p className="mt-5 text-lg text-muted">{intro}</p>
        </div>
        <Photo name={photo} className="aspect-[4/3] rounded-3xl" label={title} />
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {blocks.map(([h, p]) => (
          <div key={h} className="wood gold-trim rounded-2xl p-6 shadow-xl shadow-black/40">
            <h2 className="display text-xl text-gold">{h}</h2>
            <p className="mt-2 text-cream/80">{p}</p>
          </div>
        ))}
      </div>
      {extra}
      <Link href={cta.href} className="btn btn-primary mt-10">{cta.label}</Link>
    </div>
  );
}
