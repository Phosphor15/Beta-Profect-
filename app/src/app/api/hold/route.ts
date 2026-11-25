import { NextResponse } from "next/server";
import { createHold, type HoldInput } from "@/lib/booking";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as HoldInput | null;
  if (!body) return NextResponse.json({ error: "GENERIC" }, { status: 400 });
  const res = createHold(body);
  if (!res.ok) return NextResponse.json({ error: res.error }, { status: 409 });
  return NextResponse.json({ token: res.token });
}
