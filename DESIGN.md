# DESIGN.md — portfolio v4 (synced to the shipped build, 2026-11-23)

Status: Phase 3 `document` sync. Written at direction lock (specimen cabinet, seed
`seed:a1583b58d47371d4`); tokens, mechanisms and components below are the ones in
`src/app/globals.css` and `src/app/page.tsx` as shipped — the draft's open questions
are resolved against the real render. Nothing here is a quote from a comp — comps
carry invented small print; only PRODUCT.md facts ship.

## Colour strategy

Committed: dark walnut carries the surface. Physical scene — a hiring manager in a
lit office opening a specimen drawer: dark wood under warm indoor light, cream labels
legible at a glance, brass the only metal. Dark is a material decision, not a default.
Cream is label stock only, never the page ground.

## Tokens (raw values — only here)

```css
/* ground: walnut */
--wood-deep:   #211710; /* deepest recess, drawer interior shadow */
--wood:        #2e1f16; /* page ground */
--wood-panel:  #3a2a1d; /* tray beds, panels */
--wood-raise:  #463521; /* raised drawer front, hovered tray */

/* label stock */
--label-cream: #f3ebd8;
--label-ink:   #1c1712; /* ink on cream */
--label-rule:  #8a7a5f; /* ruled line on labels */

/* ink on wood */
--ink-on-wood:        #efe7d8;
--ink-muted-on-wood:  #b9ac97;

/* accent: brass — drawer pulls, selected tray edge, verified/live signal only */
--brass:       #c08a2d;
--brass-deep:  #9a6d20;

/* hairline, not blur: glass is a vitrine edge, never a backdrop filter */
--glass-line:  rgba(239, 231, 216, 0.16);

/* one-off shades, named once in :root and never raw in a rule */
--ink-bright:       #f5ebd9; /* brand name, hovered drawer label */
--ink-nav:          #c2b7a3; /* topnav links */
--ink-cta:          #f4efdd; /* drawer CTA text */
--ink-drawer-label: #e6d7c0; /* drawer-front labels */
--brass-light:      #d9ab4a; /* top of the brass-pull gradient */
--ink-on-cream:      #4a3b2c; /* tray meta, figure captions */
--ink-on-cream-soft: #3a2e22; /* tray detail lines, contact text */
--line-on-wood:    rgba(239, 231, 216, 0.08); /* drawer-front top edge */
--shadow-edge:     rgba(0, 0, 0, 0.45); /* drawer-front bottom edge */
--shadow-deep:     rgba(0, 0, 0, 0.55); /* drawer interior, pull shadow */
--shadow-soft:     rgba(0, 0, 0, 0.4);  /* drawer interior, lower edge */
--highlight-brass: rgba(255, 240, 200, 0.55); /* brass-pull top light */
```

The masthead background is `--wood-deep`. An earlier near-duplicate near-black
(`#181716`) was deleted in the audit pass — one near-black, not two. The wood
texture is served as WebP (`public/plates/wood-texture.webp`, 800×800, 31.8 KB);
the spec plate stays PNG. The texture tiles at `background-size: 800px 800px` on
the cabinet, drawer fronts and side frames.

## Semantic aliases (components use only these)

```css
--surface:         var(--wood);
--surface-raised:  var(--wood-panel);
--on-surface:      var(--ink-on-wood);
--on-surface-muted: var(--ink-muted-on-wood);
--label-bg:        var(--label-cream);
--on-label:        var(--label-ink);
--accent:          var(--brass);
--on-accent:       var(--wood-deep);
--rule:            var(--glass-line);
--focus:           var(--brass);
--focus-on-light:  var(--brass-deep);
```

On cream surfaces the focus ring uses `--focus-on-light`: plain brass on cream
is 2.56:1, below the 3:1 focus floor; brass-deep clears it.

Every background ships its `on-` colour. Brass is accent only — never body text.
Contrast: cream ink on walnut ≥ 4.5:1 body; label ink on cream ≥ 4.5:1.

## Type (by role name — never ad-hoc sizes)

