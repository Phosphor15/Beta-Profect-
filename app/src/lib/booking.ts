import "server-only";
import crypto from "node:crypto";
import { engine, type BookingRow, type Db, type DayRow, type TableRow, type Zone, ZONES } from "./db";

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

export async function getConfig(d?: Db): Promise<Config> {
  const db = d ?? (await engine());
  const row = await db.get<{ value: string }>("SELECT value FROM settings WHERE key = 'config'");
  return JSON.parse(row!.value) as Config;
}

export async function saveConfig(c: Config) {
  await (await engine()).run("UPDATE settings SET value = ? WHERE key = 'config'", JSON.stringify(c));
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
const isSaturday = (date: string) => new Date(`${date}T12:00:00Z`).getUTCDay() === 6;

/* ---------- Giorni e prezzi ---------- */

export async function getDay(date: string, d?: Db): Promise<DayRow | undefined> {
  return (d ?? (await engine())).get<DayRow>("SELECT * FROM service_days WHERE date = ?", date);
}

export function priceFor(date: string, zone: Zone, cfg: Config, day: DayRow | undefined): number {
  const override = zone === "terrazza" ? day?.price_terrazza : day?.price_chalet;
  if (override != null) return override;
  if (day?.special) return cfg.prices.special[zone];
  if (isSaturday(date)) return cfg.prices.saturday[zone];
  const period = cfg.prices.periods.find((p) => date >= p.from && date <= p.to);
  if (period) return period[zone];
  return cfg.prices.standard[zone];
}

export async function expireHolds(d?: Db) {
  await (d ?? (await engine())).run("UPDATE bookings SET status = 'expired' WHERE status = 'hold' AND hold_expires_at < ?", Date.now());
}

/** Prenotazioni che occupano un tavolo. Usa un parametro: Date.now() */
const ACTIVE = "(status IN ('confirmed','manual') OR (status = 'hold' AND hold_expires_at >= ?))";

export async function tables(d?: Db): Promise<TableRow[]> {
  return (d ?? (await engine())).all<TableRow>("SELECT * FROM venue_tables ORDER BY id");
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

function computeDay(
  date: string, day: DayRow | undefined, all: TableRow[], taken: Partial<Record<Zone, number>>, cfg: Config,
): DayInfo {
  const now = romeNow();
  const free = Object.fromEntries(
    ZONES.map((z) => [z, all.filter((t) => t.zone === z).length - (taken[z] ?? 0)]),
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

/** Informazioni su più date con sole 3 query (importante con un database remoto). */
async function daysInfo(dates: string[], d?: Db): Promise<DayInfo[]> {
  if (!dates.length) return [];
  const db = d ?? (await engine());
  const first = dates.reduce((a, b) => (a < b ? a : b));
  const last = dates.reduce((a, b) => (a > b ? a : b));
  const [cfg, all, dayRows, counts] = await Promise.all([
    getConfig(db),
    tables(db),
    db.all<DayRow>("SELECT * FROM service_days WHERE date >= ? AND date <= ?", first, last),
    db.all<{ date: string; zone: Zone; n: number | string }>(
      `SELECT date, zone, COUNT(*) AS n FROM bookings WHERE date >= ? AND date <= ? AND ${ACTIVE} GROUP BY date, zone`,
      first, last, Date.now(),
    ),
  ]);
  return dates.map((date) => {
    const taken: Partial<Record<Zone, number>> = {};
    for (const c of counts) if (c.date === date) taken[c.zone] = Number(c.n);
    return computeDay(date, dayRows.find((r) => r.date === date), all, taken, cfg);
  });
}

export async function dayInfo(date: string, d?: Db): Promise<DayInfo> {
  return (await daysInfo([date], d))[0];
}

export async function monthDays(month: string): Promise<DayInfo[]> {
  await expireHolds();
  const [y, m] = month.split("-").map(Number);
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return daysInfo(Array.from({ length: last }, (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`));
}

export async function specialEvents(): Promise<DayInfo[]> {
  await expireHolds();
  const db = await engine();
  const rows = await db.all<{ date: string }>(
    "SELECT date FROM service_days WHERE event_name IS NOT NULL AND date >= ? ORDER BY date LIMIT 8",
    romeNow().date,
  );
  const infos = await daysInfo(rows.map((r) => r.date), db);
  return infos.sort((a, b) => a.date.localeCompare(b.date));
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

class HoldFail extends Error {
  constructor(public code: HoldError) { super(code); }
}

export async function createHold(input: HoldInput): Promise<{ ok: true; token: string } | { ok: false; error: HoldError }> {
  const cfg = await getConfig();
  if (!cfg.onlineOpen) return { ok: false, error: "ONLINE_CLOSED" };
  if (!isIsoDate(input.date)) return { ok: false, error: "DATE_OUT_OF_RANGE" };
  if (!ZONES.includes(input.zone as Zone)) return { ok: false, error: "SLOT_INVALID" };
  const zone = input.zone as Zone;
  const guests = Math.trunc(Number(input.guests));
  if (!(guests >= cfg.minGuests && guests <= cfg.maxGuests)) return { ok: false, error: "GUESTS_INVALID" };
  const name = String(input.name ?? "").trim();
  const phone = String(input.phone ?? "").trim();
  const email = String(input.email ?? "").trim();
  if (name.length < 3 || !/^\+?[\d\s().-]{7,20}$/.test(phone) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "CONTACT_INVALID" };
  }

  try {
    const token = await (await engine()).tx(async (t) => {
      await expireHolds(t);
      const info = await dayInfo(input.date, t);
      if (info.state === "past") throw new HoldFail("DATE_OUT_OF_RANGE");
      if (info.state === "closed") throw new HoldFail("DAY_CLOSED");
      if (info.state === "cutoff") throw new HoldFail("CUTOFF_PASSED");

      // Il cliente sceglie la zona; il sistema blocca un tavolo libero della zona (lo staff può cambiarlo).
      const free = await t.get<{ id: number }>(
        `SELECT id FROM venue_tables WHERE zone = ? AND id NOT IN
          (SELECT table_id FROM bookings WHERE date = ? AND table_id IS NOT NULL AND ${ACTIVE})
         ORDER BY id LIMIT 1`,
        zone, input.date, Date.now(),
      );
      if (!free) throw new HoldFail("TABLE_TAKEN");

      const price = info.prices[zone];
      const amount = Math.round((price * cfg.depositPct) / 100);
      const tok = crypto.randomBytes(18).toString("base64url");
      const code = randomCode();
      const expires = Date.now() + cfg.holdMinutes * 60_000;
      const label = (await t.get<{ label: string }>("SELECT label FROM venue_tables WHERE id = ?", free.id))?.label ?? null;
      await t.run(
        `INSERT INTO bookings (code, token, date, zone, table_id, guests, name, phone, email, notes, lang, status,
          price_cents, amount_cents, hold_expires_at, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'hold', ?, ?, ?, ?)`,
        code, tok, input.date, zone, free.id, guests, name, phone, email,
        String(input.notes ?? "").slice(0, 500), input.lang === "en" ? "en" : "it",
        price * 100, amount * 100, expires, Date.now(),
      );
      if (!demoBookings()) return tok;
      return signDemo({
        c: code, d: input.date, z: zone, tl: label, g: guests, n: name, p: phone, e: email,
        l: input.lang === "en" ? "en" : "it", s: "hold", pc: price * 100, ac: amount * 100, x: expires,
      });
    });
    return { ok: true, token };
  } catch (e) {
    if (e instanceof HoldFail) return { ok: false, error: e.code };
    throw e;
  }
}

/* ---------- Prenotazioni "autosufficienti" per la demo ----------
 * Nella demo (nessuna chiave Stripe) i dati della prenotazione viaggiano dentro il link e il QR,
 * firmati con SESSION_SECRET: non serve alcun database e funziona anche su Netlify, dove ogni
 * richiesta può essere servita da un'istanza diversa con dati propri.
 */

export type BookingView = BookingRow & { table_label: string | null };

interface DemoPayload {
  c: string; d: string; z: Zone; tl: string | null; g: number; n: string; p: string; e: string;
  l: string; s: BookingRow["status"]; pc: number; ac: number; x: number | null; pa?: number; ci?: number;
}

export const demoBookings = () => !process.env.STRIPE_SECRET_KEY;
const demoSecret = () => process.env.SESSION_SECRET || "dev-only-secret-change-me";
const demoSig = (body: string) => crypto.createHmac("sha256", demoSecret()).update(body).digest("base64url").slice(0, 24);
export const isDemoToken = (t: string) => t.includes(".");

function signDemo(p: DemoPayload): string {
  const body = Buffer.from(JSON.stringify(p)).toString("base64url");
  return `${body}.${demoSig(body)}`;
}

function readDemo(token: string): DemoPayload | null {
  const [body, sig] = token.split(".");
  if (!body || !sig || sig.length !== 24) return null;
  const expected = demoSig(body);
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return null;
  try { return JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as DemoPayload; } catch { return null; }
}

function demoView(token: string, p: DemoPayload): BookingView {
  const expired = p.s === "hold" && p.x != null && p.x < Date.now();
  return {
    id: 0, code: p.c, token, date: p.d, zone: p.z, table_id: null, table_label: p.tl, guests: p.g,
    name: p.n, phone: p.p, email: p.e, notes: "", lang: p.l, status: expired ? "expired" : p.s,
    price_cents: p.pc, amount_cents: p.ac, hold_expires_at: p.x, stripe_session: null,
    paid_at: p.pa ?? null, checked_in_at: p.ci ?? null, cancel_reason: null, created_at: 0,
  };
}

/** Pagamento simulato: restituisce il nuovo link della prenotazione confermata. */
export function confirmDemoToken(token: string): string | null {
  const p = readDemo(token);
  if (!p || p.s !== "hold" || (p.x != null && p.x < Date.now())) return null;
  return signDemo({ ...p, s: "confirmed", x: null, pa: Date.now() });
}

/** Check-in simulato: restituisce il link con l'orario di ingresso registrato. */
export function checkInDemoToken(token: string): string | null {
  const p = readDemo(token);
  if (!p || (p.s !== "confirmed" && p.s !== "manual")) return null;
  return signDemo({ ...p, ci: p.ci ?? Date.now() });
}

/* ---------- Lettura / aggiornamento prenotazioni ---------- */

export async function bookingByToken(token: string): Promise<BookingView | undefined> {
  if (isDemoToken(token)) {
    const p = readDemo(token);
    return p ? demoView(token, p) : undefined;
  }
  await expireHolds();
  return (await engine()).get<BookingView>(
    "SELECT b.*, t.label AS table_label FROM bookings b LEFT JOIN venue_tables t ON t.id = b.table_id WHERE b.token = ?",
    token,
  );
}

/** Conferma dopo il pagamento. Restituisce true solo alla prima conferma (per inviare l'email una volta). */
export async function markPaid(token: string, stripeSession?: string): Promise<boolean> {
  const n = await (await engine()).run(
    `UPDATE bookings SET status = 'confirmed', paid_at = ?, hold_expires_at = NULL,
       stripe_session = COALESCE(?, stripe_session)
     WHERE token = ? AND status IN ('hold','expired')`,
    Date.now(), stripeSession ?? null, token,
  );
  return n > 0;
}

export async function releaseHold(token: string) {
  await (await engine()).run(
    "UPDATE bookings SET status = 'cancelled', cancel_reason = 'Annullata dal cliente' WHERE token = ? AND status = 'hold'",
    token,
  );
}

/** Collega la sessione Stripe e allunga l'hold fino alla scadenza del checkout, così il tavolo
 *  non può essere preso da altri mentre il cliente sta pagando. */
export async function setStripeSession(token: string, sessionId: string, holdUntil: number) {
  await (await engine()).run(
    `UPDATE bookings SET stripe_session = ?,
       hold_expires_at = CASE WHEN COALESCE(hold_expires_at, 0) > ? THEN hold_expires_at ELSE ? END
     WHERE token = ? AND status = 'hold'`,
    sessionId, holdUntil, holdUntil, token,
  );
}

export async function bookingsForDate(date: string): Promise<BookingView[]> {
  await expireHolds();
  return (await engine()).all<BookingView>(
    `SELECT b.*, t.label AS table_label FROM bookings b LEFT JOIN venue_tables t ON t.id = b.table_id
     WHERE b.date = ? ORDER BY CASE b.status WHEN 'confirmed' THEN 0 WHEN 'manual' THEN 1 WHEN 'hold' THEN 2 ELSE 3 END, t.id`,
    date,
  );
}

export async function upsertDay(d: DayRow) {
  await (await engine()).run(
    `INSERT INTO service_days (date, open, event_name, event_name_en, poster_url, special, price_terrazza, price_chalet, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(date) DO UPDATE SET open=excluded.open, event_name=excluded.event_name,
       event_name_en=excluded.event_name_en, poster_url=excluded.poster_url, special=excluded.special,
       price_terrazza=excluded.price_terrazza, price_chalet=excluded.price_chalet, note=excluded.note`,
    d.date, d.open, d.event_name, d.event_name_en, d.poster_url, d.special, d.price_terrazza, d.price_chalet, d.note,
  );
}

export async function setDaysOpen(from: string, to: string, weekdays: number[], open: boolean) {
  const db = await engine();
  const start = new Date(`${from}T12:00:00Z`);
  const end = new Date(`${to}T12:00:00Z`);
  const dates: string[] = [];
  for (let d = start, n = 0; d <= end && n < 400; d = new Date(d.getTime() + 86_400_000), n++) {
    const wd = (d.getUTCDay() + 6) % 7; // 0 = lunedì
    if (!weekdays.length || weekdays.includes(wd)) dates.push(d.toISOString().slice(0, 10));
  }
  await db.tx(async (t) => {
    for (const date of dates) {
      await t.run(
        "INSERT INTO service_days (date, open) VALUES (?, ?) ON CONFLICT(date) DO UPDATE SET open = excluded.open",
        date, open ? 1 : 0,
      );
    }
  });
}

export async function manualBooking(input: {
  date: string; zone: Zone; tableId: number; guests: number; name: string; phone: string; notes: string;
}): Promise<boolean> {
  return (await engine()).tx(async (t) => {
    const taken = await t.get(`SELECT 1 AS x FROM bookings WHERE date = ? AND table_id = ? AND ${ACTIVE}`, input.date, input.tableId, Date.now());
    if (taken) return false;
    const price = priceFor(input.date, input.zone, await getConfig(t), await getDay(input.date, t));
    await t.run(
      `INSERT INTO bookings (code, token, date, zone, table_id, guests, name, phone, email, notes, status,
        price_cents, amount_cents, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, '', ?, 'manual', ?, 0, ?)`,
      randomCode(), crypto.randomBytes(18).toString("base64url"), input.date, input.zone, input.tableId,
      input.guests, input.name, input.phone, input.notes, price * 100, Date.now(),
    );
    return true;
  });
}

export async function cancelBooking(id: number, reason: string) {
  await (await engine()).run("UPDATE bookings SET status = 'cancelled', cancel_reason = ? WHERE id = ?", reason, id);
}

export async function moveBooking(id: number, tableId: number): Promise<boolean> {
  return (await engine()).tx(async (t) => {
    const b = await t.get<{ date: string }>("SELECT date FROM bookings WHERE id = ?", id);
    const tb = await t.get<{ zone: Zone }>("SELECT zone FROM venue_tables WHERE id = ?", tableId);
    if (!b || !tb) return false;
    const busy = await t.get(
      `SELECT 1 AS x FROM bookings WHERE date = ? AND table_id = ? AND id != ? AND ${ACTIVE}`,
      b.date, tableId, id, Date.now(),
    );
    if (busy) return false;
    await t.run("UPDATE bookings SET table_id = ?, zone = ? WHERE id = ?", tableId, tb.zone, id);
    return true;
  });
}

export async function checkIn(id: number) {
  await (await engine()).run("UPDATE bookings SET checked_in_at = ? WHERE id = ? AND checked_in_at IS NULL", Date.now(), id);
}
