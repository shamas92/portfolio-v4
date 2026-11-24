"use client";

import { useContent } from "@/i18n/LocaleProvider";

/** Skip link, first focusable element on the page. It lives inside
 *  the locale provider so its label follows the language. */
export function SkipLink() {
  const content = useContent();
  return (
    <a className="skip-link" href="#main">
      {content.ui.skipLink}
    </a>
  );
}
