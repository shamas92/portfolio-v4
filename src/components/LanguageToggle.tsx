"use client";

import { useContent, useLocale, type Locale } from "@/i18n/LocaleProvider";

/** Segmented DE | EN language control. A separate control from
 *  the theme toggle: it switches the whole site's language, the
 *  theme toggle only switches the colour scheme. The active
 *  language is a cobalt segment; the control is two real buttons,
 *  so it is keyboard-operable and announces via aria-pressed. */
export function LanguageToggle() {
  const { locale, setLocale } = useLocale();
  const content = useContent();
  const ui = content.ui.language;

  return (
    <div className="lang-toggle" role="group" aria-label={ui.label}>
      {(["de", "en"] as const satisfies Locale[]).map((l) => (
        <button
          key={l}
          type="button"
          className="lang-option"
          aria-pressed={locale === l}
          aria-label={l === "de" ? ui.toGerman : ui.toEnglish}
          onClick={() => setLocale(l)}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
