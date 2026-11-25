import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { lang } = (await req.json().catch(() => ({}))) as { lang?: string };
  const res = NextResponse.json({ ok: true });
  res.cookies.set("lang", lang === "en" ? "en" : "it", { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  return res;
}
