# Header polish + HITEC project: report

Branch `redesign/header-i18n`, on top of `50023ff`. Four commits: `85ac18e`
(content), `026bdf0` (polish + Download CV), `93b10c8` (integrity), `f895398`
(fold pacing). Not merged, not pushed, not deployed.

## 1. Geometry: one 8px radius

The SR monogram, both hero CTAs, the active nav pill and its ghost, the
Download CV pill, the DE/EN toggle and its options, the theme toggle, the
menu button, the icon buttons, the tooltips and the footer copy button all
use `rounded-lg` (8px) now. Only the status dots stay circular.

Two capsules were deliberately kept, as a judgement call rather than an
oversight:

- The floating scrolled header bar itself stays 999px. It is the bar, not
  an inner control; the pill shape is what makes it read as floating.
- The hero availability pill stays 999px. It is a badge, not a button.

The filter pills and the `.proof-badge` also stay 999px. They were outside
the header + hero scope of this polish, so they were left alone.

## 2. DE/EN toggle de-emphasized

The active segment is now neutral: `bg-neutral-100` (`#f5f5f5`) in light
mode, `bg-neutral-800` (`#262626`) in dark mode, with primary ink text.
There is no blue anywhere in the toggle. New tokens `--lang-active-light`,
`--lang-active-dark` and the alias `--lang-active` carry the values.
Verified in the browser: computed active background `rgb(245, 245, 245)`,
text `rgb(20, 20, 19)`.

## 3. Status dots: one indicator, emerald

The redundant green dot next to `Shamas Ur Rehman` in the navbar is gone
entirely, tooltip included. Removed: the span in `SiteHeader.tsx`, the
`.presence` / `.presence-dot` CSS rules and their reduced-motion entry, and
the `availabilityTooltip` key from both locales.

The single remaining indicator is the dot inside the hero badge. It is now
emerald `#10B981` in both themes (verified `rgb(16, 185, 129)`).
`--presence-light` changed from `#047857` to `#10b981`; the dark value was
already `#10b981`. `.status-dot` points at `var(--presence)`.

## 4. Hero claim: lighter, secondary

The subheadline drops from `font-weight: 600` to `400` and takes
`var(--ink-muted)` (`#57534E` light / `#A8A29E` dark). Verified light:
weight 400, colour `rgb(87, 83, 78)`. `Shamas Ur Rehman` anchors the page
again.

## 5. Hero pacing: the Work section peeks above the fold

Desktop only (`min-width: 1024px`); mobile pacing is unchanged. The hero
loses padding (96/64 → 32/24), the actions row loses 8px of top margin, and
the Work section loses 16px of top padding plus 24px of internal gaps
(filter pills, filter note, flagship grid). Measured card tops:

| Viewport  | EN    | DE    |
| --------- | ----- | ----- |
| 1440×900  | 878px | 878px |
| 1920×1080 | 862px | 862px |

The Work divider, heading and the first flagship card tops are visible
without scrolling in all four cases.

Two things worth knowing about how this landed. The first pass (hero
padding 64/48) left the card tops at 910px on a 1440×900 screen, 10px
below the fold, so the extra trims were needed. And the desktop overrides
must sit after the base rules they replace: the first version of the block
sat above `.hero-actions` / `.filter-pills` / `.flagship-grid` in the file,
and the later base rules won at equal specificity, silently dropping 32px
of the intended trims. The block now lives after the flagship grid rules,
with a comment saying so.

## 6. Download CV in the header: merge blocker resolved

