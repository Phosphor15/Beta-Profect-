import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { RevealObserver } from "@/components/Reveal";
import { getDict } from "@/lib/lang";
import { publicUrl, stripeEnabled } from "@/lib/stripe";

export const metadata: Metadata = {
  metadataBase: new URL(publicUrl()),
  title: { default: "Harald's · Ski Restaurant & Après-Ski a Bardonecchia", template: "%s · Harald's Bardonecchia" },
  description:
    "Harald's Ski Restaurant Bar a Campo Smith, Bardonecchia: colazioni, pranzi, cene alpine e après-ski con DJ set. Prenota il tuo tavolo online.",
  openGraph: { siteName: "Harald's Ski Restaurant Bar", type: "website", locale: "it_IT", alternateLocale: ["en_GB"], images: ["/images/hero.jpg"] },
};

export const viewport: Viewport = { themeColor: "#000000", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { lang, t } = await getDict();
  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        {/* Le animazioni di comparsa si attivano solo se JavaScript è disponibile */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="min-h-dvh overflow-x-clip">
        <Header />
        <main className="pt-[4.5rem]">{children}</main>
        <Footer />
        {!stripeEnabled() && (
          <div className="no-print pointer-events-none fixed bottom-3 left-3 z-30 rounded-full bg-navy/90 px-3 py-1.5 text-[0.58rem] sm:bottom-4 sm:left-4 sm:px-3.5 sm:text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-gold-2 shadow-lg backdrop-blur">
            <span className="sm:hidden">Beta</span>
            <span className="hidden sm:inline">{t.footer.betaBanner}</span>
          </div>
        )}
        <CookieBanner text={t.cookie.text} ok={t.cookie.ok} />
        <RevealObserver />
      </body>
    </html>
  );
}
