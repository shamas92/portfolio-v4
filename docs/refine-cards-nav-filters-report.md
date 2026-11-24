# Portfolio v4: card, nav and filter refinement

Branch `refine/cards-nav-filters`, from `main @ a072ac0` (the clarity
redesign). Nothing here is merged, pushed, or deployed. The owner
decides whether it goes live.

The identity is unchanged: oxide red, Newsreader + Inter Tight +
JetBrains Mono, the morphing header, the DE/EN and theme toggles,
Download CV in the header, Email me as the hero action. What changed
is the navigation state, the shape of the project cards, and the
filter presentation.

## 1. The Contact diagnosis (why it never highlighted)

The header tracked the active section with an IntersectionObserver
whose band was 5% of the viewport (rootMargin `-40% 0px -55% 0px`,
so the band sat at 40–45% of the viewport height). The Contact
footer is 441px tall and sits at the page end. At maximum scroll on
a 1440×900 viewport the footer top lands at 459px, 54px below the
band bottom (405px), because the page cannot scroll any further.
The observer never fires for Contact, and it only ever sets the
active section on intersection, never clears it, so the last section
to cross the band (Background, or Work from a fresh load) stayed
highlighted while the reader looked at Contact. Measured on the
local production build: at the bottom, active was Work, footer top
459px, band 360–405px, footer in band: false; after clicking
Contact and after a direct `/#contact` load, active was still Work.

Two things made the bug width-dependent and easy to miss. On a
375×844 phone the page is much taller relative to the viewport, so
at maximum scroll the footer top lands at 360px, inside the
338–380px band, and Contact highlights there. And the mobile menu
click does scroll to the footer, but the smooth scroll takes about
1.8 seconds for the full page, so a check at 600ms catches it
mid-flight and looks like no scroll at all.

A second, separate defect rode along: the Contact link was
`#contact` while Work and Background were `/#work` and
`/#background`. On a case page the relative href resolves to
`/work/<slug>#contact`, which has no target, so clicking Contact
there did nothing at all: no navigation, no scroll. Work and
Background worked from case pages; Contact did not.

The anchor offset was not the problem: `section[id], footer[id]`
already carries `scroll-margin-top: 96px`, and the footer heading
lands clear of the header.

## 2. What changed

### Header (`SiteHeader.tsx`)

The observer is gone. The active section is now a scroll-position
computation, rAF-throttled, on a passive scroll listener:

- The last section whose top has crossed the 40% line is active,
  the same line the old band used, so Work and Background behave
  as before.
- A bottom-of-page rule: when `scrollY + viewport height` reaches
  the document height, the last section (Contact) is active. That
  is the rule that fixes the reported bug; it is the only rule that
  can fire for a footer the page cannot scroll past.
- The hash is read on mount and on `hashchange`, so a direct visit
  to `/#contact` or `/#background` and a browser back/forward
  highlight at once, before the scroll settles.
- A click names its destination at once (`goTo`): the pill moves to
  the clicked item immediately and holds there while the smooth
  scroll runs, instead of trailing the sections the viewport passes
  through. The hold clears the moment the position computation
  agrees the destination is current. A manual scroll input (wheel,
  touch, scroll keys) drops the destination at once and schedules a
  recomputation, and a scroll away from the destination clears it
  too, so no manual scroll leaves a stale highlight. The first
  version of the hold had a hole here: clearing the destination
  alone did not update the state when the page had not moved, so a
  wheel back to the top left Contact highlighted at scrollY 0.
  The input handler now schedules a computation after clearing.
- The Contact href is `/#contact`, like the other two, so it works
  from case pages.
- One `active` string still means at most one item is highlighted.
  On a case page Work stays active by rule, as before.

The reduced-motion rule for reveals now covers `.reveal.is-visible`
as well as `.reveal`: the old rule lost on specificity, so the
computed transform was a zero matrix instead of none. The visual
result was already correct (no offset, no transition); the rule now
says what it means.

### Featured cards (`FlagshipCard.tsx`, `content.ts`, `content.de.ts`)

The cards ran about 1100px tall with four labelled rows. Now:

- The card leads with the one-sentence summary (`rowOutcome`), no
  label. It was labelled "Problem" before, which misnamed it; the
  problem prose lives on the case page.
- The proof follows it as a strip in the accent wash, visible
  without interaction: the proof callout, plus the LeaseLens figure
  badge and test line. The proof was a row at the card bottom
  before; it is now the second thing on the card.
- The contribution and the decision move into a native `<details>`
  labelled "How it was built" (German: "Wie es gebaut wurde").
  Native means keyboard accessible with no JavaScript. Enter and
  Space toggle it, it is focusable, it has a visible focus outline,
  and the chevron turns on transform only. The substance is one
  click away; the proof never hides behind it.
- The stack stays subordinate at the card bottom (`margin-top:
  auto`), so the three cards' stacks align.
- Measured card height is now 718–839px across runs (font loading
  moves the wrapping), down from ~1100px.

Two sentences were cut as duplication, in English and German, with
no fact changed. The LeaseLens decision lost its second sentence
(the registered-IoU alignment explanation, which the proof callout
already states). The ETL contribution lost its trailing clause
naming one DAG, three tasks, and four tables (the proof states it). The case pages
share both fields, so they lose the same repetition; the case pages
still state the IoU method in the Result prose and the figure note,
and the ETL counts in the Result.

### Filters (`WorkSection.tsx`)

Twenty pills wrapped into a block taller than a project card and
competed with the work. They now sit behind a disclosure, closed by
default:

- The button reads "Filter by technology" (German: "Nach
  Technologie filtern") and shows the active filter when one is set
  ("Filter by technology: Python"). It carries `aria-expanded` and
  `aria-controls`; the chevron turns on transform only.
- A Clear button ("Clear filter" / "Filter zurücksetzen") appears
  only while a filter is active.
- The results note stays visible below the bar, so the state is
  clear even while the pills are closed. The pills are not in the
  DOM while closed, so they cannot be tabbed to.
- Filtering behaviour is unchanged: the same twenty pills with the
  same counts, `aria-pressed` states, dimming, and the same
  aria-live note. Python still matches 3 of 6.

### Other

Nothing else needed changing on inspection. The CV and contact
actions do not conflict: Download CV in the header (the owner's
settled choice), Email me in the hero, and email + copy + CV in the
footer are three different places, not three competing buttons in
one view. The case pages already explain contribution, decision,
evidence and limits in one pattern; the footer links already carry
`target="_blank" rel="noreferrer"`; the back link already points
to `/#work`. The print sheet now hides the filter bar as well as
the pills.

## Verification

Production build of `refine/cards-nav-filters`, local server on
port 3000. The QA rig is `~/workspace/.baseline-qa/refine-qa.js`
(Playwright + axe) and `refine-lighthouse.js`; the Contact
diagnosis probes are `refine-contact-diagnosis.js` and
`refine-contact-timing.js`. Screenshots: 14 files in
`docs/screenshots/refine-cards-nav-filters/` (home + LeaseLens at
375/768/1440, light + dark, first viewport + full page, the Contact
active state, the filter disclosure open, and a card with its
details open). The impeccable detector ran on the four changed
source files: no findings.

- **Build / typecheck / lint / format:** `next build` passes, 11
  pages. `tsc --noEmit` clean. `eslint .` clean. Prettier clean.
- **Contact active state (53-check suite, all pass):** click
  Contact from the top highlights it at once and it stays active
  after the smooth scroll lands at the bottom; Work at the top,
  Contact at the bottom (bottom rule), exactly one item active at
  all times; Background after click and scroll; back returns to
  Contact, forward returns to Background; direct `/#contact` and
  `/#background` loads highlight correctly; Tab reaches Contact as
  the 5th stop and Enter highlights it at once, then scrolls to
  the footer; case-page Contact click navigates to `/#contact` and
  highlights Contact; mobile menu Contact click highlights at once
  and lands at the footer, menu closed; turning back mid-scroll
  (wheel up) clears the click target with no stale state; German
  locale (Kontakt, "Nach Technologie filtern", "Wie es gebaut
  wurde") behaves the same.
- **Cards:** summary and proof visible without interaction, details
  closed by default, opens and closes via keyboard, Built text
  inside, stack at the card bottom, height 718–839px.
- **Filters:** disclosure closed by default with no pills in the
  DOM; opens to 20 pills; Python selects 3 of 6 with 3 dimmed and
  the label and Clear shown; Clear resets to All; opens on mobile
  without horizontal overflow.
- **Routes:** home + all six case pages return 200. No route was
  added, removed, or renamed.
- **axe:** 0 violations on home (EN and DE) and all six case pages.
- **Lighthouse (home, two runs):** mobile 74–78, desktop 82–90;
  accessibility, best practices and SEO 100; LCP 0.8–1.1s mobile /
  0.3–0.9s desktop; CLS 0 both. The clarity baseline on the same
  rig was mobile 82 / desktop 100; the swing is total blocking
  time (710–1600ms mobile) on this VM's 1.5 shared CPUs, not a
  regression, since the branch adds no scripts and no assets, and the
  transfer weight is 550KB. The band overlaps the earlier runs.
- **Reduced motion:** cards visible at load with `transform: none`
  and no transition, smooth scrolling off (`scroll-behavior:
  auto`).
- **Layouts:** no horizontal overflow at 375/768/1440 at load or
  with the filter open. Zero console errors.
- **Links:** the five external links and the CV PDF return 200 by
  curl (checked in the clarity round; unchanged here).

## Unresolved issues and flagged claims

Carried over from the clarity redesign, not settled here:

- **Start date.** No "available from" date anywhere; only the owner
  can supply it.
- **Solo vs team.** Not claimed anywhere, because the record does
  not settle it.
- **The 20% HIT figure.** "Cutting manual logging errors by 20%"
  has no method or baseline in any source. Kept as-is, flagged.
- **86.1% IoU has no baseline.** The label says so on the card and
  the case page.
- **No per-certificate dates.** The four Google certificates share
  one period, Nov 2025 – Sep 2026.
- **Tools420 dates.** The v8 CV says Nov 2025 – Aug 2026 (10
  months); the owner says "more than a year". Unresolved, flagged.
- **Impressum and Datenschutzerklärung.** Still missing from the
  site.
- **OratorPath.** No working URL exists. The page says the
  dashboard is no longer live and the paper is the record.

## Files changed

Header: `src/components/SiteHeader.tsx`. Cards:
`src/components/FlagshipCard.tsx`. Filters:
`src/components/WorkSection.tsx`. Content: `src/content.ts`,
`src/content.de.ts`. Styles: `src/app/globals.css`. Report: this
file. Screenshots: `docs/screenshots/refine-cards-nav-filters/`
(14 files). QA rig: `~/workspace/.baseline-qa/refine-qa.js`,
`refine-qa.json`, `refine-lighthouse.js`,
`refine-lighthouse.json`, `refine-contact-diagnosis.js`,
`refine-contact-timing.js`.

The master CV at `public/Shamas_Ur_Rehman_CV.pdf` was not touched.
`PRODUCT.md` is stale (cabinet era) and was left alone, as before.
