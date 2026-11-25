import "server-only";
import { cookies } from "next/headers";
import { dicts, type Lang } from "./i18n";

export async function getLang(): Promise<Lang> {
  const c = (await cookies()).get("lang")?.value;
  return c === "en" ? "en" : "it";
}

export async function getDict() {
  const lang = await getLang();
  return { lang, t: dicts[lang] };
}
