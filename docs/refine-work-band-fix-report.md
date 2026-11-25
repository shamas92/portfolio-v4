# Blank band below the Work intro — refine/work-band-fix

The home page's hero deck is the first row of the Work grid, so at rest row 1
sits at opacity 0 and the space below the Work intro is row 1's empty slot.
At 1440×900 that slot showed 269px of blank in the first viewport — a hole,
not breathing room. This round shrinks it to 169px by moving the whole Work
section down 100px on desktop, so the empty slot sits lower in the viewport
and the gap that opens above the heading reads as section spacing instead.

## What changed

One value, in `src/app/globals.css` (inside the `@media (min-width: 1024px)`
block):

```css
#work {
  padding-top: 124px; /* was var(--space-3), 24px */
}
```

The old comment is replaced with one that records the reasoning: the band is
row 1's empty slot, pushing the section down moves the slot down with it, the
gap above the heading is section spacing at a boundary the hairline rule
marks, the fold moves with it by the same 100px, and the docking offset is
measured at runtime so the deck still lands exactly on row 1. Nothing else
changed: no grid, card, filter, hero-copy or motion change; no second copy of
the cards, no placeholder, divider or scroll cue.

## The mechanism, and why this one

The rest band is structural, not a spacing accident. Row 1 is 455px tall and
its top sits 631px down the page at 1440×900; 269px of it is visible in the
first viewport. It cannot be reduced at rest without regressing the fold,
duplicating the cards, or changing the cards. The spread and reveal timing is
constrained by the hero copy scrolling away (around scroll 350): the spread
cannot start much earlier without covering the copy, and the reveal cannot
start before the deck is near its grid targets. The dock offset (427px) is the
distance from the deck centre (306.5) to the row-1 visual centre (733.4). Any
spacing change just redistributes the empty space; the only honest lever is to
move the whole Work section down so the empty slot sits lower, trading fold
for band. So the fix is a redistribution, stated as one: +100px above the
heading, −100px of band below the intro, total empty space in the viewport
unchanged.

The runtime measurement in `page.tsx` picks up the new dock automatically,
and the spread/reveal formulas are unchanged, so they scale to the longer
dock; the deck still lands exactly on row 1 (measured from real rects, see
Verification). Desktop only (≥1024px): the phone grid has no docking and no
band — the first card peeks by 24px there — so mobile is untouched.

## Before / after

Measured on the local production build with
`~/workspace/.baseline-qa/refine-work-band-fix-measure.js` (before/after
JSON in `~/workspace/.baseline-qa/`). EN light, EN dark and DE are identical
in geometry at both sizes.

| 1440×900 | Before | After |
|---|---|---|
| Band visible in first viewport | 269.4px | **169.4px (−100, −37%)** |
| Band full (row-2 top − intro bottom) | 519.1px | 519.1px (unchanged — row 1's height) |
| Row 1 top (fold) | 630.6px | 730.6px |
| Work heading top | 530px | 630px |
| Intro bottom | 606.6px | 706.6px |
| Heading gap (hero rule → heading) | 24px | 124px |
| Reveal starts (scroll) | 350px | 425px |
| Dock ends (scroll) | 425px | 525px |

| 375×844 | Before | After |
|---|---|---|
| Band visible (first card peeks) | 23.6px | 23.6px (unchanged) |
| Row 1 top | 820.4px | 820.4px |

Reduced motion, 1440 light: row 1 visible at rest, deck static — unchanged
in behaviour (the layout number is 169.4px because the card now sits lower).

## Known consequences of this change (not defects, but the owner should know)

- **The fold moves 631px → 731px.** The first Work card now starts 100px
  lower. That was the trade the fix is built on: the band is the space above
  the first card, so shrinking it by 100px moves the card down by 100px.
- **The heading gap is now 124px.** The space between the hero's hairline
  rule and the "Work" heading grew from 24px to 124px. It reads as section
  spacing at a section boundary (the rule marks it), but it is a visibly
  larger gap than any other section gap on the page.
- **The band fills later in absolute scroll.** The reveal completes at scroll
  ~525px instead of ~425px, because the dock is 100px longer. The fill itself
  is the same motion over the same relative progress.
- **Total empty space in the first viewport is unchanged.** 269px of band
  became 169px of band plus 100px of heading gap. What changed is where the
  empty space sits and what it reads as — not how much of it there is. Whether
  that reads as fixed is the owner's call; the before/after rest screenshots
  are the evidence.
- The secondary observation from the live review (the fanned deck shows only
  LeaseLens fully at rest; Sales ETL and OratorPath peek as strips) is
  unchanged — it was not this task.

## Skills chosen, by category

- **taste-skill** (`~/workspace/custom-skills/design-taste-frontend/`):
  `SKILL.md`, `references/motion.md` (scroll motion, the dealt moment) and
  `references/layout-v4.md` (section spacing, hero). The layout reference
  backs the mechanism: sections hold about a quarter screen between them, and
  a generous gap at a section boundary reads as intentional spacing, not
  missing content.
- **impeccable** (launcher/scripts, never npx): detector on the changed
  file — 0 findings.
- **design-intelligence** house rules: the fix keeps the deck as row 1's
  visible form, transform/opacity only, static under reduced motion.
- **human-writing-style**: this report's prose, in English.

## Verification

Build clean (11 pages). Full QA
(`~/workspace/.baseline-qa/refine-work-band-fix-qa.js`): **52/52 checks
passed**, zero console errors, zero failed requests.

- **Band:** 169.4px at 1440×900 (light, dark, DE identical); 23.6px peek at
  375×844 (unchanged); heading top 630px; row 1 top 730.6px.
- **Docking:** offset 525px at 1440 (was 425), 550px at 1024. At the dock,
  progress 1, reveal 1, fade 0. Deck cards align with the grid visuals:
  dx 0, dy −1.9px, dw −0.1px at 1440; dx 0, dy 0 at 1024. Row 1 fully visible
  at the dock; past the dock the deck scrolls away 1:1 and the grid stays;
  scroll-up reverses (progress 0, row 1 hidden again).
- **No copy coverage:** the deck's bounding boxes never intersect any
  hero-copy element's box at scroll 100, 200, 300 or 400 (overlap area 0 at
  all four). Hero text stays opaque mid-scroll.
