# Engineering Spec Sheet — build report

Branch `redesign/spec-sheet`, from `main @ deaf356` (the live Engineering
Notebook). Nine commits, local only. Nothing merged, nothing pushed,
nothing deployed. Production build, typecheck, lint, and Prettier pass.
Content integrity is zero unexplained differences
(`docs/spec-sheet-integrity.md`).

## What the rebuild changes

The Notebook was a reading document. The Spec Sheet is a technical
document. Same facts, same five projects, same links. The presentation
now reads like an RFC: one sticky header, a hero that states the claim
and the availability, flagship cards with drawn diagrams, a filterable
work index, a capabilities table, and a two-column background.

### A. One sticky header

The `Contents` rail is gone from the home page and the case pages.
`Rail.tsx`, `ProjectRow.tsx`, `StackGroup.tsx`, and `Timeline.tsx` are
deleted; `Background.tsx` is the renamed Timeline. Case pages keep
their six blocks as plain stacked sections with anchor ids and the
"All projects" back link.

The header carries the wordmark `Shamas Ur Rehman` (links to `/`),
anchor links Work, Background, Stack, Contact with a scroll-spy active
indicator (`IntersectionObserver`, `aria-current`), GitHub and LinkedIn
icon+text links, a compact Copy Email button, and the theme toggle.
Narrow screens put the nav on its own row. On small phones the brand
link labels hide and the icons carry aria-labels.

### B. Hero

