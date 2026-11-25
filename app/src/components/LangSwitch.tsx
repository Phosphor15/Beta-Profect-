"use client";
import { useRouter } from "next/navigation";
import type { Lang } from "@/lib/i18n";

export function LangSwitch({ lang }: { lang: Lang }) {
  const router = useRouter();
  const set = async (l: Lang) => {
    if (l === lang) return;
    await fetch("/api/lang", { method: "POST", body: JSON.stringify({ lang: l }) });
    router.refresh();
  };
  return (
    <div className="flex items-center rounded-full border border-current/25 p-0.5 text-[0.68rem] font-semibold uppercase" role="group" aria-label="Lingua / Language">
      {(["it", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => set(l)}
          aria-pressed={l === lang}
          className={`rounded-full px-2.5 py-1 transition-colors duration-300 ${l === lang ? "bg-gold text-navy" : "opacity-70 hover:opacity-100"}`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
