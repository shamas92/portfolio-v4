# Photographic hero deck + work grid: refine/photo-deck

Branch `refine/photo-deck`, from main @ 8887930 (the band fix). Not merged, not pushed, not deployed. The user reviews the branch first.

## What changed

The hero deck and the work grid now use photographs instead of SVG mockups. Six images in `public/projects/`, one per project, 1920×1280 JPEGs: LeaseLens (phone on a rainy neon street), Sales ETL (laptop in a dark industrial studio), OratorPath (laptop on a dark stage), HITEC (laptop in a bright university office), Quality CRM (laptop in a warm workshop office), UpliftU (phone in a bright campus study space). The same file renders in light and dark mode. No dark-variant logic remains for these cards.

Files:

- `src/components/ProjectPhoto.tsx` (new): slug to `/projects/*.jpg`, `next/image` with `fill` and `object-fit: cover`, `sizes="(max-width: 767px) 90vw, (max-width: 1023px) 45vw, 360px"`. Eager in the deck, lazy in the grid. The same sizes string in both, so the browser reuses one optimised file per width. Alt is empty: the images are decorative, the card text carries the meaning.
- `src/components/HeroDeck.tsx` (rewritten): six cards, LeaseLens front, entrance delays 240 + i×60ms.
- `src/components/WorkCard.tsx` (rewritten): photo edge to edge, overlay labels, hover/focus description. `useReveal` and the `row` prop are gone; both rows share `--grid-reveal`.
- `src/components/WorkSection.tsx`: no longer passes `row`.
- `src/app/page.tsx`: scroll engine rewritten: smootherstep easing, damped settle loop, per-card measured offsets, no docking below 1024px.
- `src/app/globals.css`: deck rules use `img`, overlay and scrim styles, the 124px `#work` padding-top is untouched, the ≤359px narrow rule.
- `public/projects/*.jpg` (new), `docs/screenshots/refine-photo-deck/` (19 PNGs).

SpecAssets.tsx is untouched. Case pages still use its SVGs for Evidence sections.

## The six-card fan

Desktop cards are 320px wide. Rest offsets (x, y, rotation): LeaseLens (0, −6, −1°), ETL (26, −16, 6°), OratorPath (−28, 8, −5°), HITEC (46, −24, 9°), Quality CRM (−48, 18, −8°), UpliftU (14, 26, 3°). The fan's bounding box is about 414×242px inside a 340px deck. Tablet cards are 280px, phone cards 200px. The fallback spread (no JavaScript or a measurement failure) is sx −674/−293/+88, sy 0/430, ss 1.07.

Rest legibility: only LeaseLens is fully visible at rest. The other five read by colour and composition in their peeking strips: neon rain, dark steel, stage amber, bright office, warm workshop, bright campus. Each strip is distinct at 20–45px. The full photos show as the cards separate on scroll. That is the trade-off the earlier round flagged: a six-card fan cannot show six full cards at rest in a 340px deck, and photographs carry the fan where line drawings could not. At 375px the compact fan is 200px wide and the same colour-strip reading holds. The screenshots confirm it; the front card is legible and the five behind it are recognisable by palette, not by detail.

## Animation

The scroll engine writes transform and opacity only. Progress uses smootherstep (quintic) instead of smoothstep. A damped settle loop (LERP 0.22 per frame, about 250ms to settle, SETTLE 0.0005) damps the displayed progress toward the scroll-derived target, while `--deck-lag` is written straight from scrollY so the pin never drifts. The loop runs only while settling.

Sampled offsets at 1440×900, English: scroll 0/132/264/395/527px gives progress 0/0.104/0.502/0.896/1, reveal 0 until 0.75 then 1, fade 1→0. The dock lands at 527px. The QA's findDock (50px steps) reports 550px. At the dock all six cards align with their grid visuals at exactly 0,0 (width delta −0.1px). Docking offsets: 550px at 1024×768, 550px dark, 550px German. Row pitch is 479px at 1440. The fold is 730.6px at 1440×900 and 820.4px at 375px. Row 2's visual centres sit at viewport y 762.5 at the dock (1440×900) and 792.3 at 1024×768, 24px past the bottom edge there; the grid is one touch more scroll away.

