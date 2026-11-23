# Content integrity — Engineering Notebook → Engineering Spec Sheet

Old source: `main:src/content.ts` (commit deaf356). New source: `src/content.ts` on `redesign/spec-sheet`, checked against the fresh production build's rendered HTML.

## Summary

- Old sentences checked: 138
- Old sentences preserved verbatim or as part of a longer note: 136
- Old sentences removed under the allowlist: 2
- Unexplained missing sentences: 0
- New sentences added under the allowlist: 6
- Unexplained added sentences: 0
- Links: 6 old, 6 new, 0 missing, 0 added
- Images: 2 old, 2 new, 0 missing, 0 added

## Removed sentences (allowlisted)

- “Real-time C#/.NET + SQL Server process monitoring with live dashboards.”: Rewritten in direct first-person voice (brief section E): the note now reads 'Built real-time C#/.NET and SQL Server process monitoring with live dashboards, cutting manual logging errors by 20%.'
- “The CV credits this work with cutting manual logging errors by 20%.”: Rewritten in direct first-person voice (brief section E); the 20% figure is unchanged and now sits in the same sentence.

## Added sentences (allowlisted)

- “One DAG, three tasks, four tables: dim_date, dim_customer, dim_product, fact_sales.”: Flagship proof callout, composed verbatim from the row proof and the outcome claim note (brief section C).
- “Peer-reviewed publication, 2025: Spectrum of Engineering Sciences, Vol.”: First fragment of the OratorPath proof callout above — the sentence splitter breaks at 'Vol.'
- “843–852, ISSN 3007-3138.”: Second fragment of the OratorPath proof callout above — the sentence splitter breaks at 'Vol.'
- “Relational defect tracking in Laravel/MySQL — one record for every defect.”: Tier-2 scope line, drawn only from the project's own problem and architecture text (brief section C).
- “Structured NLP student support in Python/Hugging Face.”: Tier-2 scope line, drawn only from the project's own problem and architecture text (brief section C).
- “Built real-time C#/.NET and SQL Server process monitoring with live dashboards, cutting manual logging errors by 20%.”: First-person rewrite of the Heavy Industries Taxila bullet (brief section E); the 20% figure is unchanged.

## Links

- https://github.com/shamas92: kept
- https://github.com/shamas92/leaselens: kept
- https://github.com/shamas92/sales-etl-pipeline: kept
- https://linkedin.com/in/shamasrehman: kept
- https://portfolio-v4-rosy-five.vercel.app: kept
- https://youtu.be/le_KM97lm5w: kept

## Images

- /images/etl-diagram.png: kept
- /images/leaselens-sam-exhibit.png: kept

## Component copy outside content.ts (manual check)

- Hero proof strip removed (brief section B): it was composed in page.tsx from the figure, tests and version fields, and those fields still render — in the LeaseLens flagship card metrics line and on the case page.
- Availability pill “Dresden · Werkstudent eligible, 20h/wk” is new component copy; the facts are profile.location (“Dresden, Germany”) and profile.workEligibility (“Working-student eligible, 20 hours a week.”), both kept verbatim. “20h/wk” is an abbreviation, not a new fact.
- “View Flagship Work” replaces the “See projects” button label (presentation copy only).
- Filter pill labels are the project stack tags verbatim, plus “All”, “SQL”, “Docker” and “C#”. SQL covers PostgreSQL/MySQL, Docker covers Docker Compose, C# matches no shipped project and the note says so.
- Capabilities matrix column headings (Data & Pipelines, ML & NLP, Full-Stack, Infra & DBs) are new presentation labels; every skill name inside them is verbatim from skillGroups or a project stack.
- “Earlier systems” and “Proof” are new presentation labels on the Work section and flagship cards.
- The rowProof sentences are no longer rendered as a row element on the home page, but every one of them survives in src/content.ts and in the case-page meta descriptions, so the sentence check passes them.
- The LeaseLens proof callout reuses the outcome claim note verbatim (“Registered IoU measures overlap after the two photos are aligned, so the score compares the same wall instead of two photos taken from different spots.”); the metrics line is composed from the figure, version and tests fields.
- Spoken languages and certificates moved from timeline groups into a horizontal metadata strip; every language, level, certificate and the Nov 2025 – Sep 2026 period is unchanged.
- Section order is unchanged (Hero, Work, Background, Stack, Contact). The footer is unchanged.
- The three SVG illustrations carry no numbers except the verified “86.1% IoU” label on the LeaseLens asset; the OratorPath bars are schematic and unlabeled.

**Result: zero unexplained differences.**
