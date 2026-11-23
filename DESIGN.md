# Design — Engineering Notebook

Replaces the "Annotated Proof" design (green verified wash, Schibsted
Grotesk / Source Serif 4, margin-column proof notes). The site reads
as a well-typeset engineering report: one reading column, a narrow
left rail holding the section index, hairline rules instead of boxes
and shadows, and evidence attached to every claim. The concept shows
through behavior; nothing on the page explains it.

## Tokens

CSS variables in `src/app/globals.css`. Two layers: raw values in one
block, semantic aliases below. Components use only the aliases.

| Role | Light | Dark (`prefers-color-scheme`) |
| --- | --- | --- |
| paper (`--bg`) | #FAF7F2 | #16130F |
| surface (`--surface`) | #FFFDF9 | #1E1A15 |
| ink (`--ink`) | #1B1815 | #F2EDE5 |
| ink-muted (`--ink-muted`) | #6B6156 | #A89D8E |
| rule (`--rule`) | #D8D2C8 | #3A332B |
| accent (`--accent`, `--accent-ink`, `--focus`) | #9A3324 | #E07856 |
| accent-wash (`--accent-wash`) | #F7E4DF | #3D201A |

Oxide red appears only where it means something: links, focus rings,
and proof figures. No gradients, no decorative shadows, no identical
rounded-card kit. Theme follows the system setting only; there is no
toggle. All text pairs pass WCAG AA (4.5:1) in both themes; the
tightest is ink-muted on the accent wash (4.93 light / 5.55 dark).
The 2px focus ring meets 3:1 against paper in both themes
(6.84 / 6.16). The hairline rules are decorative separators
(1.41 / 1.49) and carry no contrast requirement.

## Type

- Newsreader (name, headings, case-study quotes) and Inter Tight
  (body, UI) with JetBrains Mono for years, figures and labels only,
  loaded with `next/font`, self-hosted and subsetted (latin +
  latin-ext, so ä ö ü ß render), with size-adjusted fallbacks.
  The italic Newsreader used by case-study quotes loads only on
  case pages.
- Type scale of five steps, fluid with `clamp()`, body 17px desktop,
  line-height 1.6, measure 60–70ch. Tabular numerals for metrics
  and dates.
- No tracked all-caps eyebrow labels above headings, no middle-dot
  meta strings, no single accented word in a headline, no numbered
  markers on non-sequential content, no arrows appended to links.

## Layout

Desktop: one reading column (max about 72ch prose, wider for the
ledger) with a 200px left rail holding the sticky section index;
the page grid is `200px | 1fr`. Mobile: single column, no rail
(the header nav covers the same links). 8px spacing scale.
Hairline rules (1px) separate sections, rows and blocks.

Sections (one instance of each, in order): Hero, Work, Background
(a real timeline), Stack, Contact (in the footer). Work is five
ruled rows with one pattern: year, name, one-sentence outcome, one
proof statement, stack in plain text. Each row links to
`/work/[slug]`, generated with `generateStaticParams`. Each case
study has the same six blocks: Problem, Architecture, Outcome,
Evidence, Stack, Links. A block is omitted when the project has no
verified content for it; a project with no verified evidence keeps
the plain status line "No figures were measured for this project."

## Motion

One orchestrated moment only: the wash under "prove every claim"
sweeps in once on load (`transform: scaleX`, 600 ms, one easing
token `cubic-bezier(0.2, 0, 0, 1)`). Proof notes fade 200 ms
(opacity + a 2 px shift). Row hover/focus shows a thin indicator
via `transform: scaleY`. Only transform and opacity animate; never
height, width, top, left, margin, padding, box-shadow or filter.
Hover effects are wrapped in `@media (hover: hover) and
(pointer: fine)`. `prefers-reduced-motion` shows final states,
no sweep. Content is fully visible without JavaScript.

## Interaction

Proof notes are disclosure buttons (`aria-expanded`,
`aria-controls`). They open on click, tap or Enter, close on
Escape, including from the Close button, and never depend on
hover. Closing returns focus to the trigger. Touch targets are at
least 44 px tall; the remaining sub-44px-wide targets are inline
text links inside comma-separated lists (width follows the text,
height 44px, WCAG 2.5.8 inline exception). Buttons use plain verbs
("See projects", "Copy email"). The copy button announces success
via `aria-live`.

## Content

One typed module, `src/content.ts`: profile, projects, background,
skills, and the `contentTodos` list. Missing facts render a visible
`TODO(content)` marker in development and are omitted in production.
Nothing is invented; the LeaseLens IoU figure is demoted to
supporting evidence and "registered IoU" is explained in plain
words. `scripts/content-integrity.mjs` checks every sentence, link
and image in the old content against the new build; its report is
`docs/content-integrity.md`.

## Components

`ProofNote` (claim button + inline note + annotated paragraph),
`ProjectRow`, `CaseStudy`, `Timeline`, `StackGroup`, `Rail`,
`SiteHeader`, `SiteFooter`, `CopyEmailButton`, `Todo`. Server
components by default; client components only for disclosures and
the copy button.

## SEO

Per-page title/description, canonical URLs, Open Graph + Twitter
images (`public/og.png`, 1200×630, regenerated by
`scripts/make-og-image.py`), sitemap, robots, `<html lang="en">`,
`lang="de"` on the German quote, JSON-LD Person.
