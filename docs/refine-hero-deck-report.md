# Hero deck — refine/hero-deck

Branch `refine/hero-deck`, from `main @ cc7e3b3`. Three commits. Not merged, not pushed, not deployed. The owner reviews first.

## What changed

The hero is now a two-column split on desktop: the copy on the left, a fanned deck of four dummy mockup cards on the right. Under 1024px the deck stacks below the copy. Every word of the hero copy is unchanged (name, claim, ask, Dresden pill, MSc line, Email me). The old scroll effect is gone. The name used to grow 1 to 1.22x over the first 160px of scroll, a growth nobody could see because the name starts 32px below the header and leaves the viewport after about 30px. The deck replaces it as the hero's motion.

The deck is a new component, `src/components/HeroDeck.tsx`. Four landscape cards, 320 by 200, each a generic interface drawn as SVG inside a window or phone frame: a dashboard with a sidebar and a bar chart, an app screen with list rows, a data table, a mobile screen with a phone frame. Each carries a "Placeholder" label (German: "Platzhalter"). No real project data, no numbers that mean anything, no real product names. The bars and rows are shapes, not values. The cards are `aria-hidden` and `pointer-events: none`. They are decoration, not content, and they never take focus.

The scroll behaviour is the core of the work. A passive rAF listener in `page.tsx` writes two CSS variables on the hero as the reader scrolls the first 320px: `--deck-progress` (0 to 1, smoothstep-eased) and `--deck-lag` (half the scroll distance, capped at 160px). The CSS interpolates each card from its fanned rest position to a near-upright 2 by 2 spread, growing from 320px to about 350px wide. The lag makes the deck move down as the page moves up, so it stays in view longer than the text and then scrolls away. The hero text has no scroll transform at all now. It scrolls up normally and stays fully opaque until it leaves the viewport. Past 320px the progress stays at 1, the lag stays capped, and the deck scrolls away one to one with the page. The effect reverses on scroll-up. Everything is transform only, so there is no layout shift. The cumulative layout shift measured 0 on mobile and desktop.

The load entrance lands in about a second. The name rises 12px with no opacity change, so the LCP headline paints on first paint. The claim, ask, pill, status line and Email me rise in 60ms steps after it. The deck cards settle 80ms apart from 240ms. The hero carries `data-enter`, the taste-skill's entrance marker.

The deck lands as a 2 by 2 spread that scrolls away above the grid. It does not land as the grid. The reference's trick is that its hero mockups are the project cards, animated from a stacked deck into the grid. That does not transfer here. The deck holds four dummy placeholders and the grid holds three real projects, so morphing one into the other would be a bait-and-switch, and the counts do not match. The spread is the honest landing.

## How it maps to the reference, and where it diverges

The reference is austinserb.com, measured at 1919 by 998. What I matched: four landscape cards fanned at rest, rotations from minus 5 to plus 13 degrees, rounded corners, a thin dark edge and soft shadow, only the front card fully visible with the others peeking at its edges, a fast staggered entrance under a second, a scroll-linked fan-out that is continuous rather than stepped, the deck lagging the text and staying in view longer, and the cards growing and rotating toward upright as they separate into a loose spread that overlaps the projects heading. The spread lands at rotations of minus 2, plus 1, plus 2 and minus 1 degrees, which is the reference's "a few degrees of tilt remaining" rather than a dead zero.

What I did not copy: the reference's gradient button, its sans-only typography, its light-grey panel, its copy, and its photographic project images. The portfolio keeps oxide red, Newsreader headings with Inter Tight body and JetBrains Mono metadata, its own surfaces in both themes, and its morphing fixed header with the DE/EN and theme toggles and Download CV. The mockups are drawn placeholders, not the reference's photographs and not the portfolio's real project mockups. The user asked for 99 percent similarity in the mockups, their animation and the design, and the dummy mockups are where that similarity stops: they look like the reference's cards in fan and motion, but they carry no project imagery, because using the reference's images would be copying it and using the portfolio's real mockups would present placeholders as real work.