Decision: **keep Download CV**. The user said so on the morning of
2026-11-24 ("make main cv download button instead of copy email
button"), and it is live on main in the hero and header (commit `8ab0f7f`).
The branch's Copy Email pill was an artifact of the header brief, which
was written before that decision. Reverting an explicit user decision
would have been wrong.

What changed on this branch:

- `SiteHeader.tsx` renders `DownloadCvButton` in the desktop utility
  cluster (pill) and in the mobile top bar (icon-only). The component
  already existed and is used by the hero; it was reused, not rebuilt.
- `DownloadCvButton` gained one optional prop, `iconOnly`, which renders
  a download SVG with `aria-label` and `title` from the locale label. Its
  existing API and locale handling are otherwise untouched.
- Unchanged: the hero (already Download CV), the footer email (mailto +
  Copy email button), and the mobile menu bottom strip.

Verified: desktop pill reads "Download CV" / "Lebenslauf herunterladen",
links to `/Shamas_Ur_Rehman_CV.pdf` with the `download` attribute, 8px
radius, solid ink background. At 390px the icon-only button is visible,
carries `aria-label` "Download CV" / "Lebenslauf herunterladen", and shows
the download SVG. This resolves the merge blocker flagged in
`docs/header-i18n-report.md`.

## 7. New project: HITEC University Web Platform & Admin Panel

First entry of Tier 2 ("Earlier & Institutional Systems"), below the three
flagships, above Quality CRM and UpliftU. Year 2025, slug `hitec-cms`,
stack C#, ASP.NET MVC, SQL Server, Python, RAG. The row carries the
`Internal / Archived` badge (German: `Intern / Archiviert`) and links to
the internal case page `/work/hitec-cms`. No external URL exists anywhere
for this project.

The case page has five blocks (Problem, Architecture, Outcome, Evidence,
Stack) and no Links block at all (`links: []`, not an empty block). The
Evidence line reuses the Tier 2 status line verbatim: "No figures were
measured for this project." / "Für dieses Projekt wurden keine Kennzahlen
gemessen." Content comes only from the user's brief and the existing
Background internship entry; nothing was invented.

## 8. Filter-count verification

Counts are fully derived from the project list now; nothing is hard-coded.
The `showingAll` / `showingSome` strings take a `{total}` placeholder, and
the stale `cSharpNote` special case (and its strings) was removed from both
locales, since C# now matches a project.

- "All (6)", "Showing all 6 projects." / German "Alle 6 Projekte werden
  angezeigt."
- C# (1), ASP.NET MVC (1), SQL Server (1), Python (3), RAG (2). The rest
  are unchanged: TypeScript (1), SQL (3), PyTorch (1), Docker (1),
  Next.js (1), FastAPI (1), PostgreSQL (1), Apache Airflow (1), Docker
  Compose (1), Hugging Face (2), Laravel (1), MinIO (1), MySQL (1),
  NLP (2), Parquet (1), PHP (1), SAM 3.1 (1).
- Clicking C#: the note reads "1 of 6 projects use C#.", the HITEC row
  stays at full opacity, Quality CRM and UpliftU dim to 0.35. Clicking
  All resets to "Showing all 6 projects."
- The capabilities matrix does not change; all five tags were already in
  it.

## 9. Content integrity

`scripts/header-i18n-integrity.mjs` was rebaselined from `8ab0f7f` to
`50023ff`, and `docs/header-i18n-integrity.md` was regenerated. Part A:
176 old sentences checked, 0 unexplained missing, 0 unexplained added;
links 6/6 kept, images 2/2 kept. Part B: 1 missing key (the intentional
lease-quote gloss omission), 0 extra keys, 170 identical values all
explained, 0 unexplained. **Result: zero unexplained differences.**

## 10. QA

Production build (`next start`) plus a focused Playwright pass
(`~/workspace/.baseline-qa/header-polish-qa.js`, results in
`header-polish-qa.json`):

- Header morph at y<24 / y>=24: 1120px, 0 radius, no shadow at the top;
  768px capsule, 999px radius, shadow set once scrolled. The morph still
  works after the radius change.
- Toggle neutral, navbar dot absent, hero dot emerald, claim lighter,
  all verified by computed style, EN and DE.
- Fold peek 4/4 (see §5). HITEC row first in its tier with the badge, in
  both languages. `/work/hitec-cms` renders EN and DE with all five
  blocks and no Links block; the language toggle works on the case page;
  Work stays the active nav item there.
- Download CV verified on desktop and mobile, both languages (see §6).
- Zero console errors across the whole pass.

Accessibility: axe reports **0 violations** on home EN, home DE,
`/work/hitec-cms` EN and `/work/hitec-cms` DE (40 / 40 / 38 / 38 passes).

Lighthouse (local, throttled, same rig as the previous report): mobile
home **73** (previous 72–74, unchanged); desktop home **83**, then **96**
on a second run (previous 92). The 83 was run-to-run variance on the
shared VM (TBT 387ms vs 174ms on the re-run), not a regression.
Accessibility / Best Practices / SEO 100, CLS 0. The polish did not change
the performance profile; the framer-motion bundle cost from the
header-i18n build is still the driver.

## 11. Screenshots

Added to `docs/screenshots/header-i18n/` (the existing set was kept):

- `home-1440x900-fold-en.png`, `home-1440x900-fold-de.png`,
  `home-1920x1080-fold-en.png`, `home-1920x1080-fold-de.png`: the fold
  with Work peeking
- `home-390-polish-en.png`: mobile, with the download icon in the header
- `hitec-cms-1440-en.png`, `hitec-cms-1440-de.png`: the new case page,
  full page
- `home-1440-scrolled-pill-polish.png`: the floating header capsule

## 12. Deliberately left out / unsure

- The scrolled header bar and the hero pill stay 999px capsules, and the
  filter pills and `.proof-badge` stay 999px (see §1). Judgement calls,
  not oversights.
- `CopyEmailButton`'s pill and icon-only variants are now unused by any
  caller: only the footer outline button uses the component. The variants
  were left in place rather than deleted.
- The three open TODO(content) items are untouched (CV file, availability
  line wording, OratorPath live dashboard URL). The HITEC project closes
  none of them.
- Lighthouse desktop varied 83–96 across two runs on this VM. Treat the
  desktop number as noisy; it is neither a regression nor an improvement.
- Not checked: dark-mode screenshots of the new polish (axe and the
  integrity check cover dark mode logically; the previous report's dark
  screenshots still stand), and the full header-i18n QA suite was not
  re-run; only the polish checks above. The earlier suite's results
  still stand for the behaviours this polish did not touch.
