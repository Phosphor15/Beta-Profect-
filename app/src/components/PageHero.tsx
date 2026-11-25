export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  // Titolo con l'ultima parola in corsivo, per il tocco "editoriale"
  const words = title.split(" ");
  const last = words.pop();
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(255,107,74,.22),transparent_65%)]" />
      <div aria-hidden className="pointer-events-none absolute -left-40 top-10 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(31,67,201,.14),transparent_65%)]" />
      <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-16 sm:px-8 sm:pt-24">
        <p className="eyebrow animate-page">{eyebrow}</p>
        <h1 className="display animate-page mt-4 text-6xl sm:text-8xl" style={{ animationDelay: "120ms" }}>
          {words.join(" ")} <span className="display-italic text-royal">{last}</span>
        </h1>
        {intro && <p className="animate-page mt-6 max-w-2xl text-lg text-muted sm:text-xl" style={{ animationDelay: "220ms" }}>{intro}</p>}
      </div>
    </section>
  );
}
