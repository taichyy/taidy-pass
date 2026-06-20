"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

import {
    Locale,
    translateText,
} from "@/lib/i18n";

type I18nContextValue = {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    toggleLocale: () => void;
    t: (value: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);
const translatedAttributes = ["aria-label", "placeholder", "title", "alt"] as const;

export function ProviderI18n({ children }: { children: React.ReactNode }) {
    const routedLocale = useLocale() as Locale;
    const pathname = usePathname();
    const [locale, setLocaleState] = useState<Locale>(routedLocale);
    const localeRef = useRef(locale);
    const originalText = useRef(new WeakMap<Text, string>());
    const originalAttributes = useRef(new WeakMap<Element, Map<string, string>>());
    const internalUpdates = useRef(new WeakSet<Node>());

    const translateNode = useCallback((node: Node, activeLocale: Locale) => {
        const translateAttributes = (element: Element) => {
            const saved = originalAttributes.current.get(element) ?? new Map<string, string>();
            for (const attribute of translatedAttributes) {
                const current = element.getAttribute(attribute);
                if (!current) continue;
                if (/[\u3400-\u9fff]/u.test(current)) saved.set(attribute, current);
                const source = saved.get(attribute) ?? current;
                const next = translateText(source, activeLocale);
                if (current !== next) element.setAttribute(attribute, next);
            }
            if (saved.size) originalAttributes.current.set(element, saved);
        };

        if (node.nodeType === Node.TEXT_NODE) {
            const textNode = node as Text;
            const parentTag = textNode.parentElement?.tagName;
            if (parentTag === "SCRIPT" || parentTag === "STYLE" || parentTag === "NOSCRIPT") {
                return;
            }
            if (internalUpdates.current.has(textNode)) {
                internalUpdates.current.delete(textNode);
                return;
            }

            const current = textNode.nodeValue || "";
            if (/[\u3400-\u9fff]/u.test(current)) {
                originalText.current.set(textNode, current);
            }
            const source = originalText.current.get(textNode) ?? current;
            const next = translateText(source, activeLocale);
            if (current !== next) {
                internalUpdates.current.add(textNode);
                textNode.nodeValue = next;
            }
            return;
        }

        if (!(node instanceof Element)) return;

        translateAttributes(node);
        node.querySelectorAll("*").forEach(translateAttributes);

        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
        let child = walker.nextNode();
        while (child) {
            translateNode(child, activeLocale);
            child = walker.nextNode();
        }
    }, []);

    const applyLocale = useCallback((nextLocale: Locale) => {
        localeRef.current = nextLocale;
        document.documentElement.lang = nextLocale;
        document.documentElement.dataset.locale = nextLocale;
        translateNode(document.documentElement, nextLocale);
    }, [translateNode]);

    useEffect(() => {
        setLocaleState(routedLocale);
        applyLocale(routedLocale);

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === "characterData") {
                    translateNode(mutation.target, localeRef.current);
                    continue;
                }
                if (mutation.type === "attributes") {
                    translateNode(mutation.target, localeRef.current);
                    continue;
                }
                mutation.addedNodes.forEach((node) => translateNode(node, localeRef.current));
            }
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: [...translatedAttributes],
            childList: true,
            characterData: true,
            subtree: true,
        });

        const nativeAlert = window.alert.bind(window);
        window.alert = (message?: unknown) => {
            nativeAlert(translateText(String(message ?? ""), localeRef.current));
        };

        return () => {
            observer.disconnect();
            window.alert = nativeAlert;
        };
    }, [applyLocale, routedLocale, translateNode]);

    const setLocale = useCallback((nextLocale: Locale) => {
        const segments = pathname.split("/");
        if (segments[1] === "en" || segments[1] === "zh-TW") {
            segments[1] = nextLocale;
        } else {
            segments.splice(1, 0, nextLocale);
        }

        window.location.assign(`${segments.join("/")}${window.location.search}${window.location.hash}`);
    }, [pathname]);

    const value = useMemo<I18nContextValue>(() => ({
        locale,
        setLocale,
        toggleLocale: () => setLocale(locale === "zh-TW" ? "en" : "zh-TW"),
        t: (text) => translateText(text, locale),
    }), [locale, setLocale]);

    return (
        <I18nContext.Provider value={value}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) throw new Error("useI18n must be used within ProviderI18n");
    return context;
}
