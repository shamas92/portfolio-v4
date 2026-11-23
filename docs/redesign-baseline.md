# Baseline audit — portfolio-v4 (Annotated Proof)

**Date:** 2026-11-23. **Branch:** `redesign/notebook` (from `main` @ `b7c0689`).
**Live site:** https://portfolio-v4-rosy-five.vercel.app — serves the Annotated Proof
design (deployed 2026-11-23 ~20:46 CET). The old "specimen cabinet" is gone from
production; the 10 problems below were written against it, so each is mapped to
its **current** status. Nothing in this audit changed site code.

## 1. Real stack and file map

- **Framework:** Next.js 16.4.6 App Router, React 19.3.0, React DOM 19.3.0,
  Tailwind 4.3.3 (via `@tailwindcss/turbopack`), TypeScript 5, ESLint 9.
  Runtime dependencies are only `next`, `react`, `react-dom`. No test runner,
  no MDX, no icon library (both were removed in the rebuild).
- **Rendering:** fully static. `next build` produces 10 pages: `/`, 5 case studies
  under `/work/[slug]` via `generateStaticParams`, `/robots.txt`, `/sitemap.xml`,
  `/_not-found`. No server components that fetch, no third-party scripts, no
  analytics.
- **Styling:** one hand-written stylesheet, `src/app/globals.css` (~900 lines):
  Tailwind import plus CSS custom properties for tokens and all component
  styles. No CSS Modules, no utility-class soup in components. Spacing scale
  4/8/12/16/24/32/48/64/96 px. Dark theme via `prefers-color-scheme` only
  (no manual toggle).
- **Content:** one typed module, `src/content.ts` (profile, 5 projects,
  background, 5 skill groups, `contentTodos`). Everything renders from it.
- **Fonts:** Schibsted Grotesk (400/500/600/700) + Source Serif 4 (400/600,
  normal + italic) via `next/font`, self-hosted, subsetted latin + latin-ext,
  `display: swap`, size-adjusted fallbacks.
- **Images:** `next/image`, formats AVIF/WebP, explicit width/height, lazy
  below the fold. Sources: `public/images/leaselens-sam-exhibit.png`
  (740×640, 145 KB), `public/images/etl-diagram.png` (1728×1440, 859 KB),
  `public/og.png` (1200×630, 47 KB, meta only).

```
src/
  content.ts                  # the only content source
  app/
    layout.tsx                # fonts, metadata, JSON-LD Person, skip link, header/footer
    page.tsx                  # home: hero, Work, Stack, Background
    globals.css               # tokens + all component styles
    sitemap.ts  robots.ts
    work/[slug]/page.tsx      # generateStaticParams + per-page OG metadata
  components/
    ProofNote.tsx             # Annotated prose, ClaimButton, NotePanel (client)
    ProjectRow.tsx            # Work row + row proof disclosure (client)
    CaseStudy.tsx             # Problem / Architecture / Outcome / Proof
    Timeline.tsx  StackGroup.tsx  SiteHeader.tsx  SiteFooter.tsx
    CopyEmailButton.tsx       # clipboard + aria-live via text change (client)
    Todo.tsx                  # dev-only TODO(content) marker, null in prod
```

## 2. Lighthouse (local production build, Chrome 156, throttled)

Live-site Lighthouse was **not possible from this VM**: the local Chrome cannot
reach the internet (attempt fails with `CHROME_INTERSTITIAL_ERROR`). All numbers
below are the local production build of the same commit (`b7c0689`); the live
HTML was verified by curl to be identical in structure (same markup, same
image URLs, same metadata). INP is not reported by lab Lighthouse in this
version, so it is listed as not measured.

| Page | Perf | A11y | Best practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Home, mobile | **84** | 100 | 100 | 100 | 0.8 s | 0 | 640 ms |
| LeaseLens, mobile | **93** | 100 | 100 | 100 | 0.8 s | 0 | 300 ms |
| Home, desktop | 100 | 100 | 100 | 100 | 0.2 s | 0 | 30 ms |
| LeaseLens, desktop | 100 | 100 | 100 | 100 | 0.2 s | 0 | 70 ms |

