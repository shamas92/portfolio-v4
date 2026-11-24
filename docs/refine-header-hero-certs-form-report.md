# Refinement: header, hero, certificates, contact form

Branch `refine/header-hero-certs-form`, from `main @ 0875d2b`. Six commits. Nothing is merged, pushed, or deployed; the owner reviews the result and decides whether it goes live.

## What changed

### P1: The scrolled header is solid

The scrolled pill used a translucent surface (`color-mix` at 80% plus a 12px blur), and page text showed through it. The scrolled state now uses a solid `background: var(--surface)`, with the border and shadow giving separation. The top-of-page state is unchanged.

Measured on the local build: the computed header background at scroll y=100 is `rgb(255, 255, 255)` in light mode and `rgb(20, 20, 19)` in dark mode, at 1440, 768, and 375px widths, with no backdrop filter. Screenshots confirm no text bleeds through.

The scroll fix and the active-section tracking were preserved and re-verified: the 1024px breakpoint, the scrolled collapse, the 40% line, the bottom-of-page rule for Contact, and the click-hold. Contact becomes active on click and stays active at the bottom; Work is active at the top, which is the pre-existing default (`useState("work")` in `SiteHeader.tsx`, confirmed in the previous round's QA record).

### P2: Hero scroll transformation and honest mockups

The hero now transforms as the visitor scrolls. A CSS variable `--hero-progress` runs from 0 at the top to 1 at 320px of scroll, driven by a passive `requestAnimationFrame` listener in `page.tsx`. The hero translates up 14px and the name scales from 1 to 0.95. Only `transform` changes, so the layout does not shift and the fold does not move. The effect reverses on scroll-up, and it is skipped under `prefers-reduced-motion` and without JavaScript (the variable stays at 0).

The fold did not move. The first flagship card top is 682px at 1440×900, 753px at 375×844, and 769px at 375×667, the same numbers the clarity redesign recorded.

Each flagship visual now carries a mono caption that states it is a schematic, not a product screenshot. The three captions, in both locales:

- LeaseLens: "Schematic of the registration check — an illustration, not a product screenshot."
- Sales ETL: "Pipeline diagram — a schematic, not a product screenshot."
- OratorPath: "Speech metrics — schematic bars, no measured values."

The ETL case-page diagram was the one heavy asset on the site: an 859 KB PNG at 1728×1440. It is now a 43 KB WebP at 1440×1200 (`public/images/etl-diagram.webp`). The PNG was deleted and the references in `src/content.ts` and `src/content.de.ts` updated. The LeaseLens PNG (145 KB, 740×640) was left as it is.

### P3: Certificates section

A dedicated section sits after Skills, with its own heading (`Certificates` / `Zertifikate`) and `id="certificates"`. It is a two-column typographic grid: the provider "Google" in mono, the full certificate name in the Newsreader serif. The four names are exactly as recorded:

- Google Advanced Data Analytics
- Google Data Analytics
- Google IT Automation with Python
- Google Project Management

The intro gives the shared period, "Four Google certificates, completed Nov 2025 – Sep 2026." There are no badges, credential IDs, or verification links, because none exist on record. A note states the gap plainly: "Per-certificate completion dates are not on record, so none are shown."

Certificates were removed from the Background metadata strip, which now holds spoken languages only. The dead CSS (`.meta-cert-list`, `.meta-period`) and the two-column meta-strip grid rule were removed with them.

### P4: Contact form

Two new files carry the form. `src/lib/contact.ts` holds two pure functions, `buildMailto` and `isEmail`, so the mailto builder is unit-testable. `src/components/ContactForm.tsx` holds the form: Name, Email, and Message fields, inline validation errors with `aria-invalid` and focus on the first invalid field, a honeypot field named "Company" (`tabindex="-1"`, visually hidden, silently discards bot submits), and a `role="status"` line.

No delivery backend exists. A search of `src/app` found no API route and no form service, so the form does not pretend to send. A valid submit opens the visitor's email app with a prefilled mailto and says so in the note under the button and in the status line: "Opening your email app with the message ready to send. Sending happens in your email app, not on this page." No "message sent" state appears for a message that was not sent.

Direct email (`shamasrehman249@gmail.com`), GitHub, LinkedIn, Copy email, and Download CV stay beside the form. The footer is two columns on desktop and stacks on mobile.

The unit test for `buildMailto` passed: it builds `mailto:shamasrehman249@gmail.com` with the subject "Portfolio contact — Ada Lovelace" and a body carrying the name, the email, and the message with line breaks encoded. `isEmail` accepts a valid address and rejects `not-an-email`, `a@b`, and an empty string.

### P5: Theme cross-fade

Theme changes now cross-fade over 200ms, on color properties only: background-color, color, border-color, outline-color, fill, and stroke. The list covers the body, sections, the footer, the mobile menu, the hero pill, the card visuals, and the index rows; the flagship card's transition list also gained background-color. Text flips instantly, so contrast is never worse than the two endpoints. Layout is not animated. The whole block sits under `@media (prefers-reduced-motion: no-preference)`.

The no-flash script in `layout.tsx` was left alone. It still applies the stored theme before first paint: on a fresh load with dark stored, the document carries `data-theme="dark"` and the dark body background from the start.

### P6: Positioning

The header wordmark now carries a role descriptor under the name, taken from `profile.role`: "Software Engineer" in English, "Softwareentwickler" in German. It hides with the name once scrolled and below 400px, so the pill content budget is unchanged.

The hero ask now reads "Looking for a working-student role in full-stack software and data engineering." (German: "Ich suche eine Werkstudentenstelle in Full-Stack- und Datenentwicklung.") The wording rests on the projects: LeaseLens is Next.js with FastAPI, Quality CRM is Laravel, HITEC is ASP.NET, and the ETL pipeline is Python with Airflow. No seniority or job title is claimed beyond that evidence.

## Optional additions

**Pixel effect: included, as a static motif.** A small staircase of accent and rule squares (56×24 SVG, `aria-hidden`) sits under the Contact heading. It has no animation, so it needs no reduced-motion state and costs nothing at runtime. It reads as a quiet mark in the screenshots. Drop it if it reads as noise on a real screen.

**Map: omitted.** No verified coordinates exist for the address, a map would pull attention away from the engineering work, and the location is already stated plainly in the hero pill and the footer. If the owner wants it later, the verified address is Fritz-Löffler-Straße 12, 01069 Dresden; coordinates would need to be looked up and checked first.

**The reference files were not available.** The brief mentioned an Austin Serb site, a topographic map, a pixel effect, and screenshots. None of those files reached this session and no matching file exists in the workspace, so the two decisions above rest on fit alone. Nothing in this report describes what the references showed.

## Verification

- Production build passes: 11 pages (home plus 6 case pages). `tsc --noEmit` clean, ESLint clean, Prettier clean. One formatting fix in `page.tsx` came out of the Prettier check and was committed separately.
- QA rig (playwright-core 1.65.1, local production build): **50 of 50 checks pass, 0 console errors.** The checks covered all routes returning 200; the solid header in light and dark at 1440, 768, and 375; the role descriptor visible at the top and hidden when scrolled; the hero progress at 0.000 at the top and 1.000 at 320px with the name at a 0.95 scale, reversing on scroll-up; the fold numbers; the three captions; the certificates section with its four names and its note; the form (three errors and focus on the name for an empty submit, one error and focus on the email for a bad address, the honeypot discarding a submit, the valid-submit status with honest wording); labels and the honeypot's `tabindex="-1"`; the German locale (role, ask, certificates, form heading); reduced motion (no hero transform, no body transition); axe 0 on the home page in both locales and on all six case pages; no horizontal overflow at 375, 768, and 1440; the theme toggle in both directions with the stored value; and the no-flash attribute on load.
- Lighthouse 13.6.0 against the local build: mobile 84 (accessibility 100, best practices 100, SEO 100), desktop 98 (100, 100, 100). LCP 1.1s mobile and 0.3s desktop, CLS 0, TBT 630ms mobile and 140ms desktop, transfer 499 KB mobile and 560 KB desktop. Mobile performance is up from 74–78 in the previous round; the ETL image change (859 KB to 43 KB) is the likely cause.
- Impeccable detector on the 11 changed source files: no findings.
- Screenshots: 16 files under `docs/screenshots/refine-header-hero-certs-form/`: home at 1440 light and dark (first viewport and full page), 768 first viewport, 375 first viewport, the scrolled solid header at 1440, 768, and 375 in light and 1440 in dark, the certificates section at 1440 and 768, the contact form at 1440 and 375, the full contact section at 1440, the LeaseLens case page at 1440, and the German home at 1440.
- One QA note: the first certificates screenshot caught the page mid smooth-scroll and showed the Skills section instead. It was retaken with instant scrolling. The section itself passed its checks in both runs.

## Contact form: what is still needed for real delivery

The form as built opens the visitor's mail app. Nothing is sent from the page, and the page says so. To make the form send from the page, one of these two routes:

**Route A (recommended, keeps everything in the repo):** add a Next.js route handler, for example `src/app/api/contact/route.ts`, that accepts POST with name, email, and message, validates the same rules server-side, checks the honeypot, rate-limits, and sends through a transactional-mail provider (Resend, SendGrid, or Mailgun). Store the provider API key in a Vercel environment variable, never in client code. The form then POSTs to `/api/contact` and shows a real "message sent" state only after the route returns 200. The provider's sender domain needs its SPF and DKIM records set, or the provider's verified sender address.

**Route B (no code):** point the form at a form service (Formspree, Basin, or similar). Create the form in the service, paste its endpoint into the form's fetch call, and let the service's spam filtering replace the honeypot. The endpoint URL is public by design; the service holds the delivery key.

Either way, keep the direct email address on the page as a fallback.

## Flagged and unresolved items

- Per-certificate completion dates are not on record. The section says so. If the owner supplies them, add them per certificate.
- The HITEC line "cutting manual logging errors by 20%" has no method or baseline on record. It was kept as is and not strengthened.
- The 86.1% IoU figure is a single-pair score with no baseline. The LeaseLens visual now carries a caption that calls it a schematic; the case page wording was not changed.
- Tools420 dates are unresolved: the user says "more than a year", while the v8 CV spans Nov 2025–Aug 2026 (10 months). Nothing on the site decides it.
- OratorPath has no working URL. The page says the dashboard is no longer live and the paper is the record. No change here.
- No start date is on record, and solo-versus-team is unclaimed on the project pages. Neither is addressed in this round.
- The two hiring-review docs (`docs/hiring-review-*.md`) and their screenshots remain uncommitted in the working tree. They belong to the review work, not this branch.

## Branch state

- Branch `refine/header-hero-certs-form`, six commits from `main @ 0875d2b`. Not merged, pushed, or deployed.
- Changed source files: `src/app/globals.css`, `src/app/page.tsx`, `src/components/SiteHeader.tsx`, `src/components/SiteFooter.tsx`, `src/components/ContactForm.tsx` (new), `src/components/FlagshipCard.tsx`, `src/components/CertificatesSection.tsx` (new), `src/components/Background.tsx`, `src/lib/contact.ts` (new), `src/content.ts`, `src/content.de.ts`, `public/images/etl-diagram.webp` (new; `etl-diagram.png` deleted).
- Docs and screenshots: `docs/refine-header-hero-certs-form-report.md` and `docs/screenshots/refine-header-hero-certs-form/` (16 files).
