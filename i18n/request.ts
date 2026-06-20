import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale;
    const locale = routing.locales.includes(requested as "zh-TW" | "en")
        ? requested as "zh-TW" | "en"
        : routing.defaultLocale;

    return {
        locale,
        messages: {},
    };
});
