import { en, bn, type Dictionary } from "./dictionaries";

export const locales = ["en", "bn"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Cookie used to remember the visitor's language across visits. */
export const LOCALE_COOKIE = "gx-locale";

export const dictionaries: Record<Locale, Dictionary> = { en, bn };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "en" || value === "bn";
}

/** Human-readable labels for the language switcher. */
export const localeLabels: Record<Locale, string> = {
  en: "EN",
  bn: "বাংলা",
};
