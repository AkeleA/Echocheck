"use client";
import { useEffect, useState, ChangeEvent } from "react";

const FONT_OPTIONS = ["base", "lg"] as const;
type FontScale = (typeof FONT_OPTIONS)[number];

export default function AccessibilityToggle() {
  const [hc, setHc] = useState(false);
  const [font, setFont] = useState<FontScale>("base");

  useEffect(() => {
    document.documentElement.dataset.contrast = hc ? "high" : "normal";
    document.documentElement.style.setProperty(
      "--font-scale",
      font === "lg" ? "1.25" : "1.0"
    );
  }, [hc, font]);

  function onFontChange(e: ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    if (value === "base" || value === "lg") setFont(value);
  }

  return (
    <div className="flex gap-3 items-center">
      <label>
        <input
          type="checkbox"
          checked={hc}
          onChange={(e) => setHc(e.target.checked)}
        />{" "}
        High contrast
      </label>
      <label>
        Text size:
        <select value={font} onChange={onFontChange}>
          <option value="base">Normal</option>
          <option value="lg">Large</option>
        </select>
      </label>
    </div>
  );
}
