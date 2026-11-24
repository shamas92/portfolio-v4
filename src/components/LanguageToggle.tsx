"use client";

import { useContent, useLocale, type Locale } from "@/i18n/LocaleProvider";

/** Segmented DE | EN language control. A separate control from
 *  the theme toggle: it switches the whole site's language, the
 *  theme toggle only switches the colour scheme. The active
 *  language is a cobalt segment; the control is two real buttons
 *  with aria-pressed inside a group labelled "Language" (or
 *  "Sprache"), so the accessible name of each option is its visible
 *  text — DE / EN — and a screen reader hears the group label plus
 *  the pressed state. No per-option aria-label: one would replace
 *  the visible text in the accessible name and fail the
 *  label-in-name check. */
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
          onClick={() => setLocale(l)}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
