# Header rebuild + German/English toggle — report

Branch `redesign/header-i18n`, from main @ `8ab0f7f`. Local commits only.
Nothing here is merged, pushed, or deployed.

## What changed

The global header is rebuilt as a fixed bar that morphs on scroll, and the
whole site now switches between English and German.

**Header.** At scroll top the bar is full-width and flush with the content
grid, transparent, with generous padding. Past 24px it becomes a centered
floating pill (768px max, rounded, glass surface, 1px border, soft shadow).
The layout reserves the at-top height with a `.header-spacer` div, so the
morph never moves page content. Three zones: SR monogram + wordmark with a
6px emerald presence dot; a sliding-pill section nav (Work, Background,
Stack, Contact) driven by IntersectionObserver, with Work kept active on
`/work/*`; and a utility cluster (GitHub, LinkedIn, Copy Email pill, theme
toggle, segmented DE | EN toggle). Below 768px the bar shows the wordmark,
a copy icon, and a hamburger that opens a dropdown sheet with the four
links and a bottom strip (location, socials, theme, language). The sheet
locks body scroll, closes on Escape or route/hash change, and traps focus.

**i18n.** English is the source of truth. `SiteContent` is defined once in
`src/content.ts`; `enContent` lives there and `deContent` in
`src/content.de.ts` is typed against the same shape, so a missing German
string is a type error. Every section renders from the active locale
through `useContent()`. The choice persists in `localStorage["locale"]` and
a `beforeInteractive` script applies it before paint, the same no-flash
pattern as the theme toggle. `document.documentElement.lang` switches to
`de`/`en`. The title suffix and the home meta description swap with the
locale; case-page titles and descriptions stay English; JSON-LD and the OG
image are unchanged.

## Commits

| Commit | Change |
| --- | --- |
| `62e0ba7` | Deps: add framer-motion 14.14.0 for the shared-layout nav pill |
| `cae9313` | Restructure content as typed English/German locales with no-flash persistence |
| `5374b81` | Rebuild the global header: fixed bar morphing to a floating pill |
| `c4ba1da` | Render every section from the active locale |
| `a82cb3f` | Style the fixed header, pill morph, tooltips, and toggles |
| `dd74edb` | Add header-i18n content-integrity check: zero unexplained differences |
| `addf416` | Fix QA findings: copy-button visibility, tap targets, axe, skip-link focus |

## Translation rules, as applied

Numbers, dates, metrics, links, and the German lease quote stay
byte-identical in both locales. The quote
("Die vor dem Einzug zu zahlende Kaution beträgt 950,00 EUR.") is already
German and appears verbatim in both; its English gloss is omitted in
German, the one intentional difference in the whole locale. The 86.1% IoU
and the 197 tests stay separate facts. The HIT 20% figure stays. Skill
names, stack tags, course titles, the journal name, and statute names stay
as-is. Month words translate (Okt., Mai, Jul., Aug., Sep., Nov., heute);
digits do not. "Stack", "Problem", and "Links" are the same word in German
and stay. The `skillGroups` titles ("Languages", "Data & BI", …) are carried
verbatim because that data is not rendered; the matrix uses the translated
`matrixColumns` titles.

## Lighthouse (real numbers, local production build)

Measured with Lighthouse 13.6.0 against the local production server, Chrome
156, `--headless=new`. Mobile uses the default throttled profile; the VM has
1.5 shared CPUs, so mobile scores move ±2 between runs (home mobile scored
74, then 72 on a second run).

| Page | Mobile perf | Desktop perf | a11y | Best practices | SEO |
| --- | --- | --- | --- | --- | --- |
| Home | 72–74 | 92 | 100 | 100 | 100 |
| LeaseLens | 75 | 85 | 100 | 100 | 100 |

Home mobile was 77–80 on the Spec Sheet; LeaseLens mobile was 96. The
regression is real and it is total blocking time: 1,450 ms on home mobile,
1,350 ms on LeaseLens mobile, against 230 ms and 340 ms on desktop. FCP and
LCP are 1.1–1.2 s mobile, 0.3 s desktop; CLS is 0 everywhere. The long
tasks are hydration and evaluation of the larger client bundle (see below).
The case page dropped further than home because it went from mostly-server
rendering with small client islands to a fully client-rendered `CaseStudy`
plus framer-motion in the shared header chunk. Accessibility, best
practices, and SEO are 100 on all four runs.

## Bundle impact of framer-motion

Compared against a production build of main @ `8ab0f7f`:

- Total `.next/static/chunks` output: 677 KiB on main, 848 KiB on this
  branch (+171 KiB uncompressed, about +25%).
- The new chunk is `15cx6t3jrg9zk.js`, 158 KiB uncompressed, 53 KiB
  transferred (brotli). It carries framer-motion plus the client header and
  locale code bundled with it.
- CSS grew 40 KiB to 47 KiB (+7 KiB, the header and toggle styles).
- Total script transfer on home mobile: 204 KiB.

Justification, as required: the shared-layout pill animation is the reason
framer-motion is here; CSS cannot do `layoutId`-style shared-element
transitions. No other new heavy dependency was added. Everything else moves
in CSS or IntersectionObserver.

A cheaper follow-up exists and was not taken: replace the `layoutId` pill
with a CSS transform pill that tracks the active link by measurement, or
keep the case pages server-rendered and pass the locale down as a prop.
Either would shrink the client bundle and should recover most of the mobile
TBT. Both change the architecture this branch chose, so they belong in a
separate decision, not smuggled into this one.

## Contrast ratios (computed, WCAG 4.5:1 for normal text)

