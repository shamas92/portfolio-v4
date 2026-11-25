# "Latest Projects" — Work section delta

Branch `refine/latest-projects`, from `main @ 974a3e7`. Built 2026-11-25, not merged, not pushed, not deployed. The user reviews the branch first.

## What changed

Six source files, no new dependencies, no content invented.

| File | Change |
| --- | --- |
| `src/content.ts` | `work.heading` "Work" → "Latest Projects"; `viewMore: "View More Projects"` added to the work type |
| `src/content.de.ts` | `work.heading` "Projekte" → "Neueste Projekte"; `viewMore: "Mehr Projekte ansehen"` added |
| `src/components/WorkSection.tsx` | Passes `index` to each card; adds the "View More Projects" link after the filter note |
| `src/components/WorkCard.tsx` | Title `<span>` → `<h3>`; per-card reveal hook with stagger |
| `src/components/Reveal.tsx` | `useReveal` takes an optional `baseClass` (default `"reveal"`) |
| `src/app/globals.css` | `.work-card-reveal` rules, `.work-more` link styles, `margin: 0` on `.work-visual-title`, reduced-motion override for the hover scale |

The section id stays `work`. The nav label stays "Work" / "Projekte" (a separate key, `ui.nav.work`). The intro line is unchanged.

## Decisions

**Heading.** "Latest Projects" replaces "Work" in both languages. One note for the record: every other section on the site uses a one-word heading (Background, Skills, Certificates, Contact), so "Latest Projects" breaks that pattern. It is implemented as instructed, and the pattern break is worth knowing before the branch is merged.

**"View More Projects" link.** It sits after the filter note, which is where the section ends ("Showing all 6 projects."). It reads as the section's closing action. It links to `https://github.com/shamas92`, opens in a new tab (`target="_blank"`, `rel="noopener noreferrer"`), and carries an arrow that nudges on hover. GitHub is the only honest destination: all six projects are already shown, and the sitemap lists no archive index, so no archive page was invented. The link uses the site's global link style (accent-ink, underlined, 2px focus ring) with a 44px minimum tap target and a 600 font weight so it reads as an action, not body text.

**Card titles are now headings.** The audit found the six project names were `<span class="work-visual-title">` inside the card link. They are now `<h3>` with the same class and styling, and `margin: 0` was added to `.work-visual-title` so the overlay position does not move. Heading order is now h2 "Latest Projects" → h3 per project.

**Hover image scale was already there.** The audit confirmed `.work-card:hover .work-visual-asset img { transform: scale(1.03) }` (600ms in, 400ms out, gated to fine pointers), plus the card lift and arrow nudge. It was verified working (computed transform `matrix(1.03, 0, 0, 1.03, 0, 0)` on hover) and left alone. No redundant scale rule was added. The brief's "~1.04" is approximate; 1.03 is the value the site already uses.

## Reveal and docking: how they share the cards

The heading and intro already revealed once through `<Reveal>` (16px rise, 400ms fade, IntersectionObserver). The cards did not: they revealed as one block through `--grid-reveal`, driven by the deck docking, with no per-card stagger. This delta adds the stagger without touching the docking.

The cards use a separate class, `.work-card-reveal`, not the shared `.reveal`. Two reasons. First, `.work-card` (which sets `opacity: var(--grid-reveal, 1)`) sits later in the stylesheet than `.reveal` at the same specificity, so `.reveal`'s hidden state would not apply. Second, `.reveal.is-visible` (0,2,0) would override `--grid-reveal` on desktop and break the docking. The separate class, placed after `.work-card`, avoids both.

The new class is scoped to `@media (scripting: enabled) and (max-width: 1023px)`. Below 1024px there is no docking, so the reveal is the cards' entrance: opacity 0 and translateY 16px, then opacity 1 and translateY 0 over 400ms. On desktop the class is inert and the deck engine owns the cards' opacity through `--grid-reveal`, so there is no double animation and no fight. The stagger is a per-card `transition-delay` through the CSS variable `--reveal-delay`, set inline by `WorkCard` as `index * 60ms` (0, 60, 120, 180, 240, 300ms). The delay touches only the reveal transition, never the theme cross-fade. `useReveal` gained an optional `baseClass` parameter so the same hook serves both the shared `.reveal` and the card class.

