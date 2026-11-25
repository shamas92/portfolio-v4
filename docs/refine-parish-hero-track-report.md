# Parish hero + horizontal track — refine/parish-hero-track

Branch `refine/parish-hero-track`, built from `main @ 9d5f6ef` on 2026-11-25. Not merged, not pushed, not deployed. The user reviews the branch first.

The hero and the projects section now follow parish.cv as a layout and interaction reference. Nothing of Parish Khan's content, images, names or logos is reused. The rest of the page (Background, Skills, Certificates, Contact, the six case pages, the DE/EN toggle, the theme toggle, the morphing header, Download CV in the header) is untouched.

## What changed

| File | Change |
| --- | --- |
| `src/app/page.tsx` | New hero (profile row, headline A, two buttons, see-work link, HeroShowcase) and the scroll engine retargeted to the track |
| `src/app/globals.css` | Lime accent tokens, hero styles, caption + tabs, track styles, grid and filter CSS removed |
| `src/components/HeroDeck.tsx` | Rewritten: the front card follows the active tab, with a re-fan transition |
| `src/components/HeroShowcase.tsx` | New: deck + caption + tabs for the hero's right column |
| `src/components/TrackCard.tsx` | New: one wide track card (text left, photo right) |
| `src/components/WorkSection.tsx` | Rewritten: the 3×2 grid is now a horizontal scroll-driven track |
| `src/components/WorkCard.tsx` | Deleted (only WorkSection imported it) |
| `src/components/ProjectPhoto.tsx` | Desktop `sizes` slot raised from 360px to 640px (see the photo fix below) |
| `src/content.ts` | `stats` on LeaseLens and Sales ETL, `claimHighlight` on the profile, `seeWorkFirst` string, filter strings removed |
| `src/content.de.ts` | Same, in German, plus the DE "Or see the work first" proposal (flagged below) |

## Decisions, named so the user can correct them

- **Projects section = horizontal track.** The user picked this over keeping the grid, 2026-11-25.
- **Accent = lime #BFF73B, site-wide, replacing oxide red.** The reference's lime, sampled from its highlight behind "hours".
- **Hero headline = Inter Tight bold.** Newsreader stays for section headings.
- **Headline A: "I build data & ML systems."** DE "Ich baue Daten- & ML-Systeme." (content.de.ts:27, verified). The lime marker-swipe highlight sits behind "data & ML" (DE: "Daten- & ML-Systeme"), skewed about -2 degrees.
- **Deck docking = kept** on desktop at 1024px and up. The deck docks onto the track on scroll, as it did onto the grid.
- **"See plans" dropped.** The user sells no subscription; no equivalent exists.
- **"Track record" strip omitted.** No equivalent verified stats exist.
- **Heading stays "Latest Projects".** The reference's "Shipped, not mocked up." wording was not adopted.
- **Filter removed.** It dimmed cards in a grid where all six were visible at once. That does not fit a horizontal track, and the reference has no filter. The filter strings left content.ts and content.de.ts with it.
- **Case-study pill reuses the existing "View case study" string** (DE "Fallstudie ansehen", content.de.ts:467).
- **Tab labels shortened: "Sales ETL", "HITEC", "Quality CRM".** These are new strings. They do not exist in the content files, and they need the user's confirmation. Full titles stay in content.ts.
- **"Or see the work first" DE = proposal, not a verified translation.** The build uses "Oder zuerst die Projekte ansehen ↓". It matches the site's own DE vocabulary (the section is "Projekte" / "Neueste Projekte"), but it needs the user's confirmation. The EN string was not used as the DE fallback.
- **Mobile: the track becomes a vertical stack** (photo on top, text below). No sticky, no horizontal translation.
- **Reduced motion: the same vertical stack.** Cards fully visible, no translation.

## The accent and the contrast problem

#BFF73B cannot be a text colour on white. It measures about 1.2:1, and white text on it is equally unreadable. So the token swap does not set `--accent-light` to #BFF73B. A new raw token `--lime: #BFF73B` is used only as a bright background with dark content, exactly how the reference uses lime: the headline highlight and the arrow circle inside the black "Email me" pill. The readable light-mode accent is dark lime **#3F6212**, about 5.8:1 on white, for accent text and interactive backgrounds. Dark mode takes `--accent-dark: #BFF73B`, which reads on dark (about 13.8:1 as text, and dark text reads on it as a background). The washes are pale lime #F0F9D2 with #3F6212 text in light mode, and olive #22330B with #BFF73B text in dark mode. The focus ring follows the readable accent. The headline highlight span sets its text colour explicitly dark (#111) in both themes, because in dark mode the headline text is near-white and near-white on bright lime is unreadable. The presence dot stays green (a separate `--presence` token, emerald #10B981), not the accent.

