// Foto con fallback: carica /images/<name>.jpg se presente, altrimenti un gradiente.
// L'immagine sta in un livello interno così può fare zoom (hover) o Ken Burns senza spostare il contenuto.
const gradients: Record<string, string> = {
  hero: "radial-gradient(120% 80% at 70% 10%, #962a3b 0%, #2b1810 70%)",
  apres: "linear-gradient(160deg, #ff7a3d, #d4a23c)",
  restaurant: "linear-gradient(160deg, #f2c56b, #d4a23c)",
  terrace: "linear-gradient(160deg, #c4566a, #7a1e2c)",
  chalet: "linear-gradient(160deg, #f2c56b, #8a5a2b)",
};

export function Photo({
  name, className = "", label, children, position = "center", veil, kenburns = false,
}: {
  name: string; className?: string; label?: string; children?: React.ReactNode;
  position?: string;
  /** velatura sopra la foto: un gradiente CSS completo */
  veil?: string;
  kenburns?: boolean;
}) {
  return (
    <div className={`photo ${className}`} role={label ? "img" : undefined} aria-label={label}>
      <div
        className={`photo-img absolute inset-0 bg-cover ${kenburns ? "animate-kenburns" : ""}`}
        style={{ backgroundImage: `url(/images/${name}.jpg), ${gradients[name] ?? gradients.hero}`, backgroundPosition: position }}
      />
      {veil && <div className="absolute inset-0" style={{ background: veil }} />}
      {children && <div className="relative z-10 h-full">{children}</div>}
    </div>
  );
}
