import { getRequestConfig } from "next-intl/server";

// Allow nested message objects (strings or other nested objects)
type Messages = Record<string, unknown>;

const supported = ["en", "fr", "es"] as const;
type Supported = (typeof supported)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  const rawLocale = await requestLocale;
  const locale: Supported = (supported as readonly string[]).includes(
    rawLocale || ""
  )
    ? (rawLocale as Supported)
    : "en";

  const loaders: Record<Supported, () => Promise<Messages>> = {
    en: () => import("../messages/en.json").then((m) => m.default as Messages),
    fr: () => import("../messages/fr.json").then((m) => m.default as Messages),
    es: () => import("../messages/es.json").then((m) => m.default as Messages),
  };

  const messages: Messages = await loaders[locale]();

  return {
    locale,
    messages,
  };
});
