// BETA: i collegamenti ai canali reali di Harald's (telefono, email, Instagram, mappe)
// sono disattivati, così durante la presentazione nessuno finisce sui canali ufficiali.
// Per riattivarli in futuro basta sostituire questo componente con un normale <a href>.
export function DemoLink({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`cursor-not-allowed ${className}`}
      title="Collegamento disattivato nella versione beta"
      aria-disabled="true"
    >
      {children}
    </span>
  );
}
