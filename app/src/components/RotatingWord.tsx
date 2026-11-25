"use client";
import { useEffect, useState } from "react";

export function RotatingWord({ words, className = "" }: { words: string[]; className?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % words.length), 2400);
    return () => clearInterval(id);
  }, [words.length]);
  return (
    <span className={`relative inline-flex overflow-hidden align-bottom ${className}`} aria-live="polite">
      <span key={i} className="animate-word inline-block">{words[i]}</span>
    </span>
  );
}
