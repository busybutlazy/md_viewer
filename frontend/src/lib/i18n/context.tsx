"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { en } from "./en";
import { zh } from "./zh";

export type Locale = "zh" | "en";
export type Translations = typeof zh;

const STORAGE_KEY = "mrp-locale";
const translations: Record<Locale, Translations> = { zh, en };

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "zh",
  setLocale: () => {},
  t: zh,
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored === "zh" || stored === "en") {
      setLocaleState(stored);
    }
  }, []);

  function setLocale(next: Locale) {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next === "zh" ? "zh-Hant" : "en";
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useT(): Translations {
  return useContext(LocaleContext).t;
}

export function useLocale(): { locale: Locale; setLocale: (l: Locale) => void } {
  const { locale, setLocale } = useContext(LocaleContext);
  return { locale, setLocale };
}
