"use client";
import { useInteraction } from "../context/InteractionContext";

export function TranscriptPanel() {
  const { transcript, clearTranscript } = useInteraction();
  if (!transcript) return null;
  return (
    <div className="mt-4 rounded-xl border bg-white p-3 text-sm shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <strong>Transcript</strong>
        <button className="text-xs underline" onClick={clearTranscript}>
          Clear
        </button>
      </div>
      <pre className="whitespace-pre-wrap">{transcript}</pre>
    </div>
  );
}
