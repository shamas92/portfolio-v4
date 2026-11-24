# Portfolio v4: clarity redesign

Branch `redesign/clarity`, from `main @ 383e49b` (the header-scroll fix).
Nothing here is merged, pushed, or deployed. The owner decides whether
it goes live.

The brief was structural, not visual. The settled identity stays
untouched: oxide red, Newsreader + Inter Tight + JetBrains Mono, the
morphing header, the DE/EN and theme toggles, Download CV. What
changed is the order of the page, what each project says about itself,
and what the header asks the reader to do.

## What changed

### Home (`/`)

The page now reads, top to bottom: hero, Featured Work, Earlier
Projects, Background, Skills / Certificates / Languages, Contact.

The hero is shorter and says the role first. The claim is "I build
data & ML systems." The ask line names the target outright:
"Looking for a working-student role in data engineering." The pill
still carries the availability ("Dresden · Working-student eligible,
20h/wk") and the status line the degree ("MSc Computer Science, TU
Dresden"). The ask no longer repeats the hours and the city, since the pill
already says both, and the status line no longer repeats Dresden
either. That trimming is what lets a project clear the fold.

The hero has one primary action now: **Email me** (a mailto). The
hero Download CV is gone. Download CV stays in the header, the owner's settled choice and the
place a hiring manager
looks for it, and it was added to Contact as well, so the CV is
reachable at both ends of the page. Both hiring reviews recommended
email as the hero action; if the owner prefers the CV there instead,
it is a one-line change.

An About paragraph opens Background. Three sentences, first person,
both locales. It sits there rather than in the hero so the hero stays
short enough for a card to clear the fold.

### Featured Work

The three projects with real evidence (LeaseLens, Sales ETL Pipeline,
OratorPath) sit directly under the hero, in a three-column grid. The
filter pills moved below the grid; they used to push the work down.
Each flagship card carries four labelled rows, the same text as its
case page: Problem, Built (the contribution), Decision, Proof. The
card and the page cannot disagree because they read the same fields.

Earlier Projects (Quality CRM, UpliftU, HITEC) follow as a compact
index with the same structure, not a second grid. The "Featured" and
"Earlier projects" subheadings mark the split.

### Case pages (`/work/[slug]`)

Every page now follows one pattern: Problem, Contribution, one
technical decision with its trade-off, Result / Evidence, Stack, Links.
The "My role" line appears only where the participation is verifiable:

- LeaseLens: "Hackathon entry, Team Shamas #4919 (Indie Developer Track)"
- Sales ETL: "Personal project"
- OratorPath: "Final-year thesis project; co-author of the published paper"
- HITEC: "IT Department intern, HITEC University (May–Oct 2025)"
- Quality CRM, UpliftU: "Academic project (2024)"

Solo-versus-team is not claimed anywhere. The record does not settle
it, so it stays out.

### Skills, certificates, languages

The capabilities matrix is gone. Skills now render as groups, and each
skill carries the projects that used it: Parquet, MinIO, Apache
Airflow and Docker Compose point at the ETL pipeline; SAM 3.1 at
LeaseLens; Laravel at Quality CRM. Skills with no shipped use on this
page gather under "No shipped use on this page" (11 items) instead of
looking like experience. Certificates render as a list of four with
the shared period "Nov 2025 – Sep 2026"; no per-certificate dates were
invented.

### Header

The nav is three items: Work, Background, Contact. Stack is out; it
is secondary content and it was costing width. The GitHub and LinkedIn
icons are out of the header; they live in Contact and the footer. The
DE/EN toggle, the theme toggle, and Download CV stay. The mobile menu
keeps the three links and adds an email link in its strip.

One CSS fix came with the simplification: the header Download CV pill
no longer underlines. The global `a` rule was underlining it; the
`.copy-btn` class now resets `text-decoration`. That was review 1's
M6, found again here.

### OratorPath: the false claim, removed

"With a live dashboard" is gone from both locales. The result now
states the truth plainly: "The dashboard is no longer live; the paper
is the record." The empty "Links" heading is gone too. The Links
block renders only when a project has links. No replacement URL was
invented, because none exists. All three URLs are still down.

### Evidence wording, tightened not strengthened

- LeaseLens: the hackathon sentence now says the entry was accepted
  and was not a top finalist, instead of implying a placement. The
  IoU label reads "registered IoU, v7 demo pairing (single-pair
  score, no baseline; measured live twice identically)". No baseline
  was invented.
