"use client";

import { useContent } from "@/i18n/LocaleProvider";

/** Download the CV (public/Shamas_Ur_Rehman_CV.pdf). One place for
 *  the link so the hero and the header cannot drift apart. The
 *  caller supplies the button class: btn-secondary in the hero,
 *  copy-btn in the header. */
export function DownloadCvButton({ className }: { className: string }) {
  const content = useContent();
  return (
    <a
      className={className}
      href="/Shamas_Ur_Rehman_CV.pdf"
      download="Shamas_Ur_Rehman_CV.pdf"
    >
      {content.ui.hero.downloadCv}
    </a>
  );
}
