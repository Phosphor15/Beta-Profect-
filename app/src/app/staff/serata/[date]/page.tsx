import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { bookingsForDate, dayInfo, getDay, tables } from "@/lib/booking";
import { formatDate, formatEuro } from "@/lib/i18n";
import { StaffNav } from "../../StaffNav";
import { PrintButton } from "../../PrintButton";
import { addManual, arrived, cancel, move, saveDay } from "../../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Serata · staff", robots: { index: false } };

const STATUS: Record<string, [string, string]> = {
  confirmed: ["Pagata", "text-pine"], manual: ["Manuale", "text-gold"], hold: ["In pagamento", "text-royal-2"],
  cancelled: ["Annullata", "text-muted"], expired: ["Scaduta", "text-muted"],
};

export default async function Serata({ params }: { params: Promise<{ date: string }> }) {
  await requireStaff();
  const { date } = await params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound();
  const info = dayInfo(date);
  const day = getDay(date);
  const list = bookingsForDate(date);
  const active = list.filter((b) => ["confirmed", "manual", "hold"].includes(b.status));
  const busy = new Set(active.map((b) => b.table_id));
  const all = tables();
  const freeTables = all.filter((t) => !busy.has(t.id));
  const guests = active.filter((b) => b.status !== "hold").reduce((s, b) => s + b.guests, 0);
  const cash = active.filter((b) => b.status === "confirmed").reduce((s, b) => s + b.amount_cents, 0) / 100;
  const inSeasonOpen = info.state !== "closed";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <StaffNav />
      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link href={`/staff?m=${date.slice(0, 7)}`} className="no-print text-sm text-muted">← Calendario</Link>
          <h1 className="display mt-1 text-3xl capitalize">{formatDate(date, "it", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</h1>
          <p className="text-sm text-muted">
            {inSeasonOpen ? "Aperta" : "Chiusa"} · {active.length}/{all.length} tavoli · {guests} persone confermate · incassato online {formatEuro(cash, "it")}
          </p>
        </div>
        <PrintButton />
      </div>

      <section className="mt-6 overflow-x-auto">
        <h2 className="display text-2xl">Lista della serata</h2>
        <table className="mt-3 w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted">
            <tr><th className="py-2">Tavolo</th><th>Cliente</th><th>Pers.</th><th>Stato</th><th>Codice</th><th>Arrivo</th><th className="no-print">Azioni</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {list.length === 0 && <tr><td colSpan={7} className="py-6 text-muted">Nessuna prenotazione.</td></tr>}
            {list.map((b) => {
              const [label, color] = STATUS[b.status];
              const live = ["confirmed", "manual"].includes(b.status);
              return (
                <tr key={b.id} className={live || b.status === "hold" ? "" : "opacity-50"}>
                  <td className="py-3 font-semibold">{b.table_label ?? "—"} <span className="text-xs font-normal text-muted">{b.zone === "terrazza" ? "Terrazza" : "Chalet"}</span></td>
                  <td>{b.name}<div className="text-xs text-muted">{b.phone} {b.email && `· ${b.email}`}</div>{b.notes && <div className="text-xs text-gold">“{b.notes}”</div>}</td>
                  <td>{b.guests}</td>
                  <td className={color}>{label}{b.cancel_reason && <div className="text-xs text-muted">{b.cancel_reason}</div>}</td>
                  <td className="font-mono text-xs">{b.code}</td>
                  <td>{b.checked_in_at ? new Date(b.checked_in_at).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Rome" }) : "—"}</td>
                  <td className="no-print">
                    {live && (
                      <div className="flex flex-wrap items-center gap-2 py-1">
                        {!b.checked_in_at && (
                          <form action={arrived}><input type="hidden" name="id" value={b.id} /><input type="hidden" name="date" value={date} />
                            <button className="border border-pine/60 bg-pine/20 px-3 py-1 text-xs font-semibold">Segna arrivo</button></form>
                        )}
                        <form action={move} className="flex gap-1"><input type="hidden" name="id" value={b.id} /><input type="hidden" name="date" value={date} />
                          <select name="table" className="rounded border border-line bg-ink px-1 py-1 text-xs" defaultValue="">
                            <option value="" disabled>Sposta…</option>
                            {freeTables.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                          </select>
                          <button className="border border-line px-2 text-xs">OK</button></form>
                        <details className="text-xs">
                          <summary className="cursor-pointer text-danger">Annulla</summary>
                          <form action={cancel} className="mt-1 flex gap-1"><input type="hidden" name="id" value={b.id} /><input type="hidden" name="date" value={date} />
                            <input name="reason" placeholder="Motivo" className="rounded border border-line bg-ink px-2 py-1" />
                            <button className="bg-danger px-2 text-white">Conferma</button></form>
                          {b.status === "confirmed" && <p className="mt-1 text-muted">Il rimborso va fatto a mano dal pannello Stripe.</p>}
                        </details>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <div className="no-print mt-10 grid gap-6 lg:grid-cols-2">
        <form action={addManual} className="card grid gap-3 p-5">
          <h2 className="display text-xl">Prenotazione manuale / blocca tavolo</h2>
          <input type="hidden" name="date" value={date} />
          <label className="grid gap-1 text-sm">Tavolo
            <select name="table" required className="field">
              {freeTables.map((t) => <option key={t.id} value={`${t.zone}:${t.id}`}>{t.label} · {t.zone === "terrazza" ? "Terrazza" : "Chalet"}</option>)}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1 text-sm">Nome<input name="name" className="field" placeholder="Walk-in" /></label>
            <label className="grid gap-1 text-sm">Persone<input name="guests" type="number" min={1} max={20} defaultValue={4} className="field" /></label>
          </div>
          <label className="grid gap-1 text-sm">Telefono<input name="phone" className="field" /></label>
          <label className="grid gap-1 text-sm">Note<input name="notes" className="field" /></label>
          <button className="btn btn-primary" disabled={freeTables.length === 0}>Blocca tavolo</button>
        </form>

        <form action={saveDay} className="card grid gap-3 p-5">
          <h2 className="display text-xl">Impostazioni serata</h2>
          <input type="hidden" name="date" value={date} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="open" defaultChecked={day ? !!day.open : true} /> Serata aperta alle prenotazioni</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="special" defaultChecked={!!day?.special} /> Evento speciale (prezzi eventi)</label>
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1 text-sm">Nome evento (IT)<input name="event_name" defaultValue={day?.event_name ?? ""} className="field" /></label>
            <label className="grid gap-1 text-sm">Nome evento (EN)<input name="event_name_en" defaultValue={day?.event_name_en ?? ""} className="field" /></label>
            <label className="grid gap-1 text-sm">Spesa min. Terrazza €<input name="price_terrazza" type="number" min={0} placeholder={String(info.prices.terrazza)} defaultValue={day?.price_terrazza ?? ""} className="field" /></label>
            <label className="grid gap-1 text-sm">Spesa min. Chalet €<input name="price_chalet" type="number" min={0} placeholder={String(info.prices.chalet)} defaultValue={day?.price_chalet ?? ""} className="field" /></label>
          </div>
          <p className="text-xs text-muted">Prezzi vuoti = calcolati automaticamente (ora: Terrazza {formatEuro(info.prices.terrazza, "it")}, Chalet {formatEuro(info.prices.chalet, "it")}).</p>
          <label className="grid gap-1 text-sm">Nota interna<input name="note" defaultValue={day?.note ?? ""} className="field" /></label>
          <button className="btn btn-primary">Salva</button>
        </form>
      </div>
    </div>
  );
}
