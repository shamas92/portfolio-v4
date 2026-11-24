# Visual redesign — refine/visual-redesign

Branch `refine/visual-redesign`, from `main @ e503212`. Six commits, no
merge, no push, no deploy. The live site is unchanged until the owner
decides.

This round completes the visual redesign the last round left open: the
hero now grows on scroll, the three flagship schematics are finished
interface mockups, the certificates are editorial cards, and the two
reference-inspired sections (Dresden location, pixel contact ending)
are in, both decided explicitly below. The identity is untouched:
oxide red, Newsreader + Inter Tight + JetBrains Mono, the morphing
header, DE/EN and theme toggles, Download CV, Email me as the hero
action, and the same home order.

## Already complete: verified, not rebuilt

These were claimed complete by the prior round. Each was re-measured
on this branch (QA script
`~/workspace/.baseline-qa/refine-visual-redesign-qa.js`, 64/64 checks
pass) and left alone.

- **Scrolled header solid.** At 500px scroll the header pill measures
  `rgb(255, 255, 255)` in light and `rgb(20, 20, 19)` in dark, with
  no backdrop filter. Content never shows through.
- **Contact active in all four cases.** Clicking Contact, loading
  `/#contact` directly, scrolling into Contact, and browser
  back/forward all show Contact as the single active nav item
  (`aria-current="true"`, exactly one active link each time).