Frame timing over a smooth scroll to the dock: n=175, p50 16.7ms, p95 16.7ms, max 16.8ms, zero frames over 50ms. Scroll-up reverses cleanly (progress 0, both rows hidden again). Reduced motion: the deck scrolls 1:1 and the grid stays visible. No JavaScript: the grid is visible and the deck sits in its rest fan.

## Work cards and the hover description

Each card is the reference layout: photographic image edge to edge, category pill top-left, title bottom-left in white on a dark scrim, "View case study ↗" pill bottom-right. On hover and on keyboard focus the description fades and rises 8px in 180ms over the image: the one-sentence summary plus the proof, the same words as the body below. The category pill and the title fade out with it and return when the pointer or the focus leaves. The overlay is pointer-events none, so it can never block the link, and the "View case study" pill stays visible and clickable throughout.

The overlay text is clamped: six lines at 15px/1.4, five where the three-column cards run narrow (1024–1279px). The longest description is HITEC, seven lines at 1440 and eight at 1024. It ends with an ellipsis in the overlay; the full summary and proof sit in the body directly below the visual. Measured clearance from the clamped text to the pill: 9px at 1440 English, 9px at 1440 German, 11px at 1024. Touch users have no hover, so the summary and proof stay in the card body for them. The filter below the grid and the case pages are unchanged.

## Four defects found and fixed in this round

Looking at the screenshots caught what the QA script missed. Each fix was rebuilt, re-probed and re-run through the full QA.

1. **The deck was invisible below 1024px.** `writeReveal` set `--deck-fade: 0` whenever there was no docking, so phones and tablets showed an empty hero. The cards were in the DOM at opacity 1 with loaded images, but their parent was transparent. Fixed: fade stays 1 below 1024px. Two new QA checks (deck opacity 1, in viewport, 6 images loaded at 375px; deck visible at 768px) now cover it.
2. **The deck's parallax overlapped the Work heading on phones.** Below 1024px the deck lagged at 0.5× scroll, capped at 160px, so it drifted down over "Work" and "Six systems…" as the section scrolled up under it. The taste checker's crops showed the photos covering the heading's W. Fixed: no lag below 1024px; the fan scrolls 1:1. A scroll sweep at 390px and 320px now finds no overlap at any step.
3. **The HITEC title failed contrast at 390px.** The "View case study" pill squeezes the title, so HITEC wraps to five lines and its top line sat where the scrim was nearly transparent, over a near-white office photo. The checker measured 1.0:1. Fixed: the scrim went from 70% to 85% of the visual tall with a stronger gradient (0.85/0.8/0.7/0.55/0.35), holding about 0.7 alpha where the top line sits.
4. **The category pill overlapped the title at 320px.** HITEC's six-line title ran 42px into the pill; Quality CRM ran 17px. Fixed: below 360px the visual goes 4:3 and the title drops to 17px. HITEC now clears the pill by 24px, Quality CRM by 45px. The 17px rule only worked once it was moved after the `.work-visual-title` rule. Same specificity, so order decides. That placement is called out in a comment.

## QA — 82/82 checks pass

Script `~/workspace/.baseline-qa/refine-photo-deck-qa.js`, run against the local production server. Results in the log; headline numbers:

