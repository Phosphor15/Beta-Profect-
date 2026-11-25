"use client";
import type { Dict } from "@/lib/i18n";

type Zone = "terrazza" | "chalet";
export interface PlanTable { id: number; label: string; zone: Zone; x: number; y: number }

const AREA: Record<Zone, { x: number; y: number; w: number; h: number }> = {
  terrazza: { x: 5, y: 12, w: 60, h: 36 },
  chalet: { x: 7, y: 58, w: 50, h: 36 },
};

export function FloorPlan({
  tables, free, selected, onSelect, t, disabled,
}: {
  tables: PlanTable[];
  free: Record<Zone, number> | null;
  selected: Zone | null;
  onSelect: (z: Zone) => void;
  t: Dict;
  disabled: boolean;
}) {
  const takenIds = new Set<number>();
  if (free) {
    (["terrazza", "chalet"] as Zone[]).forEach((z) => {
      const zt = tables.filter((x) => x.zone === z);
      zt.slice(0, Math.max(0, zt.length - free[z])).forEach((x) => takenIds.add(x.id));
    });
  }

  return (
    <svg viewBox="0 0 100 100" className="h-auto w-full select-none" role="group" aria-label={t.booking.pickZone}>
      {/* Lato piste */}
      <rect x="0" y="0" width="100" height="9" fill="#dfe8ee" opacity="0.12" />
      <path d="M0 9 Q 25 4 50 8 T 100 6 L100 0 L0 0Z" fill="#dfe8ee" opacity="0.18" />
      <text x="50" y="6" textAnchor="middle" fontSize="2.6" fill="#dfe8ee" letterSpacing="0.6">{t.booking.map.slopes} ▲</text>

      {/* Edificio chalet */}
      <rect x="3" y="54" width="94" height="43" rx="2" fill="#2b1e15" stroke="#5a4232" strokeWidth="0.5" />
      <rect x="62" y="58" width="31" height="16" rx="1.5" fill="#3a2a1e" />
      <text x="77.5" y="67.5" textAnchor="middle" fontSize="2.8" fill="#d9ab62">{t.booking.map.bar}</text>
      <rect x="62" y="78" width="31" height="15" rx="1.5" fill="#241912" />
      <text x="77.5" y="86.5" textAnchor="middle" fontSize="2.4" fill="#8a7867">{t.booking.map.kitchen}</text>

      {/* DJ e ingresso */}
      <rect x="70" y="14" width="24" height="14" rx="1.5" fill="#3a2a1e" />
      <text x="82" y="22.5" textAnchor="middle" fontSize="3" fill="#e8734c">♪ {t.booking.map.dj}</text>
      <rect x="70" y="36" width="24" height="10" rx="1.5" fill="none" stroke="#8a7867" strokeDasharray="1 1" strokeWidth="0.4" />
      <text x="82" y="42.3" textAnchor="middle" fontSize="2.4" fill="#b8a793">{t.booking.map.entrance}</text>

      {(["terrazza", "chalet"] as Zone[]).map((z) => {
        const a = AREA[z];
        const isSel = selected === z;
        const soldOut = free ? free[z] <= 0 : false;
        const color = z === "terrazza" ? "#d2552f" : "#5f8a6a";
        const clickable = !disabled && !soldOut;
        return (
          <g
            key={z}
            role="button"
            tabIndex={clickable ? 0 : -1}
            aria-pressed={isSel}
            aria-disabled={!clickable}
            aria-label={`${t.booking.zones[z]}${soldOut ? ` · ${t.booking.soldOut}` : ""}`}
            onClick={() => clickable && onSelect(z)}
            onKeyDown={(e) => { if (clickable && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onSelect(z); } }}
            className={clickable ? "cursor-pointer outline-none" : "cursor-not-allowed"}
          >
            <rect
              x={a.x} y={a.y} width={a.w} height={a.h} rx="2.5"
              fill={color} fillOpacity={isSel ? 0.35 : soldOut ? 0.05 : 0.16}
              stroke={color} strokeWidth={isSel ? 0.9 : 0.5} strokeDasharray={soldOut ? "1.5 1" : undefined}
            />
            <text x={a.x + 2} y={a.y + 4.2} fontSize="2.6" fill="#f4ecdd" fontWeight="600" letterSpacing="0.3">
              {t.booking.zonesShort[z].toUpperCase()}
            </text>
            {tables.filter((x) => x.zone === z).map((tb) => {
              const taken = takenIds.has(tb.id);
              return (
                <g key={tb.id}>
                  <circle cx={tb.x} cy={tb.y} r="3.6" fill={taken ? "#4a372a" : color} fillOpacity={taken ? 1 : 0.9} />
                  <text x={tb.x} y={tb.y + 0.9} textAnchor="middle" fontSize="2.2" fill={taken ? "#8a7867" : "#fff"}>
                    {tb.label}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}
