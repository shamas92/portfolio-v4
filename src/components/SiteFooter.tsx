"use client";

import { useContent } from "@/i18n/LocaleProvider";
import { CopyEmailButton } from "./CopyEmailButton";
import { DownloadCvButton } from "./DownloadCvButton";
import { ContactForm } from "./ContactForm";

/** Contact footer: the owner's public details on the left, the
 *  message form on the right (stacked on mobile). The pixel
 *  motif under the heading is a static signature — a few accent
 *  squares, no animation, hidden from assistive technology. */
export function SiteFooter() {
  const content = useContent();
  const profile = content.profile;
  const ui = content.ui.footer;

  return (
    <footer className="site-footer" id="contact">
      <div className="site-footer-inner">
        <div className="footer-contact">
          <h2 className="footer-head">{ui.heading}</h2>
          <svg
            className="footer-pixels"
            width="56"
            height="24"
            viewBox="0 0 56 24"
            aria-hidden="true"
            focusable="false"
          >
            <rect x="0" y="16" width="8" height="8" fill="var(--accent)" />
            <rect
              x="8"
              y="16"
              width="8"
              height="8"
              fill="var(--accent)"
              opacity="0.55"
            />
            <rect x="16" y="8" width="8" height="8" fill="var(--accent)" />
            <rect
              x="24"
              y="8"
              width="8"
              height="8"
              fill="var(--accent)"
              opacity="0.55"
            />
            <rect x="32" y="0" width="8" height="8" fill="var(--accent)" />
            <rect x="40" y="0" width="8" height="8" fill="var(--rule)" />
            <rect x="48" y="0" width="8" height="8" fill="var(--rule)" />
          </svg>
          <a className="footer-email" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <p className="footer-location">{profile.location}</p>
          <div className="footer-links">
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <CopyEmailButton />
            <DownloadCvButton className="btn btn-secondary" />
          </div>
          <p className="footer-line">{ui.closing}</p>
          <p className="footer-eligibility">{profile.workEligibility}</p>
        </div>
        <ContactForm />
      </div>
    </footer>
  );
}