- **Theme cross-fade.** The body transition is `background-color,
  color` (200ms, color-only, no layout). Toggling light → dark →
  light flips `data-theme` both ways and moves no element (the hero
  name's position is identical before and after the toggle). With
  `theme=dark` in storage the page renders dark before first paint
  (`data-theme="dark"`, body `rgb(12, 12, 11)`), so there is no flash.
- **Contact form, honestly labelled.** There is no submission
  endpoint in the repo (re-confirmed: no `src/app/api`, no
  Resend/SendGrid/Mailgun/Formspree/Basin in `package.json`). The
  form keeps the mailto fallback and says so: the button reads
  "Open in your email app" and the note reads "Opens your email app
  with the message ready to send — nothing is sent from this page."
  The honeypot ("Company", `tabindex="-1"`) is present, and an empty
  submit marks all three fields invalid and focuses the first. The
  mechanism was not changed.
- **Reduced motion.** With `prefers-reduced-motion: reduce`, the hero
  is static (name transform `none`, claim opacity 1), the ETL dash
  animation is off, and every reveal target is visible.

## What changed

### 1. Scrolled header and active navigation

No change. Verified complete (see above).

### 2. Scroll-responsive hero

The hero now expands instead of receding. Over the first 240px of
scroll the name scales 1 → 1.22, anchored at its baseline so it grows
upward into the hero's top padding and never collides with the claim
below it; the claim, ask, location pill, status and actions drift up
12px and fade only to 0.92, so the role, the ask, the Dresden pill and
the Email me action stay legible throughout. The range is 240px
because the name is off-screen past ~150px of scroll, so the growth has
to happen while it is still in view. The effect reverses on scroll-up.

Implementation: the `--hero-progress` variable in `src/app/page.tsx`
(range 320px → 240px), transform/opacity rules in `globals.css`, the
same passive rAF listener and transform-only discipline. One
consequence of the new rules: the entrance animation's fill mode
changed `both` → `backwards`, because `both` pins the animation's
final keyframe forever and would override the scroll rules on the hero
lines after the entrance completes. At rest the entrance looks
identical (opacity 1, translateY 0); the reduced-motion reset now
covers the hero lines too.

Measured: name scale 1.055 at 60px, 1.11 at 120px, 1.22 at 240px
(translateY −2.5 / −5 / −10px, exact); claim opacity 0.98 / 0.96;
name-to-claim gap 24px at every scroll position; the name stays below
the header at rest (top 124px vs header bottom 92px). The fold is
unchanged: first flagship card top 682px at 1440×900 and 753px at
375×844, exact.

### 3. Polished project mockups

`src/components/SpecAssets.tsx` is rewritten as three interface
mockups in one shared window-chrome language (title bar with three
dots, status strip, viewBox 400×240), theme-aware through the same
CSS-variable presentation attributes the old diagrams used. They
render in the flagship cards and in the case-page Evidence sections
(same asset, same caption).

- **LeaseLens:** an evidence-review interface: a MOVE-IN plate whose
  boundary is offset from the room (the misalignment the check
  resolves) next to a MOVE-OUT plate whose boundary sits inside the
  room, registered, with a reticle; a deposit strip with the verified
  figures (€950.00 / €535.41 / €414.59); the status strip reads
  "86.1% registered IoU — single-pair score, no baseline".
- **Sales ETL Pipeline:** four numbered stages (Sources, MinIO /
  Parquet, Airflow / Tasks, PostgreSQL) joined by the animated dash
  flow, plus a star-schema strip (dim_date, dim_customer, dim_product,
  fact_sales, the fact in accent) and "1 DAG · 3 TASKS · 4 TABLES" in
  the status strip.
- **OratorPath:** a waveform with a playhead and schematic metric
  bars (pace, filler words, clarity) with no numbers; the paper
  citation (Spectrum of Engineering Sciences, Vol. 3, Issue 7, 2025)
  in the status strip.

Captions keep the honest mockup labeling, calling each one an
illustration rather than a product screenshot. No data, measurement, screenshot or functionality was
invented. The ETL raster diagram is gone: its image field was removed
from both locales and `public/images/etl-diagram.webp` (43 KB) was
deleted. The LeaseLens SAM burn PNG stays as the second evidence
figure on the case page, because it is a real artifact (verified
rendering: 710×614 natural, 720×623 on the page). German strings were
updated in lockstep (`content.de.ts`).

### 4. Certificates showcase

`CertificatesSection.tsx` now renders editorial plate cards: a
bordered card (radius 8, surface background) with an index (01–04) in
accent mono and the provider in muted mono on the top row, the
certificate name in Newsreader 600, and the shared period
(Nov 2025 – Sep 2026) in mono under a hairline, pushed to the card
foot so the metadata aligns across the row. The period moved from the
section intro onto each card (each card is a self-contained record);
the intro now states only "Four Google certificates." The note about
per-certificate dates stays. No badges, seals, verification links,
credential IDs, or individual dates.

### 5. Contact experience

No endpoint exists (re-confirmed, see above), so the mechanism is
unchanged and the labeling stands as verified-complete. What changed
is the ending around it (item 7). The email, GitHub, LinkedIn and CV
actions are all still present.

### 6. Theme changes

No change. Verified complete (see above): 200ms color-only in both
directions, no flash, no layout shift.

### 7. Reference-inspired sections: explicit decisions

**Dresden / location: implemented, compact.** A location panel now
sits in the Background section after the languages strip
(`LocationPanel.tsx`). It shows the verified facts: Dresden,
Germany; Fritz-Löffler-Straße 12, 01069 Dresden, and a live Dresden
clock (Europe/Berlin, renders after mount so server and client HTML
match, width reserved so the panel does not shift when the clock
appears). Beside the text is a decorative contour motif: abstract
wavy rings generated in the component. The panel says so plainly,
calling the motif decorative rather than a survey map, and there are no
fabricated Dresden elevations, peaks, coordinates or scale bar. On
mobile the motif becomes a short band above the text. The address was
added to the profile in both locales. A full-screen map was rejected:
it would compete with the work, and there is no verified Dresden
topography to put on it.

**Animated contact ending: implemented, static.** The 56×24 pixel
staircase under the Contact heading is replaced by a pixel field at
the very bottom of the footer (`PixelField.tsx`): a deterministic
seeded SVG grid (72×5), density growing toward the bottom, in
oxide-red with a few rule-coloured squares, adapting the reference's orange
field adapted to this palette. It is a static SVG (no canvas, no
animation, no runtime cost), so it is fully static under
`prefers-reduced-motion`, and it is revealed on scroll through the
existing Reveal (opacity/transform only). The squares stay square at
every width (the SVG crops its sides rather than stretching). It is
decorative and `aria-hidden`, and it stays secondary to the contact
actions above it. The field was verified to appear when scrolled to
the bottom (Reveal `is-visible`, opacity 1, in light, dark and
mobile); an earlier screenshot that missed it was retaken after the
scroll, because the Reveal only fires once the field is 20% visible.

## Verification

- Production build: clean (11 pages). `tsc --noEmit`, ESLint and
  Prettier: clean (one formatting-only Prettier fix, committed
  separately).
- QA rig: **64/64 checks pass**
  (`~/workspace/.baseline-qa/refine-visual-redesign-qa.js`). Routes
  200 (all 7); fold exact at both widths; hero growth exact at 60 /
  120 / 240px with no collision; mockups present with the verified
  figures and no invented numbers; ETL WebP gone, LeaseLens PNG kept;
  certificates 01–04 with the shared period; location panel with the
  verified address, a live clock matching `HH:MM:SS CET`, and the
  decorative note; pixel field (147 rects, 120px desktop / 96px
  mobile) below the form, staircase gone; header solid in both
  themes; Contact active in all four cases; theme toggle both
  directions with no layout shift; form honest labeling, honeypot,
  and empty-submit validation; no horizontal overflow at 375 / 768 /
  1440; reduced motion static; German locale (mockup label, location
  clock, certificate period "Nov. 2025 – Sep. 2026"); mockups in the
  Evidence sections of all three case pages; axe 0 on home (light and
  dark) and the LeaseLens case page; zero console errors, zero failed
  requests.
- Lighthouse (local production build, throttled): **desktop 100**
  (performance / accessibility / best practices / SEO, LCP 0.3s,
  CLS 0, TBT 60ms); **mobile 76** (accessibility 100, best practices
  100, SEO 100, LCP 0.8s, CLS 0, TBT ~1.24s). Mobile is down from 84
  in the prior round and was measured twice with the same result
  (76, TBT 1.24s both runs), so it is a real, modest regression
  rather than run noise. The likely cause is the added DOM (three larger
  SVGs, the location panel, the 147-rect pixel field) on the 4×
  throttled CPU. Desktop improved 98 → 100 and CLS is 0 on both.
  Flagged, not treated as a blocker: the visual work is the point of
  this round, and mobile has swung 74–84 across rounds on this VM.
- Impeccable detector on the nine changed source files: no issues.
- Screenshots: 44 in `docs/screenshots/refine-visual-redesign/`
  (home + leaselens / ETL / OratorPath case pages, certificates,
  location, contact ending, hero at 60 / 120 / 240px, scrolled
  header; 375 / 768 / 1440, light + dark, first viewport + full
  page; German home first viewport). The LeaseLens full-page
  capture initially showed the SAM PNG as a blank gap because
  `next/image` lazy-loads it; a scrolled probe confirmed it renders
  (see `leaselens-evidence-png.png`).

## Contact-form configuration still needed

Unchanged from the prior round. There is no delivery backend. To make
the form send directly, either Route A (a Next.js route handler at
`src/app/api/contact/route.ts` plus Resend, SendGrid or Mailgun, with
the API key in a Vercel environment variable, never in client code)
or Route B (Formspree or Basin). Direct email stays as the fallback
either way. This needs the owner's choice and, for Route A, a key he
creates.

## Files

Branch `refine/visual-redesign` (6 commits from `main @ e503212`):

- `c605661` hero: expand on scroll (name grows, lines drift and hold)
- `d2a4f3f` mockups: polished SVG interface mockups for the three
  flagships (ETL WebP deleted)
- `6c09a7b` certificates: editorial plate cards with index, provider,
  period
- `2135527` location: compact Dresden panel with decorative contours
  and live clock
- `f765a73` contact: oxide-red pixel field as the closing band
- `9c467f1` format: prettier on CaseStudy and content.de.ts

Changed: `src/app/page.tsx`, `src/app/globals.css`,
`src/components/SpecAssets.tsx`, `src/components/CaseStudy.tsx`,
`src/components/CertificatesSection.tsx`,
`src/components/Background.tsx`, `src/components/LocationPanel.tsx`
(new), `src/components/SiteFooter.tsx`,
`src/components/PixelField.tsx` (new), `src/content.ts`,
`src/content.de.ts`. Deleted: `public/images/etl-diagram.webp`.

Not merged, not pushed, not deployed. `PRODUCT.md` untouched.
