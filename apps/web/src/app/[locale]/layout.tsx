import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import "../globals.css";

import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import es from "../../messages/es.json";
import { InteractionProvider } from "../../context/InteractionContext";

const dict = { en, fr, es } as const;
type Locale = keyof typeof dict;

export const dynamic = "force-dynamic";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // 👇 await params
  const { locale } = await params;

  const l: Locale = (["en", "fr", "es"] as const).includes(locale as Locale)
    ? (locale as Locale)
    : "en";

  setRequestLocale(l);

  return (
    <html lang={l}>
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        <header className="w-full border-b bg-white/80 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-grid place-items-center h-8 w-8 rounded-xl bg-emerald-600 text-white font-bold">
                E
              </span>
              <strong className="tracking-tight">EchoCheck</strong>
            </div>
            <nav className="text-sm">
              <Link className="px-2 opacity-60 hover:opacity-100" href="/en">
                EN
              </Link>
              <Link className="px-2 opacity-60 hover:opacity-100" href="/fr">
                FR
              </Link>
              <Link className="px-2 opacity-60 hover:opacity-100" href="/es">
                ES
              </Link>
            </nav>
          </div>
        </header>

        <NextIntlClientProvider locale={l} messages={dict[l]}>
          <InteractionProvider>{children}</InteractionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
