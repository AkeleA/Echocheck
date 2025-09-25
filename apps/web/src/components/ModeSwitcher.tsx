"use client";

import { useInteraction } from "../context/InteractionContext";

const PRESETS = [
  { id: "default", label: "Default" },
  { id: "lowSensory", label: "Low Sensory" },
  { id: "focus", label: "Focus Mode" },
  { id: "highContrast", label: "High Contrast" },
] as const;

export function ModeSwitcher() {
  const { mode, setMode, speak } = useInteraction();

  return (
    <div className="inline-flex rounded-xl border bg-white p-1 shadow-sm">
      {PRESETS.map((p) => (
        <button
          key={p.id}
          className={`px-3 py-1.5 text-sm rounded-lg ${
            mode === p.id ? "bg-sky-600 text-white" : "hover:bg-slate-50"
          }`}
          onClick={() => {
            setMode(p.id);
            speak(`${p.label} enabled`);
          }}
          aria-pressed={mode === p.id}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
