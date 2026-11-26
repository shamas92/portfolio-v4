"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContent, useLocale } from "@/i18n/LocaleProvider";
import { CopyEmailButton } from "./CopyEmailButton";
import { DownloadCvButton } from "./DownloadCvButton";
import { ContactForm } from "./ContactForm";
import { PixelField } from "./PixelField";
import { Reveal } from "./Reveal";

/** Contact footer: the owner's public details on the left, the
 *  message form on the right (stacked on mobile). The pixel
 *  field at the bottom is the closing band — a static oxide-red
 *  pixel field, denser toward the bottom, revealed on scroll
 *  (opacity/transform only). Decorative and hidden from
 *  assistive technology; the contact actions above it do the
 *  work. The eligibility line stays: a recruiter who scrolls
 *  straight to Contact needs the 20 h/week constraint right
 *  there. External links carry a visually-hidden new-tab note
 *  for screen-reader users. Impressum and Datenschutzerklärung
 *  are German legal terms and stay German in both locales.
 *
 *  The full footer lives on the home page only. Every other
 *  page gets a slim footer — the legal links and the pixel-field
 *  closing band, no contact block, no form. That also fixes the
 *  English footer chrome on the German legal pages: the slim
 *  footer carries no locale-driven strings at all, only the two
 *  German legal link names. The slim footer has no id="contact"
 *  — there is no contact section on those pages. */
export function SiteFooter() {
  const pathname = usePathname();
  /* A null pathname only happens outside the app router; treat it
   *  as the home page, which is the previous behaviour everywhere. */
  const isHome = pathname === null || pathname === "/";
  const content = useContent();
  const { locale } = useLocale();

  if (!isHome) {
    return (
      <footer className="site-footer">
        <div className="site-footer-inner">
          <p className="footer-legal">
            <Link href="/impressum">Impressum</Link>
            {" · "}
            <Link href="/datenschutz">Datenschutzerklärung</Link>
          </p>
        </div>
        <Reveal>
          <PixelField />
        </Reveal>
      </footer>
    );
  }

  const profile = content.profile;
  const ui = content.ui.footer;
  const newTabNote =
    locale === "de"
      ? " (öffnet in einem neuen Tab)"
      : " (opens in a new tab)";

  return (
    <footer className="site-footer" id="contact">
      <div className="site-footer-inner">
        <div className="footer-contact">
          <h2 className="footer-head">{ui.heading}</h2>
          <a className="footer-email" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <p className="footer-location">{profile.location}</p>
          <div className="footer-links">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
              <span className="visually-hidden">{newTabNote}</span>
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
              <span className="visually-hidden">{newTabNote}</span>
            </a>
            <CopyEmailButton />
            <DownloadCvButton className="copy-btn copy-btn--pill" />
          </div>
          <p className="footer-eligibility">{profile.workEligibility}</p>
          <p className="footer-legal">
            <Link href="/impressum">Impressum</Link>
            {" · "}
            <Link href="/datenschutz">Datenschutzerklärung</Link>
          </p>
        </div>
        <ContactForm />
      </div>
      <Reveal>
        <PixelField />
      </Reveal>
    </footer>
  );
}
