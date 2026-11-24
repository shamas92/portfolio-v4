# Final decisions: oxide red, Newsreader + Inter Tight, Evidence block omitted

Branch `redesign/header-i18n`, on top of `a18640f` (the header polish +
HITEC project). Three commits: `ac9da9e` (oxide red), `f887be2`
(fonts), `e0db7b1` (Evidence block), `4c97cbd` (integrity, contrast
table, OG image). The user's five final decisions (2026-11-24) are
applied as the branch's final state; two of them needed no change
(keep the `/work/[slug]` pages, add/keep the theme toggle).

## 1. Oxide red accent

Technical Cobalt is gone. The accent tokens are now the Notebook
values: **#9A3324 light / #E07856 dark**, with warm washes **#F9E7E0
light / #33150F dark** and matching `--accent-on-wash` values. The
change touches only the token block in `globals.css` (plus the
filter-pill comment). Every accent use (links, active nav-pill
label, active filter states, proof badges, focus rings, claim
underlines, footer email rule) follows the tokens. The emerald
`#10B981` hero presence dot is untouched: it is a status colour,
not the accent. The DE/EN toggle stays neutral; there is no blue
and no red in it. The OG image was regenerated with the same
change (Newsreader name, Inter Tight claim, oxide-red rule at the
bottom edge).

Contrast, computed with the same WCAG calculator that reproduced
the cobalt table exactly (6.37 / 5.32), all pass 4.5:1:

| Pair | Ratio |
| --- | --- |
| Light accent on ground | 6.95:1 |
| Light accent on wash (nav pill) | 6.10:1 |
| Light ground on accent (active filter pill) | 6.95:1 |
| Dark accent on ground | 6.51:1 |
| Dark accent-on-wash on wash (nav pill) | 5.57:1 |
| Dark ground on accent (active filter pill) | 6.51:1 |
| Light accent on surface (proof metrics) | 7.31:1 |
| Dark accent on surface (proof metrics) | 6.14:1 |

Every accent pair is at or above the cobalt values it replaces
except the dark nav pill (5.57:1 against 5.78:1), which still
passes with margin. White on the dark accent is 3.00:1, so white
text on the accent is never used. The active filter pill uses
the page ground instead, as before. The contrast table in
`docs/header-i18n-report.md` carries the new values.

Verified in the browser (computed styles, light and dark, EN and
DE): nav label `rgb(154, 51, 36)` / `rgb(224, 120, 86)`, pill wash
`rgb(249, 231, 224)` / `rgb(51, 21, 15)`, active filter pill
`rgb(154, 51, 36)` / `rgb(224, 120, 86)` with ground text,
proof-badge border in the accent, hero dot still
`rgb(16, 185, 129)`. No cobalt value (`#1D4ED8`, `#3B82F6`,
`#60A5FA`, `#DBEAFE`, `#172554`) remains anywhere in the built
CSS or the source.

## 2. Fonts: Newsreader + Inter Tight

Geist is gone. **Newsreader** carries headings and display text;
**Inter Tight** carries body text; **JetBrains Mono** is unchanged
for years, figures, labels and metadata. Both load via `next/font`,
self-hosted, subsetted to Latin + Latin-Extended (covers ä ö ü ß),
weights 400–700. The italic Newsreader used by the case-study
quote still loads from `CaseStudy.tsx` only, so the home page
never pays for it. The Spec Sheet structure is unchanged: 1px
rules, section order, header geometry, tabular numbers. Only the
typefaces changed.

Verified in the browser: the h1 computes to Newsreader, body text
to Inter Tight, mono elements to JetBrains Mono, in both themes
and both languages. German headings fit: no horizontal overflow at
390, 768 or 1440px in German. The home page transfers 268 KiB of
font files (6 woff2 files); see §5 for what that does to
Lighthouse.

## 3. Evidence block omitted for no-figure projects

Quality CRM, UpliftU and HITEC no longer render an Evidence block
at all. The "No figures were measured for this project." /
"Für dieses Projekt wurden keine Kennzahlen gemessen." status
lines are deleted in both locales, the `evidenceStatus` field
leaves the `Project` type, the `CaseStudy` render path and the
dead `.case-status` rule go with it. This reverses the 2026-11-23
call to keep the note as a plain status line; the user directed
the omission on 2026-11-24.

LeaseLens, Sales ETL Pipeline and OratorPath keep their Evidence
blocks unchanged (86.1% IoU / 197 tests; ETL diagram; OratorPath
citation). Verified on all six case pages, EN and DE: the three
no-figure pages list only Problem, Architecture, Outcome, Stack
(no `#evidence` section, no status line, no "No figures" text
anywhere); the three with-figure pages still show Evidence. The
missing block leaves no gap, no empty heading and no broken
numbering. The sections stack plainly.

## 4. The two no-change decisions

- **Keep the work pages.** All six `/work/[slug]` pages are
  generated and served; nothing about the routing changed.