- **Page weight:** home mobile 428 KB total (JS 145 KB, fonts 253 KB);
  LeaseLens mobile 441 KB. No render-blocking third-party scripts.
- **Largest resources (home, mobile):** 6 woff2 font files, 21–51 KB each,
  253 KB total (largest: 51 KB); JS chunks 70 KB + 46 KB transfer. The
  framework JS, not images, is the weight.
- **Mobile Performance misses the 95 target on both measured pages.** The
  limiter is Total Blocking Time (640 ms home, 300 ms LeaseLens), driven by
  script evaluation of the Next.js runtime + the 6 font files, not by images
  or layout shift (CLS is 0, LCP 0.8 s).

## 3. Images: rendered vs delivered

Both images carry `sizes="(max-width: 768px) 100vw, 640px"` and a srcset that
runs to `w=3840`. The `w=3840` fallback `src` is still in the markup, but **no
run fetched w=3840** — the browser picks from srcset. The sizes value
understates the real rendered width on desktop (640 px claimed, 704–800 px
rendered), so delivery is off in both directions by DPR.

| Image | Rendered (CSS px) | Delivered | Verdict |
| --- | --- | --- | --- |
| LeaseLens exhibit, 390 px / DPR 2 | 358 | w=750 (Lighthouse, 15 KB) | ~2x, correct |
| LeaseLens exhibit, 768 px / DPR 2 | 736 | w=1920 | 2.6x, oversized |
| LeaseLens exhibit, 1024 px / DPR 2 | 704 | w=1920 | 2.7x, oversized |
| LeaseLens exhibit, 1440 px / DPR 1 | 800 | w=640 (12 KB) | 0.8x, under-delivered |
| LeaseLens exhibit, 1440 px / DPR 2 | 800 | w=1920 | 2.4x, oversized |
| ETL diagram, 390 px / DPR 2 | 358 | w=828 | ~2.3x, correct |
| ETL diagram, 1440 px / DPR 1 | 800 | w=640 | 0.8x, under-delivered |

Byte cost is bounded by the sources (exhibit is 740 px wide, so a w=1920
request still serves at most the 740 px original, re-encoded to ~12–15 KB).
The ETL source is 1728 px, so its oversized requests can deliver more. The
old "requests w=3840" complaint is fixed in practice; the remaining defect is
the inaccurate `sizes` value plus the w=3840 fallback in markup. Alt text on
both images is descriptive and accurate. Both are lazy-loaded.

## 4. Animations and transitions

Inventory from `globals.css` (all durations 150–600 ms, ease-out token
`cubic-bezier(0.16, 1, 0.3, 1)`):

- `hero-sweep`: `transform: scaleX` on the claim wash, 600 ms, once on load.
  Transform only. Disabled under reduced motion (final state shown).
- `note-in`: `opacity` + `translateY(2px)`, 200 ms, on margin-note open.
  Transform/opacity only.
- `.work-row::before`: `transform: scaleY`, 150 ms, row indicator.
  Also fires on `:focus-within`, not hover-only.
- Buttons/links: `background-color`, `color`, `border-color` transitions,
  150 ms; `:active` uses `transform: translateY(1px)`.
- `html { scroll-behavior: smooth }`, disabled under reduced motion.
- **Flag — layout property animated:** `.skip-link` uses
  `transition: top 150ms` and moves from `top: -100px` to `top: 8px` on
  focus. `top` is a layout property; everything else animates transform or
  opacity only.
- No scroll-jacking, parallax, custom cursor, stagger chains, or
  fade-and-slide on sections. No hover-only functionality: the claim buttons
  are real buttons, and the row indicator is duplicated on `:focus-within`.
