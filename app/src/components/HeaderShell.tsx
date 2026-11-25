"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/** Header trasparente sopra la foto della home, che diventa chiaro e sfocato quando si scorre. */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const overHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const solid = !overHero || scrolled;
  return (
    <header
      data-solid={solid}
      className={`group/header no-print fixed inset-x-0 top-0 z-40 transition-all duration-500 ease-out ${
        solid ? "bg-black/85 text-white shadow-[0_10px_30px_-20px_rgba(0,0,0,.9)] backdrop-blur-xl" : "bg-transparent text-white"
      }`}
    >
      {children}
    </header>
  );
}