Two deliberate divergences from the reference and from the taste-skill. First, the hero is not full-height and does not fill the first screen alone. It is compact, about 60 percent of the viewport, with the Work section peeking below it, because that is what the reference does and what the portfolio's fold requires. The skill's house rule says one section per screen; the brief and the reference both say otherwise for this hero, and the fold numbers below are the reason. Second, the deck's fan-out is a scroll moment inside the hero's own section, scrubbed to the scrollbar with a finished state at both ends, while the text itself does not move on scroll. The skill says scrolling moves nothing but the dealt moment, and this is that moment.

## The fold

The first flagship card top, measured on the production build:

| Viewport | Before | Now |
| --- | --- | --- |
| 1440 by 900, English, light | 636px | 631px |
| 1440 by 900, English, dark | 636px | 631px |
| 1440 by 900, German | not measured | 658px |
| 375 by 844, light | 706px | 820px |

The desktop fold is 5px better than before. The German fold runs 27px longer than English because the German copy wraps to more lines, and it still clears the 660px target. Mobile regressed from 706px to 820px. The deck adds 170px below the copy on a phone, and the padding and margin tightening gave back 64px of it. The first card still peeks by 24px at 375 by 844, and the Work heading sits well above the fold. The regression is the price of the deck on a stacked layout. I did not shrink the deck further to chase the old number, because a 200px card is already the smallest size at which the four mockups stay legible.

Getting the desktop fold right took a fix after the first QA run. The 5fr copy column was too narrow for "Shamas Ur Rehman" at 56px, so the name wrapped to two lines and the first card dropped to 697px. The copy is now half the measure (6fr/6fr) and the name scales with the viewport, `clamp(2.5rem, 4.5vw, 3.5rem)`, so it stays on one line from 1024px up: 46px in a 456px column at 1024px, the full 56px in a 536px column at 1440px. The spread shifted left with it (`sx` minus 300 / plus 50) so its right edge still clears the 1024px viewport.

## What was verified

A 60-check Playwright suite ran against the local production build (`~/workspace/.baseline-qa/refine-hero-deck-qa.js`). All 60 pass. Zero console errors, zero failed requests.

- Routes: home and all six case pages return 200.
- Deck at rest: four cards, rotations minus 5, minus 1, plus 7, plus 13 degrees, a span of 18 degrees. The leftmost card clears the copy by 115px at 1440px. Titles read "Placeholder" in English and "Platzhalter" in German.
- Scroll: progress 0.232 at 100px, 0.684 at 200px, 1.000 at 320px, matching the smoothstep curve within 0.05. Lag 50px, 100px, 160px at the same stops, capped at 160px past 320px. Hero text opacity stays 1 at every stop. Settled rotations are within 3 degrees of upright, the spread is two rows by two columns, cards grew past 320px wide, and the deck moves up and away past 320px.
- No horizontal overflow at 375, 768, 1024 and 1440, in English and German, light and dark, at rest and settled. Settled cards sit inside the viewport at every width, including 1024px where the right edge lands at 992px.
- Reduced motion: the deck keeps its rest fan (rotations minus 5, minus 1, plus 7, plus 13) at scroll 0 and at scroll 320, no progress variable is set, the text stays opaque. The deck is static at rest and does not move on scroll.
- Axe: 0 violations on home light, home light scrolled, home dark, and home at 375px.
- Build, TypeScript, ESLint and Prettier are clean. Impeccable reports 0 findings on the five changed files.

Lighthouse on the local build: desktop 96 (performance), 100 accessibility, 100 best practices, 100 SEO, LCP 0.4s, CLS 0. Mobile 58, 66 and 66 across three runs (was 74), accessibility 100, best practices 100, SEO 100, CLS 0. The mobile regression is real but modest, about 8 points on the stable runs. The LCP element is the hero ask paragraph, not the deck, at 4.2s under throttling. The likely cause is the added SVG DOM on the throttled mobile CPU; the total blocking time swung from 850ms to 1890ms between runs, so the number is noisy. Desktop improved from 86 and 91 to 96. I am flagging the mobile drop rather than treating it as a blocker, the same way the earlier rounds flagged a mobile dip.

Screenshots are under `docs/screenshots/refine-hero-deck/`: hero at rest, at 100, 200, 320 and 450px of scroll, and the load entrance early and settled, at 1440 and 375, light and dark, plus German rest, and the settled spread at 1024 and 768.

## The taste-skill gate

