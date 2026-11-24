"use client";

import { useContent } from "@/i18n/LocaleProvider";
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
 *  work. */
export function SiteFooter() {
  const content = useContent();
  const profile = content.profile;
  const ui = content.ui.footer;

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
      <Reveal>
        <PixelField />
      </Reveal>
    </footer>
  );
}
