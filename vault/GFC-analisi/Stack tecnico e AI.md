---
tags: [analisi, gfc, tech, ai]
---
# Stack tecnico — il sito è fatto con AI?

Torna a [[00 - Indice]]

## Verdetto: **Sì, quasi certamente costruito con Lovable** (generatore di siti/app con AI)

### Prove trovate nell'HTML
| Indizio | Dove | Significato |
|---|---|---|
| `<script defer src="/__l5e/events.….js">` | `<head>` | `l5e` = "l-ovabl-e" (numeronimo): script analytics dell'hosting **Lovable** |
| `og:image` su `…r2.dev/lovp_6merk71…/…png` | meta OG | prefisso `lovp_` = **Lovable project** id |
| `x-deployment-id` + Cloudflare | header HTTP | hosting gestito di Lovable (dietro Cloudflare) |
| `createServerFn`, `useNavigate`, `matchContext` | bundle JS | **TanStack Start / Router** + React (stack attuale di Lovable) |
| Supabase client, `rpc(...)`, Supabase Auth | bundle JS | backend **Lovable Cloud / Supabase** |
| Classi Tailwind, varianti bottone `default/destructive/outline/secondary/ghost/link` | bundle | **shadcn/ui** — tipico dei progetti Lovable |
| icone `createLucideIcon` | bundle | **lucide-react** |
| Testo "Modalità test… carta 4242 4242 4242 4242" | i18n | integrazione **Stripe** in test mode (generata) |
| "Contenuti segnaposto: testi e immagini definitivi in arrivo." | i18n | progetto ancora in rifinitura |

> Nota: "fatto con AI" ≠ "fatto male". Il codice ha logiche serie (hold, cutoff, prezzi a livelli, QR, .ics): qualcuno l'ha guidato bene con prompt dettagliati.

### Stack completo
- Frontend: React + TanStack Start (SSR) + Vite, Tailwind, shadcn/ui, lucide
- Backend: Supabase (Postgres + RPC + Auth), email transazionali (Resend probabile)
- Pagamenti: Stripe Checkout (carta, Apple Pay, Google Pay)
- Hosting: Lovable hosting su Cloudflare, immagini su Cloudflare R2