Name, the positioning statement verbatim ("I build data & ML systems —
and prove every claim on this page."), an availability pill directly
under the headline (`Dresden · Werkstudent eligible, 20h/wk`) with a
pulsing accent dot, the status line `MSc Computer Science, TU Dresden,
Dresden, Germany`, and two actions: `View Flagship Work` (scrolls to
`#work`) and `Copy Email` (`shamasrehman249@gmail.com`). The raw
`LeaseLens · 86.1% registered IoU · 197 tests · v1.0.0` string is
removed from the hero. Those numbers live in the LeaseLens card, where
they have visual context.

### C. Two-tier work

Tier 1, Flagship Systems: LeaseLens, Sales ETL Pipeline, OratorPath.
Full cards in a 3-column grid. Each card has a custom SVG visual, year,
title linking to `/work/[slug]` with a 3px arrow nudge, a one-sentence
problem, a plain-English proof callout, and monospace stack tags.

Tier 2, Earlier Systems: Quality Management & Defect-Tracking CRM and
UpliftU in a compact border-separated two-row index below the flagships.
The repeated "Shipped as an academic project" copy is replaced with
concrete scope drawn only from existing content. CRM: "Relational
defect tracking in Laravel/MySQL — one record for every defect."
UpliftU: "Structured NLP student support in Python/Hugging Face."

Proof callouts, composed verbatim from existing content:

- LeaseLens: the outcome-claim note ("Registered IoU measures overlap
  after the two photos are aligned, so the score compares the same wall
  instead of two photos taken from different spots.") plus the metrics
  line "86.1% registered IoU · v1.0.0 · 197 tests (132 backend, 65
  frontend)". The IoU is alignment accuracy on the v7 demo pairing,
  measured live twice identically. The 197 tests are the v1.0.0
  automated suite count. The two facts sit side by side and are never
  phrased as one measurement.
- Sales ETL Pipeline: "One DAG, three tasks, four tables: dim_date,
  dim_customer, dim_product, fact_sales."
- OratorPath: "Peer-reviewed publication, 2025: Spectrum of
  Engineering Sciences, Vol. 3, Issue 7, pp. 843–852, ISSN 3007-3138."

### D. Stack filter and capabilities matrix

Twenty filter pills sit above the Work section: All plus every
project-linked tag (Python, TypeScript, SQL, PyTorch, Docker, Next.js,
FastAPI, PostgreSQL, C#, Apache Airflow, Docker Compose, Hugging Face,
Laravel, MinIO, MySQL, NLP, Parquet, PHP, SAM 3.1), each with a count.
Clicking a pill dims every non-matching project to opacity 0.35 with a
180ms CSS transition. Nothing hides, nothing reorders, so no-JS still
shows all five projects. Pills are real buttons with `aria-pressed`.
A note line states the match count, and the C# pill states the honest
result: "No shipped project lists C#. It appears in Background — the
HITEC internship and Heavy Industries Taxila." The filter rules: Docker
covers Docker Compose, SQL covers PostgreSQL/MySQL.

The capabilities matrix groups all 35 items in four columns, plain
text, no links:

- Data & Pipelines (12): SQL, Pandas, NumPy, Matplotlib, scikit-learn,
  time-series analysis, anomaly detection, Tableau, Excel, Parquet,
  MinIO, Apache Airflow.
- ML & NLP (6): Python, PyTorch, Hugging Face, RAG, NLP, SAM 3.1.
- Full-Stack (10): TypeScript, JavaScript, PHP, C#, ASP.NET MVC,
  Next.js, React, FastAPI, Laravel, REST APIs.
- Infra & DBs (7): PostgreSQL, MySQL, SQL Server, Docker, Docker
  Compose, Git, Linux (Ubuntu).

Every skill appears exactly once. The brief said 31 skills, but
`src/content.ts` holds 29 in `skillGroups` (Languages 6, Data & BI 8,
Frameworks & AI 8, Databases 3, Tools 4). The other six items in the
matrix (Parquet, MinIO, Apache Airflow, SAM 3.1, Laravel, Docker
Compose) are stack tags from the projects, not `skillGroups` entries.
The matrix carries no fake links and attributes no skill to a project
it was not linked to. The old single-project skill links are replaced
by the filter pills.

### E. Asymmetric background

Experience (left) and Education (right) in a two-column desktop grid.
The Heavy Industries Taxila bullet is rewritten in direct first-person
voice: "Built real-time C#/.NET and SQL Server process monitoring with
live dashboards, cutting manual logging errors by 20%." The 20% figure
was already in the content; the sentence restates it, it does not add
a claim. Spoken Languages (English C1 / IELTS 7.5, German A1/A2, Urdu
Native) and Certificates (the four Google certificates, Nov 2025 –
Sep 2026) compress into a horizontal metadata strip under the grid.

### F. Footer

Email, Copy Email, GitHub, LinkedIn, Dresden location, and the closing
line verbatim: "Every claim on this page carries its evidence."

## Design tokens

Fonts: Geist for display and body, JetBrains Mono for technical
metadata (years, test counts, versions, metrics, stack tags), loaded
via `next/font`, self-hosted, display swap, metric-matched fallbacks,
Latin + Latin-Extended subsets. Newsreader italic is kept only for
case-study quotes, because Geist has no italic. That is a deliberate
choice, documented here.

Accent: Technical Cobalt, `#1D4ED8` light / `#3B82F6` dark. It is used
only for interactive links, the live availability dot, active filter
states, and verified proof badges.

Light tokens: ground `#FAF9F7`, surface `#FFFFFF`, ink `#141413`,
secondary `#57534E`, borders `#E6E4E0`. Dark tokens: ground `#0C0C0B`,
surface `#141413`, ink `#F5F5F4`, secondary `#A8A29E`, borders
`#262624`. The theme is driven by `data-theme` on `<html>`, never the
media query. Light is the default. The toggle persists in
`localStorage` and a `beforeInteractive` script in the head applies the
stored theme before first paint, so dark never flashes light.

### Contrast ratios (computed, WCAG AA 4.5:1 body)

| Pair                            | Light | Dark  |
| ------------------------------- | ----- | ----- |
| Primary ink on ground           | 17.52 | 17.94 |
| Secondary ink on ground         | 7.25  | 7.76  |
| Accent on ground                | 6.37  | 5.32  |
| Accent on surface               | 6.70  | 5.01  |
| Ground on ink (primary button)  | 17.52 | 17.94 |
| Ground on accent (button hover) | 6.37  | 5.32  |

The tightest pair is the dark accent on surface, 5.01:1. It still
passes AA. Active filter-pill text uses the page ground in both themes
(6.37 light / 5.32 dark) because white on the dark accent would fail
at about 3.3:1.

## Custom visual assets

Three inline SVG technical illustrations in
`src/components/SpecAssets.tsx`, theme-aware through `currentColor`
and the accent token, fixed aspect ratio via viewBox, `role="img"` +
`<title>`, 1px/1.5px strokes:

1. LeaseLens: split-frame schematic, move-in vs. move-out room
   boundary overlay, segmentation bounding box, `86.1% IoU` alignment
   reticle. The figure is verified and may be shown.
2. Sales ETL Pipeline: horizontal node-and-edge DAG (Sources → MinIO /
   Parquet → Airflow Tasks → PostgreSQL Star Schema) with animated
   `stroke-dashoffset` flow on the connectors and the caption
   "1 DAG · 3 TASKS · 4 TABLES".
3. OratorPath: audio waveform paired with structured metric bars
   (pace, filler words, clarity). The bars are schematic and carry no
   numeric labels, because no such values exist in the content.

No stock photos. No invented numbers.

## Motion

No framer-motion. The dependency was not installed, and the report
justifies that in one sentence: the filter highlights in place with
CSS opacity transitions and the reveals use IntersectionObserver plus
CSS, so no layout-animation library is needed.

- GPU-only properties: transform and opacity, plus SVG
  `stroke-dashoffset` on the ETL connectors. Width, height, top, left,
  and box-shadow are never animated.
- One ease token, `cubic-bezier(0.22, 1, 0.36, 1)`: reveals 350–450ms,
  micro-interactions 150–180ms.
- Hero entrance: 40ms stagger, 12px rise. The h1 is never animated;
  it is the LCP element and stays visible for first paint.
- Scroll reveals trigger once at about 20% visibility, 16px translate
  plus opacity fade. The hidden state is gated by
  `@media (scripting: enabled)`, so no-JS readers see everything.
- Copy email swaps to `Copied ✓` with a 180ms scale pop and keeps the
  aria-live announcement. Project cards nudge the arrow 3px on hover
  and sharpen the border on focus/hover.
- Hover lifts and arrow nudges sit inside `@media (hover: hover)`, so
  touch devices never get stuck hover states.
- `prefers-reduced-motion: reduce` disables transforms and staggers
  and shows final states. The print stylesheet forces the light theme
  even when the toggle is dark.

## The hydration fix

The first QA run stopped at the theme section. After clicking dark
mode and reloading, the page threw React error 418, a hydration
mismatch on the `<html>` element, and the stored theme was lost.

The cause was the toggle's `useSyncExternalStore` call. Its third
argument, `getServerSnapshot`, read the live DOM, so during hydration
it returned `dark` and rendered the sun icon while the server HTML
carried the moon icon. The fix, commit `b4d4ccb`:

- `getServerSnapshot` now returns `"light"` unconditionally. The
  server always renders light; the stored theme is applied by the
  head script and read back after hydration.
- The no-flash script moved from a raw `<script>` in the layout to
  `next/script` with `strategy="beforeInteractive"`. The raw tag drew
  a React warning about scripts inside components.
- Scroll reveals no longer depend on a `js` class added by the theme
  script. They are gated by `@media (scripting: enabled)` instead,
  so no class mutation can disturb hydration.

After the fix, the reload test passes with no page errors: dark
persists across reload, background `#0C0C0B`, toggle label reads
"Switch to light mode".

## Lighthouse

Lighthouse 13.6.0, production build on localhost, throttled mobile
preset, Chrome 156.

| Page               | Perf  | A11y | BP  | SEO | LCP      | CLS | TBT        |
| ------------------ | ----- | ---- | --- | --- | -------- | --- | ---------- |
| Home, desktop      | 99    | 100  | 100 | 100 | 0.3s     | 0   | 90ms       |
| Home, mobile       | 77–80 | 100  | 100 | 100 | 0.8–2.0s | 0   | 790–1070ms |
| LeaseLens, desktop | 100   | 100  | 100 | 100 | 0.3s     | 0   | 10ms       |
| LeaseLens, mobile  | 96    | 100  | 100 | 100 | 0.9s     | 0   | 230ms      |

Home mobile ran three times: 79, 77, 80. The 95 Performance target is
not met on the home page. Total Blocking Time is the driver, 790–1070ms
under throttling, and it is the Next.js framework baseline: the home
page carries the filter, scroll-spy, reveals, theme toggle, and claim
toggle as client components, and their hydration cost lands in TBT.
LeaseLens mobile scores 96 with the same framework, because the case
pages are lighter. CLS is 0 everywhere. INP has no lab value in these
runs (no interactions in the trace), so TBT is the reported blocking
measure.

## Bundle

Home page, mobile, transferred: 258 KiB total. Script 147.2 kB, fonts
87.9 kB, document 9.7 kB, stylesheet 7.8 kB, other 5.1 kB. Third-party
0 kB, images 0 kB (the visuals are inline SVG). Top five chunks on
disk, uncompressed: 228 kB, 169 kB, 110 kB (framework and runtime
chunks), 40 kB, 29 kB (page chunks). The `@next/bundle-analyzer`
plugin is wired and runs with `ANALYZE=true`, but its HTML report did
not materialize in this environment, so chunk roles are identified
from size, not from the treemap. Nothing else was added: the only
runtime dependencies are Next 16.4.6, React 19.3, and react-dom.

## QA results

Playwright, Chrome 156, production server on port 3000. Full script:
`~/workspace/.baseline-qa/spec-sheet-qa.js`, results in
`/tmp/spec-sheet-qa.json`.

- Viewports 320, 360, 390, 768, 1024, 1280, 1440, 1920: no horizontal
  overflow on home or LeaseLens, zero targets under 44px, 3 flagship
  cards, 2 index rows, 20 pills, 35 matrix items, no hero proof
  strip, no rail on the case page, no w=3840 image requests.
- Landscape 844×390 and 1024×768: no overflow. 200% zoom at 1440:
  no overflow.
- Filter, settled states (350ms wait): Python dims ETL, OratorPath,
  and CRM to 0.35 and keeps LeaseLens and UpliftU at 1, with the note
  "2 of 5 projects use Python." C# dims all five to 0.35 with the
  explanatory note. All returns everything to 1.
- Theme: toggle to dark, reload, dark persists, background `#0C0C0B`,
  toggle back to light. No page errors.
- Scroll-spy: scrolling to Background marks it `aria-current="true"`.
  Header position is sticky.
- axe-core: 0 violations, 41 passes, on home and LeaseLens in light
  and dark.
- Keyboard: first Tab lands on the skip link, visible at top 8px and
  47px tall after focus. The claim toggle opens with Enter and closes
  with Escape, focus returning to the claim. Filter pills toggle with
  Space.
- No-JS: h1, claim, pill, 3 cards, 2 rows, 20 pills, 35 matrix items
  all render; 0 reveal-hidden elements.
- Reduced motion: availability-dot animation is `none`, 0 of 6
  reveals hidden.
- Fonts: `document.fonts.check` confirms ä, ö, ü, ß render in Geist
  and in JetBrains Mono.

One QA bug found and fixed in the script itself: the dark screenshots
were first taken with `addInitScript` given a string
`"() => {...}"`, which only defines a function and never calls it, so
the dark shots were light. The script now passes the function
directly. The dark screenshots and dark axe runs were re-taken after
the fix and are genuine.

## Content integrity

`scripts/content-integrity.mjs` compares `main:src/content.ts`
(Notebook, commit `deaf356`) against the new content and the fresh
production build's rendered HTML. Full report:
`docs/spec-sheet-integrity.md`. Result: zero unexplained differences.
138 old sentences checked, 136 preserved, 2 allowlisted removals (the
two HIT-bullet sentences), 6 allowlisted additions (3 proof callouts —
the OratorPath one needed two fragment entries because the sentence
splitter breaks at "Vol." — plus 2 scope lines and the HIT rewrite).
6 of 6 links and 2 of 2 images kept. Exit code 0.

The 3 open TODO(content) items stay open: CV file, availability line
wording, OratorPath live dashboard URL. Nothing invented for them.

## Screenshots

`docs/screenshots/`, 12 files: home and LeaseLens at 390, 768, and
1440px, in light and dark. The 390px header wraps into three rows
(wordmark, icon links, nav) with no overflow. Dark renders the accent
`#3B82F6` cleanly on `#0C0C0B`, and the SVGs adapt through
`currentColor`.

## Commits

1. `15cb2cc` Content: tier-2 scope lines, flagship proof callouts,
   first-person HIT bullet
2. `aedb5d1` Design: spec-sheet tokens, Geist/JetBrains Mono, theme
   script
3. `ef68aef` Header: sticky bar, scroll-spy nav, theme toggle, icon
   links
4. `33cbc2f` Work: flagship cards, SVG assets, stack filter,
   capabilities matrix
5. `b9f63ef` Home: spec-sheet hero, two-tier work, asymmetric
   background
6. `e28facc` Fix: lint errors and Prettier formatting
7. `293ddb7` Checks: spec-sheet content-integrity script + report
8. `7dc5c8e` Social: restyle OG image to the spec sheet
9. `b4d4ccb` Fix: theme toggle hydration mismatch (React error 418)

## Known nits and things not checked

- When stack tags wrap, the comma separator can land at the start of
  a line (", Python, SAM 3.1"). Cosmetic. Same pattern as the
  Notebook.
- The LeaseLens SVG reads small inside its frame. The drawing uses
  the full viewBox, but the thin frame leaves a lot of white space.
- The bundle-analyzer HTML did not materialize, so the top-five list
  is chunk sizes on disk, not the treemap.
- INP has no lab value. Field INP needs real user traffic.
- The impeccable detector ran on the changed source files and returned
  no issues.
- The 95 mobile Performance target is not met on the home page
  (77–80). The case pages clear it. The gap is TBT, and TBT is the
  framework baseline under throttling, not the page's own scripts.
