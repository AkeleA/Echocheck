"use client";

import { useInteraction } from "../context/InteractionContext";

const MODS = [
  { id: "voice", label: "Voice" },
  { id: "keyboard", label: "Keyboard" },
  { id: "touch", label: "Touch" },
  { id: "text", label: "Text" }, // UI alias -> keyboard
  { id: "assistive", label: "Assistive" }, // UI alias -> touch
] as const;

function toSupported(
  id: (typeof MODS)[number]["id"]
): "voice" | "keyboard" | "touch" {
  if (id === "text") return "keyboard";
  if (id === "assistive") return "touch";
  return id as "voice" | "keyboard" | "touch";
}

export function ModalitySwitch() {
  const { modality, setModality, speak } = useInteraction();

  return (
    <div className="inline-flex rounded-xl border bg-white p-1 shadow-sm">
      {MODS.map((m) => {
        const supported = toSupported(m.id);
        const isActive = modality === supported;

        return (
          <button
            key={m.id}
            className={`px-3 py-1.5 text-sm rounded-lg ${
              isActive ? "bg-emerald-600 text-white" : "hover:bg-slate-50"
            }`}
            onClick={() => {
              setModality(supported);
              speak(`${m.label} mode`);
            }}
            aria-pressed={isActive}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
