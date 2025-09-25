"use client";
import { useInteraction } from "../context/InteractionContext";

export function StepControls() {
  const { step, nextStep, prevStep, speak } = useInteraction();
  return (
    <div className="flex items-center gap-3">
      <button
        className="rounded-lg border px-3 py-1.5 hover:bg-slate-50"
        onClick={() => {
          prevStep();
          speak("Previous");
        }}
      >
        ←
      </button>
      <span className="text-sm">Step {step} / 6</span>
      <button
        className="rounded-lg border px-3 py-1.5 hover:bg-slate-50"
        onClick={() => {
          nextStep();
          speak("Next");
        }}
      >
        →
      </button>
    </div>
  );
}
