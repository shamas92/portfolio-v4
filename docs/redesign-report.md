# Redesign report — Engineering Notebook

**Branch:** `redesign/notebook` (from `main` @ `b7c0689`).
**Date:** 2026-11-23. **Live site still serves the Annotated Proof design**:
this branch is local only: not merged, not pushed, not deployed.

## What changed

The Annotated Proof design is rebuilt as an engineering notebook: a
well-typeset report with one reading column, a narrow left rail
holding the sticky section index, hairline rules instead of boxes,
and evidence attached to every claim. No terminal aesthetic, no
gradients, no stock template patterns.

- **Layout:** desktop grid `200px rail | 1fr reading column`; mobile
  single column, no rail (the header nav covers the same links).
  Section order is now Hero, Work, Background, Stack, Contact.
- **Type:** Newsreader (headings, case-study quotes) + Inter Tight
  (body/UI) + JetBrains Mono (years, figures, labels only), via
  `next/font`, self-hosted, latin + latin-ext, display swap,
  metric-matched fallbacks. The italic Newsreader for quotes loads
  only on case pages.
- **Colour:** oxide red: #9A3324 on paper #FAF7F2 (light),
  #E07856 on paper #16130F (dark). Accent is used only for links,
  focus rings and proof figures. Theme follows the system setting;
  there is no toggle.
