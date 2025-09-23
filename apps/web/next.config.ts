import type { NextConfig } from "next";
import withPWA from "next-pwa";
import createNextIntlPlugin from "next-intl/plugin";

// Remove the custom path - next-intl will automatically look for i18n/request.ts
const withNextIntl = createNextIntlPlugin();
const isProd = process.env.NODE_ENV === "production";

const base: NextConfig = { reactStrictMode: true };

export default withNextIntl(
  withPWA({ dest: "public", disable: !isProd })(base)
);
