"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Voci del menu in minuscolo con il punto finale; quella della pagina attuale è rossa.
export function NavLinks({ links }: { links: { href: string; label: string }[] }) {
  const pathname = usePathname();
  return (
    <nav className="hidden items-center gap-9 text-[1.05rem] font-semibold lowercase tracking-tight lg:flex">
      {links.map((l) => {
        const active = pathname === l.href;
        return (
          <Link key={l.href} href={l.href} className={`link-underline pb-0.5 transition-colors ${active ? "text-royal" : "hover:text-royal"}`}>
            {l.label}.
          </Link>
        );
      })}
    </nav>
  );
}
