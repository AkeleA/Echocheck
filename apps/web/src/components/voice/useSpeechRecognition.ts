"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type UseSpeechOptions = {
  locale: "en" | "fr" | "es";
  onTranscript?: (finalText: string) => void;
};

export function useSpeechRecognition({
  locale,
  onTranscript,
}: UseSpeechOptions) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<SpeechRecognition | null>(null);

  // lazy create to avoid SSR
  const ensure = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (recRef.current) return recRef.current;
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) return null;
    const rec = new Ctor();
    rec.lang = locale;
    rec.continuous = true;
    rec.interimResults = false;
    recRef.current = rec;
    return rec;
  }, [locale]);

  useEffect(() => {
    setSupported(
      Boolean(
        typeof window !== "undefined" &&
          (window.SpeechRecognition || window.webkitSpeechRecognition)
      )
    );
  }, []);

  const start = useCallback(() => {
    const rec = ensure();
    if (!rec) {
      setError("Speech Recognition not supported in this browser.");
      return;
    }
    setError(null);
    rec.lang = locale;
    rec.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from({ length: event.results.length })
        .map((_, i) => event.results.item(i)!)
        .map((r) => r[0].transcript)
        .join(" ")
        .toLowerCase()
        .trim();
      onTranscript?.(transcript);
    };
    rec.onerror = (e) => {
      setError((e as unknown as { error?: string }).error ?? "mic-error");
      setListening(false);
    };
    rec.start();
    setListening(true);
  }, [ensure, locale, onTranscript]);

  const stop = useCallback(() => {
    recRef.current?.stop();
    setListening(false);
  }, []);

  useEffect(() => {
    // auto-stop when unmounting
    return () => {
      try {
        recRef.current?.stop();
      } catch {}
      recRef.current = null;
    };
  }, []);

  return { supported, listening, error, start, stop };
}
