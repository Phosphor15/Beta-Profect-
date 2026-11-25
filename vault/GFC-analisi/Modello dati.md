---
tags: [analisi, gfc, database]
---
# Modello dati dedotto

Torna a [[00 - Indice]] · [[Funzionalità pagina Prenota]]

Chiamate Supabase visibili nel bundle della pagina:
- `from('venue_tables')` — tavoli: id, label, zona (red/green), posizione x/y sulla piantina, stato
- `from('service_slots')` — serate/fasce: data, start, end, event_name, poster_url, aperta/chiusa
- `rpc('get_open_days')` — giorni prenotabili del mese (taken/total → Esaurito)
- `rpc('get_availability')` — disponibilità per zona in una data
- `rpc('get_public_settings')` — prezzi, % acconto, cutoff, online on/off
- `rpc('create_zone_hold')` — crea prenotazione "in attesa" e blocca un tavolo della zona

Tabelle probabili lato admin: `bookings` (code, token, stato, guests, contatti, importi, stripe_session, checked_in_at), `price_periods`, `profiles/user_roles`.

Proposta per il nostro progetto → [[Piano Beta]]
