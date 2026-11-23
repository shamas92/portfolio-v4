# Content integrity — Annotated Proof → Engineering Notebook

Old source: `main:src/content.ts` (commit b7c0689). New source: `src/content.ts` on `redesign/notebook`, checked against the fresh production build's rendered HTML.

## Summary

- Old sentences checked: 136
- Old sentences preserved verbatim or as part of a longer note: 133
- Old sentences removed under the allowlist: 3
- Unexplained missing sentences: 0
- New sentences added under the allowlist: 5
- Unexplained added sentences: 0
- Links: 6 old, 6 new, 0 missing, 0 added
- Images: 2 old, 2 new, 0 missing, 0 added

## Removed sentences (allowlisted)

- “MSc Computer Science, TU Dresden.” — Intro reworded as the hero status line (allowed: duplicate Dresden fix).
- “Software engineer in Dresden.” — Intro reworded; role and location survive in the document title and the footer location line.
- “No figures were measured for this project, so none are shown.” — Reworded to the plain status line 'No figures were measured for this project.' (user decision 5).

## Added sentences (allowlisted)

- “MSc Computer Science, TU Dresden, Dresden, Germany” — Hero status line, reworded from the old intro (allowed: duplicate Dresden fix).
- “LeaseLens on GitHub” — Descriptive case link label (accessibility).
- “LeaseLens demo film” — Descriptive case link label (accessibility).
- “Sales ETL Pipeline on GitHub” — Descriptive case link label (accessibility).
- “No figures were measured for this project.” — Plain status line (user decision 5).

## Links

- https://github.com/shamas92 — kept
- https://github.com/shamas92/leaselens — kept
- https://github.com/shamas92/sales-etl-pipeline — kept
- https://linkedin.com/in/shamasrehman — kept
- https://portfolio-v4-rosy-five.vercel.app — kept
- https://youtu.be/le_KM97lm5w — kept

## Images

- /images/etl-diagram.png — kept
- /images/leaselens-sam-exhibit.png — kept

## Component copy outside content.ts (manual check)

- Footer line “Every claim on this page carries its evidence.” is new presentation copy; the sentiment is the hero claim “I build data & ML systems — and prove every claim on this page.”, kept verbatim.
- Footer location line “Dresden, Germany” is new as a separate line; the fact was in the old intro (“Software engineer in Dresden.”) and the document title.
- Section order changed Work, Stack, Background → Work, Background, Stack (per the redesign brief). Section intros are unchanged.
- “Spoken languages” replaces the “Languages” heading in the timeline (allowed: label-clash fix); the programming group keeps “Languages”.
- The row proof notes are gone as a row element; each note's text survives in the case-page claim notes (LeaseLens note merged into the outcome claim note, ETL and OratorPath notes verbatim).

**Result: zero unexplained differences.**
