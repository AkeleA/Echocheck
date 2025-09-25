"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useSpeechRecognition } from "../../components/voice/useSpeechRecognition";
import { ModalitySwitch } from "../../components/ModalitySwitch";
import { ModeSwitcher } from "../../components/ModeSwitcher";
import { StepFlow } from "../../components/StepFlow";
import { StepControls } from "../../components/StepControls";
import { TranscriptPanel } from "../../components/TranscriptPanel";
import { VoiceIcons } from "../../components/VoiceIcons";
import Link from "next/link";
import AccessibilityToggle from "../../components/AccessibilityToggle";
import { useInteraction } from "../../context/InteractionContext";
import { MicPanel } from "../../components/MicPanel";
import {
  executeCommands,
  normalize,
  type Command,
} from "../../lib/CommandRouter";

export default function HomePage() {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = localeFromPath(pathname);

  const {
    appendTranscript,
    speak,
    setModality,
    setSpeechLocale, // make TTS voice match the active locale
  } = useInteraction();

  const { supported, listening, error, start, stop, interim } =
    useSpeechRecognition({
      locale,
      onTranscript: (final) => {
        appendTranscript(final);
        handleCommand(final);
      },
      onInterim: () => {
        /* we show `interim` directly in UI */
      },
    });

  // Keep UI complexity in sync with CSS token (SSR-safe)
  const [complexity, setComplexity] = useState<"1" | "2">("2");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue("--complexity")
      .trim();
    setComplexity(v === "1" ? "1" : "2");
  }, []);

  // Ensure TTS voice matches locale (en → en-GB, fr → fr-FR, es → es-ES as configured in context)
  useEffect(() => {
    setSpeechLocale(locale);
  }, [locale, setSpeechLocale]);

  const toggleVoice = () => {
    setModality("voice");
    if (listening) {
      stop();
      speak(t("voice.stopped"));
    } else {
      start();
      speak(t("voice.started"));
    }
  };

  // Build the command list once
  const commands = useMemo<Command[]>(
    () => [
      // Language switching
      { test: /\benglish\b/i, run: () => window.location.assign("/en") },
      {
        test: /\b(french|francais|français)\b/i,
        run: () => window.location.assign("/fr"),
      },
      {
        test: /\b(spanish|espanol|español)\b/i,
        run: () => window.location.assign("/es"),
      },

      // High contrast ON/OFF (token-based — Mode presets may also set this)
      {
        test: /\b(high contrast on|contraste eleve active|contraste élevé activé|alto contraste activar)\b/i,
        run: () => {
          document.documentElement.dataset.contrast = "high";
          speak(t("home.contrast") + " ON");
        },
      },
      {
        test: /\b(high contrast off|contraste eleve desactive|contraste élevé désactivé|alto contraste desactivar)\b/i,
        run: () => {
          document.documentElement.dataset.contrast = "normal";
          speak(t("home.contrast") + " OFF");
        },
      },

      // Text size
      {
        test: /\b(bigger text|texte plus grand|texto mas grande|texto más grande)\b/i,
        run: () => {
          document.documentElement.style.setProperty("--font-scale", "1.25");
          speak(t("home.text.large"));
        },
      },
      {
        test: /\b(smaller text|texte plus petit|texto mas pequeno|texto más pequeño)\b/i,
        run: () => {
          document.documentElement.style.setProperty("--font-scale", "1.0");
          speak(t("home.text.normal"));
        },
      },

      // Scroll
      {
        test: /\b(scroll down|descendre|bajar)\b/i,
        run: () => window.scrollBy({ top: 600, behavior: "smooth" }),
      },
      {
        test: /\b(scroll up|monter|subir)\b/i,
        run: () => window.scrollBy({ top: -600, behavior: "smooth" }),
      },

      // Step nav (clicks the StepControls buttons by aria-label)
      {
        test: /\b(next|suivant|siguiente)\b/i,
        run: () =>
          (
            document.querySelector(
              'button[aria-label="Next"]'
            ) as HTMLButtonElement | null
          )?.click(),
      },
      {
        test: /\b(previous|precedent|précédent|anterior)\b/i,
        run: () =>
          (
            document.querySelector(
              'button[aria-label="Previous"]'
            ) as HTMLButtonElement | null
          )?.click(),
      },
    ],
    [speak, t]
  );

  function handleCommand(text: string) {
    executeCommands(normalize(text), commands);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* Top controls bar */}
      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <ModalitySwitch />
            <ModeSwitcher />
            {/* Text size only — no duplicate contrast toggle */}
            <AccessibilityToggle />
          </div>

          {/* Language quick-links */}
          <nav className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">{t("home.lang")}:</span>
            <Link className="underline" href="/en">
              EN
            </Link>
            <span aria-hidden>·</span>
            <Link className="underline" href="/fr">
              FR
            </Link>
            <span aria-hidden>·</span>
            <Link className="underline" href="/es">
              ES
            </Link>
          </nav>
        </div>
      </section>

      {/* Intro + Mic */}
      <section className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Left: intro + mic + transcript */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            {t("home.title")}
          </h1>
          <p className="mt-3 text-slate-600">{t("home.intro")}</p>

          <div className="mt-5">
            <MicPanel
              listening={listening}
              supported={supported}
              error={error}
              onToggle={toggleVoice}
              interim={interim}
            />
          </div>

          <div className="mt-4">
            <VoiceIcons />
          </div>

          <TranscriptPanel />
        </div>

        {/* Right: stepwise content */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t("home.voice.title")}</h2>
            <StepControls />
          </div>

          <StepFlow>
            {(step) => (
              <div data-complexity={complexity}>
                {step === 1 && (
                  <p className="text-slate-700">
                    Welcome. This flow advances only when you choose Next.
                  </p>
                )}
                {step === 2 && (
                  <div>
                    <h3 className="mb-2 font-semibold">Learn</h3>
                    <p className="text-slate-700">
                      Short explanation for cognitive ease.
                    </p>
                    <p className="hidden-when-simple text-slate-500">
                      (More detail when complexity is high.)
                    </p>
                  </div>
                )}
                {step === 3 && (
                  <p>Prepare: We’ll ask a few concise questions.</p>
                )}
                {step === 4 && (
                  <p>Summary: You’ll review and confirm calmly.</p>
                )}
                {step === 5 && (
                  <p>Booking: Choose a time that suits your routine.</p>
                )}
                {step === 6 && <p>Done. You’ll receive a confirmation.</p>}
              </div>
            )}
          </StepFlow>
        </div>
      </section>

      <footer className="mt-10 border-t pt-6 text-sm text-slate-500">
        {t("home.footer")}
      </footer>
    </main>
  );
}

/** Helpers */
function localeFromPath(p: string | null): "en" | "fr" | "es" {
  if (!p) return "en";
  const m = /^\/(en|fr|es)(\/|$)/.exec(p);
  return (m?.[1] as "en" | "fr" | "es") ?? "en";
}
