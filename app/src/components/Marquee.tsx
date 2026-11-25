export function Marquee({ items, className = "" }: { items: string[]; className?: string }) {
  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <span key={i} className="flex items-center">
          <span className="px-6 sm:px-8">{t}</span>
          <span className="text-gold" aria-hidden>✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className={`overflow-hidden ${className}`} aria-label={items.join(", ")}>
      <div className="marquee" aria-hidden>{row}{row}</div>
    </div>
  );
}