| Role | Face | Notes |
|---|---|---|
| `display` | Gothic A1, 700 | Brand name, drawer labels, section headings. Measured from the approved comp (cap 43.1px, normal width, medium weight; font-match catalog rank #1, size 62px estimated). A sturdy grotesque with engraved-plate presence. |
| `claim` | Hanken Grotesk, 500 | Masthead tagline, up to 24px in `--on-surface`. The tagline IS the claim — "I build data & ML systems — and prove every claim on this page." — not role or location. |
| `heading` | Gothic A1, 700 | Section headings inside drawers. |
| `body` | Hanken Grotesk, 400–500 | Reading text. Plain grotesque. |
| `small` | Hanken Grotesk, 400 | Meta, captions. |
| `mono-data` | JetBrains Mono, 400–500, tabular numerals | Measurements, figures, dates, labels' measurement lines. Mono only for data. |

No kicker/eyebrow above a heading. No gradient text. No system display faces.
Faces are the shipped picks, self-hosted as woff2 in `src/app/fonts/` — never one
from the reflex list (Fraunces, Playfair, Cormorant, Lora, Inter-as-display,
Space Grotesk, IBM Plex, DM Sans/Serif, Instrument Sans, Archivo — v3's face).

## Spacing (one finite scale, 4px base)

`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96`. Section rhythm 80–96px.
Container 1200px. Radii: buttons 8px, trays/cards 12px, pills 9999px.
No off-scale spacing; no one-sided stripe borders; no hard offset shadows.

Breakpoint: 1200px. Below it the cabinet becomes a vertical stack (drawer
fronts, trays, contact sheet); the desktop wall only renders at 1201px and up,
because the tray labels need the width — a measurement line wraps below it.

## Motion (one easing, one signature effect)

- Easing token: `cubic-bezier(.16,1,.3,1)`; durations 110 / 150 / 240 ms.
- Signature effect (the only one): selecting a tray — its specimen grows to fill
  the drawer at full size, held. Motion only in response to the visitor's own
  action; nothing autoplays. `prefers-reduced-motion` disables it — the CSS media
  query kills the transitions, and `scrollToId` checks `matchMedia` and jumps with
  `behavior: auto` instead of smooth-scrolling.
- Focus ring: 2px brass outline with 2px offset, on every interactive element;
  brass-deep on cream surfaces (see Tokens).

## Components

- **Drawer**: the page's unit. Dark header (name, claim, Work / Stack / Contact,
  "Examine the work" action — the drawer is already open, so the button says what
  it does: jump to the examination). Trays in a row, newest first; each tray holds
  one specimen + one cream label (name, origin, measurements).
- **Ruled line**: one continuous brass rule threads all five labels. It is NOT an
  absolutely-positioned element at a % of the cabinet — that struck through the
  titles at 1440px, because the titles sit by content flow while a % sits by
  cabinet height. It is a `::before` segment on each `.tray-meta`: 2px brass,
  centred in the title/meta gap (`top: -9px`, half the 18px margin), each segment
  bleeding 6px into the tray gaps so the five read as one rule. The segments sit
  at the same height only because every label is the same height: the title
  reserves two lines (`min-height: 2.3em`), the meta reserves two lines
  (`min-height: 2.9em`), and the detail line reserves one line (`height: 1.45em`,
  `visibility: hidden` when its tray is unselected — hidden, never removed).
  That equal height IS the line. The drawer gap is a fixed 12px so the bleed is
  exact at every width. Below the 1200px breakpoint the trays stack and the rule
  is hidden.
- **Tray**: varies in specimen size by project — no identical card grid. LeaseLens
  carries the segmentation mask + `86.1% IoU` on its label; OratorPath carries its
  publication citation; projects with no verified figure carry no figure. The
  LeaseLens tray plate is a generated line diagram (document → check seal →
  document), like the other four trays — the dorm photo was removed from the
  tray 2026-11-23 at the user's direction ("dont show the image of leaselens
  project, keep it like other projects"); the photo survives only as the exam
  figure, the annotated exhibit. Tray images use
  `sizes="(max-width: 1200px) 100vw, 35vw"` — the selected tray is 2.6× wide,
  so 20vw underserved it.
- **Contact drawer**: the open cream sheet under the Stack front carries a brass
  `CONTACT` label tab on its top edge — the drawer front it lacks. Its four
  columns are single styled labels (`Languages`, `Data / Analytics`, `Contact`,
  `Dresden`), not a kicker above a heading.
- **Examination**: the selected tray, opened below the cabinet. A five-pill
  switcher shares the trays' state, so the exam changes projects without
  scrolling back to the hero; the exam region is `aria-live="polite"`.
  OratorPath's specimen is a typeset citation card (`exam-citation`), not the
  faint paper image — the citation is the specimen.
- **Doors**: every tray ends in Live ↗ / GitHub ↗ where a real door exists.
  External doors open in a new tab (`target="_blank" rel="noreferrer"`).
- **Proof on the same card as the claim**: figure, quote, and verification state
  sit on the label, never in an end-loaded list. An honest "could not verify"
  state exists; unchecked work gets no tick.

## What this world refuses

The two-column editorial CV (v2), the dossier paper ground (v3), the card-grid
gallery, cream-page + high-contrast-serif editorial, dark-neon, glass/blur,
WebGL heroes, custom cursors, kinetic type over content, hidden navigation,
scroll-jacking, confetti/gamification. The cabinet is a working instrument:
labels, measurements, doors.
