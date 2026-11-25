"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

export function MobileMenu({ links, cta }: { links: { href: string; label: string }[]; cta: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Menu"
        className="relative grid h-11 w-11 place-items-center rounded-full border border-current/25"
      >
        <span className={`absolute h-[1.5px] w-5 bg-current transition-transform duration-500 ${open ? "rotate-45" : "-translate-y-1.5"}`} />
        <span className={`absolute h-[1.5px] w-5 bg-current transition-transform duration-500 ${open ? "-rotate-45" : "translate-y-1.5"}`} />
      </button>
      {mounted && createPortal(
      <div
        inert={!open}
        aria-hidden={!open}
        className={`fixed inset-0 z-[55] flex flex-col bg-royal px-6 pb-10 pt-28 text-white transition-[clip-path] duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${
          open ? "[clip-path:circle(150%_at_100%_0)]" : "pointer-events-none [clip-path:circle(0%_at_100%_0)]"
        }`}
      >
        <button
          onClick={() => setOpen(false)}
          aria-label="Chiudi menu"
          className="absolute right-5 top-[0.875rem] grid h-11 w-11 place-items-center rounded-full border border-white/40 transition-transform duration-500 hover:rotate-90"
        >
          <span className="absolute h-[1.5px] w-5 rotate-45 bg-white" />
          <span className="absolute h-[1.5px] w-5 -rotate-45 bg-white" />
        </button>
        <nav className="flex flex-col gap-1">
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className={`display-italic text-5xl transition-all duration-700 ${open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
              style={{ transitionDelay: open ? `${150 + i * 60}ms` : "0ms" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link href="/prenota" className="btn btn-primary mt-auto w-full">{cta}</Link>
      </div>, document.body)}
    </div>
  );
}
