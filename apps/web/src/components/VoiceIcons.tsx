"use client";

const ICONS = [
  { label: "Start / Stop", svg: "M5 4h4v16H5zM15 4h4v16h-4z" },
  { label: "Scroll up", svg: "M12 5l6 6h-4v8h-4v-8H6z" },
  { label: "Scroll down", svg: "M12 19l-6-6h4V5h4v8h4z" },
  {
    label: "Bigger text",
    svg: "M5 19h14M12 5l4 10h-2l-.8-2H10.8L10 15H8l4-10z",
  },
  { label: "High contrast", svg: "M12 3a9 9 0 1 0 0 18V3z" },
];

export function VoiceIcons() {
  return (
    <ul
      className="mt-3 grid grid-cols-5 gap-2"
      aria-label="Voice command icons"
    >
      {ICONS.map((i, idx) => (
        <li key={idx} className="rounded-lg border bg-white p-2 text-center">
          <svg
            viewBox="0 0 24 24"
            className="mx-auto h-5 w-5 opacity-80"
            aria-hidden="true"
          >
            <path fill="currentColor" d={i.svg} />
          </svg>
          <div className="mt-1 text-[11px] opacity-75">{i.label}</div>
        </li>
      ))}
    </ul>
  );
}
