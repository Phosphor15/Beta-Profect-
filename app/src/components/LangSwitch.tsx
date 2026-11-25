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
    <div className="flex rounded-full border border-line p-0.5 text-xs font-semibold" role="group" aria-label="Lingua / Language">
      {(["it", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => set(l)}
          aria-pressed={l === lang}
          className={`rounded-full px-2.5 py-1 uppercase ${l === lang ? "bg-cream text-ink" : "text-muted hover:text-cream"}`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
