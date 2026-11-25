import Link from "next/link";
import { logout } from "./actions";

export function StaffNav() {
  return (
    <div className="no-print flex flex-wrap items-center gap-2 border-b border-line pb-4 text-sm">
      <span className="eyebrow mr-2">Area staff</span>
      <Link href="/staff" className="rounded-full border border-line px-3 py-1.5 hover:border-gold">Calendario</Link>
      <Link href="/staff/impostazioni" className="rounded-full border border-line px-3 py-1.5 hover:border-gold">Impostazioni e prezzi</Link>
      <form action={logout} className="ml-auto"><button className="text-muted underline">Esci</button></form>
    </div>
  );
}
