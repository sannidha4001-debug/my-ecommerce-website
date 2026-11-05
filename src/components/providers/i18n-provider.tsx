"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getDictionary,
  LOCALE_COOKIE,
  type Locale,
} from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type I18nContextValue = {
  locale: Locale;
  dict: Dictionary;
  isBangla: boolean;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

type I18nProviderProps = {
  initialLocale: Locale;
  children: ReactNode;
};

/**
 * Keeps the active language in React state and a cookie.
 * - No page reload, so animations stay smooth.
 * - The cookie is read by the root server layout on the next visit.
 * - `document.documentElement.lang` is kept in sync for accessibility/SEO.
 */
export function I18nProvider({ initialLocale, children }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    document.documentElement.lang = next;
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "en" ? "bn" : "en");
  }, [locale, setLocale]);

  // Keep the HTML language attribute correct even if the visitor changes it.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      dict: getDictionary(locale),
      isBangla: locale === "bn",
      setLocale,
      toggleLocale,
    }),
    [locale, setLocale, toggleLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used inside <I18nProvider>.");
  }
  return context;
}
