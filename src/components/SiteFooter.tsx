"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContent, useLocale } from "@/i18n/LocaleProvider";
import { CopyEmailButton } from "./CopyEmailButton";
import { DownloadCvButton } from "./DownloadCvButton";
import { ContactForm } from "./ContactForm";
import { PixelField } from "./PixelField";
import { Reveal } from "./Reveal";

/** Site footer, Direction A (Parish spine).
 *
 *  Top block on every page: the lime CTA panel — huge heading, a
 *  black mailto pill, a text link to the projects, and the copyable
 *  email. Parish shows its panel on every page; this one does the
 *  same. The panel is locale-aware, so the legal pages keep their
 *  German copy in German (no English chrome leaks in).
 *
 *  Home page below the panel: the Contact section, numbered 03 on
 *  the shared spine (kicker + hairline rule), with the contact
 *  details on the left and the message form on the right (stacked
 *  on mobile). The form posts to /api/contact and stays
 *  homepage-only. Under the contact grid, the footer proper: four
 *  columns — identity / Explore (including the legal links
 *  Impressum + Datenschutzerklärung, which Parish omits and we
 *  must keep) / Elsewhere / Currently — then a bottom bar
 *  (copyright, built-with line, location) and the giant cropped
 *  wordmark.
 *
 *  Every other page gets the slim footer below the panel: the
 *  legal links and the pixel-field closing band, no contact block,
 *  no form, no id="contact" — there is no contact section on
 *  those pages. The slim footer carries no locale-driven strings
 *  of its own beyond the panel above it, only the two German legal
 *  link names.
 *
 *  Availability: the site has exactly ONE availability indicator,
 *  the hero profile's status pill (status dot + "Working-student
 *  eligible, 20h/wk") — that lives in page.tsx and is untouched
 *  here. The footer's "Currently" column carries availability as
 *  plain text only, no second dot or pill. The eligibility line
 *  stays in the contact column: a recruiter who scrolls straight
 *  to Contact needs the 20 h/week constraint right there.
 *  External links carry a visually-hidden new-tab note for
 *  screen-reader users. Impressum and Datenschutzerklärung are
 *  German legal terms and stay German in both locales. */
export function SiteFooter() {
  const pathname = usePathname();
  /* A null pathname only happens outside the app router; treat it
   *  as the home page, which is the previous behaviour everywhere. */
  const isHome = pathname === null || pathname === "/";
  const content = useContent();

  return (
    <footer className="site-footer" id={isHome ? "contact" : undefined}>
      <div className="site-footer-inner">
        <CtaPanel />
        {isHome ? (
          <HomeFooter />
        ) : (
          <p className="footer-legal">
            <Link href="/impressum">Impressum</Link>
            {" · "}
            <Link href="/datenschutz">Datenschutzerklärung</Link>
          </p>
        )}
      </div>
      <div className="footer-wordmark-wrap" aria-hidden="true">
        <p className="footer-wordmark">{content.profile.name}</p>
      </div>
      <Reveal>
        <PixelField />
      </Reveal>
    </footer>
  );
}

/** The lime CTA panel: the top block of the footer on every page.
 *  Fixed lime background in both themes, so every colour inside
 *  is a fixed dark token too (see css-contact.md) — the themed
 *  --ink would turn near-white in dark mode and vanish on lime.
 *  The black pill reuses the hero's "Email me" label, the text
 *  link reuses "See the projects"; only the heading and the
 *  subline are new copy. */
function CtaPanel() {
  const content = useContent();
  const profile = content.profile;
  const ui = content.ui;

  return (
    <div className="cta-panel">
      <h2 className="cta-panel-head">{ui.footer.ctaHeading}</h2>
      <p className="cta-panel-sub">{ui.footer.ctaSub}</p>
      <div className="cta-panel-actions">
        <a className="cta-panel-mail" href={`mailto:${profile.email}`}>
          {ui.hero.emailMe}
        </a>
        <Link className="cta-panel-link" href="/work">
          {ui.hero.seeWorkFirst}
        </Link>
        <CopyEmailButton />
      </div>
    </div>
  );
}

/** The home-page footer below the panel: Contact section (03 on
 *  the spine) + the four-column footer + bottom bar. The kicker,
 *  rule, columns and bottom bar span both grid columns at desktop;
 *  the contact details and the form are the two columns. */
function HomeFooter() {
  const content = useContent();
  const { locale } = useLocale();
  const profile = content.profile;
  const ui = content.ui;
  const newTabNote =
    locale === "de"
      ? " (öffnet in einem neuen Tab)"
      : " (opens in a new tab)";

  return (
    <>
      <p className="section-kicker">
        <span className="section-number">03</span> {ui.footer.heading}
      </p>
      <hr className="section-rule" aria-hidden="true" />
      <div className="footer-contact">
        <a className="footer-email" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        {/* One treatment for the whole row (audit S3): every item
            is a plain text link. The copy-email button and the
            Download CV link are text-styled, not pills — the
            outline pill and the solid pill used to sit next to
            bare text links here. */}
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
          <CopyEmailButton variant="text" />
          <DownloadCvButton className="footer-text-link" />
        </div>
        <p className="footer-eligibility">{profile.workEligibility}</p>
      </div>
      <ContactForm />
      <div className="footer-columns">
        <div className="footer-col">
          <h3 className="footer-col-head">{profile.name}</h3>
          <ul className="footer-col-lines">
            <li>{profile.role}</li>
            <li>{profile.location}</li>
          </ul>
        </div>
        <div className="footer-col">
          <h3 className="footer-col-head">{ui.footer.exploreHeading}</h3>
          <ul className="footer-col-links">
            <li>
              <Link href="/">{ui.workIndex.back}</Link>
            </li>
            <li>
              <Link href="/#work">{ui.nav.work}</Link>
            </li>
            <li>
              <Link href="/#background">{ui.nav.background}</Link>
            </li>
            <li>
              <Link href="/#contact">{ui.nav.contact}</Link>
            </li>
            <li>
              <Link href="/impressum">Impressum</Link>
            </li>
            <li>
              <Link href="/datenschutz">Datenschutzerklärung</Link>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h3 className="footer-col-head">{ui.footer.elsewhereHeading}</h3>
          <ul className="footer-col-links">
            <li>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
                <span className="visually-hidden">{newTabNote}</span>
              </a>
            </li>
            <li>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
                <span className="visually-hidden">{newTabNote}</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h3 className="footer-col-head">{ui.footer.currentlyHeading}</h3>
          {/* Plain text on purpose: the hero pill is the site's
              one availability indicator. No dot, no second pill. */}
          <ul className="footer-col-lines">
            <li>{ui.footer.currentlyWorking}</li>
            <li>{ui.footer.currentlyLooking}</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottombar">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p>{ui.footer.builtWith}</p>
        <p>{profile.location}</p>
      </div>
    </>
  );
}
