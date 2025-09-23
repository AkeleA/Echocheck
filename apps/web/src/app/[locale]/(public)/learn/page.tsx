import { useTranslations } from "next-intl";

export default function LearnPage() {
  const t = useTranslations();
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">{t("learn.title")}</h1>
      <p className="mt-4">Content goes here…</p>
    </main>
  );
}
