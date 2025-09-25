"use client";

import { useRef } from "react";
import { useInteraction } from "./context/InteractionContext";

export function VoiceControls() {
  const { speech, setSpeech, speak, stopSpeaking } = useInteraction();

  // Remember the last non-zero volume so toggling back restores it
  const prevVolRef = useRef<number>(speech.volume || 1);

  const enabled = (speech.volume ?? 1) > 0;

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm flex items-center gap-2">
        Rate
        <input
          type="range"
          min={0.5}
          max={2}
          step={0.1}
          value={speech.rate}
          onChange={(e) =>
            setSpeech((prev) => ({ ...prev, rate: Number(e.target.value) }))
          }
        />
      </label>

      <label className="text-sm flex items-center gap-2">
        Pitch
        <input
          type="range"
          min={0.5}
          max={2}
          step={0.1}
          value={speech.pitch}
          onChange={(e) =>
            setSpeech((prev) => ({ ...prev, pitch: Number(e.target.value) }))
          }
        />
      </label>

      <label className="text-sm flex items-center gap-2">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => {
            const on = e.target.checked;
            setSpeech((prev) => {
              if (on) {
                const restore = prevVolRef.current > 0 ? prevVolRef.current : 1;
                return { ...prev, volume: restore };
              } else {
                // store current volume before muting
                prevVolRef.current = prev.volume ?? 1;
                return { ...prev, volume: 0 };
              }
            });
          }}
        />
        Voice feedback
      </label>

      <button
        className="rounded border px-2 py-1 text-sm"
        onClick={() => speak("Voice settings updated")}
      >
        Test
      </button>
      <button
        className="rounded border px-2 py-1 text-sm"
        onClick={stopSpeaking}
      >
        Stop
      </button>
    </div>
  );
}
