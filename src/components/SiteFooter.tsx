import { profile } from "@/content";
import { CopyEmailButton } from "./CopyEmailButton";

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="site-footer-inner">
        <h2 className="footer-head">Contact</h2>
        <a className="footer-email" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <div className="footer-links">
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <CopyEmailButton />
        </div>
        <p className="footer-eligibility">{profile.workEligibility}</p>
      </div>
    </footer>
  );
}
