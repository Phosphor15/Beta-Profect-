import type { Metadata } from "next";
import { requireStaff } from "@/lib/auth";
import { getConfig } from "@/lib/booking";
import { stripeEnabled, stripeTestMode } from "@/lib/stripe";
import { StaffNav } from "../StaffNav";
import { saveSettings } from "../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Impostazioni · staff", robots: { index: false } };

export default async function Impostazioni() {
  await requireStaff();
  const c = getConfig();
  const num = (name: string, value: number, label: string, extra: object = {}) => (
    <label className="grid gap-1 text-sm">{label}<input name={name} type="number" min={0} defaultValue={value} className="field" {...extra} /></label>
  );
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <StaffNav />
      <h1 className="display mt-6 text-3xl">Impostazioni e prezzi</h1>
      <p className="mt-2 text-sm text-muted">
        Pagamenti: {stripeEnabled() ? (stripeTestMode() ? "Stripe in modalità TEST" : "Stripe LIVE") : "modalità DEMO (nessuna chiave Stripe)"} ·
        Email: {process.env.RESEND_API_KEY ? "Resend attivo" : "solo log (nessuna chiave Resend)"}
      </p>
      <form action={saveSettings} className="mt-6 grid gap-6">
        <fieldset className="card grid gap-4 p-5 sm:grid-cols-2">
          <legend className="display px-1 text-xl">Prezzi tavolo (spesa minima, €)</legend>
          <p className="text-xs text-muted sm:col-span-2">Ordine di priorità: prezzo manuale del giorno &gt; evento speciale &gt; sabato &gt; periodo &gt; standard.</p>
          {num("std_t", c.prices.standard.terrazza, "Standard · Terrazza")}
          {num("std_c", c.prices.standard.chalet, "Standard · Chalet")}
          {num("sat_t", c.prices.saturday.terrazza, "Sabato · Terrazza")}
          {num("sat_c", c.prices.saturday.chalet, "Sabato · Chalet")}
          {num("spe_t", c.prices.special.terrazza, "Evento speciale · Terrazza")}
          {num("spe_c", c.prices.special.chalet, "Evento speciale · Chalet")}
          <label className="grid gap-1 text-sm sm:col-span-2">Periodi (uno per riga: nome; dal; al; terrazza; chalet)
            <textarea name="periods" rows={4} className="field font-mono text-sm"
              defaultValue={c.prices.periods.map((p) => [p.label, p.from, p.to, p.terrazza, p.chalet].join("; ")).join("\n")} />
          </label>
        </fieldset>

        <fieldset className="card grid gap-4 p-5 sm:grid-cols-2">
          <legend className="display px-1 text-xl">Regole prenotazione</legend>
          <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" name="onlineOpen" defaultChecked={c.onlineOpen} /> Prenotazioni online attive</label>
          {num("depositPct", c.depositPct, "Percentuale da pagare online (100 = intero)", { max: 100, min: 1 })}
          {num("holdMinutes", c.holdMinutes, "Minuti di blocco tavolo durante il pagamento", { max: 60, min: 3 })}
          <label className="grid gap-1 text-sm">Chiusura prenotazioni del giorno stesso (ora)<input name="cutoff" type="time" defaultValue={c.cutoff} className="field" /></label>
          <div className="grid grid-cols-2 gap-3">
            {num("minGuests", c.minGuests, "Persone min")}
            {num("maxGuests", c.maxGuests, "Persone max")}
          </div>
          <label className="grid gap-1 text-sm">Inizio stagione<input name="seasonStart" type="date" defaultValue={c.seasonStart} className="field" /></label>
          <label className="grid gap-1 text-sm">Fine stagione<input name="seasonEnd" type="date" defaultValue={c.seasonEnd} className="field" /></label>
        </fieldset>
        <button className="btn btn-primary justify-self-start">Salva impostazioni</button>
      </form>
    </div>
  );
}
