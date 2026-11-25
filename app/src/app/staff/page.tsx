import type { Metadata } from "next";
import Link from "next/link";
import { isStaff } from "@/lib/auth";
import { monthDays, romeNow, tables } from "@/lib/booking";
import { formatEuro } from "@/lib/i18n";
import { stripeEnabled } from "@/lib/stripe";
import { LoginForm } from "./LoginForm";
import { StaffNav } from "./StaffNav";
import { bulkDays } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Area staff", robots: { index: false } };

const shift = (m: string, d: number) => {
  const [y, mo] = m.split("-").map(Number);
  return new Date(Date.UTC(y, mo - 1 + d, 1)).toISOString().slice(0, 7);
};

export default async function StaffHome({ searchParams }: { searchParams: Promise<{ m?: string }> }) {
  if (!(await isStaff())) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="display text-center text-4xl">Accesso staff</h1>
        <LoginForm />
      </div>
    );
  }
  const sp = await searchParams;
  const today = romeNow().date;
  const month = sp.m && /^\d{4}-\d{2}$/.test(sp.m) ? sp.m : today.slice(0, 7);
  const days = monthDays(month);
  const total = tables().length;
  const label = new Intl.DateTimeFormat("it-IT", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${month}-01T12:00:00Z`));
  const first = (new Date(`${month}-01T12:00:00Z`).getUTCDay() + 6) % 7;
  const wd = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <StaffNav />
      {!stripeEnabled() && <p className="mt-4 rounded-lg bg-gold/10 p-3 text-sm text-gold">Pagamenti in modalità demo (nessuna chiave Stripe configurata).</p>}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="display text-3xl capitalize">{label}</h1>
        <div className="flex gap-2 text-sm">
          <Link href={`/staff?m=${shift(month, -1)}`} className="btn btn-ghost !py-1.5">‹ Prec.</Link>
          <Link href={`/staff/serata/${today}`} className="btn btn-primary !py-1.5">Stasera</Link>
          <Link href={`/staff?m=${shift(month, 1)}`} className="btn btn-ghost !py-1.5">Succ. ›</Link>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs text-muted">{wd.map((w) => <div key={w}>{w}</div>)}</div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {Array.from({ length: first }).map((_, i) => <div key={i} />)}
        {days.map((d) => {
          const taken = total - d.free.terrazza - d.free.chalet;
          const open = d.state !== "closed";
          return (
            <Link
              key={d.date}
              href={`/staff/serata/${d.date}`}
              className={`min-h-20 rounded-lg border p-1.5 text-left text-xs transition hover:border-gold ${d.date === today ? "border-gold" : "border-line"} ${open ? "bg-wood" : "bg-ink opacity-60"}`}
            >
              <div className="flex justify-between"><span className="font-semibold">{Number(d.date.slice(8))}</span>{d.special && <span className="text-ember">★</span>}</div>
              <div className={open ? "text-pine" : "text-muted"}>{open ? "Aperta" : "Chiusa"}</div>
              {open && <div className="text-muted">{taken}/{total} tav.</div>}
              {d.eventName && <div className="truncate text-gold">{d.eventName}</div>}
              {open && <div className="hidden text-muted sm:block">{formatEuro(d.prices.terrazza, "it")}/{formatEuro(d.prices.chalet, "it")}</div>}
            </Link>
          );
        })}
      </div>

      <form action={bulkDays} className="card mt-8 grid gap-4 p-5 sm:grid-cols-[1fr_1fr_2fr_auto] sm:items-end">
        <h2 className="display text-xl sm:col-span-4">Apri / chiudi più date</h2>
        <label className="grid gap-1 text-sm">Dal<input type="date" name="from" required className="field" /></label>
        <label className="grid gap-1 text-sm">Al<input type="date" name="to" required className="field" /></label>
        <fieldset className="flex flex-wrap gap-2 text-sm">
          <legend className="mb-1 text-sm">Giorni (nessuno = tutti)</legend>
          {wd.map((w, i) => (
            <label key={w} className="flex items-center gap-1 rounded-full border border-line px-2.5 py-1"><input type="checkbox" name="wd" value={i} />{w}</label>
          ))}
        </fieldset>
        <div className="flex gap-2">
          <button name="mode" value="open" className="btn btn-primary !py-2">Apri</button>
          <button name="mode" value="close" className="btn btn-ghost !py-2">Chiudi</button>
        </div>
      </form>
    </div>
  );
}
