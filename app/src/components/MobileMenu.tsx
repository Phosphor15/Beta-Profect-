"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function MobileMenu({ links, cta }: { links: { href: string; label: string }[]; cta: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Menu"
        className="grid h-10 w-10 place-items-center border border-line"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 7h18M3 12h18M3 17h18" />}
        </svg>
      </button>
      {open && (
        <div className="wood-dark gold-trim-bottom absolute inset-x-0 top-full px-4 pb-6 pt-2">
          <nav className="flex flex-col">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="display border-b border-gold/20 py-3.5 text-2xl">
                {l.label}
              </Link>
            ))}
          </nav>
          <Link href="/prenota" className="btn btn-primary mt-5 w-full">{cta}</Link>
        </div>
      )}
    </div>
  );
}
