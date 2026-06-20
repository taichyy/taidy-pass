import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Toaster } from "react-hot-toast";

import "../globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import ProviderAOS from "@/components/providers/provider-aos";
import { ProviderI18n } from "@/components/providers/provider-i18n";
import { ProviderKey } from "@/components/providers/provider-key";
import { ProviderTheme } from "@/components/providers/provider-theme";
import { routing } from "@/i18n/routing";

export const viewport: Viewport = {
    themeColor: "black",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    minimumScale: 1,
};

export const metadata: Metadata = {
    title: "TaidyPass | 最安全的密碼管理器",
    description: "TaidyPass is a password manager that helps you securely store and manage your credentials. Developed by TaiChe Digital Co. Ltd.",
    other: {
        monetag: process.env.NEXT_PUBLIC_MONETAG ?? "",
    },
};

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) notFound();

    setRequestLocale(locale);

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className="bg-background text-foreground">
                <NextIntlClientProvider>
                    <ProviderI18n>
                        <ProviderTheme attribute="class" defaultTheme="system" enableSystem>
                            <ProviderAOS>
                                <Toaster />
                                <TooltipProvider>
                                    <ProviderKey>{children}</ProviderKey>
                                </TooltipProvider>
                            </ProviderAOS>
                        </ProviderTheme>
                    </ProviderI18n>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
