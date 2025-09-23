"use client";
import { useTranslations } from "next-intl";

export function VoiceTips() {
  const t = useTranslations();
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold mb-1">{t("home.voice.title")}</h3>
      <p className="text-sm text-slate-600">{t("home.voice.help")}</p>
    </div>
  );
}
