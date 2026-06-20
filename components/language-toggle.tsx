"use client";

import { Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/providers/provider-i18n";

export function LanguageToggle() {
    const { locale, toggleLocale } = useI18n();
    const nextLanguage = locale === "zh-TW" ? "English" : "Traditional Chinese";

    return (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleLocale}
            aria-label={`Switch language to ${nextLanguage}`}
            title={`Switch language to ${nextLanguage}`}
            className="gap-1.5 px-2 h-9"
        >
            <Languages className="h-4 w-4" aria-hidden="true" />
            <span className="text-sm font-medium">
                {locale === "zh-TW" ? "EN" : "ZH"}
            </span>
        </Button>
    );
}
