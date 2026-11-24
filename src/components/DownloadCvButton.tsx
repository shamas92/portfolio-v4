"use client";

import { useContent } from "@/i18n/LocaleProvider";

/** Download the CV (public/Shamas_Ur_Rehman_CV.pdf). One place for
 *  the link so the hero and the header cannot drift apart. The
 *  caller supplies the button class: btn-secondary in the hero,
 *  copy-btn copy-btn--pill in the header (desktop), the icon-only
 *  pill in the mobile header. The label is locale-aware
 *  ("Download CV" / "Lebenslauf herunterladen"). */
function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="download-icon"
    >
      <path
        d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5M4 20h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DownloadCvButton({
  className,
  iconOnly = false,
}: {
  className: string;
  iconOnly?: boolean;
}) {
  const content = useContent();
  const label = content.ui.hero.downloadCv;
  return (
    <a
      className={className}
      href="/Shamas_Ur_Rehman_CV.pdf"
      download="Shamas_Ur_Rehman_CV.pdf"
      aria-label={iconOnly ? label : undefined}
      title={iconOnly ? label : undefined}
    >
      {iconOnly ? <DownloadIcon /> : label}
    </a>
  );
}
