import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "staff_session";
const secret = () => process.env.SESSION_SECRET || "dev-only-secret-change-me";
export const staffPassword = () => process.env.STAFF_PASSWORD || "harald-beta";

function sign(value: string) {
  return crypto.createHmac("sha256", secret()).update(value).digest("base64url");
}

export function checkPassword(pw: string) {
  const a = Buffer.from(sign(pw));
  const b = Buffer.from(sign(staffPassword()));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function startSession() {
  const exp = Date.now() + 1000 * 60 * 60 * 14; // 14 ore: un turno
  const value = `${exp}.${sign(String(exp))}`;
  (await cookies()).set(COOKIE, value, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 14,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isStaff() {
  const v = (await cookies()).get(COOKIE)?.value;
  if (!v) return false;
  const [exp, sig] = v.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const expected = sign(exp);
  return expected.length === sig.length && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
}

export async function requireStaff() {
  if (!(await isStaff())) redirect("/staff");
}