The gate itself did not run. `GATE: ERROR (the copy (the page showed no <main>, <section> or <h1> to lint); consistency.mjs gave no report (exit 1: Error: Chrome exited early (1)); check.mjs could not run (exit 2: check: Chrome did not start))`. The gate's own Chrome launcher would not start the browser in this VM, three times, even with `CHROME_PATH` set to the QA rig's Chrome and then to a `--no-sandbox` wrapper around it. The same Chrome binary works for the Playwright suite and for a manual launch with the gate's own flags, so the failure sits in the gate's orchestration, not in the browser. I ran the three checks the gate runs, directly, with the same Chrome, and they all completed. Their results follow.

`consistency.mjs` (quick, widths 1440 and 390) ran to completion: 79 findings at 1440, 45 at 390, 6 at the 320 narrow pass. Most are whole-page or pre-existing and out of scope for a hero-only change: the nav, the scroll reveals, the sections without visuals, the certificate cards, the button styles, the copy headings, the address, the focus ring on pre-existing elements, the section rhythm rules. The hero-relevant ones are listed here, with what I did about each.

- `hero-fill` (1440 and 390): the next section shows on the first screen. Deliberate. The brief and the reference both want a compact hero with Work peeking, and the fold numbers above are the reason. Fixing it would mean a full-height hero, which the brief forbids.
- `placeholder` (1440): the "Placeholder" label on the mockups. Deliberate. The user asked for dummy mockups, and labelling them is the honest choice.
- `tilt` (1440 and 390): cards rotated minus 5 and plus 7 degrees. Deliberate. The reference fans at minus 5 to plus 15 degrees.
- `spill` and `flush` (1440 and 390): the deck cards run past the edges of the `.hero-deck` panel, because the fan is wider and taller than its container. That is the fan's geometry, not a layout bug. There is no horizontal overflow and nothing is clipped. The cards are meant to overflow their box.
- `collide` (390 and 320): on a phone the fanned deck overlaps the Work section's text as it spreads downward. Transient. The deck scrolls away as the reader continues, and the overlap is the same mechanism as the desktop spread overlapping the Work heading. I left it.
- `section-gaps` (1440): the hero to Work gap is 43px against a 134px median. Deliberate. The gap was tightened to hold the fold, and the deck's spread fills the space the gap gives up.
- `hero-enter` (WARN, held as a FAIL by the gate): the hero does not enter on load because no head line sets `html.m-enter`. The hero does enter on load, verified in screenshots and by the QA suite. The checker looks for the skill's `m-enter` mechanism, which needs the skill's motion script. I used `data-enter` with plain CSS animations instead, and did not add a head script that would be dead code without that script. Mechanism mismatch, not a missing entrance.
- `moment-none` (WARN, held as a FAIL by the gate): a service page deals no moment. The deck fan-out is the page's one dealt scroll moment, scrubbed to the scrollbar with a finished state at both ends. The checker does not recognise it as a moment because it is not marked in the way the skill's moments checker expects. Mechanism mismatch again.

The layout check (`assets/layout/check.mjs`, 1440 by 900 and 390 by 844) found one finding at each size: "no .wrap". The portfolio uses its own `.page` container with a 1120px measure, not the skill's `.wrap` class. Pre-existing structure, not a hero change. No horizontal overflow at either size.

The copy lint on the rendered page found one FAIL, `copy-contrast`: seven "X, not Y" contrast frames against a budget of two. Those are the honest-mockup captions ("an illustration, not a product screenshot") that pre-date this change. The deck adds no new contrast frames.

I did not fix the out-of-scope FAILs. The brief says not to touch the rest of the page, and fixing whole-page findings (section rhythm, nav, certificates, copy) would have meant rebuilding sections the owner has already signed off.

## What I did not verify

- The gate's own `GATE:` line is ERROR, not PASS, for the Chrome-launcher reason above. The three checks were run directly instead.
- Mobile Lighthouse is 58 to 66, down from 74. I measured it three times and the spread is real. I did not chase it further, because the LCP element is the hero ask, not the deck, and the likely cause is rendering cost on a throttled CPU.
- The entrance was captured as two stills (early and settled), not as a video. The staggered timing was verified by measurement (delays 0 to 480ms, total about 880ms), not by watching it play.
- I did not check the deck in a real browser on a phone, only in the Playwright emulation at 375 and 390px.
