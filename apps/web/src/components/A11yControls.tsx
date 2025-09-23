"use client";
import { useTranslations } from "next-intl";

export function A11yControls({
  highContrast,
  setHighContrast,
  fontScale,
  setFontScale,
}: {
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
  fontScale: "base" | "lg";
  setFontScale: (v: "base" | "lg") => void;
}) {
  const t = useTranslations();
  return (
    <div className="flex flex-wrap items-center gap-4">
      <label className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          className="h-4 w-4"
          checked={highContrast}
          onChange={(e) => setHighContrast(e.target.checked)}
        />
        {t("home.contrast")}
      </label>

      <label className="inline-flex items-center gap-2">
        {t("home.textSize")}
        <select
          value={fontScale}
          onChange={(e) => setFontScale(e.target.value as "base" | "lg")}
          className="border rounded px-2 py-1"
          aria-label={t("home.textSize")}
        >
          <option value="base">{t("home.text.normal")}</option>
          <option value="lg">{t("home.text.large")}</option>
        </select>
      </label>
    </div>
  );
}