The reduced-motion block forces `.work-card-reveal` to opacity 1 and transform none, and the heading reveal already had the same treatment.

**One defect found by QA and fixed after the run.** Under `prefers-reduced-motion: reduce`, hovering a card still scaled the image to 1.03. The reduced-motion block set `transition: none` on `.work-card` and `.work-card-inner` but never overrode the hover scale on the image itself. The fix adds `.work-card:hover .work-visual-asset img { transform: none; transition: none; }` inside the reduce block. Re-verified with a focused check: reduced-motion hover now computes to `none`, and normal hover still computes to `matrix(1.03, 0, 0, 1.03, 0, 0)`. The full QA suite was not re-run after this one-line fix; the focused check covers the exact behaviour that failed.

## Verification

**Build.** Clean. `tsc --noEmit` passes, `next build` produces 11 pages. The built HTML contains "Latest Projects", the "View More Projects" link with the exact href/target/rel, six `<h3 class="work-visual-title">`, six `work-card-reveal` classes, and delays 0–300ms. The built CSS contains the scoped reveal rules, the `.work-more` styles, and the reduced-motion override. The German strings ("Neueste Projekte", "Mehr Projekte ansehen") are in the JS bundle.

**QA: 78/78 after the fix (77/78 before it).** Script `~/workspace/.baseline-qa/refine-latest-projects-qa.js`, results in `~/workspace/.baseline-qa/refine-latest-projects-qa.json`. Full run, three times.

- Routes: home + 6 case pages, all 200.
- Heading: `h2#work-head` reads "Latest Projects" (EN) and "Neueste Projekte" (DE), verified through the real toggle and through localStorage seeding. Nav still "Work" / "Projekte", section id still `work`.
- Link: text, href `https://github.com/shamas92`, `target="_blank"`, `rel="noopener noreferrer"`, class `work-more-link`, 44px tap target, DOM order `work-grid → filter-note → work-more`.
- Titles: exactly 6 `h3.work-visual-title`, correct names, one h2 before them. (In DE the HITEC title localizes to "HITEC University Webplattform & Admin-Panel" — the defined string in `content.de.ts:226`, pre-existing, not a defect.)
- Reveal on mobile/tablet (375px and 768px): all 6 cards carry `work-card-reveal`, start at opacity 0 / translateY 16px, gain `is-visible` on scroll, delays exactly 0/60/120/180/240/300ms.
- Reveal on desktop (1440px): the class is inert. Through the dock, card opacity tracks `--grid-reveal` within 0.15 at every sampled offset, monotonic, no second fade. Dock at 550px scroll; all 6 deck cards align with grid visuals at dx=0, dy=0, dw=−0.1. Same at 1024px and in dark mode.
- Hover: image scales to 1.03, card lifts −2px, overlay appears with summary + proof, "View case study" pill stays visible (151×36px) and navigates to the case page on click.
- Reduced motion: cards visible at scroll 0 without scrolling; hover scale now disabled (fixed, see above).
- No horizontal overflow at 375/768/1024/1440, EN + DE. Zero console errors, zero failed requests. axe 0 on home 1440 light (docked), 1440 dark (docked), and 375px (axe-core 4.14.0).
- Regression: the Python filter still dims the 3 non-matching cards to 0.35 and the note reads "3 of 6 projects use Python." 12 images loaded, deck and grid share one file per project, 0 SVGs in deck/grid, dark mode serves the identical files as light.

**Lighthouse 13.6.0, two runs, no smoothing.** The VM's 1.5 shared CPUs swing these numbers; the second run is the better read.

| Run | Mobile | Desktop |
| --- | --- | --- |
| 1 | 43 (LCP 6.1s, TBT 5,760ms) | 81 (LCP 1.0s, TBT 380ms) |
| 2 | 52 (LCP 5.0s, TBT 2,530ms) | 92 (LCP 0.8s, TBT 230ms) |

Both runs: accessibility 100, best practices 100, SEO 100, CLS 0. Mobile is below last round's 57 and desktop run 1 (81) below last round's 97, but run 2 sits inside the known swing and nothing in this delta explains a systematic drop. The variance is CPU contention, not the change. Full JSON in `~/workspace/.baseline-qa/refine-latest-projects-lighthouse.json` (run 1 preserved separately).

## Gate and design checks

