"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SupportedLocale = "en" | "fr" | "es";

export type UseSpeechOptions = {
  locale: SupportedLocale;
  onTranscript?: (finalText: string) => void;
  onInterim?: (interimText: string) => void;
};

type RecognitionCtor = new () => SpeechRecognition;
type WithWebkit = Window &
  typeof globalThis & {
    webkitSpeechRecognition?: RecognitionCtor;
  };

function getRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as WithWebkit;
  const Native = (w as unknown as { SpeechRecognition?: RecognitionCtor })
    .SpeechRecognition;
  return Native ?? w.webkitSpeechRecognition ?? null;
}

export function useSpeechRecognition({
  locale,
  onTranscript,
  onInterim,
}: UseSpeechOptions) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interim, setInterim] = useState("");
  const recRef = useRef<SpeechRecognition | null>(null);

  function mapToBCP47(locale: SupportedLocale): string {
    switch (locale) {
      case "fr":
        return "fr-FR";
      case "es":
        return "es-ES";
      default:
        return "en-GB"; // or 'en-US' if that’s your target
    }
  }

  const ensure = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (recRef.current) return recRef.current;
    const Ctor = getRecognitionCtor();
    if (!Ctor) return null;
    const rec = new Ctor();
    rec.lang = mapToBCP47(locale);
    rec.continuous = true;
    rec.interimResults = true;
    recRef.current = rec;
    return recRef.current;
  }, [locale]);

  useEffect(() => {
    setSupported(getRecognitionCtor() !== null);
  }, []);

  const start = useCallback(() => {
    const rec = ensure();
    if (!rec) {
      setError("Speech Recognition not supported in this browser.");
      return;
    }
    setError(null);
    setInterim("");
    rec.lang = locale;

    const handleResult = (event: SpeechRecognitionEvent) => {
      const finalChunks: string[] = [];
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const alt = res[0];
        if (!alt) continue;

        if (res.isFinal) {
          finalChunks.push(alt.transcript);
        } else {
          interimText += alt.transcript;
        }
      }

      if (interimText) {
        setInterim(interimText);
        onInterim?.(interimText);
      } else {
        setInterim("");
      }

      if (finalChunks.length) {
        const finalText = finalChunks.join(" ").trim();
        if (finalText) onTranscript?.(finalText);
      }
    };

    const handleError = (e: Event) => {
      // Attempt to read a string `error` field if present
      const err = (e as { error?: string }).error ?? "mic-error";
      setError(err);
      setListening(false);
    };

    const handleEnd = () => {
      setListening(false);
    };

    rec.addEventListener("result", handleResult as unknown as EventListener);
    rec.addEventListener("error", handleError as EventListener);
    rec.addEventListener("end", handleEnd as EventListener);

    try {
      rec.start();
      setListening(true);
    } catch {
      // if already started, some impls throw; UI state is still listening
      setListening(true);
    }

    return () => {
      try {
        rec.removeEventListener(
          "result",
          handleResult as unknown as EventListener
        );
        rec.removeEventListener("error", handleError as EventListener);
        rec.removeEventListener("end", handleEnd as EventListener);
        rec.stop();
      } catch {
        // ignore
      }
    };
  }, [ensure, locale, onInterim, onTranscript]);

  const stop = useCallback(() => {
    setInterim("");
    try {
      recRef.current?.stop();
    } catch {
      // ignore
    }
    setListening(false);
  }, []);

  useEffect(() => {
    return () => {
      try {
        recRef.current?.stop();
      } catch {
        // ignore
      }
      recRef.current = null;
    };
  }, []);

  return { supported, listening, error, start, stop, interim };
}
