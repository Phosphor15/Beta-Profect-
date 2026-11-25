import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { getDict } from "@/lib/lang";
import { publicUrl } from "@/lib/stripe";

export const metadata: Metadata = {
  metadataBase: new URL(publicUrl()),
  title: { default: "Harald's · Ski Restaurant & Après-Ski a Bardonecchia", template: "%s · Harald's Bardonecchia" },
  description:
    "Harald's Ski Restaurant Bar a Campo Smith, Bardonecchia: colazioni, pranzi, cene alpine e après-ski con DJ set. Prenota il tuo tavolo online.",
  openGraph: { siteName: "Harald's Ski Restaurant Bar", type: "website", locale: "it_IT", alternateLocale: ["en_GB"] },
};

export const viewport: Viewport = { themeColor: "#081230", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { lang, t } = await getDict();
  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Cormorant+SC:wght@500;600&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap"
        />
      </head>
      <body className="min-h-dvh">
        <Header />
        <main>{children}</main>
        <Footer />
        <CookieBanner text={t.cookie.text} ok={t.cookie.ok} />
      </body>
    </html>
  );
}
