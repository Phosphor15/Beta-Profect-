import { NextResponse } from "next/server";
import { monthDays } from "@/lib/booking";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const month = new URL(req.url).searchParams.get("month") ?? "";
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return NextResponse.json({ error: "bad month" }, { status: 400 });
  return NextResponse.json({ days: await monthDays(month) });
}
