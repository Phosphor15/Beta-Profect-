import type { Metadata } from "next";
import Link from "next/link";
import { isStaff } from "@/lib/auth";
import { bookingByToken, romeNow } from "@/lib/booking";
import { formatDate } from "@/lib/i18n";
import { LoginForm } from "../../LoginForm";
import { arrived } from "../../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Check-in", robots: { index: false } };

// Lo staff inquadra il QR del cliente con la fotocamera del telefono: si apre questa pagina.
export default async function CheckIn({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!(await isStaff())) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="display text-center text-3xl">Check-in · accesso staff</h1>
        <LoginForm />
      </div>
    );
  }
  const b = await bookingByToken(token);
  const valid = b && ["confirmed", "manual"].includes(b.status);
  const today = romeNow().date;
  const wrongDay = b && b.date !== today;

  const tone = !valid ? "bg-danger" : b!.checked_in_at ? "bg-gold" : wrongDay ? "bg-gold" : "bg-pine";
  const title = !b ? "QR non valido" : !valid ? "Prenotazione non valida" : b.checked_in_at ? "QR già usato" : wrongDay ? "Data diversa da oggi" : "Valido";

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className={`${tone} rounded-3xl p-6 text-center text-ink`}>
        <p className="display text-4xl">{title}</p>
        {b?.checked_in_at && <p className="mt-1 font-semibold">Entrati alle {new Date(b.checked_in_at).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Rome" })}</p>}
      </div>
      {b && (
        <dl className="card mt-6 divide-y divide-line text-sm">
          {[
            ["Nome", b.name], ["Serata", formatDate(b.date, "it")], ["Zona", b.zone === "terrazza" ? "Terrazza" : "Chalet"],
            ["Tavolo", b.table_label ?? "—"], ["Persone", String(b.guests)], ["Codice", b.code], ["Stato", b.status],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between px-4 py-3"><dt className="text-muted">{k}</dt><dd className="font-semibold capitalize">{v}</dd></div>
          ))}
        </dl>
      )}
      {valid && !b!.checked_in_at && (
        <form action={arrived} className="mt-6">
          <input type="hidden" name="id" value={b!.id} />
          <input type="hidden" name="back" value={`/staff/checkin/${token}`} />
          <button className="btn btn-primary w-full !py-4 text-lg">Segna arrivo</button>
        </form>
      )}
      {b && <Link href={`/staff/serata/${b.date}`} className="btn btn-ghost mt-3 w-full">Lista della serata</Link>}
    </div>
  );
}
