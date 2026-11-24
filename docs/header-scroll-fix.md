# Header scroll-pill fix

Branch `fix/header-scroll-pill`, from `main @ 61f7578`. User-reported:
"the header is broken when i scroll".

## The bug

The scrolled floating header pill is 768px wide, but the header's flex
row (wordmark + 4 nav links + GitHub + LinkedIn + Download CV + DE/EN +
theme toggle) needs ~950–1070px. Nothing in the scrolled state collapses
the content and `overflow` is visible, so excess controls render outside
the pill. Measured (Playwright, local production build of `main @
61f7578`): at 1440px scrolled, the pill spans x=336–1104 while Download
CV ends at x=1148, DE/EN at x=1252 and the theme toggle at x=1304
(44–200px outside the pill); at 768px scrolled, CV 812, DE/EN 916,
theme 968 (all off-screen); at 1024px scrolled, DE/EN 1044 and theme
1096 (off-screen even though at top on 1024 everything fits). It appears
only after scrolling past 24px, at every desktop width ≥768px. At 375px
it does not happen (the mobile layout hides the desktop controls).
Clearest before-shot:
`docs/screenshots/hiring-review-2/header-1440-light-y100.png`.

What did NOT break (all measured): the morph animation is smooth (inner
width 910→815→782→771→768, settles ~125ms); the 24px threshold flips
exactly once; the spacer is a constant 92px and content never jumps; no
horizontal overflow; anchor jumps land correctly
(`scroll-margin-top: 96px` works).

## Cause

`.site-header.is-scrolled .site-header-inner` (`src/app/globals.css`)
sets `max-width: 768px`, `margin-top: 12px`, `padding: 10px 16px`,
`border-radius: 999px` over 200ms, with no rule collapsing inner
content; `SiteHeader.tsx` has no scrolled-state content variant. Earlier
QA measured the pill's box (768px capsule) but never checked content
containment.

## The fix

Two changes in `src/app/globals.css`, one comment in
`src/components/SiteHeader.tsx`. No content strings, colours, fonts or
anything outside the header changed.

**(a) Mobile breakpoint 768px → 1024px.** Only the header media block
changed (`@media (max-width: 767px)` → `1023px`, the block that hides
`.site-nav`, `.site-action-icon`, `.header-lang`, `.header-theme` and
`.copy-desktop` and shows the hamburger and the icon-only Download CV).
The other `max-width: 767px` blocks in the file belong to the page
padding, the index rows, the capabilities matrix and the timeline — not
the header — and were left alone. There is no JS width check or
matchMedia anywhere in `src/`; the hamburger-vs-desktop decision is
CSS-only. This also fixes the at-top header overflow at 768–980px found
by the first hiring review (M1).

**(b) Scrolled pill collapses its content.** When `.is-scrolled`, the
wordmark text (`.site-name-text`, SR monogram stays) and the two social
icons (`.site-actions .site-action-icon`, GitHub + LinkedIn) get
`display: none` — so they leave the tab order too; never
`visibility: hidden` on a focusable control. The rule is scoped to
`.site-actions`, so the identical icons in the mobile-menu strip are
untouched. `overflow: hidden` was deliberately not used on the pill:
it would clip focusable controls and trade a visible defect for an
accessibility one.

**(c) Compact scrolled spacing (addition to the prescribed fix).**
Hiding the wordmark and icons alone does not close the pill in German:
"Lebenslauf herunterladen" is 207px against "Download CV" at 126px, and
the row still ran ~52px past the pill edge in German at 1024px and
1440px scrolled. The pill keeps its 768px width, so the scrolled state
tightens its own spacing instead: inner `padding-inline` 16px → 12px
(matching the mobile scrolled padding), `column-gap` 24px → 12px, nav
link `padding-inline` 12px → 8px, actions `gap` 8px → 4px. No control
shrinks below its 44px tap target; the at-top layout is untouched.

Kept as-is: the morph animation and its 200ms timing, the 24px
threshold, the 92px spacer, the pill's 768px width, the DE/EN toggle,
the theme toggle, Download CV, the nav links and the sliding pill.

## Verification (branch, before merging)

Production build passes; TypeScript, ESLint, Prettier clean.
Impeccable detector: zero findings. QA rig
`~/workspace/.baseline-qa/header-fix-qa.js`, results in
`header-fix-qa.json`.

Containment — every visible header control inside the pill, scrolled
at y=100 and y=500, light and dark, English and German. The numbers are
the worst case across both scroll positions; slack is the distance from
the outermost control edge to the pill edge on each side:

| Viewport | Theme | Locale | Pill | Slack left / right | Spill |
| -------- | ----- | ------ | ---- | ------------------ | ----- |
| 768px    | light | EN     | 0–768   | 13px / 13px | 0 |
| 900px    | light | EN     | 66–834  | 13px / 13px | 0 |
| 900px    | dark  | EN     | 66–834  | 13px / 13px | 0 |
| 1024px   | light | EN     | 128–896 | 13px / 13px | 0 |
| 1024px   | light | DE     | 128–896 | 13px / 13px | 0 |
| 1440px   | light | EN     | 336–1104| 13px / 13px | 0 |
| 1440px   | dark  | EN     | 336–1104| 13px / 13px | 0 |
| 1440px   | light | DE     | 336–1104| 13px / 13px | 0 |
| 1023px   | light | EN     | 128–896 | 13px / 13px | 0 |

- Breakpoint boundary is exact: at 1023px the hamburger shows
  (`display: flex`) and the desktop nav is hidden; at 1024px the
  hamburger is gone and the desktop nav shows. At-top header at
  768–1023px now shows the mobile layout with nothing cut off and no
  horizontal overflow.
- Mobile menu at 900px and 1023px: opens on hamburger click, focus
  lands on the first link, body scroll locks, Escape closes and focus
  returns to the hamburger.
- Morph unchanged: inner width 910→815→782→771→768 over ~125ms,
  settles at 768px; the scrolled class flips exactly once on a slow
  0→120px scroll. Spacer stays 92px; `main` returns to exactly its
  at-top position after scrolling back (no jump).
- Axe: 0 violations on home EN at 1440, 900 and 768px.
- Lighthouse 13.6.0 (local, throttled): home mobile **72**, desktop
  **100**; accessibility / best practices / SEO 100, CLS 0, LCP 1.1s
  mobile / 0.3s desktop. Mobile 72 sits at the bottom of the usual
  72–81 band on this VM (TBT 2,040ms this run, vs 780–1,290ms on
  earlier runs); the fix adds no JavaScript and ~10 lines of CSS, so
  the swing is run-to-run variance, not a regression.
- Zero console errors across the whole pass.

Screenshots: `docs/screenshots/header-fix/` — scrolled header at
768/900/1024/1440 light (plus 1440 dark, 900 dark), EN and DE at 1024
and 1440, and the open mobile menu at 900 and 1023px.

## Environment note

The first rebuild after the compact-spacing trim served the old CSS:
the Turbopack build cache did not invalidate for the stylesheet edit
(the built chunk kept the pre-trim rules even though the source file
had changed). A clean rebuild (`rm -rf .next && npm run build`) picked
the new rules up. If a CSS-only change ever looks like it had no
effect in this repo, rebuild clean before doubting the CSS.

## Not checked

A real phone (emulation only), VoiceOver/TalkBack, the pill glide at
120 Hz. The underline on the header Download CV pill (global `a`
underline rule, review 1 S1) is a separate pre-existing issue and was
left alone.

## Merge / deploy record

(To be filled in after the merge, push and deploy.)
