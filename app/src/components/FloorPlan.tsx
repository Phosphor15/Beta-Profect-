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
      <defs>
        <linearGradient id="snow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dbe6ff" />
          <stop offset="1" stopColor="#f6f8ff" />
        </linearGradient>
        <pattern id="parquet" width="8" height="2" patternUnits="userSpaceOnUse">
          <rect width="8" height="2" fill="#f3e6cf" />
          <rect y="1" width="8" height="1" fill="#efdfc3" />
          <line x1="0" y1="0" x2="8" y2="0" stroke="#e2cfae" strokeWidth="0.12" />
          <line x1="5" y1="0" x2="5" y2="1" stroke="#e2cfae" strokeWidth="0.12" />
        </pattern>
      </defs>
      {/* Lato piste */}
      <path d="M0 0 H100 V8 Q 75 11 50 7.5 T 0 9 Z" fill="url(#snow)" />
      <text x="50" y="5.6" textAnchor="middle" fontSize="2.5" fill="#1f43c9" fontWeight="600" letterSpacing="0.8">▲ {t.booking.map.slopes}</text>

      {/* Edificio chalet */}
      <rect x="3" y="54" width="94" height="43" rx="3" fill="url(#parquet)" stroke="#e6ddcf" strokeWidth="0.5" />
      <rect x="62" y="58" width="31" height="16" rx="2" fill="#101c45" />
      <text x="77.5" y="67.3" textAnchor="middle" fontSize="2.8" fill="#f0cf85" fontWeight="600" letterSpacing="0.5">{t.booking.map.bar}</text>
      <rect x="62" y="78" width="31" height="15" rx="2" fill="#e6ddcf" />
      <text x="77.5" y="86.4" textAnchor="middle" fontSize="2.3" fill="#646a80" letterSpacing="0.4">{t.booking.map.kitchen}</text>

      {/* DJ e ingresso */}
      <rect x="70" y="14" width="24" height="14" rx="2" fill="#ff6b4a" />
      <text x="82" y="22.3" textAnchor="middle" fontSize="3" fill="#fff" fontWeight="600">♪ {t.booking.map.dj}</text>
      <rect x="70" y="36" width="24" height="10" rx="2" fill="none" stroke="#646a80" strokeDasharray="1 1" strokeWidth="0.35" />
      <text x="82" y="42.2" textAnchor="middle" fontSize="2.3" fill="#646a80" letterSpacing="0.4">{t.booking.map.entrance}</text>

      {(["terrazza", "chalet"] as Zone[]).map((z) => {
        const a = AREA[z];
        const isSel = selected === z;
        const soldOut = free ? free[z] <= 0 : false;
        const color = z === "terrazza" ? "#1f43c9" : "#d4a23c";
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
              fill={color} fillOpacity={isSel ? 0.22 : soldOut ? 0.03 : 0.09}
              stroke={color} strokeWidth={isSel ? 1 : 0.45}
              style={{ transition: "fill-opacity .4s, stroke-width .4s" }} strokeDasharray={soldOut ? "1.5 1" : undefined}
            />
            <text x={a.x + 2} y={a.y + 4.2} fontSize="2.6" fill={color} fontWeight="700" letterSpacing="0.6">
              {t.booking.zonesShort[z].toUpperCase()}
            </text>
            {tables.filter((x) => x.zone === z).map((tb) => {
              const taken = takenIds.has(tb.id);
              return (
                <g key={tb.id}>
                  <circle cx={tb.x} cy={tb.y} r="3.6" fill={taken ? "#e6ddcf" : color} fillOpacity={1} style={{ transition: "fill .4s" }} />
                  <text x={tb.x} y={tb.y + 0.9} textAnchor="middle" fontSize="2.2" fill={taken ? "#a3a7b6" : "#fff"} fontWeight="600">
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