| Pair | Ratio |
| --- | --- |
| Light ink on ground | 17.52:1 |
| Light muted on ground | 7.25:1 |
| Light accent on ground | 6.37:1 |
| Light accent on wash (nav pill) | 5.49:1 |
| Light ground on ink (copy pill) | 17.52:1 |
| Light ground on accent (language active) | 6.37:1 |
| Dark ink on ground | 17.94:1 |
| Dark muted on ground | 7.76:1 |
| Dark accent on ground | 5.32:1 |
| Dark accent-on-wash on wash (nav pill) | 5.78:1 |
| Dark ground on accent (language active) | 5.32:1 |
| Dark presence dot on ground | 7.72:1 |
| Light presence dot on ground | 5.21:1 |

The dark nav pill was 4.00:1 before the fix (#3B82F6 on #172554). A new
`--accent-on-wash` token is #60A5FA in dark mode and #1D4ED8 in light mode;
only the nav-pill label uses it.

## Accessibility results

Axe 4.14.0, six runs (home and LeaseLens, light, dark, German): **zero
violations**, 40–41 passes each. The two findings from the first QA pass
were fixed on the branch: the dark nav-pill contrast above, and the
language options, whose aria-labels ("Switch language to German") did not
contain their visible text ("DE"). The options now have no per-option
aria-label; the group carries "Language"/"Sprache" and each option
announces through `aria-pressed`.

Manual keyboard pass: skip link is the first Tab stop, becomes visible on
focus, and moves focus to `<main>` (which gained `tabIndex={-1}`); the
mobile menu traps focus, wraps Tab at both ends, closes on Escape and
returns focus to the hamburger, and closes on link click; filter pills
toggle with Space; the language toggle switches with Space. Tap targets
are 44px or larger at every width from 320 to 1920. Reduced motion
disables the dot pulse, the header morph, and the pill spring (instant
state swaps instead). The 200% zoom check shows no horizontal overflow.
No-JS render shows the full page (h1, hero, 3 flagship cards, 2 index
rows, 20 filter pills, 35 matrix items) with the header present.

## QA summary

The rig is `~/workspace/.baseline-qa/header-i18n-qa.js` (playwright-core
1.65.1, Chrome 156). Results live in
`~/workspace/.baseline-qa/header-i18n-qa.json`.

- Viewports 320, 360, 390, 768, 1024, 1280, 1440, 1920: no horizontal
  overflow on home or LeaseLens; zero tap targets under 44px.
- Scroll morph: at y=0 the header is 1120px, transparent, square; at
  y=10 still unmorphed; at y=100 and y=500 it is a 768px pill with a
  glass background, 999px radius, and a shadow. `main` returns to exactly
  its at-top position after scrolling back: no layout shift.
- Sliding pill: Work active on load; clicking Background moves the pill
  there; scrolling to Stack moves it again. On `/work/leaselens`, Work
  stays active.
- Copy email: click copies `shamasrehman249@gmail.com` to the clipboard,
  swaps to "Copied ✓" with `data-copied="true"` and a live-region
  announcement, and reverts after 2 seconds.
- Theme toggle: light to dark to light, persisted across reload, no-flash
  on the stored value.
- Language toggle: EN to DE on home (nav, hero, filter note, title suffix
  all switch, `lang="de"`), DE to EN on a case page (blocks, back link,
  and the "Für dieses Projekt wurden keine Kennzahlen gemessen." status
  line switch back), persisted across reload. Reloading with dark theme
  and German stored renders dark German with zero console errors and zero
  hydration errors.
- Mobile menu (390px): opens with focus on the first link, locks body
  scroll, wraps focus at both ends, closes on Escape (focus returns to
  the hamburger) and on link click (hash follows).
- Content integrity: `docs/header-i18n-integrity.md` — 140 of 140 English
  sentences from main @ `8ab0f7f` survive verbatim; the 36 added sentences
  are UI copy moved from components into the typed content, each
  allowlisted with its source. German carries 330 of 331 English string
  leaves; the one missing key is the intentional gloss omission. All 163
  byte-identical German values are explained. Zero unexplained
  differences.
- Impeccable detector on all changed source files: zero findings.

## Screenshots

`docs/screenshots/header-i18n/` — 26 shots: home and LeaseLens at 390,
768, and 1440px, light and dark, English and German, plus the mobile menu
open and the scrolled pill at 1440px. All were viewed: the header does not
wrap at 390px, German text fits at every width, and the dark active-nav
label reads clearly after the contrast fix.

## Open decisions and things left out

**Copy Email vs Download CV — needs a user decision.** Commit `8ab0f7f` on
main (user decision, 2026-11-24 morning) replaced Copy Email with Download
CV in the hero and the header. This brief specifies Copy Email as the
header primary action, in detail. The branch follows the brief: the header
has the Copy Email pill and the hero keeps Download CV. Email stays
reachable from the footer (mailto + copy button). Do not merge until the
user says which one the header should carry.

**OratorPath live dashboard URL** is still open (1 TODO(content) item).
No live link anywhere on the site; the OratorPath deployments were all
verified down on 2026-11-24.

**Not checked:** the header on a real phone (emulation only); VoiceOver /
TalkBack (axe + keyboard only); the pill glide at 120 Hz (the spring
values are the brief's, verified at 60 Hz in the QA browser). The mobile
header is 86px tall against a 92px spacer, leaving a 6px band of ground
colour above `main` on phones; it is invisible because it is the same
ground, and the spacer is constant, so there is no shift.

**Deliberately not done:** no new dependency besides framer-motion; no
change to JSON-LD or the OG image; case-page titles and descriptions stay
English (only the home title suffix and description swap); the
human-writing-style checker was not run on the German strings, as
instructed — it is written for English prose.
