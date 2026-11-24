# PR addendum: header polish + HITEC project

Addendum to the `redesign/header-i18n` PR (`docs/header-i18n-pr.md`).
Commits on top of `50023ff`: `85ac18e`, `026bdf0`, `93b10c8`, `f895398`.
Still local only: not merged, not pushed, not deployed.

## What this adds

**Header + hero polish (5 fixes)**

- One geometry: 8px (`rounded-lg`) radius on the SR monogram, hero CTAs,
  nav pill, Download CV pill, DE/EN toggle, theme toggle, menu button and
  icon buttons. Only the status dots stay circular. The floating header
  bar and the hero pill deliberately stay capsules.
- DE/EN toggle de-emphasized: neutral active segment
  (`bg-neutral-100` / dark `bg-neutral-800`), no blue anywhere in it.
- Navbar presence dot removed (tooltip included). One indicator remains:
  the hero badge dot, now emerald `#10B981` in both themes.
- Hero claim drops to `font-normal` in secondary ink, so the H1 anchors
  the page.
- Desktop hero pacing tightened (hero padding 96/64 → 32/24, plus smaller
  Work-section gaps). At 1440×900 and 1920×1080, EN and DE, the Work
  divider, heading and first flagship card tops show without scrolling
  (card tops 878px / 862px). Mobile pacing unchanged.

**Download CV in the header: merge blocker resolved**

The branch's Copy Email pill is replaced by Download CV, per the user's
instruction on 2026-11-24 ("make main cv download button instead of copy
email button"), live on main in commit `8ab0f7f`. The header brief
predates that decision; reverting it would have been wrong. Desktop pill
and a new icon-only mobile button, both locale-aware ("Download CV" /
"Lebenslauf herunterladen"). Hero, footer and mobile menu strip unchanged.

**New project: HITEC University Web Platform & Admin Panel (2025)**

First entry of Tier 2, with an `Internal / Archived` badge (DE:
`Intern / Archiviert`) and a `/work/hitec-cms` case page (Problem,
Architecture, Outcome, Evidence, Stack, with no Links block and no
external URL). Stack: C#, ASP.NET MVC, SQL Server, Python, RAG. Content from the
user's brief and the existing Background internship entry only.

Filter counts are now fully derived: All (6), C# (1), ASP.NET MVC (1),
SQL Server (1), Python (3), RAG (2). The stale C# note is removed. The
capabilities matrix does not change.

## Verification

- `npm run build` passes; TypeScript, ESLint and Prettier clean.
- Content integrity: zero unexplained differences (rebaselined to
  `50023ff`; see `docs/header-i18n-integrity.md`).
- Browser QA: header morph, neutral toggle, no navbar dot, emerald hero
  dot, lighter claim, fold peek 4/4, HITEC row + case page EN/DE, filter
  counts (C# click leaves only HITEC at full opacity), language toggle
  on the case page, Download CV on desktop and mobile in both languages.
  Zero console errors.
- Axe: 0 violations on home and `/work/hitec-cms`, EN and DE.
- Lighthouse (local, throttled): mobile home 73 (was 72–74, unchanged),
  desktop home 83–96 across two runs (was 92; variance, not a change).
  A11y / BP / SEO 100, CLS 0.
- Screenshots in `docs/screenshots/header-i18n/`: fold shots at
  1440×900 and 1920×1080 (EN + DE), home at 390px, the new case page at
  1440px (EN + DE), and the scrolled header pill.

Full detail: `docs/header-polish-report.md`.

## Open items (unchanged by this work)

- The three TODO(content) items stay open: CV file, availability line
  wording, OratorPath live dashboard URL.
- The `CopyEmailButton` pill/icon variants are now unused (footer only
  uses the outline shape); left in place.
- Vercel Git connect still open (needs the user's sign-in); this branch
  is not deployed.

## Final decisions (2026-11-24, on top of this addendum)

The user's five final decisions, applied on this branch before the
merge — full detail in `docs/final-decisions-report.md`:

- **Oxide red** replaces Technical Cobalt (`#9A3324` light /
  `#E07856` dark, washes `#F9E7E0` / `#33150F`); contrast rechecked,
  all accent pairs pass 4.5:1. The emerald hero dot is untouched.
- **Newsreader + Inter Tight** replace Geist (JetBrains Mono
  unchanged). Both load via `next/font`, latin + latin-ext.
- **Evidence block omitted** for Quality CRM, UpliftU and HITEC —
  no block, no status line, in either locale. LeaseLens, ETL and
  OratorPath keep theirs.
- **Keep the work pages** and **add the theme toggle**: both were
  already the branch's state; verified, no change.

Verification: build/lint/Prettier clean, content integrity zero
unexplained differences, axe 0 violations (home EN/DE, HITEC EN/DE,
LeaseLens EN), Lighthouse home mobile 75–81 / desktop 95, zero
console errors. The merge and deploy record is in
`docs/final-decisions-report.md` §7–§8.
