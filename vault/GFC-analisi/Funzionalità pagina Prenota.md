---
tags: [analisi, gfc, prenotazione]
fonte: https://gfc-afterski.com/prenota
analizzato: 2026-11-25
---
# Funzionalità della pagina /prenota (GFC Après-Ski)

Torna a [[00 - Indice]] · Vedi anche [[Stack tecnico e AI]] · [[Modello dati]]

## 1. Struttura della pagina
- **Header**: logo "GFC", menu (Après-Ski, Eventi, Capodanno, Menu bottiglie, Galleria, Contatti), link *Area staff*, switch lingua **IT / EN**, CTA "Prenota il tavolo".
- **Hero compatto**: eyebrow "Tavoli VIP", titolo "Prenota il tavolo", intro "Scegli la serata, poi la zona sulla piantina. Pagamento completo online e QR all'ingresso".
- **Sezione "Eventi speciali"**: locandine cliccabili delle serate evento (poster da URL impostato dallo staff).
- **Calendario "Scegli il giorno"**: vista mensile, mese precedente/successivo; ogni giorno può essere *aperto*, *Chiuso*, *Esaurito*, o mostrare il nome evento.
- **Piantina del locale (FloorPlan)**: immagine della mappa con tavoli cliccabili, legenda (Dance floor, DJ, Bar, Ingresso, Lato montagna), zoom, "Vedi tutto il locale".
- **Scelta zona**: 🔴 *Zona rossa · Terrazza* / 🟢 *Zona verde · Outdoor*. Il **numero del tavolo lo assegna lo staff**, il cliente sceglie solo la zona.
- **Footer**: indirizzo, link a tutte le pagine, Lavora con noi, Privacy, Termini di vendita, Termini prenotazione, Instagram, Area staff, **Preferenze cookie**.

## 2. Flusso di prenotazione (4 step)
1. **Scegli** – serata → zona sulla piantina → numero persone (stepper **min 4, max 8**).
2. **Dati** – Nome e cognome, Telefono (con prefisso), Email, Note (facoltative), checkbox obbligatoria "Accetto i Termini e condizioni".
3. **Paga** – riepilogo: prezzo tavolo, *spesa minima*, "Da pagare ora" (percentuale configurabile, 100 = intero), "Consumazione inclusa fino a €X", **Non rimborsabile**. Pagamento con carta / Apple Pay / Google Pay (Stripe).
4. **QR** – pagina "La tua prenotazione" con codice, stato, **QR unico per tutto il tavolo** (valido una volta), consiglio luminosità, "Aggiungi al calendario" (file **.ics**), email di conferma.

## 3. Logiche importanti
- **Hold del tavolo**: alla scelta il tavolo viene *bloccato* (`create_zone_hold`) con timer "Tavolo bloccato per te ancora…"; se non paghi → *Scaduta: il tavolo è stato liberato*. Pulsante "Annulla e libera il tavolo".
- **Stati prenotazione**: In attesa di pagamento · Confermata · Confermata dal locale (manuale) · Annullata · Scaduta.
- **Errori gestiti**: TABLE_TAKEN, DAY_CLOSED, CUTOFF_PASSED (stasera chiuse), ONLINE_CLOSED, DATE_OUT_OF_RANGE, GUESTS_INVALID, CONTACT_INVALID, SLOT_INVALID.
- **Prezzi a livelli** (priorità): prezzo manuale del giorno > evento speciale > sabato > periodo > standard. Esempi nei testi: "Rosso e verde €170" / "€300".
- **Menu bottiglie** collegato (spirits, prosecco, champagne; prezzi €120–€500).
- **Capodanno** gestito fuori: rimanda a **TicketSMS**. Pacchetto Immacolata rimanda a Snow Week.

## 4. Area staff (/auth → admin)
- Login/registrazione staff (Supabase Auth), ruolo admin.
- Calendario: apri/chiudi singole date o **in blocco** (dal/al + giorni della settimana).
- Per serata: nome evento, nota interna, locandina, override spesa minima per zona.
- Prezzi: standard, periodi, sabati, eventi speciali; % da pagare online.
- Tavoli: libero / in pagamento / **blocca tavolo** (prenotazione manuale) / annulla con motivo (rimborso manuale da Stripe).
- Serata: **Segna arrivo** (check-in via QR), **Lista della serata** stampabile.
- Invia email di prova.

## 5. Elementi trasversali
- Bilingue IT/EN, SEO (title, description, OG/Twitter, canonical, hreflang), font Cormorant Garamond + DM Sans, tema scuro (`#1C1410`).
- Cookie banner con preferenze, pagine legali.
- Mobile-first (viewport-fit=cover, "Tap" hint).