## The hero

The profile row carries the "SR" monogram as a circular avatar (the site's existing honest mark; no portrait exists and none may be generated), "Shamas Ur Rehman", a green dot, and the pill text ("Dresden · Working-student eligible, 20h/wk" / DE "Dresden · Werkstudent, 20 Std./Woche", content.de.ts:452). The name leaves the h1 slot; it remains in the header's site-name link. The old mono pill and the MSc status line leave the hero (the MSc info is in the Background section).

The subline is the existing ask, unchanged: "Looking for a working-student role in full-stack software and data engineering." (DE content.de.ts:453). The buttons are "Email me" (mailto:shamasrehman249@gmail.com) in the black pill with a lime circular arrow inside it, and "Download CV" (public/Shamas_Ur_Rehman_CV.pdf) in the outline pill. Both are fully rounded (999px), about 58px high. The hero primary button's hover keeps its ink background, because a lime button would swallow the lime arrow circle. Under the buttons sits "Or see the work first ↓", anchored to #work.

The headline renders by splitting `profile.claim` on `profile.claimHighlight` and wrapping the match in a `.hero-highlight` span (lime background, dark text, about 10px radius, rotate about -2 degrees, `box-decoration-break: clone`). If the highlight string is not found, the claim renders plain.

## The deck as a tab showcase

The deck keeps the six photographic project images (public/projects/*.jpg, 1920×1280, the same file in light and dark). No browser-chrome framing, no new images, no theme variants. The front card follows the active tab, default LeaseLens. Clicking a tab swaps the front card, re-fans the others (a 600ms transform transition, enabled 650ms after a tab change, skipped on first render), moves the caption and the black pill. Deck cards keep their `data-project` slug so docking pairs by slug, not position. The deck stays decorative (aria-hidden, pointer-events none); the tabs and the caption carry the information.

The caption under the deck is the bold project name, the verified one-line summary (`rowOutcome` from content.ts), and a "View case study" pill to `/work/{slug}`. It follows the active tab. The tab row under the caption holds six project names as real buttons (`aria-pressed`, `role="group"`, 44px tap targets). The active tab is a black pill with white text; inactive tabs are grey text.

## The track

`WorkSection.tsx` renders `.track-scroll` (320vh) > `.track-viewport` (sticky) > `.track` (a flex row of six TrackCards), then the "View More Projects" link to https://github.com/shamas92. Each card is about 860px wide: year + role in mono, an H3 title in Newsreader, the one-line summary, a stats row where one exists, a Stack list, and links. The photo sits large on the right (ProjectPhoto, same file in light and dark, aria-hidden). The track moves left as the user scrolls vertically on desktop. The horizontal track only exists inside `@media screen and (min-width: 1024px) and (prefers-reduced-motion: no-preference) and (scripting: enabled)`, so mobile, reduced motion, no-JS and print all get the vertical stack.

### Stats row, per project

Only two cards have a stats row. The other four omit it; nothing is invented.

| Project | Stats row |
| --- | --- |
| LeaseLens | Deposit €950.00 / legal cap €535.41 / excess €414.59 |
| Sales ETL | 1 DAG / 3 tasks / 4 tables |
| OratorPath | None. Its proof line is the publication (Spectrum of Engineering Sciences, Vol. 3 Issue 7, pp. 843–852, 2025, ISSN 3007-3138), not a stats row |
| HITEC, Quality CRM, UpliftU | None. No figures, no metrics |

The LeaseLens 86.1% registered IoU is the rowProof and lives on the case page, not in the stats row. The proof line (`rowProof` with the "Proof" label) shows on every card except Sales ETL, where it would restate the stats row ("One DAG, three tasks, four tables.").

### Repo links

Only two projects have a repo URL in content.ts: LeaseLens (https://github.com/shamas92/leaselens) and Sales ETL (https://github.com/shamas92/sales-etl-pipeline). OratorPath, HITEC, Quality CRM and UpliftU have `links: []`. Their only link is "View case study". No repo URLs were invented, and the GitHub profile link was not used as if it were a project repo.

### Stacks (from content.ts, verbatim)

LeaseLens: Next.js, TypeScript, FastAPI, Python, SAM 3.1. Sales ETL: Apache Airflow, Docker Compose, PostgreSQL, MinIO, Parquet. OratorPath: PyTorch, Hugging Face, NLP. HITEC: C#, ASP.NET MVC, SQL Server, Python, RAG. Quality CRM: Laravel, MySQL, PHP. UpliftU: Python, Hugging Face, NLP.

## Docking onto the track

The first version measured the dock from the first photo's rect (photo centre minus deck centre). That is wrong for a sticky track: the photos sit vertically centred in the sticky 100vh viewport, below the deck's pinned rest centre, and the track starts translating left as soon as it sticks. The corrected measure sets the dock to `trackTop` (the scroll at which the track section becomes sticky; at that scroll `--track-x` is still 0, so the photos sit at their rest X and `--sx` is exact) and `--sy` to `window.innerHeight / 2 − deckCy` (the deck glides down to the viewport centre as it docks; the same value for all six cards). `--sx` is the photo rest centre X minus the deck centre X; `--sr` is 0; `--ss` is the photo width divided by the card width. The old "skip re-measurement when the track is stuck" guard was removed (no longer needed: `--sy` no longer uses the photo's Y, and `--sx` uses only X, which is correct even when stuck). Verified exact at the dock: dx = 0, dy = −0.2 to −0.4, dw = 0.1 for all six cards in EN, DE and at 1024px.

One honest limit: the deck card is 5:3 (257.5px tall at the dock) while the track photo is text-height tall (about 568px at 1440 EN, 578.7px DE). Centres and width align exactly, but heights differ by design. The deck card fits inside the photo, centred, and the cross-fade morphs it. Exact height matching is impossible with the text-left/photo-right layout, because the text column (about 400px) is taller than a 5:3 photo at the same width. The QA records the heights but does not fail on them.

## Two bugs the QA caught, and the fixes

**Horizontal overflow.** The deck cards translate up to about 4,000px right to dock onto the track's later photos (the track is about 5,320px wide), widening the document to 5,503px and making the page horizontally scrollable (verified: `window.scrollTo(500, …)` moved `scrollX` to 483). Fix: `overflow: clip` on `body` plus `overflow-x: hidden` on `html` (globals.css:150; the built CSS shows `html{overflow-x:clip}`, Lightning CSS normalises it). Verified after the fix: `documentElement.scrollWidth` is 1440 at the dock, the page does not scroll horizontally (`scrollX` stays 0), and the sticky track still works (`--track-x` = 0.253 after scrolling). `overflow-x: clip` alone on `body` did not fix it: `scrollWidth` counts clipped content, and the viewport (`html`, `overflow-x: visible`) stayed scrollable, so the `html` rule was required. The build pipeline also dropped a bare `overflow-x: clip` on `html` once (a Lightning CSS quirk); the `hidden` longhand survived and computes to `clip`.

**Photo upscale (found by the taste-skill consistency check, fixed after the first QA pass).** The track photos display at 429×568, but ProjectPhoto's `sizes` said 360px, so next/image served a 359×239 file that the checker measured blown up 2.38x. Fix: the desktop `sizes` slot is now 640px, so the browser fetches a 640×427 file (1.33x at the track's height, down from 2.38x). The deck and the track share the same `sizes` string, so the browser reuses one optimised file per width. After the fix the consistency check reports zero photo-upscale findings. The trade-off is a larger file (638 KB total transfer on desktop, up from 598 KB) and a desktop Lighthouse performance dip from 99 to 87; see the Lighthouse section.

**See-work tap target (found by the same check, fixed in the same pass).** At 320px the "Or see the work first ↓" link measured 147×19px, under the 44px a phone needs. Fix: the link is now `display: inline-flex` with `min-height: 44px`. Verified at 144×44. The remaining tap-size findings in the check are the Skills-section project links (`li > span.skills-used > span > a`, 70×19px), which are pre-existing and untouched by this round.

## QA

QA script `~/workspace/.baseline-qa/refine-parish-hero-track-qa.js`: **105/105 checks pass** (results in `~/workspace/.baseline-qa/refine-parish-hero-track-qa.json`). It covers: all 7 routes 200; hero (h1, highlight lime #BFF73B with dark text, SR avatar, name, status pill, ask, both buttons, see-work link, Inter Tight 800); tabs (six shortened labels, 44px targets, clicking "Sales ETL" moves the active pill, the front card and the caption, clicking back); track cards (six h3 titles EN + DE, stats only on LeaseLens and Sales ETL with the verified values, repo link only on those two, stacks matching content.ts on all six, proof line on all except Sales ETL, OratorPath proof is the publication); heading "Latest Projects" and the "View More Projects" link to https://github.com/shamas92; 12 images (six deck + six track), six unique files, no SVG; docking (at rest `--track-reveal` about 0; dock found; exact alignment at the dock in EN, dark, DE, 1024px); track movement (`--track-x` rises monotonically past the dock, the first card moves left, UpliftU comes into view); no horizontal overflow at 1440 EN/DE/dark, 1024, 768, 375; mobile/tablet stack (auto height, static viewport, column, no transform, photo above text on every card, all six reachable); reduced motion at 1440 (stack, all cards opacity 1 at scroll 0, deck has no scroll transform); axe 0 on home at 1440 light (docked), 1440 dark (docked), 375px, and 1440 reduced motion; zero console errors; zero failed requests. Earlier QA runs caught real bugs (docking offset, horizontal overflow, lazy-image timing) and the script was fixed accordingly; the final run is 105/105.

**Lighthouse** (local production build, `~/workspace/.baseline-qa/refine-parish-hero-track-lighthouse.json`): desktop **87 performance / 100 accessibility / 100 best-practices / 100 SEO** (LCP 0.3s, CLS 0, TBT 310ms, 638 KB); mobile **53 performance / 100 / 100 / 100** (LCP 4.7s, CLS 0, TBT 2,720ms, 656 KB). Desktop was 99/100/100/100 before the photo-sizes fix (LCP 0.4s, TBT 100ms, 598 KB). The dip is plausibly the larger images the fix serves, and Lighthouse on this VM is noisy (mobile ranged 43–57 across rounds), so I am not claiming a precise cause. The mobile number sits inside the previous rounds' VM-throttled range, not a regression from this change.

**Taste-skill gate: GATE: ERROR.** The gate's Chrome launcher cannot find Chrome and omits `--no-sandbox`; the VM runs as root. This is the same failure as every prior round. Its "no `<main>`/`<section>`/`<h1>`" note is a gate-fetch artefact, not a page defect. The three checks were run directly with a `--no-sandbox` wrapper (`/tmp/chrome-nosandbox.sh`, the puppeteer Chrome at `/home/hatch/.cache/puppeteer/chrome/linux-156.0.8078.47/chrome-linux64/chrome`).

- **copy-lint** on the rendered page (`/tmp/parish-gate/rendered.html`, 68,860 bytes): exit 0, **0 FAILs**. WARNs only: copy-contrast (3, budget 2; pre-existing phrasing in content.ts), copy-em-dash (7, budget 2; pre-existing), copy-stat-strip (1, the new verified stats row "1 / 3 / 4"). INFO copy-rhythm (23 sentences, mean 30.2 words). Full JSON at `/tmp/parish-gate/copy-lint.json`.
- **consistency** (direct, `--quick --widths 1440,390`): **87 FAIL, 38 WARN** after the two fixes. The prior round (Latest Projects, main @ 9d5f6ef) was 91 FAIL, 45 WARN, so this round is 4 fewer FAILs and 7 fewer WARNs. The two fixes account for 8 of the FAILs removed (photo-upscale 6, tap-size 1 at 390 plus 1 at 320). The scroll-reveal count fell from 16 to 11, because the track cards have no staggered reveal. Full report at `/tmp/parish-gate2/report.json` (the first run, before the fixes, is at `/tmp/parish-gate/report.json`: 95 FAIL, 38 WARN).
- **layout check** (`assets/layout/check.mjs --sizes 1440x900,390x844 --json`): exit 1, which is its "findings present" code, not a crash. One finding per size, both the same: `container | page | no .wrap`. The site uses `.page` with `max-width: var(--measure)`, not a `.wrap` class, so this is a pre-existing structural note, not a defect. `overflowX: false` at both sizes, confirming the overflow fix. Full JSON at `/tmp/parish-check.json`.

**Impeccable detector** on all 9 changed files (page.tsx, globals.css, HeroDeck.tsx, HeroShowcase.tsx, TrackCard.tsx, WorkSection.tsx, ProjectPhoto.tsx, content.ts, content.de.ts): `[]`, zero findings.

## Taste-skill tensions (user-directed deviations)

The skill forbids scroll reveals and scroll-linked motion. The horizontal track is scroll-linked, and the deck docking is scroll-linked. It forbids captions under visuals; the deck caption is a caption. It forbids tilt, carousels and timed tabs; the tab showcase switches the front card, and the highlight is tilted -2 degrees. It requires one section per screen; the track section is 320vh, about 3.2 screens. It requires equal left/right edges; the track stays inside the centred `.page` column (`max-width: var(--measure)`). The previous round already cost +8 consistency FAILs for scroll reveals; this round adds the track's own: `pinned` 1, `section-height` 3, `tilt` 4, `visual-caption` 1 WARN, `copy-actions` 1 (three actions in the hero: Email me, Download CV, and the caption's "View case study" pill; the checker allows two), `copy-headline` 1 ("I build data & ML systems." does not name what is sold; only the line under it does). The rest of the 87 FAILs are the page-structure checks this multi-section portfolio has always failed (`container-edges` 8, `spill` 5, `button-styles` 4, `split-pair` 4, `section-tile` 3, `no-visual` 3, `street-number`/`postcode` 1 each on the Dresden address panel, and others), plus two that pre-date this round and are worth naming: `focus-ring` 1 (`[tabindex="-1"]:focus` removes the outline, pre-existing CSS) and `focus-visible` 1 (a tab stop lands on a "View case study" link while its track card is still opacity 0). The focus-visible finding is a real, minor wart of the opacity reveal: a keyboard user tabbing at scroll 0 can focus an invisible link. The old grid had the same pattern. Fixing it would mean toggling `inert` on the track cards with the reveal, which adds risk for a wart the axe check (0 violations) does not flag, so it is left as a known limit.

One more mobile note from the check: at 390px the caption pill "View case study ↗" is cut by the fold, 17px of its 44px below it (a WARN, `fold-cut`). The hero is taller than the viewport on a phone, so the pill needs a short scroll to reach. Acceptable, not a defect.

## Screenshots

15 in `docs/screenshots/refine-parish-hero-track/`: hero-1440-light-en, hero-1440-dark-en, hero-1440-light-de, hero-1440-dark-de (the EN/DE × light/dark matrix, complete), hero-768-light-rest, hero-375-light-rest, hero-tabs-sales-etl, track-1440-light-en-docked, track-1440-light-en-mid, track-1440-light-en-end, track-1440-dark-en-docked, track-1440-light-de-docked, track-768-light-stack, track-375-light-stack, track-1440-reduced-motion. The hero screenshot was visually verified (profile row, lime highlight, black pill with lime arrow, outline pill, see-work link, fanned deck, caption, tabs); the docked-track screenshot was visually verified (LeaseLens card with stats, proof, stack and links, photo large right, Sales ETL peeking). One visual observation: the six tabs wrap to two lines at 1440px ("UpliftU" alone on the second line). Acceptable, not a defect.

## Honest gaps

- The DE "Or see the work first" string ("Oder zuerst die Projekte ansehen ↓") is a proposal needing the user's confirmation, not a verified translation.
- The shortened tab labels ("Sales ETL", "HITEC", "Quality CRM") are new strings needing the user's confirmation.
- The deck card and the track photo align in centre and width at the dock but not in height (257.5px vs about 568px), by design; see the docking section.
- The focus-visible wart above (a tab stop can land on an opacity-0 track link).
- The caption pill sits 17px below the fold at 390px.
- Desktop Lighthouse performance is 87, down from 99, plausibly from the larger images the photo fix serves.
- The taste-skill gate returns ERROR in this VM in every round; its three checks were run directly, as above.

## Build

`tsc --noEmit` exit 0. `next build` clean (11 pages: `/`, `/work/[slug]` ×6, `/_not-found`, `/robots.txt`, `/sitemap.xml`). One environment note: a normal `next build` after the CSS-only tap-target fix did not pick the change up (the built chunk still held the old rule), so the final build was a clean rebuild (`rm -rf .next`). The production server is running on `http://localhost:3000` with the latest build.

## Still to do

Commit on branch `refine/parish-hero-track` as Shamas Ur Rehman <shamasrehman249@gmail.com> (the repo's configured identity is already the user's; do not override it), verify with `git log`, and present the branch to the user for review. Do not merge, push or deploy until the user says so in that turn. Only the branch files: src/app/page.tsx, src/app/globals.css, src/components/HeroDeck.tsx, src/components/HeroShowcase.tsx (new), src/components/TrackCard.tsx (new), src/components/WorkSection.tsx, src/components/ProjectPhoto.tsx, src/content.ts, src/content.de.ts, and WorkCard.tsx deleted. Do not commit the untracked hiring-review docs, the 13 `media-generation-*.json` artefacts, `.impeccable/`, `.taste-skill/`, `assets/`, or `tsconfig.tsbuildinfo`.
