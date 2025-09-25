"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function MicPanel({
  listening,
  supported,
  error,
  onToggle,
  interim,
}: {
  listening: boolean;
  supported: boolean;
  error: string | null;
  onToggle: () => void;
  interim: string;
}) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={listening}
          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium shadow-sm transition
            ${
              listening
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white hover:bg-slate-50"
            }`}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
            <path
              fill="currentColor"
              d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.93V21h2v-3.07A7 7 0 0 0 19 11h-2Z"
            />
          </svg>
          {listening ? t("home.mic.stop") : t("home.mic.start")}
        </button>

        <span className="text-sm" aria-live="polite">
          {listening ? t("home.status.listening") : t("home.status.stopped")}
        </span>
      </div>

      {/* Live words */}
      <div className="mt-3">
        <div className="inline-flex min-h-10 max-w-full items-center rounded-full border bg-white/80 px-3 py-2 text-sm shadow-sm">
          {interim ? (
            <span className="truncate">{interim}</span>
          ) : (
            <span className="opacity-60">
              {listening
                ? t("voice.placeholder.listening")
                : t("voice.placeholder.idle")}
            </span>
          )}
        </div>
      </div>

      {!supported && (
        <p className="mt-3 rounded border border-amber-200 bg-amber-50 p-2 text-sm text-amber-800">
          Browser doesn’t support speech recognition.
        </p>
      )}
      {error && (
        <p className="mt-3 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Small disclosure to avoid button confusion */}
      <div className="mt-3">
        <button
          type="button"
          className="text-xs underline text-slate-600"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {open ? t("home.voice.settings.hide") : t("home.voice.settings.show")}
        </button>
        {open && (
          <div className="mt-2 rounded-xl border bg-slate-50 p-3 text-xs text-slate-700">
            <p className="mb-1">{t("home.voice.settings.note")}</p>
            {/* Keep this area for future sliders; removed "Test/Stop" to avoid play-like confusion */}
            <p className="opacity-70">{t("home.voice.settings.simple")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
