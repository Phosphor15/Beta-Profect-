"use client";
import { useState } from "react";
import type { Dict } from "@/lib/i18n";

// DEMO: il modulo non invia nulla, mostra solo la conferma.
export function PrivateEventForm({ t, kinds }: { t: Dict["privateEvents"]; kinds: string[] }) {
  const [sent, setSent] = useState(false);
  if (sent) return <p className="mt-6 rounded-2xl bg-blush p-5 font-medium text-sunset">{t.sent}</p>;
  return (
    <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="mt-6 grid gap-4 sm:grid-cols-2">
      <label className="grid gap-1 text-sm">{t.name}<input required className="field" autoComplete="name" /></label>
      <label className="grid gap-1 text-sm">{t.email}<input required type="email" className="field" autoComplete="email" /></label>
      <label className="grid gap-1 text-sm">{t.phone}<input type="tel" className="field" autoComplete="tel" /></label>
      <label className="grid gap-1 text-sm">{t.kind}
        <select className="field">{kinds.map((k) => <option key={k}>{k}</option>)}</select>
      </label>
      <label className="grid gap-1 text-sm">{t.date}<input type="date" className="field" /></label>
      <label className="grid gap-1 text-sm">{t.guests}<input type="number" min={10} defaultValue={30} className="field" /></label>
      <label className="grid gap-1 text-sm sm:col-span-2">{t.message}<textarea rows={4} className="field" /></label>
      <button className="btn btn-primary sm:col-span-2 sm:justify-self-start">{t.send}</button>
    </form>
  );
}
