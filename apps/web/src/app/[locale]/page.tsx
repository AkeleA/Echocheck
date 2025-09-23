"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import { useSpeechRecognition } from "../../components/voice/useSpeechRecognition";
import { MicButton } from "../../components/voice/MicButton";
import { A11yControls } from "../../components/A11yControls";
import { VoiceTips } from "../../components/voice/VoiceTips";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";

type FontScale = "base" | "lg";

function useAccessibility() {
  const [highContrast, setHighContrast] = useState(false);
  const [fontScale, setFontScale] = useState<FontScale>("base");

  useEffect(() => {
    document.documentElement.dataset.contrast = highContrast
      ? "high"
      : "normal";
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--font-scale",
      fontScale === "lg" ? "1.25" : "1.0"
    );
  }, [fontScale]);

  return { highContrast, setHighContrast, fontScale, setFontScale };
}

export default function HomePage() {
  const t = useTranslations();
  const pathname = usePathname();
  const { highContrast, setHighContrast, fontScale, setFontScale } =
    useAccessibility();

  // map path -> locale for SR
  function localeFromPath(p: string | null): "en" | "fr" | "es" {
    if (!p) return "en";
    const m = /^\/(en|fr|es)(\/|$)/.exec(p);
    return (m?.[1] as "en" | "fr" | "es") ?? "en";
  }

  const locale = localeFromPath(pathname);

  const { supported, listening, error, start, stop } = useSpeechRecognition({
    locale,
    onTranscript: (text) => handleCommand(text),
  });

  function handleCommand(text: string) {
    // language
    if (/(english)/.test(text)) window.location.assign("/en");
    if (/(french|français)/.test(text)) window.location.assign("/fr");
    if (/(spanish|español)/.test(text)) window.location.assign("/es");

    // contrast
    if (
      /(high contrast on|contraste élevé activé|alto contraste activar)/.test(
        text
      )
    )
      setHighContrast(true);
    if (
      /(high contrast off|contraste élevé désactivé|alto contraste desactivar)/.test(
        text
      )
    )
      setHighContrast(false);

    // font size
    if (/(bigger text|texte plus grand|texto más grande)/.test(text))
      setFontScale("lg");
    if (/(smaller text|texte plus petit|texto más pequeño)/.test(text))
      setFontScale("base");

    // scroll
    if (/(scroll down|descendre|bajar)/.test(text))
      window.scrollBy({ top: 600, behavior: "smooth" });
    if (/(scroll up|monter|subir)/.test(text))
      window.scrollBy({ top: -600, behavior: "smooth" });

    // “start” feedback
    if (/(start|commencer|iniciar)/.test(text)) {
      setHighContrast((v) => !v);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-b from-white to-slate-50 p-8 md:p-12 shadow-sm">
        {/* soft background rings */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-emerald-100 blur-3xl opacity-70" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-72 w-72 rounded-full bg-sky-100 blur-3xl opacity-70" />

        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              {t("home.title")}
            </h1>
            <p className="mt-4 text-lg text-slate-600">{t("home.intro")}</p>

            <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
              <A11yControls
                highContrast={highContrast}
                setHighContrast={setHighContrast}
                fontScale={fontScale}
                setFontScale={setFontScale}
              />
              <div className="hidden md:block h-6 w-px bg-slate-200" />
              <LanguageSwitcher />
            </div>
          </div>

          {/* Voice block */}
          <div className="w-full md:w-auto">
            <div className="rounded-2xl border bg-white/70 backdrop-blur p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <MicButton
                  active={listening}
                  onToggle={() => (listening ? stop() : start())}
                  labelOn={t("home.mic.start")}
                  labelOff={t("home.mic.stop")}
                />
                <span className="text-sm" aria-live="polite">
                  {listening
                    ? t("home.status.listening")
                    : t("home.status.stopped")}
                </span>
              </div>

              {!supported && (
                <p className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
                  Browser doesn’t support speech recognition. Try Chrome or
                  Edge.
                </p>
              )}
              {error && (
                <p className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">
                  {error}
                </p>
              )}

              <div className="mt-4">
                <VoiceTips />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT SECTIONS */}
      <section className="mt-12 grid gap-6 md:grid-cols-3">
        <Card title={t("home.cta")}>
          <p className="text-sm text-slate-600">
            {/* Small teaser; keep single page */}
            {t("home.voice.help")}
          </p>
          <button
            className="mt-4 inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            onClick={() =>
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
              })
            }
          >
            {t("home.cta")}
          </button>
        </Card>
        <Card title="WCAG AAA intent">
          <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
            <li>Keyboard-first, visible focus</li>
            <li>High contrast toggle</li>
            <li>Resizable text</li>
            <li>Screen reader-friendly labels</li>
          </ul>
        </Card>
        <Card title="Privacy">
          <p className="text-sm text-slate-600">
            We do not send your microphone audio to servers. Commands are
            handled locally via the Web Speech API.
          </p>
        </Card>
      </section>

      <footer className="mt-16 border-t pt-6 text-sm text-slate-500">
        {t("home.footer")}
      </footer>

      {/* a11y tokens */}
      <style jsx global>{`
        :root {
          --font-scale: 1;
        }
        html {
          font-size: calc(16px * var(--font-scale));
        }
        :root[data-contrast="high"] body {
          background: #0b0b0b;
          color: #fff;
        }
        :root[data-contrast="high"] .bg-white {
          background: #000 !important;
        }
        :root[data-contrast="high"] .text-slate-600 {
          color: #e5e7eb !important;
        }
        :focus {
          outline: 3px solid #2563eb;
          outline-offset: 2px;
        }
      `}</style>
    </main>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );
}
