import "server-only";
import path from "node:path";
import fs from "node:fs";
import type { DatabaseSync } from "node:sqlite";
import type { Pool, PoolClient } from "pg";

/*
 * Accesso al database con due motori:
 *  - Postgres quando è impostata DATABASE_URL (o NETLIFY_DATABASE_URL, creata da Netlify DB):
 *    è quello usato online su Netlify, dove il disco non è permanente.
 *  - SQLite (file data/haralds.db, integrato in Node >= 22.5) in tutti gli altri casi:
 *    comodo per provare il sito in locale senza configurare nulla.
 * Le query si scrivono con i segnaposto "?" e funzionano su entrambi.
 */

export type Zone = "terrazza" | "chalet";
export const ZONES: Zone[] = ["terrazza", "chalet"];

export type BookingStatus = "hold" | "confirmed" | "manual" | "cancelled" | "expired";

export interface BookingRow {
  id: number;
  code: string;
  token: string;
  date: string;
  zone: Zone;
  table_id: number | null;
  guests: number;
  name: string;
  phone: string;
  email: string;
  notes: string;
  lang: string;
  status: BookingStatus;
  price_cents: number;
  amount_cents: number;
  hold_expires_at: number | null;
  stripe_session: string | null;
  paid_at: number | null;
  checked_in_at: number | null;
  cancel_reason: string | null;
  created_at: number;
}

export interface DayRow {
  date: string;
  open: number;
  event_name: string | null;
  event_name_en: string | null;
  poster_url: string | null;
  special: number;
  price_terrazza: number | null;
  price_chalet: number | null;
  note: string | null;
}

export interface TableRow {
  id: number;
  label: string;
  zone: Zone;
  x: number;
  y: number;
}

type Param = string | number | null;

export interface Db {
  all<T>(sql: string, ...params: Param[]): Promise<T[]>;
  get<T>(sql: string, ...params: Param[]): Promise<T | undefined>;
  /** Esegue una scrittura e restituisce il numero di righe modificate. */
  run(sql: string, ...params: Param[]): Promise<number>;
}

interface Engine extends Db {
  kind: "pg" | "sqlite";
  /** Esegue fn in una transazione serializzata (una alla volta), con commit o rollback automatico. */
  tx<T>(fn: (db: Db) => Promise<T>): Promise<T>;
}

const databaseUrl = () => process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL || "";

/* ---------------- Postgres ---------------- */

function toPg(sql: string) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

async function pgEngine(): Promise<Engine> {
  const pg = await import("pg");
  const { Pool: PgPool, types } = pg.default ?? pg;
  types.setTypeParser(20, (v: string) => Number(v)); // BIGINT -> number (timestamp in ms)
  const url = databaseUrl();
  const pool: Pool = new PgPool({
    connectionString: url,
    max: 3,
    ssl: /localhost|127\.0\.0\.1/.test(url) ? undefined : { rejectUnauthorized: false },
  });
  const wrap = (c: Pool | PoolClient): Db => ({
    async all<T>(sql: string, ...p: Param[]) { return (await c.query(toPg(sql), p)).rows as T[]; },
    async get<T>(sql: string, ...p: Param[]) { return (await c.query(toPg(sql), p)).rows[0] as T | undefined; },
    async run(sql: string, ...p: Param[]) { return (await c.query(toPg(sql), p)).rowCount ?? 0; },
  });
  return {
    kind: "pg",
    ...wrap(pool),
    async tx(fn) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        await client.query("SELECT pg_advisory_xact_lock(7426)"); // una prenotazione alla volta
        const out = await fn(wrap(client));
        await client.query("COMMIT");
        return out;
      } catch (e) {
        await client.query("ROLLBACK").catch(() => {});
        throw e;
      } finally {
        client.release();
      }
    },
  };
}

/* ---------------- SQLite (locale) ---------------- */

