import type { Metadata } from "next";
import { VENUE } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = { title: "Termini e condizioni prenotazione" };

// BOZZA BETA: modellata sul funzionamento del sistema, da validare legalmente.
export default function Termini() {
  return (
    <>
      <PageHero eyebrow="Bozza beta" title="Termini e condizioni di prenotazione" />
      <ol className="mx-auto max-w-3xl list-decimal space-y-4 px-5 pl-10 text-lg text-muted marker:text-royal">
        <li>La prenotazione riguarda una <strong className="text-cream">zona</strong> (Terrazza sulle piste o Sala chalet) per la fascia après-ski {VENUE.apresStart}–{VENUE.apresEnd}. Il numero del tavolo è assegnato dallo staff.</li>
        <li>Ogni tavolo ospita da 4 a 8 persone. Il prezzo del tavolo comprende una consumazione di pari valore da scegliere dal listino al tavolo.</li>
        <li>La prenotazione è confermata solo a pagamento completato. Il tavolo resta bloccato per pochi minuti durante il pagamento; trascorso il tempo viene liberato.</li>
        <li>Il pagamento <strong className="text-cream">non è rimborsabile</strong>, salvo annullamento della serata da parte del locale. La consumazione non goduta non dà diritto a rimborso.</li>
        <li>All'ingresso va mostrato il QR ricevuto: è unico per tutto il tavolo e vale una sola volta.</li>
        <li>Il locale può rifiutare l'accesso in caso di comportamenti scorretti o in stato di alterazione. Gli alcolici non sono serviti ai minori di 18 anni.</li>
        <li>Per informazioni: {VENUE.phone} · {VENUE.email}.</li>
      </ol>
    </>
  );
}
