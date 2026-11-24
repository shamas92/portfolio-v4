"use client";

import { useContent } from "@/i18n/LocaleProvider";
import { CopyEmailButton } from "./CopyEmailButton";

export function SiteFooter() {
  const content = useContent();
  const profile = content.profile;
  const ui = content.ui.footer;

  return (
    <footer className="site-footer" id="contact">
      <div className="site-footer-inner">
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
        </div>
        <p className="footer-line">{ui.closing}</p>
        <p className="footer-eligibility">{profile.workEligibility}</p>
      </div>
    </footer>
  );
}