- **Add the theme toggle.** The header already carries it
  (desktop utility cluster + mobile menu strip). Verified: light
  to dark to light, persisted across reload, no flash on the
  stored value.

## 5. Verification

Production build (`next build`, clean rebuild after the OG image
change): passes; TypeScript, ESLint and Prettier clean; 11 pages
(6 case pages). Impeccable detector: zero findings on the changed
source files.

Content integrity (`scripts/header-i18n-integrity.mjs`): the
removed status line is an allowlisted removal (user-directed,
2026-11-24). 176 old sentences checked, 167 preserved, 0
unexplained missing, 0 unexplained added, links 6/6, images 2/2,
German keys complete (one intentional omission: the lease-quote
gloss). **Result: zero unexplained differences.** Regenerated in
`docs/header-i18n-integrity.md`.

Browser QA (Playwright, `~/workspace/.baseline-qa/final-decisions-qa.js`,
results in `final-decisions-qa.json`): header morph (1120px at top,
768px pill scrolled), sliding pill, theme toggle, language toggle
both directions on home and a case page, filter counts still 6
projects ("Showing all 6 projects.", All (6), C# (1), Python (3),
RAG (2)), Download CV in the header (desktop pill + mobile icon,
EN and DE), zero console errors.

Accessibility: axe reports **0 violations** on home EN, home DE,
`/work/hitec-cms` EN and DE, and `/work/leaselens` EN (38–41
passes each).

Lighthouse 13.6.0 (local, throttled, same rig as the previous
reports):

| Page | Mobile perf | Desktop perf | a11y / BP / SEO | CLS |
| --- | --- | --- | --- | --- |
| Home | **75–81** (two runs) | **95** | 100 / 100 / 100 | 0 |

Home mobile was 73 after the polish. The two runs landed at 81
(TBT 810ms) and 75 (TBT 1,290ms), so the honest reading is
roughly unchanged to slightly better, inside the usual ±3–4 swing
on this VM — not a regression from the fonts. The 268 KiB of font
transfer did not move the score: the limiter is still total
blocking time from the client bundle (framer-motion + the Next.js
framework baseline under throttling), the same driver as the
header-i18n report. LCP 0.8–0.9s mobile, 0.2s desktop. Desktop
95 sits inside the 83–96 band seen across runs.

## 6. Screenshots

Added to `docs/screenshots/header-i18n/`:

- `home-1440-final-en.png`, `home-1440-final-de.png`: home, light
- `home-1440-dark-final-en.png`: home, dark
- `home-390-final-en.png`: home, mobile
- `hitec-cms-1440-final-en.png`: HITEC case page, no Evidence block
- `leaselens-1440-final-en.png`: LeaseLens case page, Evidence kept

All six were read: serif headings and oxide red read clearly in
both themes and both languages; the German home fits with no
overflow; the HITEC page goes Problem → Architecture → Outcome →
Stack with no gap where Evidence was.

## 7. Merge and deploy

Merged `redesign/header-i18n` into `main` as a fast-forward (main
had not moved from `8ab0f7f`); pushed to GitHub
`shamas92/portfolio-v4`; deployed with the Vercel CLI
(`vercel --prod --yes`, 33s). Live verification at
https://portfolio-v4-rosy-five.vercel.app: home 200, all six case
pages 200, oxide-red accent (`#9A3324` in the served CSS, zero
cobalt values) and Newsreader / Inter Tight in the served CSS, no
"No figures were measured" string in the live HTML of the three
no-figure pages, Download CV in the header (CV PDF 200), German
toggle present (DE/EN options in the live HTML). Deployment id:
see §8.

## 8. Deployment record

- Branch tip merged: `be7e5f3`
- `main` after merge: `be7e5f3`
- Pushed to `origin/main`: yes, `be7e5f3`
- Vercel deployment id: `portfolio-v4-6rt7358mp-shamas92s-projects.vercel.app`
- Live URL: https://portfolio-v4-rosy-five.vercel.app

## Deliberately left out / unsure

- The metadata description in `layout.tsx` still says "Five
  shipped systems" although the site now shows six. It was
  already stale after the HITEC addition; the polish report's
  integrity allowlist notes the six-systems version lives in
  `content.ts`, but the hardcoded `layout.tsx` description was
  never updated. Left untouched: content strings were out of
  scope for this change, and it is a one-word fix for the next
  pass.
- The `Newsreader Fallback` face shows as `error` in
  `document.fonts` in the QA browser. That is the next/font
  size-adjusted fallback face (no downloadable source); the real
  Newsreader 600 face loads and the headings render in it. No
  user-visible effect.
- Lighthouse mobile moves ±3–4 between runs on this VM; treat
  75–81 as a band, not a point.
- Not checked: a real phone (emulation only), VoiceOver /
  TalkBack, the pill glide at 120 Hz. The three open TODO(content)
  items are unchanged (OratorPath live dashboard URL still open;
  the CV file and availability wording were resolved on main @
  8ab0f7f).