- **Hero:** name, positioning line verbatim, status line
  ("MSc Computer Science, TU Dresden, Dresden, Germany"), a proof
  strip from structured LeaseLens facts ("86.1% registered IoU ·
  197 tests · v1.0.0"), "See projects" + copy-email actions.
- **Work:** the same five rows, each linking to its `/work/[slug]`
  page. Case pages now use six blocks (Problem, Architecture,
  Outcome, Evidence, Stack, Links), and a block is omitted when
  the project has no verified content for it. Case links carry
  descriptive labels ("LeaseLens on GitHub").
- **Background:** timeline, newest first, dates in monospace;
  "Spoken languages" replaces the clashing "Languages" heading.
- **Footer:** email with copy button, GitHub, LinkedIn, location
  once ("Dresden, Germany"), footer line "Every claim on this page
  carries its evidence."
- **OG image** restyled to the notebook direction (Newsreader name,
  Inter Tight claim, oxide-red wash and rule) by
  `scripts/make-og-image.py`.

## Lighthouse (local production build, Chrome 156, throttled)

Live-site Lighthouse was not possible from this VM (local Chrome
cannot reach the internet). All numbers are the local production
build; the live site was not re-measured.

| Page | Perf | A11y | Best practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Home, mobile (run 1) | **81** | 100 | 100 | 100 | 1.0 s | 0 | 820 ms |
| Home, mobile (run 2) | **88** | 100 | 100 | 100 | 0.9 s | 0 | 470 ms |
| Home, mobile (run 3, final build) | **89** | 100 | 100 | 100 | 0.8 s | 0 | 450 ms |
| LeaseLens, mobile (run 1) | **82** | 100 | 100 | 100 | 1.0 s | 0 | 720 ms |
| LeaseLens, mobile (final build) | **86** | 100 | 100 | 100 | 0.9 s | 0 | 560 ms |
| Home, desktop (final build) | **99** | 100 | 100 | 100 | 0.2 s | 0 | 100 ms |

**The 95 mobile Performance target is not met.** The limiter is
Total Blocking Time, which swings 450–820 ms between runs on the
same build: the Next.js framework baseline under 4x CPU
throttling, not the page's own code. The site's own client JS is
two small components (disclosures, copy button); the bundle
analysis below shows the rest is framework. LCP is 0.8–1.0 s,
CLS is 0, and desktop is 99–100. INP is not reported by lab
Lighthouse in this version, so it is not measured.

## Bundle (local production build)

Home mobile transfers 481 KiB total: fonts 309 KiB (8 woff2 files),
scripts 144 KiB (7 requests), stylesheet 8 KiB, document 8 KiB,
no images above the fold, no third-party requests. The biggest
single file is an Inter Tight woff2 at 88 KiB.

Top five JS contributors by parsed size (webpack build via
`ANALYZE=true next build --webpack`; the analyzer does not run
under Turbopack, so this is an attribution build, not the shipped
build):

1. `react-dom-client.production.js`: 397 KiB parsed (React DOM)
2. `router.js`: 25 KiB (Next.js app router)
3. `react-server-dom-webpack-client`: 24 KiB (Next.js RSC client)
4. `cache.js`: 20 KiB (Next.js segment cache)
5. `constants.js`: 19 KiB (Next.js)

One React DOM file is half the parsed JS; everything else is small
Next.js runtime pieces. The site's own code is a few KiB. There is
nothing to tree-shake here: the JS weight is the framework floor.

Fonts: 8 files load on the home page (latin + latin-ext subsets
for Newsreader, Inter Tight and JetBrains Mono, plus the italic
Newsreader). The latin-ext subsets load even though no page
contains a latin-ext character, so Chrome fetches both subsets for
these variable fonts. The cost is transfer only (display: swap,
so text renders with the fallback first); LCP is unaffected.
ä ö ü ß were verified to render in all three families by injecting
test text and checking the loaded faces.

## Images

- `sizes` fixed to `(min-width: 1024px) 720px, 100vw` and the
  figure capped at 720 px, so `sizes` now matches the rendered
  width. The w=3840 src fallback is gone: `deviceSizes` is capped
  at 1920.
- Delivered widths measured: 390 px viewport → w=640 for a 358 px
  render; 768 px → w=828 for a 720 px render; 1024–1920 px →
  w=750 for a 720 px render. No request above w=1920 anywhere.
- Both evidence images are reused unchanged, with their captions
  and alt text verbatim. Both are lazy-loaded.

## Contrast (computed, WCAG ratios)

All text pairs pass AA (4.5:1) in both themes. The tightest is
ink-muted on the accent wash: 4.93 light, 5.55 dark. The 2 px
focus ring meets 3:1 against paper in both themes (6.84 light,
6.16 dark) and against the surface (7.19 / 5.76). The hairline
rules are decorative separators (1.41 light, 1.49 dark) and carry
no contrast requirement.

| Pair | Light | Dark |
| --- | --- | --- |
| ink on paper | 16.54 | 15.89 |
| ink-muted on paper | 5.66 | 6.95 |
| accent on paper | 6.84 | 6.16 |
| ink on surface | 17.40 | 14.85 |
| ink-muted on surface | 5.96 | 6.49 |
| accent on surface | 7.19 | 5.76 |
| ink on accent-wash | 14.41 | 12.69 |
| ink-muted on accent-wash | 4.93 | 5.55 |
| accent on accent-wash | 5.96 | 4.92 |
| paper on ink (primary button) | 16.54 | 15.89 |
| paper on accent (primary button hover) | 6.84 | 6.16 |

## Accessibility

- **axe:** 0 violations on home and LeaseLens, light and dark
  (37 passes home, 39 LeaseLens).
- **Keyboard:** tab order follows visual order; skip link is first
  and lands visibly (top 8 px, 47 px tall after the 180 ms
  transition). Claim buttons open on Enter, close on Escape, and
  focus returns to the trigger. Escape now also closes a note when
  focus is on its Close button (the baseline gap, fixed and verified). No traps.
- **Tap targets:** claim buttons 47 px tall, row title links 44 px,
  site name 44 px, rail links ≥ 44 px wide after padding. The five
  remaining sub-44 px-wide targets are inline text links inside
  comma-separated skill lists (27–44 px wide, 44 px tall); width
  follows the text, which the WCAG 2.5.8 inline exception covers.
- **No-JS:** h1, all five work rows, hero claim and proof strip
  render with JavaScript disabled.
- **Reduced motion:** hero sweep and note animation are removed;
  scroll-behavior is auto; final states shown.
- **Print:** single column, light theme forced, link URLs shown,
  no animations.
- **Not checked:** a real screen-reader pass (VoiceOver/NVDA),
  real-device touch behaviour, external link liveness, INP as a
  field metric.

## Responsive

No horizontal overflow at 320, 360, 390, 768, 1024, 1280, 1440 and
1920 px, in portrait and landscape (844×390, 1024×768), at 200%
zoom, or in dark theme. Safe-area insets are respected via
`max()` padding. Screenshots at 390, 768 and 1440 px in light and
dark are in `docs/screenshots/` (home + LeaseLens, full page).

## Content integrity

`scripts/content-integrity.mjs` compares `main:src/content.ts`
against the new content and the fresh production build's rendered
HTML, sentence by sentence, plus links and images. Result: **zero
unexplained differences**: 136 old sentences checked, 133
preserved, 3 allowlisted removals, 5 allowlisted additions; 6/6
links and 2/2 images kept. Full report: `docs/content-integrity.md`.

## Changelog mapped to the ten problems

| # | Problem | This redesign |
| --- | --- | --- |
| 1 | Cabinet metaphor | Gone, including the last internal residue: the `specimen` data key is renamed to `evidence` and no longer appears in the RSC payload. |
| 2 | Projects selectable in three places | Unchanged: two paths (Work rows + Stack skill links), the second a skill→project path, not a duplicate list. |
| 3 | Only one project visible at a time | Unchanged: all five rows visible at a glance. |
| 4 | Proof is uneven | Structure now fully unified: the same six blocks on every case page. Depth still differs because the verified facts differ (LeaseLens has figure, quote, registry, limits, image; the others have less). The gap is a lack of verified facts, not presentation. |
| 5 | Hero has no status, location, or strongest proof | **Fixed.** Status line renders, location renders once in the footer, proof strip renders LeaseLens figures. CV download and availability line are still open TODO(content) items. |
| 6 | Background buried under Stack | **Fixed.** Order is now Hero, Work, Background, Stack, Contact. |
| 7 | Stack is a flat list of ~30 items | Unchanged by design: the same 5 groups and 31 skills, no bars, chips or percentages. The 18 unlinked skills still carry no signal beyond their name. |
| 8 | Performance problems | `sizes` fixed, w=3840 fallback removed, CLS 0, LCP 0.8–1.0 s. Mobile Performance 81–89 across runs; **the 95 target is still not met**; TBT is the framework baseline under throttling. Fonts are slightly heavier than baseline (309 KiB, 8 files, vs 253 KiB, 6 files) because of the third family. |
| 9 | Motion and touch problems | **Fixed.** Skip link moves by transform (no layout property animated). Claim buttons 47 px, row titles 44 px, site name 44 px, rail links ≥ 44 px wide. Escape closes notes from the Close button. |
| 10 | Content defects | **Fixed.** "Languages" clash resolved ("Spoken languages" in Background). Duplicate Dresden fixed. Footer line reworded without the metaphor. |

## What was deliberately left out

- **No manual theme toggle**: user decision 4: system setting only.
- **No in-place expanding rows**: user decision 1: the five
  `/work/[slug]` pages stay.
- **No new facts.** Three TODO(content) items are still open: the CV
  file, the availability line wording, the OratorPath live dashboard
  URL. Nothing was invented to fill them.
- **No test runner.** The content-integrity check is a plain Node
  script and the keyboard/axe checks run in the Playwright QA rig;
  adding a test framework for two client components was heavier
  than the value. The disclosure keyboard/aria behaviour and the
  no-JS render are covered by the QA script
  (`~/workspace/.baseline-qa/notebook-qa.js`), not by a test suite.
- **No analytics, no third-party scripts**: unchanged from baseline.

## Things found while building

- **Stale Turbopack CSS cache:** after one `globals.css` edit, two
  incremental builds kept serving the old chunk. A clean rebuild
  (`rm -rf .next`) picked the change up. If a style edit ever
  seems to have no effect, rebuild clean before debugging the CSS.
- **Claim highlight bleed:** the 44 px claim buttons overflow
  their line box, so a box border struck through the next line's
  text and the wash tinted neighbouring prose. Fixed with a text
  underline (follows the baseline) and `background-clip:
  content-box` (wash only behind the claim's own words).
- **Work-row grid bug:** the year and title shared the 72 px
  track, so the title overflowed into the outcome text on desktop.
  Found by looking at a screenshot, not by any automated check.
  Restructured to year + main column; the title is now an h3.
- **Skill-list commas** dropped below the 44 px-tall skill links.
  Each list item is now a flex row so the comma sits on the link's
  baseline.
- **Bundle analyzer needs webpack:** `@next/bundle-analyzer` does
  not run under Turbopack (Next 16 default). Reports need
  `ANALYZE=true next build --webpack`.
- **PRODUCT.md is stale** (still describes the cabinet world). It
  was left untouched per the impeccable skill's rule: report
  staleness, don't repair it as a side effect. DESIGN.md was
  rewritten for this direction.
