import type { Metadata } from "next";
import { VENUE } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = { title: "Privacy policy" };

// BOZZA BETA: da far verificare a un consulente prima della pubblicazione.
export default function Privacy() {
  return (
    <>
      <PageHero eyebrow="Bozza beta" title="Privacy policy" />
      <article className="mx-auto max-w-3xl space-y-4 px-4 text-muted [&_h2]:display [&_h2]:pt-4 [&_h2]:text-2xl [&_h2]:text-cream">
        <p>Titolare del trattamento: {VENUE.name}, {VENUE.address}, {VENUE.city} — {VENUE.email}.</p>
        <h2>Dati raccolti</h2>
        <p>Per gestire la prenotazione raccogliamo nome, telefono, email, numero di persone ed eventuali note. I pagamenti sono gestiti da Stripe: non conserviamo i dati della carta.</p>
        <h2>Finalità e base giuridica</h2>
        <p>Esecuzione del contratto di prenotazione (art. 6.1.b GDPR) e obblighi di legge (fiscali). Non usiamo i dati per marketing senza consenso.</p>
        <h2>Conservazione</h2>
        <p>I dati delle prenotazioni sono conservati per la durata della stagione e per i tempi richiesti dalla normativa fiscale.</p>
        <h2>Cookie</h2>
        <p>Il sito usa solo cookie tecnici (lingua, sessione dello staff). Nessun cookie di profilazione o di terze parti a fini pubblicitari.</p>
        <h2>Diritti</h2>
        <p>Puoi chiedere accesso, rettifica, cancellazione o limitazione scrivendo a {VENUE.email}. Puoi proporre reclamo al Garante Privacy.</p>
      </article>
    </>
  );
}
