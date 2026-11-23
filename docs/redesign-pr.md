# PR: Engineering Notebook redesign

**Branch:** `redesign/notebook` → `main`. Local only: not pushed,
not deployed. 9 commits on top of `main` @ `b7c0689`.

## What this does

Rebuilds the portfolio in the "Engineering Notebook" direction: a
well-typeset engineering report. One reading column, a narrow left
rail with the sticky section index, hairline rules instead of boxes.
Oxide-red accent (#9A3324 light / #E07856 dark). Newsreader
headings, Inter Tight body, JetBrains Mono for years, figures and
labels. System theme only, no toggle. The five `/work/[slug]` case
pages stay, restyled to six uniform blocks (Problem, Architecture,
Outcome, Evidence, Stack, Links).

## Decisions already made (not re-opened here)

1. Keep the `/work/[slug]` pages.
2. Accent is oxide red (verified 6.84:1 light, 6.16:1 dark).
3. Fonts are Newsreader + Inter Tight + JetBrains Mono.
4. No manual theme toggle.
5. The "no figures measured" note stays as a plain status line.

## What to check in review

- `docs/redesign-report.md`: Lighthouse numbers, bundle sizes,
  contrast ratios, accessibility results, changelog mapped to the
  ten problems.
- `docs/content-integrity.md`: zero unexplained differences
  (136 old sentences, 133 preserved, 3 allowlisted removals).
- `docs/screenshots/`: home + LeaseLens at 390, 768 and 1440 px,
  light and dark, full page.
- `DESIGN.md`: rewritten for this direction. `PRODUCT.md` is
  stale (cabinet era) and deliberately untouched.

## Measured results

- Lighthouse (local production build, throttled): home mobile
  81–89 Performance across runs / 100 / 100 / 100, LCP 0.8–1.0 s,
  CLS 0; desktop 99–100. **The 95 mobile target is not met**:
  Total Blocking Time (450–820 ms) is the Next.js framework
  baseline under throttling, not the page's own code. Honest
  numbers, no faking.
- axe: 0 violations, home and LeaseLens, light and dark.
- No overflow at 320–1920 px, landscape, 200% zoom, or dark theme.
- Contrast: every text pair passes AA in both themes.
- Content: zero unexplained differences (script:
  `scripts/content-integrity.mjs`).

## Still open (not in this PR)

- Three TODO(content) items: CV file, availability line wording,
  OratorPath live dashboard URL. Nothing was invented for them.
- Impressum + Datenschutzerklärung pages, custom domain
  (shamasrehman.dev), user's final verdict, unchanged from before.
- No test runner was added (plain Node script + Playwright QA rig
  instead); see the report for the reasoning.

## How to verify locally

```bash
git checkout redesign/notebook
npm install
npm run build
npm run start   # http://localhost:3000
node scripts/content-integrity.mjs   # after the build
```

Checks that must pass: `tsc --noEmit`, `eslint src/`,
`prettier --check "src/**/*.{ts,tsx}"`, `npm run build`.
