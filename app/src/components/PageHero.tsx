export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-10 pt-14 text-center sm:pt-20">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="display mt-3 text-5xl sm:text-7xl">{title}</h1>
      <div className="rule mx-auto mt-6 max-w-xs text-[0.6rem]" aria-hidden>✦</div>
      {intro && <p className="mx-auto mt-6 max-w-2xl text-xl italic text-muted">{intro}</p>}
    </section>
  );
}