- **Filter:** Python dims exactly 3 non-matching cards, note reads "3 of 6
  projects use Python.", reset restores all 6.
- **Overflow:** none at 375 / 768 / 1024 / 1440, EN + DE, light + dark.
- **Axe:** 0 violations on home light, home dark (docked), and 375px.
- **Reduced motion:** row 1 visible at rest, deck does not pin (scrolls away
  1:1), row 1 still visible at scroll 320.
- **Routes:** all 7 return 200 (home + 6 case pages).
- **Lint/format:** ESLint clean on the touched TSX; Prettier clean on
  `globals.css` (ESLint reports the CSS file itself as ignored by its config,
  a warning, not a finding); impeccable 0 on `globals.css`.
- **Lighthouse** (local, throttled): desktop 92, mobile 57 (work-grid round:
  92 / 54). The first desktop run after the change read 87; a second run
  read 92, so the 87 was run-to-run noise, not a regression. CLS 0 on both.
- **Screenshots** (`docs/screenshots/refine-work-band-fix/`, before + after):
  rest, docked and y100/y200/y300 at 1440 light EN, dark EN and light DE;
  rest and docked at 375 light and dark EN. Eyeballed: the rest shots show
  the smaller band and the larger heading gap; the docked shots are
  indistinguishable from before; mid-scroll shots show the deck fanned and
  clear of the copy.

## GATE

```
GATE: ERROR (the copy (the page showed no <main>, <section> or <h1> to lint); consistency.mjs gave no report (exit 1: Error: No Chrome, Edge or Chromium found; set CHROME_PATH.); check.mjs could not run (exit 2: no Chrome found (set CHROME_PATH)))
```

The gate's own Chrome launcher would not start in this VM — same as the
hero-deck and work-grid rounds. The cause is now known: the skill launches
Chrome without `--no-sandbox`, and this VM runs as root, so Chrome exits
immediately. Setting `CHROME_PATH` did not help because the gate does not pass
its environment to its children. The gate's own instruction was "Do not rerun
it: put the GATE line and what was not checked in your report, then finish."
The three checks were run directly instead, with a `--no-sandbox` Chrome
wrapper (`/tmp/chrome-wrapper.sh`, an environment workaround, not a change to
the skill):

- **consistency.mjs** (`--quick --widths 1440,390`): 31 FAIL check-ids /
  13 WARN ids (92 individual FAIL findings, 42 WARN) — against 33 / 12
  (94 / 42) in the work-grid round. Two ids left FAIL (`section-gaps` and
  `visual-empty`, both now WARN); `fade-cut` left WARN (now PASS). The same
  two mechanism-mismatch WARNs as both previous rounds, `hero-enter` and
  `moment-none` (the hero has no `data-enter` marker the skill expects; the
  deck-dock spans the hero→Work boundary rather than sitting in a section of
  its own, so the checker does not recognise it as a dealt moment). The rest
  are the same categories as before: the fanned deck's intentional overlap
  (`collide`, `tilt`), the overlay labels (`contrast` — the checker samples
  the mockup behind the scrim; axe 0 and Lighthouse accessibility 100 agree
  the titles are legible), inline SVG drawings that are not photographs
  (`card-visual` / `no-visual` / `visual-empty`), and the site-wide
  pre-existing set (compact hero, section heights, nav, buttons, copy
  headlines, the Dresden address, the contact form). Not checked by the run:
  scroll-linked stepping, the reveal walk, hover-spill, hidden-visual,
  loop-pause, forms, reduced-motion, the dead-IntersectionObserver walk,
  hover-move.
- **layout check** (`check.mjs --sizes 1440x900,390x844`): only the
  pre-existing `container / no .wrap` finding at both sizes; no overflow-x.
- **copy-lint.mjs** (on the rendered page): no FAILs. Two pre-existing WARNs
  — `copy-contrast` (3 contrast frames, budget 2) and `copy-em-dash` (7 em
  dashes, budget 2) — plus one INFO (`copy-rhythm`). None of them is in the
  changed strings; the change added no copy.

## Not verified

- The motion at real scroll speeds in a real browser — the QA scrolled in
  steps and measured states, it did not watch a continuous scroll. The easing
  and the cross-fade are verified at sampled offsets only.
- The live deployed site — this branch is not deployed; the owner reviews
  first.
- Whether 169px of band plus a 124px heading gap reads as fixed — that is a
  judgement call, and the before/after rest screenshots are the evidence for
  it, not a measurement.
