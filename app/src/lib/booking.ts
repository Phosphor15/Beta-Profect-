import "server-only";
import crypto from "node:crypto";
import { db, type BookingRow, type DayRow, type TableRow, type Zone, ZONES } from "./db";

export interface Config {
  prices: {
    standard: Record<Zone, number>;
    saturday: Record<Zone, number>;
    special: Record<Zone, number>;
    periods: ({ label: string; from: string; to: string } & Record<Zone, number>)[];
  };
  depositPct: number;
  holdMinutes: number;
  cutoff: string; // HH:MM, ora di Roma, per prenotare la serata stessa
  onlineOpen: boolean;
  minGuests: number;
  maxGuests: number;
  seasonStart: string;
  seasonEnd: string;
}

export function getConfig(): Config {
  const row = db().prepare("SELECT value FROM settings WHERE key = 'config'").get() as { value: string };
  return JSON.parse(row.value) as Config;
}

export function saveConfig(c: Config) {
  db().prepare("UPDATE settings SET value = ? WHERE key = 'config'").run(JSON.stringify(c));
}

/* ---------- Date helpers (fuso orario Europe/Rome) ---------- */

export function romeNow(): { date: string; time: string } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return { date: `${get("year")}-${get("month")}-${get("day")}`, time: `${get("hour")}:${get("minute")}` };
}

const isIsoDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));

function isSaturday(date: string) {
  return new Date(`${date}T12:00:00Z`).getUTCDay() === 6;
}

/* ---------- Giorni e prezzi ---------- */

export function getDay(date: string): DayRow | undefined {
  return db().prepare("SELECT * FROM service_days WHERE date = ?").get(date) as DayRow | undefined;
}

export function priceFor(date: string, zone: Zone, cfg = getConfig(), day = getDay(date)): number {
  const override = zone === "terrazza" ? day?.price_terrazza : day?.price_chalet;
  if (override != null) return override;
  if (day?.special) return cfg.prices.special[zone];
  if (isSaturday(date)) return cfg.prices.saturday[zone];
  const period = cfg.prices.periods.find((p) => date >= p.from && date <= p.to);
  if (period) return period[zone];
  return cfg.prices.standard[zone];
}

export function expireHolds() {
  db().prepare("UPDATE bookings SET status = 'expired' WHERE status = 'hold' AND hold_expires_at < ?").run(Date.now());
}

const ACTIVE = "(status IN ('confirmed','manual') OR (status = 'hold' AND hold_expires_at >= ?))";

export function tables(): TableRow[] {
  // node:sqlite restituisce oggetti con prototipo null: li copiamo per poterli passare ai Client Component
  return (db().prepare("SELECT * FROM venue_tables ORDER BY id").all() as unknown as TableRow[]).map((r) => ({ ...r }));
}

export type DayState = "open" | "closed" | "soldout" | "past" | "cutoff";

export interface DayInfo {
  date: string;
  state: DayState;
  eventName: string | null;
  eventNameEn: string | null;
  special: boolean;
  prices: Record<Zone, number>;
  free: Record<Zone, number>;
}

export function dayInfo(date: string, cfg = getConfig()): DayInfo {
  const day = getDay(date);
  const now = romeNow();
  const all = tables();
  const taken = db()
    .prepare(`SELECT zone, COUNT(*) AS n FROM bookings WHERE date = ? AND ${ACTIVE} GROUP BY zone`)
    .all(date, Date.now()) as { zone: Zone; n: number }[];
  const free = Object.fromEntries(
    ZONES.map((z) => [z, all.filter((t) => t.zone === z).length - (taken.find((t) => t.zone === z)?.n ?? 0)]),
  ) as Record<Zone, number>;

  let state: DayState = "open";
  const inSeason = date >= cfg.seasonStart && date <= cfg.seasonEnd;
  if (date < now.date) state = "past";
  else if (!inSeason || (day && !day.open)) state = "closed";
  else if (date === now.date && now.time >= cfg.cutoff) state = "cutoff";
  else if (free.terrazza + free.chalet <= 0) state = "soldout";

  return {
    date,
    state,
    eventName: day?.event_name ?? null,
    eventNameEn: day?.event_name_en ?? null,
    special: !!day?.special,
    prices: { terrazza: priceFor(date, "terrazza", cfg, day), chalet: priceFor(date, "chalet", cfg, day) },
    free,
  };
}

export function monthDays(month: string): DayInfo[] {
  expireHolds();
  const cfg = getConfig();
  const [y, m] = month.split("-").map(Number);
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const out: DayInfo[] = [];
  for (let d = 1; d <= last; d++) {
    out.push(dayInfo(`${month}-${String(d).padStart(2, "0")}`, cfg));
  }
  return out;
}

