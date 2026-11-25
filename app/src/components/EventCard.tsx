import Link from "next/link";
import type { DayInfo } from "@/lib/booking";
import { formatDate, formatEuro, type Lang, type Dict } from "@/lib/i18n";

export function EventCard({ e, lang, t, href }: { e: DayInfo; lang: Lang; t: Dict; href: string }) {
  const name = (lang === "en" ? e.eventNameEn : e.eventName) ?? e.eventName ?? "";
  const bookable = e.state === "open";
  return (
    <Link
      href={href}
      className="card group flex min-h-44 flex-col justify-between overflow-hidden p-5 transition hover:border-gold"
    >
      <div>
        <p className="eyebrow">{formatDate(e.date, lang, { weekday: "short", day: "numeric", month: "short" })}</p>
        <h3 className="display mt-2 text-2xl leading-tight group-hover:text-gold">{name}</h3>
      </div>
      <p className="mt-6 text-sm text-muted">
        {bookable
          ? `${t.booking.from} ${formatEuro(Math.min(e.prices.terrazza, e.prices.chalet), lang)}`
          : e.state === "soldout" ? t.booking.soldOut : t.booking.closed}
      </p>
    </Link>
  );
}