- Sales ETL: the result carries the measured seed outcome (4 mock
  rows, 3 unique transactions after dedup) and the evidence note says
  no larger dataset or runtime has been measured.
- The 20% figure on the HITEC internship ("cutting manual logging
  errors by 20%") is kept as-is, per the brief, and flagged below.
  It was not strengthened.

## What QA found and fixed

Two things surfaced while verifying, both fixed on this branch.

**The flagship cards were blank on arrival.** The first card's top
sat at 698px in a 900px viewport, inside the first viewport, but the
cards stayed at opacity 0 until the reader scrolled. The scroll
reveal fires at 20% visibility, and the cards are about 1100px tall,
so only ~18% of one is visible on load. The threshold was the bug,
not the fold. `useReveal` now takes a threshold, and the flagship
cards pass 0.05. All three cards are `is-visible` with opacity 1
within 500ms of load. The 0.2 default is unchanged everywhere else.

**The mobile fold was still short.** At 375×667 the first card sat at
914px. Three trims brought it to 769px: the ask line shortened (the
hours and city live in the pill), the status line shortened (Dresden
already in the pill), the work intro shortened, and the hero and
section padding tightened on phones. The Work heading now sits at
588px on a 667px-tall phone, and the first card clears the fold on a
modern phone (375×844: card top 753px). It does not clear the fold on
the small 667px viewport. Further compression would cramp the hero,
so 769px stands as the measured number.

## Verification

Production build of `redesign/clarity`, local server on port 3000.
The QA rig is `~/workspace/.baseline-qa/redesign-clarity-qa.js`
(Playwright + axe), `redesign-clarity-lighthouse.js`, and two probes
for the reveal and the fold. Screenshots: 27 files in
`docs/screenshots/redesign-clarity/` (home + all six case pages at
375/768/1440, light + dark, first viewport + full page where it
matters). The impeccable detector ran on all 13 changed source files:
no findings.

- **Build / typecheck / lint / format:** `next build` passes, 11
  pages. `tsc --noEmit` clean. `eslint .` clean. Prettier clean.
  (There is no `typecheck` script in `package.json`; `tsc --noEmit`
  was run directly.)
- **Routes:** home + all six case pages return 200. No route was
  added, removed, or renamed.
- **Links:** 18 hrefs across the seven pages, all resolved. External
  checks by curl: github.com/shamas92, github.com/shamas92/leaselens,
  github.com/shamas92/sales-etl-pipeline, linkedin.com/in/shamasrehman,
  youtu.be/le_KM97lm5w, all 200. CV PDF 200. The OratorPath page
  links nothing dead, because it links nothing.
- **Fold:** first flagship card top at 1440×900 is 682px and visible
  (opacity 1). At 768×1024 it is 784px. At 375×844 it is 753px. At
  375×667 it is 769px, below the fold, with the Work heading at 588px. No
  horizontal overflow at any width.
- **Header:** zero spills in the scrolled pill at 1440, 900, and
  768px. The header-scroll fix holds after the nav simplification.
  Settled header height equals the spacer (92px desktop, 86px at
  375px), so the header does not overlap content.
- **Anchors:** with instant scrolling, Work, Background, and Skills
  land with their section top 12px below the header bottom
  (96px vs 84px). Contact lands at the page end, which is normal.
- **Keyboard:** the first ten Tab stops are Skip to content, the
  wordmark, Work, Background, Contact, Download CV, DE, EN, theme
  toggle, Email me. Every one has a visible outline. No Stack, no
  social icons in the tab order.
- **Focus:** visible on all stops (outline present). No focus trap
  in the mobile menu.
- **Reduced motion:** with `prefers-reduced-motion: reduce`, all
  three flagship cards are opacity 1 with no transform at load. The
  stylesheet already shows reveal targets instantly under reduced
  motion.
- **Contrast:** the new classes use the existing tokens: ink
  (17.52:1 light) for the ask and About, muted (7.25:1 light,
  7.76:1 dark) for row labels and the "no shipped use" line. All
  above 4.5:1. The tokens themselves were verified in the earlier
  rounds.
- **axe:** 0 violations on home (EN and DE) and all six case pages.
- **Lighthouse (home):** mobile 82, desktop 100; accessibility 100,
  best practices 100, SEO 100, both form factors. LCP 0.8s mobile /
  0.3s desktop. CLS 0 in both. Mobile performance rose from 72–75
  to 82. Mobile total blocking time 710ms is the remaining drag, from
  Next.js hydration, unchanged by this redesign.
- **CLS, measured two ways:** Lighthouse reports 0. A scroll-based
  probe reports 0.028, under the 0.1 threshold. The shifts are the
  header morphing on scroll and the webfonts swapping in on load,
  both pre-existing; no content below the header shifts.

## Unresolved issues and flagged claims

These are for the owner, not for this branch to settle.

- **Start date.** The content still has no "available from" date.
  `contentTodos` holds only "available-from". The hero says he is
  looking, not when he can start. Only the owner can supply it.
- **Solo vs team.** Not claimed anywhere, because the record does
  not settle it for LeaseLens, the ETL pipeline, or OratorPath. If
  the owner confirms he built any of them alone, the role lines can
  say so.
- **The 20% HIT figure.** "Cutting manual logging errors by 20%"
  has no method or baseline in any source. It is kept as-is and
  flagged. The reviews suggested attributing it ("the CV credits
  this work with…") or dropping the number; either is the owner's
  call.
- **86.1% IoU has no baseline.** The label now says so on the card
  and the case page. A baseline would need a measurement that does
  not exist.
- **No per-certificate dates.** The four Google certificates share
  one period, Nov 2025 – Sep 2026. Individual dates were not in
  the record.
- **Tools420 dates.** The v8 CV says Nov 2025 – Aug 2026 (10
  months); the owner says "more than a year". Unresolved, flagged,
  not decided here. The freelance entry is not on the portfolio.
- **Mobile fold at 375×667.** First card at 769px, below the fold
  on the smallest phones. Visible on modern phones and on desktop.
  See "What QA found" above.
- **Impressum and Datenschutzerklärung.** Still missing from the
  site. Out of scope for this branch, carried over from v4.
- **OratorPath.** No working URL exists. The page now says so. A
  live link needs the middleware fixed and the app redeployed, which
  is a separate job.

## Files changed

Content: `src/content.ts`, `src/content.de.ts`. Components:
`src/components/FlagshipCard.tsx`, `src/components/Reveal.tsx`,
`src/components/WorkSection.tsx`, `src/components/SiteHeader.tsx`,
`src/components/SiteFooter.tsx`, `src/components/CaseStudy.tsx`,
`src/components/Background.tsx`, `src/components/SkillsSection.tsx`
(renamed from `CapabilitiesMatrix.tsx`), `src/components/Todo.tsx`
(deleted). App: `src/app/layout.tsx`, `src/app/page.tsx`,
`src/app/globals.css`. Report: this file. Screenshots:
`docs/screenshots/redesign-clarity/` (27 files).

The master CV at `public/Shamas_Ur_Rehman_CV.pdf` was not touched.
`PRODUCT.md` is stale (cabinet era) and was left alone, as before.
