# Rebuild the global header + German/English toggle

## Summary

Rebuilds the global `<Header />` in the Engineering Spec Sheet aesthetic
and adds a full-site German/English language toggle. The header is a fixed
bar that morphs into a centered floating pill on scroll; the whole site
switches language through a typed locale system with no-flash persistence.

## What is in it

- **Fixed morphing header** (`SiteHeader`, `globals.css`): full-width flush
  bar at scroll top (y < 24), centered 768px floating pill past 24px
  (glass surface, 1px border, soft shadow, 200ms ease). A `.header-spacer`
  reserves the at-top height, so the morph never moves page content.
- **Three zones**: SR monogram + wordmark with a 6px emerald presence dot;
  sliding-pill section nav (Work, Background, Stack, Contact) with a
  framer-motion `layoutId` pill (spring 420/32) and IntersectionObserver
  scroll-spy, Work kept active on `/work/*`; utility cluster with GitHub,
  LinkedIn, Copy Email pill, theme toggle, and a segmented DE | EN toggle.
- **Mobile** (< 768px): wordmark + copy icon + hamburger; a dropdown sheet
  with the four links and a bottom strip (location, socials, theme,
  language), scroll lock, Escape close, focus trap, focus return.
- **i18n** (`content.ts`, `content.de.ts`, `i18n/LocaleProvider.tsx`):
  English is the source of truth; both locales are typed against one
  `SiteContent` shape, so a missing German string is a type error. The
  choice persists in localStorage and applies before paint; `lang`
  switches to `de`/`en`. Numbers, metrics, links, and the German lease
  quote stay byte-identical; the English gloss of the quote is omitted in
  German, the one intentional difference.
- **Accessibility**: skip link moves focus to `<main>`; axe zero
  violations on home and LeaseLens (light, dark, German); tap targets
  ≥44px at 320–1920px; reduced-motion fallbacks; keyboard pass clean.
- **New dependency**: framer-motion 14.14.0, for the shared-layout pill
  only. CSS cannot do `layoutId` transitions. Bundle: +171 KiB
  uncompressed vs main (chunk total 677 → 848 KiB); see the report for the
  Lighthouse impact.

## Verification

- `npm run lint`, Prettier, and `npm run build` pass; all 10 pages
  generate; zero console or hydration errors, including a reload with dark
  theme and German stored.
- `scripts/header-i18n-integrity.mjs`: 140/140 English sentences from main
  @ `8ab0f7f` preserved; German complete (330/331 leaves, one intentional
  omission); zero unexplained differences.
- QA rig `~/workspace/.baseline-qa/header-i18n-qa.js`: morph, pill, copy
  swap, theme, language both directions on home and a case page, mobile
  menu, axe, keyboard, no-JS, 200% zoom, reduced motion, persistence.
- Lighthouse 13.6.0: home mobile 72–74, home desktop 92, LeaseLens mobile
  75, LeaseLens desktop 85; a11y/best-practices/SEO 100 everywhere. Mobile
  performance regressed from the Spec Sheet (home 77–80, LeaseLens 96)
  because of total blocking time from the larger client bundle.
- Screenshots: `docs/screenshots/header-i18n/` (26 shots, 390/768/1440,
  light/dark, EN/DE, home + LeaseLens, menu open, scrolled pill).

Full numbers and the honest performance story:
`docs/header-i18n-report.md`. Integrity:
`docs/header-i18n-integrity.md`.

## Needs a decision before merge

**Copy Email vs Download CV.** Commit `8ab0f7f` on main replaced Copy Email
with Download CV in the hero and the header. This branch follows the brief
and puts Copy Email back in the header (hero keeps Download CV). Please
confirm which one the header should carry — do not merge until that is
settled.

## Not in scope

No merge, push, or deploy from this branch. OratorPath live dashboard URL
is still open. Vercel Git connect (auto-deploy) is still open.
