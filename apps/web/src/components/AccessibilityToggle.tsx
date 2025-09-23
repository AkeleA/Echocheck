"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useTranslations } from "next-intl";

// Use as a runtime value (fixes the "used as type only" warning)
export const FONT_OPTIONS = [
  { labelKey: "home.text.normal", value: "base" as const },
  { labelKey: "home.text.large", value: "lg" as const },
] as const;

export type FontScale = (typeof FONT_OPTIONS)[number]["value"];

export default function AccessibilityToggle() {
  const t = useTranslations();

  const [hc, setHc] = useState(false);
  const [font, setFont] = useState<FontScale>("base");

  useEffect(() => {
    // Update contrast token on <html>
    document.documentElement.dataset.contrast = hc ? "high" : "normal";
  }, [hc]);

  useEffect(() => {
    // Update root font scale for the entire document
    document.documentElement.style.setProperty(
      "--font-scale",
      font === "lg" ? "1.25" : "1.0"
    );
  }, [font]);

  function onFontChange(e: ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    if (value === "base" || value === "lg") setFont(value);
  }

  return (
    <div className="flex items-center gap-4">
      <label className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          className="h-4 w-4"
          checked={hc}
          onChange={(e) => setHc(e.target.checked)}
          aria-label={t("home.contrast")}
        />
        <span>{t("home.contrast")}</span>
      </label>

      <label className="inline-flex items-center gap-2">
        <span>{t("home.textSize")}</span>
        <select
          value={font}
          onChange={onFontChange}
          className="border rounded px-2 py-1"
          aria-label={t("home.textSize")}
        >
          {FONT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {t(opt.labelKey)}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
