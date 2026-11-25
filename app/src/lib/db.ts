import "server-only";
import path from "node:path";
import fs from "node:fs";
import type { DatabaseSync as DatabaseSyncType } from "node:sqlite";

// node:sqlite è integrato in Node >= 22.5. Lo carichiamo a runtime per non farlo
// passare dal bundler di Next.
const { DatabaseSync } = process.getBuiltinModule("node:sqlite") as typeof import("node:sqlite");

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

const globalForDb = globalThis as unknown as { __haraldDb?: DatabaseSyncType };

function open(): DatabaseSyncType {
  const dir = path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  const db = new DatabaseSync(path.join(dir, "haralds.db"));
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
  migrate(db);
  return db;
}

export function db(): DatabaseSyncType {
  if (!globalForDb.__haraldDb) globalForDb.__haraldDb = open();
  return globalForDb.__haraldDb;
}

function migrate(db: DatabaseSyncType) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS service_days (
      date TEXT PRIMARY KEY,
      open INTEGER NOT NULL DEFAULT 1,
      event_name TEXT, event_name_en TEXT, poster_url TEXT,
      special INTEGER NOT NULL DEFAULT 0,
      price_terrazza INTEGER, price_chalet INTEGER,
      note TEXT
    );
    CREATE TABLE IF NOT EXISTS venue_tables (
      id INTEGER PRIMARY KEY,
      label TEXT NOT NULL,
      zone TEXT NOT NULL,
      x REAL NOT NULL, y REAL NOT NULL
    );
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      token TEXT NOT NULL UNIQUE,
      date TEXT NOT NULL,
      zone TEXT NOT NULL,
      table_id INTEGER REFERENCES venue_tables(id),
      guests INTEGER NOT NULL,
      name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT '',
      lang TEXT NOT NULL DEFAULT 'it',
      status TEXT NOT NULL,
      price_cents INTEGER NOT NULL,
      amount_cents INTEGER NOT NULL,
      hold_expires_at INTEGER,
      stripe_session TEXT,
      paid_at INTEGER,
      checked_in_at INTEGER,
      cancel_reason TEXT,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS bookings_date ON bookings(date, status);
  `);

  const seeded = db.prepare("SELECT value FROM settings WHERE key = 'seeded'").get();
  if (!seeded) seed(db);
}

function seed(db: DatabaseSyncType) {
  const insTable = db.prepare("INSERT INTO venue_tables (id, label, zone, x, y) VALUES (?, ?, ?, ?, ?)");
  // Terrazza sulle piste: 8 tavoli (coordinate in % sulla piantina SVG)
  const terr: [number, number][] = [
    [14, 22], [28, 22], [42, 22], [56, 22],
    [14, 38], [28, 38], [42, 38], [56, 38],
  ];
  terr.forEach(([x, y], i) => insTable.run(i + 1, `T${i + 1}`, "terrazza", x, y));
  // Sala chalet: 6 tavoli
  const chal: [number, number][] = [
    [18, 68], [32, 68], [46, 68],
    [18, 84], [32, 84], [46, 84],
  ];
  chal.forEach(([x, y], i) => insTable.run(100 + i + 1, `C${i + 1}`, "chalet", x, y));

  const defaults = {
    prices: {
      standard: { terrazza: 200, chalet: 150 },
      saturday: { terrazza: 300, chalet: 250 },
      special: { terrazza: 400, chalet: 350 },
      periods: [
        { label: "Natale / Capodanno", from: "2026-12-24", to: "2027-01-06", terrazza: 300, chalet: 250 },
      ],
    },
    depositPct: 100,
    holdMinutes: 10,
    cutoff: "13:00",
    onlineOpen: true,
    minGuests: 4,
    maxGuests: 8,
    seasonStart: "2026-12-05",
    seasonEnd: "2027-04-11",
  };
  const insSetting = db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)");
  insSetting.run("config", JSON.stringify(defaults));

  // Serate di esempio (BETA: nomi evento fittizi, da sostituire con quelli reali)
  const insDay = db.prepare(
    "INSERT INTO service_days (date, open, event_name, event_name_en, special, note) VALUES (?, ?, ?, ?, ?, ?)",
  );
  const days: [string, number, string | null, string | null, number, string | null][] = [
    ["2026-12-05", 1, "Opening Party", "Opening Party", 1, "Evento di esempio (beta)"],
    ["2026-12-08", 1, "Immacolata Après-Ski", "Immaculate Conception Après-Ski", 1, "Evento di esempio (beta)"],
    ["2026-12-25", 0, null, null, 0, "Natale: solo ristorante"],
    ["2026-12-31", 0, "Capodanno · su richiesta", "New Year's Eve · on request", 1, "Prenotazioni Capodanno per telefono"],
    ["2027-02-13", 1, "Carnevale sulla neve", "Carnival on the snow", 1, "Evento di esempio (beta)"],
  ];
  for (const d of days) insDay.run(...d);

  insSetting.run("seeded", "1");
}
