import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
    locales: ["zh-TW", "en"],
    defaultLocale: "zh-TW",
    localePrefix: "always",
});

export type AppLocale = (typeof routing.locales)[number];
