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
    <div className="no-print animate-page fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-3xl bg-navy p-5 text-sm text-white shadow-2xl sm:flex sm:items-center sm:gap-5">
      <p className="text-white/80">{text}</p>
      <button
        className="btn btn-primary mt-3 w-full !py-2.5 sm:mt-0 sm:w-auto"
        onClick={() => { try { localStorage.setItem("cookie-ok", "1"); } catch {} setShow(false); }}
      >
        {ok}
      </button>
    </div>
  );
}

export function CookiePrefsButton({ label }: { label: string }) {
  return (
    <button className="link-underline" onClick={() => window.dispatchEvent(new Event("open-cookie-banner"))}>
      {label}
    </button>
  );
}
