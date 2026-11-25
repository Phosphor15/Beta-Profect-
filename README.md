# Beta Project — Harald's Ski Restaurant Bar

Sito con prenotazione tavoli après-ski per **Harald's** (Campo Smith, Bardonecchia),
modellato sul flusso di gfc-afterski.com/prenota ma scritto da zero con codice nostro.

- `app/` — il sito (Next.js + SQLite + Stripe)
- `vault/` — note Obsidian del progetto (apri la cartella come vault)

## Avvio in locale

Serve **Node.js 22.5 o più recente**.

```bash
cd app
npm install
cp .env.example .env.local   # facoltativo: senza chiavi gira in modalità demo
npm run dev                  # http://localhost:3000
```

- Area staff: http://localhost:3000/staff — password di default `harald-beta` (cambiala con `STAFF_PASSWORD`).
- Senza `STRIPE_SECRET_KEY` il pagamento è **simulato** (modalità demo).
- Con una chiave `sk_test_…` di Stripe il pagamento è reale in modalità test (carta 4242 4242 4242 4242).
- Senza `RESEND_API_KEY` le email di conferma vengono solo scritte nei log.
- Il database (`app/data/haralds.db`) si crea da solo al primo avvio con tavoli, prezzi e serate di esempio.

## Cosa c'è

**Pubblico:** home, Après-Ski, Ristorante, Listino bevande (beta), Contatti, Privacy, Termini, IT/EN, banner cookie.

**Prenotazione** (come GFC): calendario con stati (aperta / chiusa / esaurita / eventi), piantina con
zone *Terrazza sulle piste* e *Sala chalet*, 4–8 persone, dati cliente, blocco del tavolo con timer,
pagamento Stripe (carta / Apple Pay / Google Pay), pagina conferma con QR unico, file calendario .ics, email.

**Staff:** calendario mensile, apri/chiudi date in blocco, impostazioni serata (evento, prezzi),
prezzi a livelli (giorno > evento > sabato > periodo > standard), % da pagare online, orario di chiusura,
prenotazione manuale, sposta tavolo, annulla, lista serata stampabile, check-in scansionando il QR.

## Da completare prima di andare online
- Foto: salvarle in `app/public/images/` (vedi il README lì dentro) — Instagram non si può scaricare in automatico.
- Listino bevande reale (`app/src/lib/drinks.ts`) e prezzi tavoli reali (area staff → Impostazioni).
- Testi legali da far validare.
- Hosting: con SQLite serve un server con disco persistente (es. VPS, Railway, Fly.io).
  Per Vercel bisogna passare a un database esterno (es. Supabase/Postgres).
