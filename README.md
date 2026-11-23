# Shamas Ur Rehman — Portfolio v4

A personal portfolio: Next.js 16.4.6, React 19.3, TypeScript, Tailwind CSS
4.3.3. Static rendering, no third-party scripts, no analytics.

## Design

This branch is the **Engineering Notebook** redesign: a well-typeset
engineering report. Oxide-red accent (#9A3324 light / #E07856 dark),
Newsreader headings, Inter Tight body, JetBrains Mono for years, figures
and labels. Theme follows the system setting only
(`prefers-color-scheme`); there is no toggle. Tokens live in
`src/app/globals.css`: one hand-written stylesheet, CSS custom
properties, hairline rules instead of boxes and shadows.

## Structure

- `src/content.ts`: every fact on the site: profile, projects,
  background, stack groups. Content lives here, never in components.
- `src/app/`: routes: `/` (hero, work ledger, background, stack),
  `/work/[slug]` (five static case-study pages), sitemap, robots.
- `src/components/`: one small component per piece: `ProjectRow`,
  `CaseStudy` (with the evidence blocks), `Timeline`, `StackGroup`,
  `SiteFooter` (contact), `CopyEmailButton`, `ProofNote`, `Rail`.
- `src/app/globals.css`: the only stylesheet. All spacing, colour,
  radii and durations come from tokens; no magic numbers.
- `public/images/`: the two evidence images (LeaseLens SAM exhibit,
  ETL diagram) and the OG image.
- `scripts/`: `content-integrity.mjs` (see below), `make-og-image.py`.
- `docs/`: `redesign-baseline.md` (audit of the previous design),
  `redesign-report.md` (this redesign, with measurements),
  `content-integrity.md` (content diff report).

## Add a project

1. Add one entry to `projects` in `src/content.ts`: `slug`, `title`,
   `year`, `tagline`, `rowOutcome`, `rowProof`, `stack`, `problem`,
   `architecture`, `outcome`. Blocks are optional fields: leave out
   what has no verified content (`figure`, `evidence`, `image`,
   `registry`, `limits`, `links`); a project with no verified
   evidence gets the plain status line `evidenceStatus`.
2. Put its image in `public/images/` and reference it with its real
   `width` and `height`.
3. The `/work/[slug]` page is generated automatically
   (`generateStaticParams`). The home ledger row reads the same entry.

Never invent a figure, date or link: if a fact is missing, leave the
field out and say so in the PR.

## Run, build, check

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

Checks (all must pass before a commit):

```bash
./node_modules/.bin/tsc --noEmit
./node_modules/.bin/eslint src/
./node_modules/.bin/prettier --check "src/**/*.{ts,tsx}"
node scripts/content-integrity.mjs   # after npm run build; writes docs/content-integrity.md
```

## Deploy

The GitHub repo is not connected to Vercel, so pushes do not
auto-deploy. Deploy from this machine with the Vercel CLI:
`~/workspace/.vercel-cli/node_modules/.bin/vercel deploy --prod`.
