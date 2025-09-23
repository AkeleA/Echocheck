"use client";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export function LanguageSwitcher() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();

  function changeLocale(to: "en" | "fr" | "es") {
    const rest = pathname?.replace(/^\/(en|fr|es)/, "") ?? "";
    router.push(`/${to}${rest || ""}`);
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-600">{t("home.lang")}:</span>
      <button
        className="underline"
        onClick={() => changeLocale("en")}
        aria-label="English"
      >
        EN
      </button>
      <button
        className="underline"
        onClick={() => changeLocale("fr")}
        aria-label="Français"
      >
        FR
      </button>
      <button
        className="underline"
        onClick={() => changeLocale("es")}
        aria-label="Español"
      >
        ES
      </button>
    </div>
  );
}