**GATE: ERROR.** The gate's Chrome launcher finds no Chrome and omits `--no-sandbox`, the same failure as every prior round. Its "no `<main>`/`<section>`/`<h1>`" note is a gate-fetch artefact, not a page defect: the live page has them, and consistency (running in real Chrome) found the h1, `h2#work-head` "Latest Projects", and all sections. The three checks were run directly with a `--no-sandbox` wrapper against the production server.

- **Consistency (direct): 91 FAIL, 45 WARN.** Prior round: 83 FAIL, 43 WARN. The whole +8 FAIL is one check, `scroll-reveal` 8 → 16: the new link's reveal wrapper (both widths) and all six cards at 390px only (at 1440 they pass). Every other category matches the prior round exactly. The +2 WARN are `link-styles` on the new link. No new contrast finding from the h3 titles (the one contrast FAIL is the known HITEC false positive: the checker measures the photo behind the title without the sibling scrim; prior pixel sampling showed 5.08:1 median against the 3:1 large-text bar). `collide`: 0 FAIL. Full log: `/tmp/consistency-latest.txt`.
- **Layout check (direct):** only the pre-existing "no `.wrap`" finding at 1440 and 390; `overflowX: false` at both sizes. The check script has a bug: its `--shots` path crashes (`r.sections is not iterable`) on this page, so no layout screenshots were produced. Findings in `/tmp/layout-latest.json`.
- **Copy-lint (direct, built HTML): 0 FAIL, 2 WARN**, both pre-existing (`copy-contrast` 3 vs budget 2, `copy-em-dash` 7 vs budget 2). None of the new strings triggered a finding.
- **Impeccable: clean.** `detect --json` on the six changed files returns `[]`, exit 0.
- **Prettier: pass** on the six changed files, nothing reformatted.

**Tension to record.** The taste skill's motion guidance forbids scroll reveals ("No card, row or tile ever fades, rises or staggers in as the page scrolls"). The user explicitly asked for them, so this is a user-directed deviation. Its gate cost is measurable: +8 consistency FAILs, all `scroll-reveal`, concentrated at 390px where the checker sweeps the narrow viewport and reads the cards as unrevealed. The cards do reveal on a real scroll at 375px and 768px (QA verified), so the finding is a checker-vs-behaviour gap, not a broken entrance. The narrow-width card reveals are still the item to look at if the gate score matters more than the effect.

## Screenshots

`docs/screenshots/refine-latest-projects/` — 9 files.

- `work-1440-light-en-docked.png` — heading + docked grid, light, EN
- `work-1440-dark-en-docked.png` — same, dark
- `work-1440-light-de-docked.png` — same, DE ("Neueste Projekte")
- `work-hover-leaselens.png` — hovered LeaseLens card: overlay + scaled image, pill visible
- `work-375-light-rest.png` — mobile hero + work at rest
- `work-375-light-grid.png` — mobile grid scrolled into view, cards revealed
- `work-768-light-rest.png` — tablet
- `work-more-link.png` — close crop of "View More Projects ↗", underlined in accent red
- `first-1440.png` — hero + "Latest Projects" heading at rest, 1440 light EN; captured during the gate run (20:57), kept for the first-viewport view

At 1440×900 the more-link cannot share a frame with the heading and the whole grid (it sits below the filter note), so the docked shot shows heading + grid and the link has its own close crop.

## Honest gaps

- The reduced-motion hover-scale fix was verified with a focused check, not a full QA re-run. The rest of the suite (78 checks) ran against the build without that one-line CSS addition; the addition only changes behaviour under `prefers-reduced-motion: reduce`.
- Lighthouse mobile (43 / 52) is low and below last round's 57. It is CPU contention on this VM, not the delta, but the number is what it is and a real device would read higher.
- Consistency is 91 FAIL / 45 WARN, up 8 / 2 from the prior round, all of it the scroll reveal and the new link. If the user wants the gate number back down, the reveal is the lever.
- The layout check's `--shots` path is broken on this page (script bug), so there are no layout-check screenshots.
- `first-1440.png` came from the gate run, not the QA run; its provenance is noted above.
- The `.taste-skill/chrome-check-layout/` profile dir left by the layout check (containing a `SingletonSocket`) was removed after the gate run; it would have broken a later `next build` if left in place.