function sqliteEngine(): Engine {
  const { DatabaseSync: Sqlite } = process.getBuiltinModule("node:sqlite") as typeof import("node:sqlite");
  // Online senza database collegato il disco è di sola lettura tranne /tmp: i dati sono temporanei.
  const serverless = !!(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
  if (serverless) console.warn("[db] Nessun DATABASE_URL: uso SQLite temporaneo in /tmp. Collega Netlify DB per dati persistenti.");
  const dir = serverless ? "/tmp/haralds" : path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  const conn: DatabaseSync = new Sqlite(path.join(dir, "haralds.db"));
  conn.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");

  // Con una sola connessione serve un lucchetto: durante una transazione le altre query aspettano.
  let lock: Promise<void> = Promise.resolve();
  const plain = (r: unknown) => (r && typeof r === "object" ? { ...(r as object) } : r); // via il prototipo null
  const direct: Db = {
    async all<T>(sql: string, ...p: Param[]) { return conn.prepare(sql).all(...p).map(plain) as T[]; },
    async get<T>(sql: string, ...p: Param[]) { return plain(conn.prepare(sql).get(...p)) as T | undefined; },
    async run(sql: string, ...p: Param[]) { return Number(conn.prepare(sql).run(...p).changes); },
  };
  const waiting: Db = {
    async all(sql, ...p) { await lock; return direct.all(sql, ...p); },
    async get(sql, ...p) { await lock; return direct.get(sql, ...p); },
    async run(sql, ...p) { await lock; return direct.run(sql, ...p); },
  };
  return {
    kind: "sqlite",
    ...waiting,
    async tx(fn) {
      const prev = lock;
      let release!: () => void;
      lock = new Promise((r) => (release = r));
      await prev;
      try {
        conn.exec("BEGIN IMMEDIATE");
        try {
          const out = await fn(direct);
          conn.exec("COMMIT");
          return out;
        } catch (e) {
          conn.exec("ROLLBACK");
          throw e;
        }
      } finally {
        release();
      }
    },
  };
}

/* ---------------- Schema e dati iniziali ---------------- */

async function migrate(e: Engine) {
  const pg = e.kind === "pg";
  const id = pg ? "SERIAL PRIMARY KEY" : "INTEGER PRIMARY KEY AUTOINCREMENT";
  const big = pg ? "BIGINT" : "INTEGER";
  const real = pg ? "DOUBLE PRECISION" : "REAL";
  const ddl = [
    "CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)",
    `CREATE TABLE IF NOT EXISTS service_days (
      date TEXT PRIMARY KEY, open INTEGER NOT NULL DEFAULT 1,
      event_name TEXT, event_name_en TEXT, poster_url TEXT,
      special INTEGER NOT NULL DEFAULT 0, price_terrazza INTEGER, price_chalet INTEGER, note TEXT)`,
    `CREATE TABLE IF NOT EXISTS venue_tables (
      id INTEGER PRIMARY KEY, label TEXT NOT NULL, zone TEXT NOT NULL, x ${real} NOT NULL, y ${real} NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS bookings (
      id ${id},
      code TEXT NOT NULL UNIQUE, token TEXT NOT NULL UNIQUE,
      date TEXT NOT NULL, zone TEXT NOT NULL, table_id INTEGER REFERENCES venue_tables(id),
      guests INTEGER NOT NULL, name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT '', lang TEXT NOT NULL DEFAULT 'it', status TEXT NOT NULL,
      price_cents INTEGER NOT NULL, amount_cents INTEGER NOT NULL,
      hold_expires_at ${big}, stripe_session TEXT, paid_at ${big}, checked_in_at ${big},
      cancel_reason TEXT, created_at ${big} NOT NULL)`,
    "CREATE INDEX IF NOT EXISTS bookings_date ON bookings(date, status)",
  ];
  for (const s of ddl) await e.run(s);

  await e.tx(async (t) => {
    if (await t.get("SELECT value FROM settings WHERE key = 'seeded'")) return;
    await seed(t);
  });
}

async function seed(t: Db) {
  // Terrazza sulle piste: 8 tavoli; Sala chalet: 6 tavoli (coordinate in % sulla piantina)
  const terr: [number, number][] = [[14, 22], [28, 22], [42, 22], [56, 22], [14, 38], [28, 38], [42, 38], [56, 38]];
  const chal: [number, number][] = [[18, 68], [32, 68], [46, 68], [18, 84], [32, 84], [46, 84]];
  for (const [i, [x, y]] of terr.entries()) await t.run("INSERT INTO venue_tables (id, label, zone, x, y) VALUES (?, ?, 'terrazza', ?, ?)", i + 1, `T${i + 1}`, x, y);
  for (const [i, [x, y]] of chal.entries()) await t.run("INSERT INTO venue_tables (id, label, zone, x, y) VALUES (?, ?, 'chalet', ?, ?)", 101 + i, `C${i + 1}`, x, y);

  const defaults = {
    prices: {
      standard: { terrazza: 200, chalet: 150 },
      saturday: { terrazza: 300, chalet: 250 },
      special: { terrazza: 400, chalet: 350 },
      periods: [{ label: "Natale / Capodanno", from: "2026-12-24", to: "2027-01-06", terrazza: 300, chalet: 250 }],
    },
    depositPct: 100, holdMinutes: 10, cutoff: "13:00", onlineOpen: true,
    minGuests: 4, maxGuests: 8, seasonStart: "2026-12-05", seasonEnd: "2027-04-11",
  };
  await t.run("INSERT INTO settings (key, value) VALUES ('config', ?)", JSON.stringify(defaults));

  // Serate di esempio (BETA: nomi evento fittizi, da sostituire con quelli reali)
  const days: [string, number, string | null, string | null, number, string | null][] = [
    ["2026-12-05", 1, "Opening Party", "Opening Party", 1, "Evento di esempio (beta)"],
    ["2026-12-08", 1, "Immacolata Après-Ski", "Immaculate Conception Après-Ski", 1, "Evento di esempio (beta)"],
    ["2026-12-25", 0, null, null, 0, "Natale: solo ristorante"],
    ["2026-12-31", 0, "Capodanno · su richiesta", "New Year's Eve · on request", 1, "Prenotazioni Capodanno per telefono"],
    ["2027-02-13", 1, "Carnevale sulla neve", "Carnival on the snow", 1, "Evento di esempio (beta)"],
  ];
  for (const d of days) {
    await t.run("INSERT INTO service_days (date, open, event_name, event_name_en, special, note) VALUES (?, ?, ?, ?, ?, ?)", ...d);
  }
  // Prenotazioni dimostrative (nomi inventati) per mostrare l'area staff durante la presentazione
  const demo: [string, string, number, number, string, string, number][] = [
    ["2026-12-05", "terrazza", 1, 6, "Famiglia Rossi (demo)", "confirmed", 350],
    ["2026-12-05", "terrazza", 2, 8, "Gruppo Sci Club Torino (demo)", "confirmed", 400],
    ["2026-12-05", "terrazza", 3, 4, "Marco B. (demo)", "confirmed", 400],
    ["2026-12-05", "chalet", 101, 5, "Laura e amici (demo)", "confirmed", 350],
    ["2026-12-05", "chalet", 102, 6, "Tavolo maestri di sci (demo)", "manual", 350],
    ["2026-12-08", "terrazza", 1, 7, "Addio al celibato Luca (demo)", "confirmed", 400],
    ["2026-12-12", "chalet", 101, 4, "Giulia M. (demo)", "confirmed", 250],
  ];
  for (const [i, [date, zone, tableId, guests, name, status, eur]] of demo.entries()) {
    const code = `HR-DEMO${String(i + 1).padStart(2, "0")}`;
    await t.run(
      `INSERT INTO bookings (code, token, date, zone, table_id, guests, name, phone, email, notes, status,
        price_cents, amount_cents, paid_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, '+39 333 0000000', ?, '', ?, ?, ?, ?, ?)`,
      code, `demo-${i + 1}`, date, zone, tableId, guests, name, status === "manual" ? "" : "demo@example.com",
      status, eur * 100, status === "manual" ? 0 : eur * 100, status === "manual" ? null : Date.now(), Date.now(),
    );
  }
  await t.run("INSERT INTO settings (key, value) VALUES ('seeded', '1')");
}

/* ---------------- Istanza condivisa ---------------- */

const g = globalThis as unknown as { __haraldDb?: Promise<Engine> };

async function open(): Promise<Engine> {
  const e = databaseUrl() ? await pgEngine() : sqliteEngine();
  await migrate(e);
  return e;
}

export function engine(): Promise<Engine> {
  g.__haraldDb ??= open().catch((err) => {
    g.__haraldDb = undefined; // riprova alla prossima richiesta
    throw err;
  });
  return g.__haraldDb;
}
