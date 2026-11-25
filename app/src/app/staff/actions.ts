"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { checkPassword, endSession, requireStaff, startSession } from "@/lib/auth";
import {
  cancelBooking, checkIn, checkInDemoToken, isDemoToken, getConfig, getDay, manualBooking, moveBooking, saveConfig, setDaysOpen, upsertDay,
  type Config,
} from "@/lib/booking";
import type { Zone } from "@/lib/db";

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const numOrNull = (f: FormData, k: string) => {
  const v = str(f, k);
  return v === "" ? null : Math.max(0, Math.round(Number(v)));
};
const isDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);

export async function login(_: string | null, f: FormData): Promise<string | null> {
  if (!checkPassword(str(f, "password"))) return "Password errata";
  await startSession();
  const next = str(f, "next");
  redirect(next.startsWith("/staff/") ? next : "/staff"); // es. torna al check-in del QR inquadrato
}

export async function logout() {
  await endSession();
  redirect("/staff");
}

export async function bulkDays(f: FormData) {
  await requireStaff();
  const from = str(f, "from"), to = str(f, "to");
  if (!isDate(from) || !isDate(to) || from > to) return;
  const weekdays = f.getAll("wd").map(Number).filter((n) => n >= 0 && n <= 6);
  await setDaysOpen(from, to, weekdays, str(f, "mode") === "open");
  revalidatePath("/staff");
}

export async function saveDay(f: FormData) {
  await requireStaff();
  const date = str(f, "date");
  if (!isDate(date)) return;
  const prev = await getDay(date);
  await upsertDay({
    date,
    open: f.get("open") ? 1 : 0,
    event_name: str(f, "event_name") || null,
    event_name_en: str(f, "event_name_en") || null,
    poster_url: str(f, "poster_url") || prev?.poster_url || null,
    special: f.get("special") ? 1 : 0,
    price_terrazza: numOrNull(f, "price_terrazza"),
    price_chalet: numOrNull(f, "price_chalet"),
    note: str(f, "note") || null,
  });
  revalidatePath(`/staff/serata/${date}`);
}

export async function addManual(f: FormData) {
  await requireStaff();
  const date = str(f, "date");
  const [zone, tableId] = str(f, "table").split(":");
  if (!isDate(date) || !tableId) return;
  await manualBooking({
    date, zone: zone as Zone, tableId: Number(tableId),
    guests: Math.min(20, Math.max(1, Number(str(f, "guests")) || 4)),
    name: str(f, "name") || "Walk-in", phone: str(f, "phone"), notes: str(f, "notes"),
  });
  revalidatePath(`/staff/serata/${date}`);
}

export async function cancel(f: FormData) {
  await requireStaff();
  await cancelBooking(Number(str(f, "id")), str(f, "reason") || "Annullata dallo staff");
  revalidatePath(`/staff/serata/${str(f, "date")}`);
}

export async function move(f: FormData) {
  await requireStaff();
  await moveBooking(Number(str(f, "id")), Number(str(f, "table")));
  revalidatePath(`/staff/serata/${str(f, "date")}`);
}

export async function arrived(f: FormData) {
  await requireStaff();
  const token = str(f, "token");
  if (token && isDemoToken(token)) {
    const next = checkInDemoToken(token);
    redirect(`/staff/checkin/${next ?? token}`);
  }
  await checkIn(Number(str(f, "id")));
  const back = str(f, "back");
  if (back.startsWith("/staff")) redirect(back);
  revalidatePath(`/staff/serata/${str(f, "date")}`);
}

export async function saveSettings(f: FormData) {
  await requireStaff();
  const c = await getConfig();
  const n = (k: string, fallback: number) => {
    const v = Number(str(f, k));
    return Number.isFinite(v) && str(f, k) !== "" ? Math.max(0, Math.round(v)) : fallback;
  };
  const periods: Config["prices"]["periods"] = str(f, "periods")
    .split("\n")
    .map((l) => l.split(";").map((x) => x.trim()))
    .filter((p) => p.length === 5 && isDate(p[1]) && isDate(p[2]))
    .map(([label, from, to, terrazza, chalet]) => ({ label, from, to, terrazza: Number(terrazza) || 0, chalet: Number(chalet) || 0 }));
  const next: Config = {
    prices: {
      standard: { terrazza: n("std_t", c.prices.standard.terrazza), chalet: n("std_c", c.prices.standard.chalet) },
      saturday: { terrazza: n("sat_t", c.prices.saturday.terrazza), chalet: n("sat_c", c.prices.saturday.chalet) },
      special: { terrazza: n("spe_t", c.prices.special.terrazza), chalet: n("spe_c", c.prices.special.chalet) },
      periods,
    },
    depositPct: Math.min(100, Math.max(1, n("depositPct", c.depositPct))),
    holdMinutes: Math.min(60, Math.max(3, n("holdMinutes", c.holdMinutes))),
    cutoff: /^\d{2}:\d{2}$/.test(str(f, "cutoff")) ? str(f, "cutoff") : c.cutoff,
    onlineOpen: !!f.get("onlineOpen"),
    minGuests: Math.max(1, n("minGuests", c.minGuests)),
    maxGuests: Math.max(1, n("maxGuests", c.maxGuests)),
    seasonStart: isDate(str(f, "seasonStart")) ? str(f, "seasonStart") : c.seasonStart,
    seasonEnd: isDate(str(f, "seasonEnd")) ? str(f, "seasonEnd") : c.seasonEnd,
  };
  if (next.minGuests > next.maxGuests) next.minGuests = next.maxGuests;
  await saveConfig(next);
  revalidatePath("/staff/impostazioni");
}
