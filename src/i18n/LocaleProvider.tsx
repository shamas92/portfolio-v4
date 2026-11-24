"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import { enContent, type SiteContent } from "@/content";
import { deContent } from "@/content.de";

export type Locale = "en" | "de";

/** Fill a {placeholder} template from the locale strings. */
export function format(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ""));
}

/** The locale is external DOM state (data-locale on <html>, set by
 *  the beforeInteractive script from localStorage), so it is read
 *  with useSyncExternalStore rather than an effect — exactly the
 *  theme toggle's pattern. The server always renders English; a
 *  stored German choice applies after hydration, with no mismatch
 *  (React error 418) because the server snapshot is "en" and the
 *  client snapshot only diverges once the store is read. */
function getLocale(): Locale {
  if (typeof document === "undefined") return "en";
  return document.documentElement.getAttribute("data-locale") === "de"
    ? "de"
    : "en";
}

function getServerLocale(): Locale {
  return "en";
}

function subscribeLocale(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-locale"],
  });
  return () => observer.disconnect();
}

type LocaleState = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  content: SiteContent;
};

const LocaleContext = createContext<LocaleState>({
  locale: "en",
  setLocale: () => {},
  content: enContent,
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(
    subscribeLocale,
    getLocale,
    getServerLocale,
  );

  const setLocale = useCallback((next: Locale) => {
    document.documentElement.setAttribute("data-locale", next);
    document.documentElement.setAttribute("lang", next);
    try {
      localStorage.setItem("locale", next);
    } catch {
      /* Storage unavailable (private mode): the switch still works
         for this page load. */
    }
  }, []);

  /* Title and description follow the language. The title swap is a
   * suffix replace, so case pages (whose titles carry no suffix)
   * keep their English title — only the "Software Engineer,
   * Dresden" suffix changes. The description swaps only on the
   * home page, where the current description is the known site
   * description; case-page descriptions are per-project English
   * and are left alone. */
  useEffect(() => {
    const suffixEn = enContent.ui.meta.titleSuffix;
    const suffixDe = deContent.ui.meta.titleSuffix;
    if (locale === "de") {
      if (document.title.includes(suffixEn)) {
        document.title = document.title.replace(suffixEn, suffixDe);
      }
      const meta = document.querySelector('meta[name="description"]');
      if (
        meta &&
        meta.getAttribute("content") === enContent.ui.meta.description
      ) {
        meta.setAttribute("content", deContent.ui.meta.description);
      }
    } else {
      if (document.title.includes(suffixDe)) {
        document.title = document.title.replace(suffixDe, suffixEn);
      }
      const meta = document.querySelector('meta[name="description"]');
      if (
        meta &&
        meta.getAttribute("content") === deContent.ui.meta.description
      ) {
        meta.setAttribute("content", enContent.ui.meta.description);
      }
    }
  }, [locale]);

  const content = locale === "de" ? deContent : enContent;

  return (
    <LocaleContext.Provider value={{ locale, setLocale, content }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleState {
  return useContext(LocaleContext);
}

/** The current locale's content — the single way components read
 *  user-visible strings. */
export function useContent(): SiteContent {
  return useContext(LocaleContext).content;
}
