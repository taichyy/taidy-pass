import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

import { requireEnv } from "@/lib/env";
import { routing } from "@/i18n/routing";

const handleI18nRouting = createMiddleware(routing);
const jwtSecret = new TextEncoder().encode(requireEnv("JWT_SECRET"));

const proxy = async (request: NextRequest) => {
    const { pathname } = request.nextUrl;
    const pathSegments = pathname.split("/");
    const locale = routing.locales.includes(pathSegments[1] as "zh-TW" | "en")
        ? pathSegments[1] as "zh-TW" | "en"
        : routing.defaultLocale;
    const localizedPathname = pathSegments[1] === locale
        ? `/${pathSegments.slice(2).join("/")}`
        : pathname;
    const token = request.cookies.get("token")?.value;

    if (localizedPathname === "/vault") {
        if (!token || !(await hasValidToken(token))) {
            return redirectTo(request, locale, "/login");
        }
    }

    if (localizedPathname === "/login" && token && await hasValidToken(token)) {
        return redirectTo(request, locale, "/vault");
    }

    return handleI18nRouting(request);
};

const hasValidToken = async (token: string) => {
    try {
        await jwtVerify(token, jwtSecret);
        return true;
    } catch {
        return false;
    }
};

const redirectTo = (request: NextRequest, locale: "zh-TW" | "en", pathname: string) => {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
};

export const config = {
    matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};

export default proxy;
