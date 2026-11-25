---
tags: [progetto, roadmap]
stato: da-definire
---
# Piano Beta — sito di prenotazione

Torna a [[00 - Indice]]

## Checklist funzionalità (dal benchmark GFC)
### MVP
- [ ] Home + pagina Prenota, bilingue IT/EN
- [ ] Calendario serate (aperta / chiusa / esaurita / evento)
- [ ] Piantina con zone cliccabili
- [ ] Form: persone (min/max), nome, telefono, email, note, accetto termini
- [ ] Hold temporaneo del tavolo con timer
- [ ] Pagamento Stripe (carta, Apple/Google Pay)
- [ ] Email di conferma + QR + file .ics
- [ ] Pagine legali + cookie banner

### Area staff
- [ ] Login staff con ruoli
- [ ] Apri/chiudi date (anche in blocco)
- [ ] Prezzi a livelli (giorno > evento > sabato > periodo > standard)
- [ ] Prenotazione manuale / blocco tavolo / annullamento
- [ ] Scanner QR check-in + lista serata stampabile

### Dopo
- [ ] Menu bottiglie, galleria, eventi, lavora con noi
- [ ] Analytics, SEO avanzato

## Domande aperte sul mio progetto
- Che tipo di locale/attività è? (club, ristorante, stabilimento, eventi…)
- Stack: Lovable come GFC, o codice nostro (es. Next.js + Supabase + Stripe)?
- Pagamento completo, acconto o solo richiesta senza pagamento?
- Lingue, dominio, brand (colori, logo, foto)?

## Aggiornamento 2026-11-25 — decisioni
- Cliente: **Harald's Ski Restaurant Bar**, Campo Smith, Bardonecchia (ristorante + après-ski) → [[Harald's - scheda locale]]
- Stack: **codice nostro** — Next.js 15 + SQLite (node:sqlite) + Stripe + Resend (email). Cartella `app/`.
- Pagamento: **come GFC** — pagamento completo online, non rimborsabile, QR all'ingresso.
- Zone: *Terrazza sulle piste* (8 tavoli) e *Sala chalet* (6 tavoli). Prezzi beta in [[Harald's - scheda locale]].
- Stato MVP + Area staff: ✅ costruiti e testati end-to-end (prenotazione demo → QR → check-in).
- Restano: foto reali, listino reale, prezzi reali, testi legali, chiavi Stripe/Resend, hosting.
