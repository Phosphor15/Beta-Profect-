// Foto con fallback: carica /images/<name>.jpg se presente, altrimenti mostra un gradiente "alpino".
// Per usare le foto di Instagram: salvale in public/images con i nomi indicati in public/images/README.md
const gradients: Record<string, string> = {
  hero: "radial-gradient(120% 80% at 70% 10%, #2a54d0 0%, #10205a 50%, #050a1f 100%)",
  apres: "radial-gradient(100% 80% at 20% 0%, #c9a45a 0%, #3a3a5c 40%, #070e29 100%)",
  restaurant: "radial-gradient(100% 90% at 80% 20%, #8f7a3c 0%, #172a66 55%, #070e29 100%)",
  terrace: "linear-gradient(160deg, #b9cdf0 0%, #3a68ee 40%, #0b1636 100%)",
  chalet: "linear-gradient(160deg, #c9a45a 0%, #6b5a2a 35%, #0b1636 100%)",
};

export function Photo({
  name, className = "", label, children,
}: { name: string; className?: string; label?: string; children?: React.ReactNode }) {
  return (
    <div
      className={`photo ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      style={{ backgroundImage: `url(/images/${name}.jpg), ${gradients[name] ?? gradients.hero}` }}
    >
      {children && <div className="relative z-10 h-full">{children}</div>}
    </div>
  );
}
