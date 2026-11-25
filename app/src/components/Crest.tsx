// Stemma/monogramma "H" in stile club: doppio anello, alloro e scritta circolare.
// Segnaposto elegante finché non arriva il logo ufficiale di Harald's.
export function Crest({ size = 56, className = "", ring = true }: { size?: number; className?: string; ring?: boolean }) {
  // Corona d'alloro: due rami che salgono dal basso ai lati della H
  const leaf = (deg: number, key: string, r = 25) => {
    const a = (deg * Math.PI) / 180;
    const x = 50 + Math.cos(a) * r;
    const y = 50 - Math.sin(a) * r;
    return <ellipse key={key} cx={x} cy={y} rx="1.5" ry="4.2" transform={`rotate(${-deg} ${x} ${y})`} />;
  };
  const left = [252, 232, 212, 192, 172, 152];
  const right = left.map((d) => 540 - d);
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
      <defs>
        <path id="crest-arc" d="M 50 50 m -39 0 a 39 39 0 1 1 78 0 a 39 39 0 1 1 -78 0" />
      </defs>
      <g fill="none" stroke="#c9a45a">
        <circle cx="50" cy="50" r="47" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="44.5" strokeWidth="0.5" />
        {ring && <circle cx="50" cy="50" r="32" strokeWidth="0.6" />}
      </g>
      {ring && (
        <text fill="#c9a45a" fontSize="6.2" letterSpacing="2.2" fontFamily="Cormorant SC, Cormorant Garamond, serif">
          <textPath href="#crest-arc" startOffset="2%">CAMPO SMITH · BARDONECCHIA · SKI CLUB ·</textPath>
        </text>
      )}
      <g fill="#c9a45a" opacity="0.9">
        {left.map((d) => leaf(d, `l${d}`))}
        {right.map((d) => leaf(d, `r${d}`))}
        {left.slice(1, 5).map((d) => leaf(d - 9, `li${d}`, 21))}
        {right.slice(1, 5).map((d) => leaf(d + 9, `ri${d}`, 21))}
      </g>
      <text x="50" y="61" textAnchor="middle" fill="#e2c47e" fontSize="34" fontFamily="Cormorant Garamond, Georgia, serif" fontStyle="italic" fontWeight="600">
        H
      </text>
      <path d="M44 66 h12" stroke="#c9a45a" strokeWidth="0.6" />
    </svg>
  );
}