- Routes: 7 × 200. No Placeholder text anywhere.
- 12 images in the DOM (6 deck + 6 grid), all loaded, one file per project, deck and grid share files. No SVG left in the deck or grid.
- Docking exact (0,0) at 1440 light, dark and German, and at 1024. Both rows opacity 0 at rest, 1 at the dock.
- Hover: LeaseLens and HITEC overlays fade in with summary + proof; title and category fade; the pill stays; axe 0 on hovered cards. Focus shows the overlay.
- Filter: Python dims the three non-matching cards to 0.35; the note reads "3 of 6 projects use Python."
- Axe 0 on home light, home dark (docked) and home 375px.
- Load CLS 0. The session total is 0.0147, and a focused probe traced it to the pre-existing header morph: the header's layout steps while scrolling, not the deck or the grid. Load CLS is the metric that matters and it is 0.
- No horizontal overflow at 375/768/1024/1440, English and German. No console errors, no failed requests. The no-JS "failed request" from the first run was a Playwright artefact (the site sends no CSP header; the no-JS context reports refused scripts as CSP errors) and is now filtered in that context.
- Case page still has its SVG Evidence (6 SVGs).

## Lighthouse (local, throttled, honest)

- Desktop: performance 97, accessibility 100, best practices 100, SEO 100, CLS 0, LCP 1.0s.
- Mobile: performance 57, accessibility 100, best practices 100, SEO 100, CLS 0, LCP 4.3s.
- Desktop is up from 92 in the band-fix round. Mobile is the same 57 as that round; it has swung 54–89 across rounds on this VM's 1.5 shared CPUs, so the number is a range, not a verdict.

## Gate

**GATE: ERROR.** The gate's Chrome launcher cannot find Chrome in this VM (it also omits `--no-sandbox`, and the VM runs as root), the same as every prior round. The three checks were run directly with a `--no-sandbox` Chrome wrapper.

- **Consistency** (`consistency.mjs --quick --widths 1440,390`): FAIL 83, WARN 41→43, across 30 distinct FAIL checks. Before the narrow-width fixes it was FAIL 98 with 14 `collide` findings; after them `collide` is 0. The remaining FAILs are the standing set: `spill` 10 and `tilt` 4 (the fan, deliberate), `scroll-reveal` 8 (the deck-to-grid reveal, deliberate), `no-visual` 6 (Background, Skills, Certificates — sections that never had visuals), `container-edges` 8, `section-tile` 5, `button-styles` 4, `focus-visible` 4, `hero-fill` 2, and the rest of the pre-existing set. `visual-caption` WARN 14 is the photos having no captions; they are decorative, the card text carries the meaning, and the reference has none either.
- **Contrast, the one FAIL that needed a second look.** The checker still reports the HITEC title at 390px as 1.0:1. That is a false positive: the checker measures the photo behind the title without the scrim (the scrim is a sibling overlay, not the title's own background). Pixel sampling of the rendered screenshot says otherwise — background behind the title is median 39.9/255, so white text reads 5.08:1 at the median and 3.59:1 at the 90th percentile. The title is 20px bold, so the 3:1 large-text bar is the applicable one, and the render clears it with room.
- **Layout check** (`check.mjs --sizes 1440x900,390x844`): only the pre-existing "no .wrap" finding at both sizes; no horizontal overflow.
- **Copy-lint**: 0 FAIL, 2 WARN, both pre-existing (`copy-contrast` 3 vs budget 2, `copy-em-dash` 7 vs budget 2). No new copy was written in this round; every string comes from the existing content files.

Impeccable detector on the six changed source files: `[]`, no issues.

## Honesty note

The six images are created visuals, not photographs of the real products and not screenshots. Nothing on the site labels them as real screenshots or real photos. The device screens show only the project title and generic interface dressing. That dressing must never be quoted as project content: Quality CRM's "Chassis Alignment Check" and UpliftU's support topics are generic screen text, not verified facts. All site copy comes from the verified facts already in the repo. No metrics, outcomes, dates or URLs were invented. The same image file serves light and dark mode, verified by comparing the loaded URLs in both themes.

## Open items

- Row 2's cards dock 24px past the bottom edge at 1024×768; the grid is there on a touch more scroll. Acceptable, recorded.
- The header morph contributes 0.0147 session CLS while scrolling. Pre-existing, not touched here.
- The taste checker's `contrast` FAIL on the HITEC title is a false positive (see above); it will reappear on every run until the checker accounts for overlay scrims.
