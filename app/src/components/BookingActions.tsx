"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Dict } from "@/lib/i18n";

export function BookingActions({
  token, expiresAt, t, note, paidReturn,
}: { token: string; expiresAt: number; t: Dict; note: string | null; paidReturn: boolean }) {
  const router = useRouter();
  const [left, setLeft] = useState(() => Math.max(0, expiresAt - Date.now()));
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      const l = Math.max(0, expiresAt - Date.now());
      setLeft(l);
      if (l === 0) { clearInterval(id); router.refresh(); }
    }, 1000);
    return () => clearInterval(id);
  }, [expiresAt, router]);

  // Tornati da Stripe ma il webhook non è ancora arrivato: ricarichiamo tra poco.
  useEffect(() => {
    if (!paidReturn) return;
    const id = setTimeout(() => router.refresh(), 2500);
    return () => clearTimeout(id);
  }, [paidReturn, router]);

  const mm = String(Math.floor(left / 60000)).padStart(2, "0");
  const ss = String(Math.floor((left % 60000) / 1000)).padStart(2, "0");

  async function pay() {
    setBusy(true);
    const r = await fetch("/api/pay", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) });
    const j = (await r.json()) as { url?: string };
    if (j.url) window.location.href = j.url;
    else { setBusy(false); router.refresh(); }
  }
  async function release() {
    setBusy(true);
    await fetch("/api/release", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) });
    router.refresh();
  }

  if (paidReturn) return <p className="mt-6 rounded-xl border border-line p-4 text-sm">{t.page.paidWait}</p>;

  return (
    <div className="mt-6">
      <p className="text-center text-sm text-muted">
        {t.page.holdLeft} <span className="display text-3xl text-royal">{mm}:{ss}</span>
      </p>
      {note && <p className="mt-3 rounded-2xl bg-blush p-4 text-sm text-sunset">{note}</p>}
      <button onClick={pay} disabled={busy || left === 0} className="btn btn-primary mt-4 w-full">{t.page.payNow}</button>
      <button onClick={release} disabled={busy} className="mt-4 w-full text-sm text-muted underline">{t.page.release}</button>
    </div>
  );
}
