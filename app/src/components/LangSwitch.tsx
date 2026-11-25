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
    <div className="caps flex items-center gap-1 text-[0.7rem]" role="group" aria-label="Lingua / Language">
      {(["it", "en"] as Lang[]).map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-gold/50">·</span>}
          <button
            onClick={() => set(l)}
            aria-pressed={l === lang}
            className={`px-1 py-1 ${l === lang ? "border-b border-gold text-gold-2" : "text-muted hover:text-cream"}`}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}
