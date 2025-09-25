"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useTranslations } from "next-intl";

export const FONT_OPTIONS = [
  { labelKey: "home.text.normal", value: "base" as const },
  { labelKey: "home.text.large", value: "lg" as const },
] as const;

export type FontScale = (typeof FONT_OPTIONS)[number]["value"];

export default function AccessibilityToggle() {
  const t = useTranslations();
  const [font, setFont] = useState<FontScale>("base");

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--font-scale",
      font === "lg" ? "1.25" : "1.0"
    );
  }, [font]);

  function onFontChange(e: ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value;
    if (v === "base" || v === "lg") setFont(v);
  }

  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span>{t("home.textSize")}</span>
      <select
        value={font}
        onChange={onFontChange}
        className="rounded border px-2 py-1"
        aria-label={t("home.textSize")}
      >
        {FONT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {t(o.labelKey)}
          </option>
        ))}
      </select>
    </label>
  );
}
