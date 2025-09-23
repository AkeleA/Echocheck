"use client";

import { cn } from "../utils/cn";

export function MicButton({
  active,
  onToggle,
  labelOn,
  labelOff,
}: {
  active: boolean;
  onToggle: () => void;
  labelOn: string;
  labelOff: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className={cn(
        "group inline-flex items-center gap-2 rounded-2xl border px-4 py-2 shadow-sm transition",
        active
          ? "bg-emerald-600 text-white border-emerald-600"
          : "bg-white hover:bg-slate-50"
      )}
    >
      {/* inline SVG to avoid icon deps */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className={cn(
          "h-5 w-5",
          active ? "opacity-100" : "opacity-70 group-hover:opacity-100"
        )}
        focusable="false"
      >
        <path
          fill="currentColor"
          d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.93V21h2v-3.07A7 7 0 0 0 19 11h-2Z"
        />
      </svg>
      <span className="font-medium">{active ? labelOff : labelOn}</span>
    </button>
  );
}
