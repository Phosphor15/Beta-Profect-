"use client";
import { useEffect, useState } from "react";

export function CookieBanner({ text, ok }: { text: string; ok: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try { setShow(localStorage.getItem("cookie-ok") !== "1"); } catch { setShow(true); }
    const open = () => setShow(true);
    window.addEventListener("open-cookie-banner", open);
    return () => window.removeEventListener("open-cookie-banner", open);
  }, []);
  if (!show) return null;
  return (
    <div className="no-print fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-2xl border border-line bg-wood p-4 text-sm shadow-2xl sm:flex sm:items-center sm:gap-4">
      <p className="text-muted">{text}</p>
      <button
        className="btn btn-primary mt-3 w-full !py-2 sm:mt-0 sm:w-auto"
        onClick={() => { try { localStorage.setItem("cookie-ok", "1"); } catch {} setShow(false); }}
      >
        {ok}
      </button>
    </div>
  );
}

export function CookiePrefsButton({ label }: { label: string }) {
  return (
    <button className="hover:text-cream" onClick={() => window.dispatchEvent(new Event("open-cookie-banner"))}>
      {label}
    </button>
  );
}
