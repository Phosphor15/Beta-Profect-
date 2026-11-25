// Foto con fallback: carica /images/<name>.jpg se presente, altrimenti mostra un gradiente "alpino".
// Per usare le foto di Instagram: salvale in public/images con i nomi indicati in public/images/README.md
const gradients: Record<string, string> = {
  hero: "radial-gradient(120% 80% at 70% 10%, #7a4a2c 0%, #2a1a10 55%, #120c08 100%)",
  apres: "radial-gradient(100% 80% at 20% 0%, #c0673a 0%, #4a2617 50%, #170f0a 100%)",
  restaurant: "radial-gradient(100% 90% at 80% 20%, #8c6a3d 0%, #3a2616 55%, #160f0a 100%)",
  terrace: "linear-gradient(160deg, #a9c3d6 0%, #5c7a91 35%, #2b2018 100%)",
  chalet: "linear-gradient(160deg, #8a5a33 0%, #4b2f1c 50%, #1a110b 100%)",
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