export function specialEvents(): DayInfo[] {
  expireHolds();
  const now = romeNow();
  const rows = db()
    .prepare("SELECT date FROM service_days WHERE event_name IS NOT NULL AND date >= ? ORDER BY date LIMIT 8")
    .all(now.date) as { date: string }[];
  const cfg = getConfig();
  return rows.map((r) => dayInfo(r.date, cfg));
}

/* ---------- Creazione prenotazione (hold) ---------- */

export type HoldError =
  | "DATE_OUT_OF_RANGE" | "DAY_CLOSED" | "CUTOFF_PASSED" | "ONLINE_CLOSED"
  | "GUESTS_INVALID" | "CONTACT_INVALID" | "SLOT_INVALID" | "TABLE_TAKEN";

export interface HoldInput {
  date: string; zone: string; guests: number;
  name: string; phone: string; email: string; notes?: string; lang?: string;
}

const randomCode = () => {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return "HR-" + Array.from(crypto.randomBytes(6), (b) => alphabet[b % alphabet.length]).join("");
};

export function createHold(input: HoldInput): { ok: true; token: string } | { ok: false; error: HoldError } {
  const cfg = getConfig();
  if (!cfg.onlineOpen) return { ok: false, error: "ONLINE_CLOSED" };
  if (!isIsoDate(input.date)) return { ok: false, error: "DATE_OUT_OF_RANGE" };
  if (!ZONES.includes(input.zone as Zone)) return { ok: false, error: "SLOT_INVALID" };
  const zone = input.zone as Zone;
  const guests = Math.trunc(Number(input.guests));
  if (!(guests >= cfg.minGuests && guests <= cfg.maxGuests)) return { ok: false, error: "GUESTS_INVALID" };
  const name = (input.name ?? "").trim();
  const phone = (input.phone ?? "").trim();
  const email = (input.email ?? "").trim();
  if (name.length < 3 || !/^\+?[\d\s().-]{7,20}$/.test(phone) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "CONTACT_INVALID" };
  }

  const d = db();
  d.exec("BEGIN IMMEDIATE");
  try {
    expireHolds();
    const info = dayInfo(input.date, cfg);
    if (info.state === "past") throw "DATE_OUT_OF_RANGE";
    if (info.state === "closed") throw "DAY_CLOSED";
    if (info.state === "cutoff") throw "CUTOFF_PASSED";

    // Il cliente sceglie la zona; il sistema blocca un tavolo libero della zona
    // (lo staff può poi cambiarlo).
    const free = d
      .prepare(
        `SELECT id FROM venue_tables WHERE zone = ? AND id NOT IN
          (SELECT table_id FROM bookings WHERE date = ? AND table_id IS NOT NULL AND ${ACTIVE})
         ORDER BY id LIMIT 1`,
      )
      .get(zone, input.date, Date.now()) as { id: number } | undefined;
    if (!free) throw "TABLE_TAKEN";

    const price = info.prices[zone];
    const amount = Math.round((price * cfg.depositPct) / 100);
    const token = crypto.randomBytes(18).toString("base64url");
    d.prepare(
      `INSERT INTO bookings (code, token, date, zone, table_id, guests, name, phone, email, notes, lang, status,
        price_cents, amount_cents, hold_expires_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'hold', ?, ?, ?, ?)`,
    ).run(
      randomCode(), token, input.date, zone, free.id, guests, name, phone, email,
      (input.notes ?? "").slice(0, 500), input.lang === "en" ? "en" : "it",
      price * 100, amount * 100, Date.now() + cfg.holdMinutes * 60_000, Date.now(),
    );
    d.exec("COMMIT");
    return { ok: true, token };
  } catch (e) {
    d.exec("ROLLBACK");
    if (typeof e === "string") return { ok: false, error: e as HoldError };
    throw e;
  }
}

/* ---------- Lettura / aggiornamento prenotazioni ---------- */

export function bookingByToken(token: string): (BookingRow & { table_label: string | null }) | undefined {
  expireHolds();
  return db()
    .prepare(
      "SELECT b.*, t.label AS table_label FROM bookings b LEFT JOIN venue_tables t ON t.id = b.table_id WHERE b.token = ?",
    )
    .get(token) as (BookingRow & { table_label: string | null }) | undefined;
}

/** Conferma dopo il pagamento. Restituisce true solo alla prima conferma (per inviare l'email una volta). */
export function markPaid(token: string, stripeSession?: string): boolean {
  const res = db()
    .prepare(
      `UPDATE bookings SET status = 'confirmed', paid_at = ?, hold_expires_at = NULL,
         stripe_session = COALESCE(?, stripe_session)
       WHERE token = ? AND status IN ('hold','expired')`,
    )
    .run(Date.now(), stripeSession ?? null, token);
  return Number(res.changes) > 0;
}

