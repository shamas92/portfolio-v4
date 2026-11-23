# PR: Rebuild the portfolio as the Engineering Spec Sheet

Branch `redesign/spec-sheet`, from `main @ deaf356`. Local only — do
not merge, push, or deploy until reviewed.

## What this does

The Notebook design becomes a technical spec sheet. One sticky header
replaces the `Contents` rail. The hero states the claim and the
availability, then gets out of the way. Work splits into three flagship
cards with drawn SVG diagrams and two earlier systems in a compact
index. A stack filter dims non-matching projects. A capabilities matrix
groups all 35 technologies. Background becomes a two-column grid with
a metadata strip for languages and certificates. Dark mode arrives
with a manual toggle that persists in `localStorage` and never flashes
on load.

Fonts move to Geist with JetBrains Mono for technical metadata. The
accent is Technical Cobalt. Motion is CSS only; framer-motion was not
installed.

## What did not change

Every project, link, date, metric, quote, credential, and bio detail
is preserved. `docs/spec-sheet-integrity.md` confirms zero unexplained
differences against the Notebook build: 138 sentences checked, 136
preserved, 2 allowlisted removals, 6 allowlisted additions, 6 of 6
links and 2 of 2 images kept. The 86.1% registered IoU and the 197
tests stay separate facts. The three open TODO(content) items (CV file,
availability wording, OratorPath dashboard URL) stay open.

## Verification

- Lighthouse 13.6.0: home desktop 99, home mobile 77–80 (three runs),
  LeaseLens desktop 100, LeaseLens mobile 96. Accessibility, Best
  Practices, and SEO are 100 everywhere. CLS is 0 everywhere.
- The 95 mobile Performance target is not met on the home page. TBT
  runs 790–1070ms under throttling and is the Next.js framework
  baseline, not the page's own scripts.
- axe-core: 0 violations, 41 passes, on home and LeaseLens in light
  and dark.
- No horizontal overflow at 320–1920px, in landscape, or at 200%
  zoom. Zero targets under 44px. Keyboard pass, no-JS pass, reduced
  motion pass.
- One real bug was found and fixed in review: the theme toggle caused
  a React 418 hydration mismatch after reload. Commit `b4d4ccb`
  explains it.

Full numbers, the contrast table, the matrix mapping, and the known
nits are in `docs/spec-sheet-report.md`. Screenshots (home and
LeaseLens, 390/768/1440, light and dark) are in
`docs/screenshots/`.

## Files changed

- `src/content.ts`: tier-2 scope lines, proof callouts, first-person
  HIT bullet
- `src/app/layout.tsx`, `src/app/globals.css`: tokens, Geist and
  JetBrains Mono, theme script, reveal gating
- `src/components/SiteHeader.tsx`, `ThemeToggle.tsx`: sticky header,
  scroll-spy, toggle
- `src/components/SpecAssets.tsx`: the three SVG diagrams
- `src/components/WorkSection.tsx`, `FlagshipCard.tsx`,
  `CapabilitiesMatrix.tsx`, `Background.tsx`, `CopyEmailButton.tsx`,
  `Reveal.tsx`: the new home sections
- `src/components/Rail.tsx`, `ProjectRow.tsx`, `StackGroup.tsx`,
  `Timeline.tsx`: deleted
- `scripts/content-integrity.mjs`, `docs/spec-sheet-integrity.md`
- `docs/spec-sheet-report.md`, `docs/spec-sheet-pr.md`
- `docs/screenshots/`: 12 new screenshots
- `public/og.png`: restyled to the spec sheet

## Review notes

The home mobile Performance number is the one honest disappointment.
If the 95 target matters more than the filter and toggle, the lever is
less client JavaScript on the home page, not smaller images. The
LeaseLens mobile score of 96 shows the framework alone is not the
ceiling.
