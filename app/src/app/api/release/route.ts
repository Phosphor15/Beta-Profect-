import { NextResponse } from "next/server";
import { releaseHold } from "@/lib/booking";

export async function POST(req: Request) {
  const { token } = (await req.json().catch(() => ({}))) as { token?: string };
  if (token) releaseHold(token);
  return NextResponse.json({ ok: true });
}