- Reduced motion verified in-browser: hero mark at final state
  (`matrix(1,0,0,1,0,0)`), no sweep animation, `scroll-behavior: auto`.

## 5. Navigation duplication

Projects are selectable in **two** places:

1. **Work rows** — the title link in each row goes to `/work/[slug]`; a
   stretched-link overlay makes the whole row clickable.
2. **Stack skill links** — 13 of the 31 skills link to the case study that
   used them (e.g. Python → LeaseLens).

The header nav holds sections only (Work / Stack / Background / Contact).
Case-study pages have one "All projects" back link. The old three-way
duplication (top rail / "Selected work" / tray tabs) is gone; the Stack links
are a secondary skill→project path, not a duplicate project list.

## 6. Keyboard and screen-reader audit

Checked with Playwright keyboard runs + axe-core on home and LeaseLens
(Chrome 156, local production build).

- **Landmarks:** `header`, `nav[aria-label="Sections"]`, `main#main`,
  `footer#contact`. One `h1` per page. Heading order is logical
  (H1 → H2 sections → H3 groups/items). `lang="en"`; the German quote carries
  `lang="de"`. Skip link present and first in tab order.
- **Tab order** follows visual order: skip link → site name → nav → "See
  projects" → Work rows (title link, then claim button per row) → skill
  links → footer. No traps.
- **Focus:** a 2 px solid verified-green ring with 2 px offset on every stop
  (measured settled: `2px solid rgb(14, 107, 73)`, offset 2 px). Sections
  reached by nav jumps carry `tabindex="-1"` with the outline suppressed,
  which is correct for programmatic focus.
- **Proof disclosures:** `aria-expanded` + `aria-controls` are correct; Enter
  opens; Escape closes and returns focus to the trigger — **but only when
  focus is on the trigger**. When focus is on the Close button inside an open
  note, Escape does nothing (verified twice); Enter on the Close button, or a
  mouse click on it, closes and returns focus correctly. Closed notes are
  absent from the DOM (not visually hidden), so the accessibility tree is
  always in the correct state.
- **axe:** 0 violations on home and on LeaseLens (0 serious, critical,
  moderate, minor).
- **200% zoom:** no horizontal overflow (verified via page-scale emulation).
- **Contrast (measured, all ≥ 4.5:1):** light — ink/paper 13.42,
  secondary/paper 5.44, verified/paper 6.01, ink/wash 11.19,
  secondary/wash 4.54, verified/wash 5.02; dark — ink/paper 14.47,
  secondary/paper 7.10, verified/paper 9.57, ink/wash 9.31,
  secondary/wash 4.57, verified/wash 6.15. Tightest pair in both themes is
  secondary text on the verified wash (4.54 light / 4.57 dark).
- **Not checked:** a pass with a real screen reader (VoiceOver/NVDA), and
  real-device touch behaviour. Axe + DOM + keyboard runs are the evidence
  here.

## 7. Mobile checks (360 / 390 / 768 / 1024 / 1440 px)

- **No horizontal overflow at any width** (`scrollWidth == innerWidth` at
  all five widths; also clean at 200% zoom). Screenshots verified at 390 px
  light and 1440 px dark.
- **Tap targets under 44 px** (16–18 elements per page): Work-row title
  links (~25 px tall), claim buttons (~24 px tall), site-name link
  (~29 px tall), nav links 39–42 px wide (44 px tall). The stretched row
  link makes the whole row tappable, which mitigates the title-link height;
  the claim buttons have no such mitigation. Buttons that do meet 44 px:
  "See projects", "Copy email", footer links, skill links.
- The hero claim wraps cleanly; the claim wash does not overflow; the
  margin notes stack below the claim on mobile as designed.

## 8. Mapping of the 10 problems (current status)

