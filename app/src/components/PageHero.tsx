export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-8 pt-12 sm:pt-16">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="display mt-3 text-4xl sm:text-6xl">{title}</h1>
      {intro && <p className="mt-4 max-w-2xl text-lg text-muted">{intro}</p>}
    </section>
  );
}
