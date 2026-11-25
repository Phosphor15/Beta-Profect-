import Link from "next/link";
import { Photo } from "./Photo";

export function InfoPage({
  eyebrow, title, intro, blocks, photo, cta, extra, position = "center",
}: {
  eyebrow: string; title: string; intro: string; blocks: [string, string][];
  photo: string; cta: { href: string; label: string }; extra?: React.ReactNode; position?: string;
}) {
  const accents = ["bg-royal", "bg-sunset", "bg-gold"];
  return (
    <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-14 sm:px-8 sm:pt-20">
      <div className="grid items-center gap-12 md:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="eyebrow animate-page">{eyebrow}</p>
          <h1 className="display-italic animate-page mt-4 text-7xl text-royal sm:text-9xl" style={{ animationDelay: "120ms" }}>{title}</h1>
          <p className="animate-page mt-8 max-w-xl text-xl leading-relaxed text-muted" style={{ animationDelay: "220ms" }}>{intro}</p>
          <Link href={cta.href} className="btn btn-primary animate-page mt-10" style={{ animationDelay: "320ms" }}>{cta.label}</Link>
        </div>
        <div className="zoom-on-hover arch animate-page relative aspect-[4/5] overflow-hidden" style={{ animationDelay: "200ms" }}>
          <Photo name={photo} position={position} kenburns className="absolute inset-0" label={title} />
        </div>
      </div>
      <div className="mt-24 grid gap-5 sm:grid-cols-3">
        {blocks.map(([h, p], i) => (
          <div key={h} className="card card-hover reveal p-8" style={{ ["--d" as string]: `${i * 110}ms` }}>
            <span className={`block h-2 w-10 rounded-full ${accents[i % 3]}`} />
            <h2 className="display mt-6 text-3xl">{h}</h2>
            <p className="mt-3 text-muted">{p}</p>
          </div>
        ))}
      </div>
      {extra}
    </div>
  );
}