| # | Problem (as written against the old cabinet) | Status now |
| --- | --- | --- |
| 1 | Cabinet metaphor (drawer, trays, plates, "Examine the work") | **Fixed.** No cabinet/drawer/tray/plate language in the UI; "Examine the work" is now "See projects". Residual: `plate` appears only inside the word "template" in JS chunk names, and `specimen` survives only as an internal data key in `src/content.ts` and the RSC payload — neither is visible. |
| 2 | Projects selectable in three places | **Fixed as a list.** Two selection paths remain (Work rows + Stack skill links); the Stack links are skill→project links, not a duplicate project list. |
| 3 | Only one project visible at a time | **Fixed.** All five rows are visible at a glance. |
| 4 | Proof is uneven | **Partial.** Structure is unified: same four blocks on every case-study page, every row has a proof statement + margin note. Depth still differs because the verified facts differ — LeaseLens has a figure, quote, registry, limits and image; ETL has an image; OratorPath has a citation; Quality CRM and UpliftU have only "Shipped as an academic project" plus the honest "No figures were measured" note. The gap is a lack of verified facts, not presentation. |
| 5 | Hero has no status, location, or strongest proof | **Partial.** Status + location are in the intro line ("MSc Computer Science, TU Dresden. Software engineer in Dresden."). No proof strip. No CV download or availability line in production — both are open `TODO(content)` items (dev-only markers). Note: `profile.location` ("Dresden, Germany") is defined in `src/content.ts` but never rendered anywhere. |
| 6 | Background buried under Stack | **Still present as order.** Background is now its own timeline section (not a drawer), but the section order is still Hero, Work, Stack, Background, Contact. |
| 7 | Stack is a flat list of ~30 items | **Partial.** 5 groups, 31 skills, each shown once; 13 link to the project that used them. No bars, chips, or percentages. The 18 unlinked skills still carry no signal beyond their name. |
| 8 | Performance problems | **Improved, not closed.** CLS 0, LCP 0.8 s mobile, no third-party scripts, AVIF/WebP, lazy images, width/height set. But mobile Performance is 84 (home) / 93 (LeaseLens) against a 95 target; TBT 640 ms on home mobile is the limiter; fonts are the biggest transfer (253 KB, 6 woff2 files); `sizes` understates rendered width; the w=3840 src fallback remains in markup. |
| 9 | Motion and touch problems | **Partial.** Animations are transform/opacity only, except the skip-link `top` transition (layout property). No hover-only functionality. Touch gaps: claim buttons ~24 px tall, row title links ~25 px tall, site name ~29 px tall (target is 44 px). |
| 10 | Content defects | **Mixed.** "Dresden twice in the contact block": gone — the footer shows no location at all. "Languages" label clash: **still present** — "Languages" is both a Stack group and a Background group heading. "Tools behind the trays" intro: fixed (now "Each skill appears once. A linked skill was used in that project."). |

## 9. What this audit could not check

- Live-site Lighthouse (this VM's Chrome cannot reach the internet;
  attempted, failed with `CHROME_INTERSTITIAL_ERROR`). Live HTML was
  verified by curl instead (200, same markup and image URLs as the local
  build of the same commit).
- A real screen-reader pass (axe + DOM + keyboard runs only).
- Real-device performance and touch behaviour (emulated viewports only).
- External link liveness (GitHub, demo film, LinkedIn) — copied from the
  verified source files, not fetched.
- INP as a field metric (lab Lighthouse does not report it here).

## 10. Baseline verdict (one paragraph)

The Annotated Proof rebuild already fixed the three structural complaints
(metaphor, single-project visibility, selection duplication) and unified the
proof structure, so the notebook redesign is not starting from the cabinet —
it is starting from a clean document with a short, specific punch list:
section order (Background before Stack), the "Languages" label clash, the
hero proof strip, the `sizes` values and the w=3840 fallback, mobile
Performance (fonts + TBT), tap-target heights on claims and row titles, the
skip-link `top` transition, and the Escape-from-Close-button gap. Everything
else measured is already at or above the bar (axe 0, CLS 0, LCP 0.8 s,
contrast ≥ 4.5:1, no overflow at any width).
