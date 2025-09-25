"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

/** Public types */
export type VoiceLocale = "en" | "fr" | "es";
export type Modality = "voice" | "touch" | "keyboard";
export type Mode = "default" | "lowSensory" | "focus" | "highContrast";

export type SpeechState = {
  rate: number; // 0.1 – 10
  pitch: number; // 0 – 2
  volume: number; // 0 – 1
  voiceURI?: string;
};

export type InteractionState = {
  // Input modality (what the user is primarily using now)
  modality: Modality;
  setModality: (m: Modality) => void;

  // Sensory/visual mode
  mode: Mode;
  setMode: (m: Mode) => void;

  // Speech synthesis config + helpers
  speech: SpeechState;
  setSpeech: React.Dispatch<React.SetStateAction<SpeechState>>;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  setSpeechLocale: (loc: VoiceLocale) => void;

  // Transcript log
  transcript: string[];
  appendTranscript: (t: string) => void;
  clearTranscript: () => void;

  // Stepwise interaction
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (n: number) => void;
};

const InteractionContext = createContext<InteractionState | null>(null);

/** Utility: pick a best-available TTS voice for a given locale */
function pickVoiceForLocale(
  target: VoiceLocale
): SpeechSynthesisVoice | undefined {
  if (typeof window === "undefined" || !("speechSynthesis" in window))
    return undefined;

  const preferences: Record<VoiceLocale, string[]> = {
    en: ["en-GB", "en-US", "en-AU", "en"],
    fr: ["fr-FR", "fr-CA", "fr"],
    es: ["es-ES", "es-MX", "es-AR", "es"],
  };

  const wants = preferences[target];
  const voices = window.speechSynthesis.getVoices();

  // Prefer exact / startsWith matches in order
  for (const pref of wants) {
    const match = voices.find((v) =>
      v.lang?.toLowerCase().startsWith(pref.toLowerCase())
    );
    if (match) return match;
  }
  // Fallback to the first available voice
  return voices[0];
}

/** Optional: apply visual tokens for mode presets */
function applyModeTokens(mode: Mode) {
  const root = document.documentElement;

  // Defaults
  let motion = "1"; // 0..1 scale
  let complexity = "2"; // '1' (simple) or '2' (detailed)
  let sound = "1"; // 0..1 scale (your app can read it if needed)
  let contrast = "normal"; // 'normal' | 'high'

  switch (mode) {
    case "lowSensory":
      motion = "0";
      complexity = "1";
      sound = "0";
      contrast = "normal";
      break;
    case "focus":
      motion = "0.3";
      complexity = "1";
      sound = "0.3";
      contrast = "normal";
      break;
    case "highContrast":
      motion = "1";
      complexity = "2";
      sound = "1";
      contrast = "high";
      break;
    default:
      // keep defaults
      break;
  }

  root.style.setProperty("--motion-scale", motion);
  root.style.setProperty("--complexity", complexity);
  root.style.setProperty("--sound-scale", sound);
  root.dataset.contrast = contrast;
}

/** Provider */
export function InteractionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [modality, setModality] = useState<Modality>("touch");
  const [mode, setModeState] = useState<Mode>("default");

  const [speech, setSpeech] = useState<SpeechState>({
    rate: 1,
    pitch: 1,
    volume: 1,
  });

  const [transcript, setTranscript] = useState<string[]>([]);
  const appendTranscript = useCallback((t: string) => {
    if (!t) return;
    setTranscript((prev) =>
      prev.length > 400 ? [...prev.slice(-400), t] : [...prev, t]
    );
  }, []);
  const clearTranscript = useCallback(() => setTranscript([]), []);

  const [step, setStep] = useState<number>(1);
  const nextStep = useCallback(() => setStep((s) => Math.min(6, s + 1)), []);
  const prevStep = useCallback(() => setStep((s) => Math.max(1, s - 1)), []);

  const setSpeechLocale = useCallback((loc: VoiceLocale) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const assign = () => {
      const v = pickVoiceForLocale(loc);
      if (v) {
        setSpeech((prev) => ({ ...prev, voiceURI: v.voiceURI }));
      }
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length) {
      assign();
    } else {
      const once = () => {
        assign();
        window.speechSynthesis.removeEventListener("voiceschanged", once);
      };
      window.speechSynthesis.addEventListener("voiceschanged", once);
    }
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window))
        return;
      // Cancel anything in progress so updates are responsive
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = Math.max(0.1, Math.min(10, speech.rate ?? 1));
      utterance.pitch = Math.max(0, Math.min(2, speech.pitch ?? 1));
      utterance.volume = Math.max(0, Math.min(1, speech.volume ?? 1));

      const voices = window.speechSynthesis.getVoices();
      if (speech.voiceURI) {
        const chosen = voices.find((v) => v.voiceURI === speech.voiceURI);
        if (chosen) utterance.voice = chosen;
      }
      window.speechSynthesis.speak(utterance);
    },
    [speech]
  );

  const stopSpeaking = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
  }, []);

  const setMode = useCallback((m: Mode) => {
    setModeState(m);
    if (typeof document !== "undefined") {
      applyModeTokens(m);
    }
  }, []);

  const value = useMemo<InteractionState>(
    () => ({
      modality,
      setModality,
      mode,
      setMode,
      speech,
      setSpeech,
      speak,
      stopSpeaking,
      setSpeechLocale,
      transcript,
      appendTranscript,
      clearTranscript,
      step,
      nextStep,
      prevStep,
      setStep,
    }),
    [
      modality,
      mode,
      setMode,
      speech,
      speak,
      stopSpeaking,
      setSpeechLocale,
      transcript,
      appendTranscript,
      clearTranscript,
      step,
      nextStep,
      prevStep,
    ]
  );

  return (
    <InteractionContext.Provider value={value}>
      {children}
    </InteractionContext.Provider>
  );
}

/** Hook */
export function useInteraction(): InteractionState {
  const ctx = useContext(InteractionContext);
  if (!ctx) {
    throw new Error("useInteraction must be used within InteractionProvider");
  }
  return ctx;
}
