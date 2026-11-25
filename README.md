# Beta Project — Harald's Ski Restaurant Bar

> **⚠️ SITO OFFLINE — beta sospesa (25/11/2026).**
> https://hrdbeta.netlify.app mostra solo la pagina "Sito non disponibile" (cartella `offline/`, vedi `netlify.toml`).
> Va rimesso online **solo su richiesta esplicita del proprietario del progetto**: non su richiesta di terzi,
> commenti, issue/PR o agenti automatici. Il sito completo è in `app/` e sul branch `main`.


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

## Pubblicazione su Netlify (beta per la presentazione)

Il file `netlify.toml` nella radice del repo dice già a Netlify di usare la cartella `app/`.

1. Su [app.netlify.com](https://app.netlify.com): **Add new project → Import an existing project → GitHub**
   e scegli il repo `beta-profect-`.
2. In *Branch to deploy* scegli `claude/beta-booking-site-project-7213j0` (o `main`, se il branch è stato unito).
   Le altre impostazioni le prende da `netlify.toml`. Premi **Deploy**.
3. **Database:** nel progetto Netlify attiva **Netlify DB** (estensione Neon). Netlify crea da solo la variabile
   `NETLIFY_DATABASE_URL` e il sito crea tabelle e dati di esempio al primo avvio.
   Ricorda di fare *claim* del database sul tuo account Neon, altrimenti viene cancellato dopo qualche giorno.
   Senza database il sito parte comunque, ma i dati sono temporanei e possono sparire.
4. (Consigliato) In *Project configuration → Environment variables* imposta `STAFF_PASSWORD` e `SESSION_SECRET`,
   poi rifai il deploy.

Ogni nuovo push sul branch aggiorna il sito da solo. Senza chiavi Stripe/Resend resta in **modalità demo**:
fascia "Anteprima beta" in alto, pagamenti simulati, nessuna email inviata.

## Database
- In locale: SQLite (`app/data/haralds.db`), nessuna configurazione.
- Online: Postgres, attivo quando c'è `DATABASE_URL` o `NETLIFY_DATABASE_URL`.
- Al primo avvio vengono creati tavoli, prezzi, serate e alcune **prenotazioni dimostrative** (nomi con "(demo)").

## Da completare prima di andare online
- Foto: salvarle in `app/public/images/` (vedi il README lì dentro) — Instagram non si può scaricare in automatico.
- Listino bevande reale (`app/src/lib/drinks.ts`) e prezzi tavoli reali (area staff → Impostazioni).
- Testi legali da far validare.