export function releaseHold(token: string) {
  db().prepare("UPDATE bookings SET status = 'cancelled', cancel_reason = 'Annullata dal cliente' WHERE token = ? AND status = 'hold'").run(token);
}

/** Collega la sessione Stripe e allunga l'hold fino alla scadenza del checkout, così il tavolo
 *  non può essere preso da altri mentre il cliente sta pagando. */
export function setStripeSession(token: string, sessionId: string, holdUntil: number) {
  db()
    .prepare("UPDATE bookings SET stripe_session = ?, hold_expires_at = MAX(COALESCE(hold_expires_at, 0), ?) WHERE token = ? AND status = 'hold'")
    .run(sessionId, holdUntil, token);
}

export function bookingsForDate(date: string) {
  expireHolds();
  return db()
    .prepare(
      `SELECT b.*, t.label AS table_label FROM bookings b LEFT JOIN venue_tables t ON t.id = b.table_id
       WHERE b.date = ? ORDER BY CASE b.status WHEN 'confirmed' THEN 0 WHEN 'manual' THEN 1 WHEN 'hold' THEN 2 ELSE 3 END, t.id`,
    )
    .all(date) as unknown as (BookingRow & { table_label: string | null })[];
}

export function upsertDay(d: Omit<DayRow, "special"> & { special: number }) {
  db()
    .prepare(
      `INSERT INTO service_days (date, open, event_name, event_name_en, poster_url, special, price_terrazza, price_chalet, note)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(date) DO UPDATE SET open=excluded.open, event_name=excluded.event_name,
         event_name_en=excluded.event_name_en, poster_url=excluded.poster_url, special=excluded.special,
         price_terrazza=excluded.price_terrazza, price_chalet=excluded.price_chalet, note=excluded.note`,
    )
    .run(d.date, d.open, d.event_name, d.event_name_en, d.poster_url, d.special, d.price_terrazza, d.price_chalet, d.note);
}

export function setDaysOpen(from: string, to: string, weekdays: number[], open: boolean) {
  const stmt = db().prepare(
    `INSERT INTO service_days (date, open) VALUES (?, ?) ON CONFLICT(date) DO UPDATE SET open = excluded.open`,
  );
  const start = new Date(`${from}T12:00:00Z`);
  const end = new Date(`${to}T12:00:00Z`);
  let n = 0;
  for (let d = start; d <= end && n < 400; d = new Date(d.getTime() + 86_400_000), n++) {
    const wd = (d.getUTCDay() + 6) % 7; // 0 = lunedì
    if (weekdays.length && !weekdays.includes(wd)) continue;
    stmt.run(d.toISOString().slice(0, 10), open ? 1 : 0);
  }
}

export function manualBooking(input: {
  date: string; zone: Zone; tableId: number; guests: number; name: string; phone: string; notes: string;
}) {
  const taken = db()
    .prepare(`SELECT 1 FROM bookings WHERE date = ? AND table_id = ? AND ${ACTIVE}`)
    .get(input.date, input.tableId, Date.now());
  if (taken) return false;
  const price = priceFor(input.date, input.zone);
  db()
    .prepare(
      `INSERT INTO bookings (code, token, date, zone, table_id, guests, name, phone, email, notes, status,
        price_cents, amount_cents, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, '', ?, 'manual', ?, 0, ?)`,
    )
    .run(randomCode(), crypto.randomBytes(18).toString("base64url"), input.date, input.zone, input.tableId,
      input.guests, input.name, input.phone, input.notes, price * 100, Date.now());
  return true;
}

export function cancelBooking(id: number, reason: string) {
  db().prepare("UPDATE bookings SET status = 'cancelled', cancel_reason = ? WHERE id = ?").run(reason, id);
}

export function moveBooking(id: number, tableId: number) {
  const b = db().prepare("SELECT date FROM bookings WHERE id = ?").get(id) as { date: string } | undefined;
  if (!b) return false;
  const t = db().prepare("SELECT zone FROM venue_tables WHERE id = ?").get(tableId) as { zone: Zone } | undefined;
  if (!t) return false;
  const busy = db()
    .prepare(`SELECT 1 FROM bookings WHERE date = ? AND table_id = ? AND id != ? AND ${ACTIVE}`)
    .get(b.date, tableId, id, Date.now());
  if (busy) return false;
  db().prepare("UPDATE bookings SET table_id = ?, zone = ? WHERE id = ?").run(tableId, t.zone, id);
  return true;
}

export function checkIn(id: number) {
  db().prepare("UPDATE bookings SET checked_in_at = ? WHERE id = ? AND checked_in_at IS NULL").run(Date.now(), id);
}
