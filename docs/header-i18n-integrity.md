# Content integrity — header-i18n + polish (HITEC project)

Baseline: `src/content.ts` at commit 50023ff (redesign/header-i18n before the polish + HITEC additions). New source: `src/content.ts` + `src/content.de.ts` on `redesign/header-i18n`, checked against the fresh production build's rendered HTML (English SSR) and a runtime deep comparison of the two locales (Node type-stripping import). Additions and removals in the polish update are allowlisted below with their reasons.

## Part A — English unchanged

- Old sentences checked: 176
- Old sentences preserved verbatim or as part of a longer note: 168
- Old sentences removed under the allowlist: 8
- Unexplained missing sentences: 0
- New sentences added under the allowlist: 14
- Unexplained added sentences: 0
- Links: 6 old, 6 new, 0 missing, 0 added
- Images: 2 old, 2 new, 0 missing, 0 added

### Removed sentences (allowlisted)

- “Dresden · Werkstudent 20h/wk”: Navbar presence-dot tooltip, removed with the dot itself (the polish brief removes the redundant dot; the hero pill carries the availability line).
- “Two earlier systems follow in a compact index.”: Work intro, second sentence. Three earlier systems now follow (HITEC added); the sentence is replaced by the three-systems version.
- “Showing all 5 projects.”: Work filter note. The count is now a derived {total} placeholder (6 projects); the hard-coded 5 is gone.
- “{n} of 5 projects use {tag}.”: Work filter-note template. The count is now a derived {total} placeholder; the hard-coded 5 is gone.
- “No shipped project lists C#.”: C# filter note, first sentence. The new HITEC project lists C#, so the note's claim is now false; the note and its special case are removed.
- “It appears in Background — the HITEC internship and Heavy Industries Taxila.”: C# filter note, second sentence. Removed with the note (see above).
- “Earlier systems”: Tier-2 heading. Renamed to Earlier & Institutional Systems now that the tier holds an institutional project.
- “Five shipped systems, each shown with its proof.”: Meta description, second sentence. Six shipped systems now (HITEC added).

### Added sentences (allowlisted)

- “Internal / Archived”: New project — Tier 2 row badge. No external live URL exists, so the row links to the internal case page and carries this badge.
- “HITEC University Web Platform & Admin Panel”: New project (HITEC University Web Platform & Admin Panel, 2025) — title. User-briefed 2026-11-24.
- “Database-backed university web modules, an internal content-management admin panel, and an integrated RAG support chatbot.”: New project — one-sentence summary. User-briefed 2026-11-24.
- “Delivered during IT Department internship (May–Oct 2025); internal admin panel & CMS, live site maintained externally post-internship.”: New project — proof / delivery line. User-briefed 2026-11-24.
- “HITEC University's web presence ran on modules that needed a database behind them, and the internal team needed an admin panel to manage content — plus a support chatbot that could answer questions from university documents.”: New project — Problem block. Rephrased from the user-briefed summary and the existing Background internship entry; no new claim.
- “The backend is ASP.NET MVC in C#, with a SQL Server schema behind the web modules.”: New project — Architecture block, sentence 1. User-briefed stack (ASP.NET MVC, C#, SQL Server).
- “The internal admin panel provides CRUD workflows for the content management system.”: New project — Architecture block, sentence 2. User-briefed (admin CRUD workflows).
- “A RAG support chatbot in Python/Hugging Face answers questions over university documents.”: New project — Architecture block, sentence 3. From the existing Background internship entry (RAG support chatbot in Python/Hugging Face over university docs).
- “Delivered during the IT Department internship (May–Oct 2025); internal admin panel & CMS, live site maintained externally post-internship.”: New project — Outcome block, sentence 1. The proof line restated with 'the' for sentence grammar; same facts, user-briefed 2026-11-24.
- “Three earlier systems follow in a compact index.”: Work intro, second sentence. Replaces 'Two earlier systems follow in a compact index.' (HITEC added).
- “Showing all {total} projects.”: Work filter note, derived count. Replaces the hard-coded 'Showing all 5 projects.' now that the count comes from the project list.
- “{n} of {total} projects use {tag}.”: Work filter-note template, derived count. Replaces the hard-coded '{n} of 5 projects use {tag}.'.
- “Earlier & Institutional Systems”: Tier-2 heading. Replaces 'Earlier systems' now that the tier holds an institutional project.
- “Six shipped systems, each shown with its proof.”: Meta description, second sentence. Replaces 'Five shipped systems, each shown with its proof.' (HITEC added).

### Links

- https://github.com/shamas92: kept
- https://github.com/shamas92/leaselens: kept
- https://github.com/shamas92/sales-etl-pipeline: kept
- https://linkedin.com/in/shamasrehman: kept
- https://portfolio-v4-rosy-five.vercel.app: kept
- https://youtu.be/le_KM97lm5w: kept

### Images

- /images/etl-diagram.png: kept
- /images/leaselens-sam-exhibit.png: kept

## Part B — German complete

- English string leaves: 343
- German string leaves: 342
- Keys in English but not German: 1 (1 allowlisted)
- Keys in German but not English: 0 (0 allowlisted)
- German values byte-identical to English: 170 (170 explained as proper nouns, links, numbers, or the verbatim quote)
- Unexplained identical values: 0

### Missing keys in German

- `projects[0].evidence.gloss`: English gloss of the German lease quote; omitted in German because the quote is already German.

### Extra keys in German

- None.

### German values identical to English (explained)

- `profile.name` = “Shamas Ur Rehman”: person's name
- `profile.email` = “shamasrehman249@gmail.com”: Email address, identical in both locales.
- `profile.github` = “https://github.com/shamas92”: URL, identical in both locales.
- `profile.linkedin` = “https://linkedin.com/in/shamasrehman”: URL, identical in both locales.
- `projects[0].slug` = “leaselens”: URL slug, identical in both locales.
- `projects[0].title` = “LeaseLens”: project title — proper noun
- `projects[0].year` = “2026”: year / test count — number, identical by rule
- `projects[0].stack[0]` = “Next.js”: skill / stack / certificate name — proper noun, does not translate
- `projects[0].stack[1]` = “TypeScript”: skill / stack / certificate name — proper noun, does not translate
- `projects[0].stack[2]` = “FastAPI”: skill / stack / certificate name — proper noun, does not translate
- `projects[0].stack[3]` = “Python”: skill / stack / certificate name — proper noun, does not translate
- `projects[0].stack[4]` = “SAM 3.1”: skill / stack / certificate name — proper noun, does not translate
- `projects[0].outcome[1][1].claim` = “86.1% registered IoU”: metric claim '86.1% registered IoU' — number, identical by rule
- `projects[0].figure.value` = “86.1%”: Metric '86.1%', identical in both locales.
- `projects[0].version` = “v1.0.0”: Version string 'v1.0.0', identical in both locales.
- `projects[0].tests.total` = “197”: year / test count — number, identical by rule
- `projects[0].tests.backend` = “132”: year / test count — number, identical by rule
- `projects[0].tests.frontend` = “65”: year / test count — number, identical by rule
- `projects[0].evidence.kind` = “quote”: evidence-kind key (quote / citation)
- `projects[0].evidence.text` = “Die vor dem Einzug zu zahlende Kaution beträgt 950,00 EUR.”: The German lease quote, verbatim in both locales.
- `projects[0].image.src` = “/images/leaselens-sam-exhibit.png”: link / slug / address / image path — identical by definition
- `projects[0].image.width` = “740”: link / slug / address / image path — identical by definition
- `projects[0].image.height` = “640”: link / slug / address / image path — identical by definition
- `projects[0].registry[4].jurisdiction` = “Japan”: jurisdiction name — same word in German (Japan)
- `projects[0].links[0].href` = “https://github.com/shamas92/leaselens”: URL, identical in both locales.
- `projects[0].links[1].href` = “https://youtu.be/le_KM97lm5w”: URL, identical in both locales.
- `projects[1].slug` = “sales-etl-pipeline”: URL slug, identical in both locales.
- `projects[1].title` = “Sales ETL Pipeline”: project title — proper noun
- `projects[1].year` = “2026”: year / test count — number, identical by rule
- `projects[1].stack[0]` = “Apache Airflow”: skill / stack / certificate name — proper noun, does not translate
- `projects[1].stack[1]` = “Docker Compose”: skill / stack / certificate name — proper noun, does not translate
- `projects[1].stack[2]` = “PostgreSQL”: skill / stack / certificate name — proper noun, does not translate
- `projects[1].stack[3]` = “MinIO”: skill / stack / certificate name — proper noun, does not translate
- `projects[1].stack[4]` = “Parquet”: skill / stack / certificate name — proper noun, does not translate
- `projects[1].image.src` = “/images/etl-diagram.png”: link / slug / address / image path — identical by definition
- `projects[1].image.width` = “1728”: link / slug / address / image path — identical by definition
- `projects[1].image.height` = “1440”: link / slug / address / image path — identical by definition
- `projects[1].links[0].href` = “https://github.com/shamas92/sales-etl-pipeline”: URL, identical in both locales.
- `projects[2].slug` = “oratorpath”: URL slug, identical in both locales.
- `projects[2].title` = “OratorPath”: project title — proper noun
- `projects[2].year` = “2025”: year / test count — number, identical by rule
- `projects[2].stack[0]` = “PyTorch”: skill / stack / certificate name — proper noun, does not translate
- `projects[2].stack[1]` = “Hugging Face”: skill / stack / certificate name — proper noun, does not translate
- `projects[2].stack[2]` = “NLP”: skill / stack / certificate name — proper noun, does not translate
- `projects[2].evidence.kind` = “citation”: evidence-kind key (quote / citation)
- `projects[3].slug` = “hitec-cms”: URL slug, identical in both locales.
- `projects[3].year` = “2025”: year / test count — number, identical by rule
- `projects[3].stack[0]` = “C#”: skill / stack / certificate name — proper noun, does not translate
- `projects[3].stack[1]` = “ASP.NET MVC”: skill / stack / certificate name — proper noun, does not translate
- `projects[3].stack[2]` = “SQL Server”: skill / stack / certificate name — proper noun, does not translate
- `projects[3].stack[3]` = “Python”: skill / stack / certificate name — proper noun, does not translate
- `projects[3].stack[4]` = “RAG”: skill / stack / certificate name — proper noun, does not translate
- `projects[4].slug` = “quality-crm”: URL slug, identical in both locales.
- `projects[4].title` = “Quality Management & Defect-Tracking CRM”: project title — proper noun
- `projects[4].year` = “2024”: year / test count — number, identical by rule
- `projects[4].stack[0]` = “Laravel”: skill / stack / certificate name — proper noun, does not translate
- `projects[4].stack[1]` = “MySQL”: skill / stack / certificate name — proper noun, does not translate
- `projects[4].stack[2]` = “PHP”: skill / stack / certificate name — proper noun, does not translate
- `projects[5].slug` = “upliftu”: URL slug, identical in both locales.
- `projects[5].title` = “UpliftU”: project title — proper noun
- `projects[5].year` = “2024”: year / test count — number, identical by rule
- `projects[5].stack[0]` = “Python”: skill / stack / certificate name — proper noun, does not translate
- `projects[5].stack[1]` = “Hugging Face”: skill / stack / certificate name — proper noun, does not translate
- `projects[5].stack[2]` = “NLP”: skill / stack / certificate name — proper noun, does not translate
- `background.education[0].school` = “TU Dresden”: institution / degree name — proper noun
- `background.education[0].note` = “Scalable Data Engineering, Data Visualization, Requirements Engineering.”: course titles — proper nouns
- `background.education[1].degree` = “BSc Software Engineering”: institution / degree name — proper noun
- `background.education[1].school` = “HITEC University Taxila”: institution / degree name — proper noun
- `background.experience[0].org` = “HITEC University”: institution / degree name — proper noun
- `background.experience[1].org` = “Heavy Industries Taxila”: institution / degree name — proper noun
- `background.languages[0].level` = “C1 (IELTS 7.5)”: test level (C1, IELTS 7.5) — identical by rule
- `background.languages[2].language` = “Urdu”: language name — same word in German
- `background.certifications.items[0]` = “Google Advanced Data Analytics”: skill / stack / certificate name — proper noun, does not translate
- `background.certifications.items[1]` = “Google Data Analytics”: skill / stack / certificate name — proper noun, does not translate
- `background.certifications.items[2]` = “Google IT Automation with Python”: skill / stack / certificate name — proper noun, does not translate
- `background.certifications.items[3]` = “Google Project Management”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[0].title` = “Languages”: skill-group title carried verbatim — not rendered (the matrix uses the translated matrixColumns titles)
- `skillGroups[0].skills[0].name` = “Python”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[0].skills[0].project` = “leaselens”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[0].skills[1].name` = “SQL”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[0].skills[1].project` = “sales-etl-pipeline”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[0].skills[2].name` = “C#”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[0].skills[3].name` = “TypeScript”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[0].skills[3].project` = “leaselens”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[0].skills[4].name` = “JavaScript”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[0].skills[5].name` = “PHP”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[0].skills[5].project` = “quality-crm”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[1].title` = “Data & BI”: skill-group title carried verbatim — not rendered (the matrix uses the translated matrixColumns titles)
- `skillGroups[1].skills[0].name` = “Pandas”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[1].skills[1].name` = “NumPy”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[1].skills[2].name` = “Matplotlib”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[1].skills[3].name` = “scikit-learn”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[1].skills[4].name` = “time-series analysis”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[1].skills[5].name` = “anomaly detection”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[1].skills[6].name` = “Tableau”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[1].skills[7].name` = “Excel”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[2].title` = “Frameworks & AI”: skill-group title carried verbatim — not rendered (the matrix uses the translated matrixColumns titles)
- `skillGroups[2].skills[0].name` = “FastAPI”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[2].skills[0].project` = “leaselens”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[2].skills[1].name` = “ASP.NET MVC”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[2].skills[2].name` = “Next.js”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[2].skills[2].project` = “leaselens”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[2].skills[3].name` = “React”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[2].skills[3].project` = “leaselens”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[2].skills[4].name` = “PyTorch”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[2].skills[4].project` = “oratorpath”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[2].skills[5].name` = “Hugging Face”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[2].skills[5].project` = “oratorpath”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[2].skills[6].name` = “RAG”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[2].skills[7].name` = “NLP”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[2].skills[7].project` = “oratorpath”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[3].title` = “Databases”: skill-group title carried verbatim — not rendered (the matrix uses the translated matrixColumns titles)
- `skillGroups[3].skills[0].name` = “SQL Server”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[3].skills[1].name` = “MySQL”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[3].skills[1].project` = “quality-crm”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[3].skills[2].name` = “PostgreSQL”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[3].skills[2].project` = “sales-etl-pipeline”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[4].title` = “Tools”: skill-group title carried verbatim — not rendered (the matrix uses the translated matrixColumns titles)
- `skillGroups[4].skills[0].name` = “Git”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[4].skills[1].name` = “Docker”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[4].skills[1].project` = “sales-etl-pipeline”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[4].skills[2].name` = “Linux (Ubuntu)”: skill / stack / certificate name — proper noun, does not translate
- `skillGroups[4].skills[3].name` = “REST APIs”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[0].skills[0]` = “SQL”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[0].skills[1]` = “Pandas”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[0].skills[2]` = “NumPy”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[0].skills[3]` = “Matplotlib”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[0].skills[4]` = “scikit-learn”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[0].skills[5]` = “time-series analysis”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[0].skills[6]` = “anomaly detection”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[0].skills[7]` = “Tableau”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[0].skills[8]` = “Excel”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[0].skills[9]` = “Parquet”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[0].skills[10]` = “MinIO”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[0].skills[11]` = “Apache Airflow”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[1].title` = “ML & NLP”: column title — standard German tech term (ML & NLP, Full-Stack)
- `matrixColumns[1].skills[0]` = “Python”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[1].skills[1]` = “PyTorch”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[1].skills[2]` = “Hugging Face”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[1].skills[3]` = “RAG”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[1].skills[4]` = “NLP”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[1].skills[5]` = “SAM 3.1”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[2].title` = “Full-Stack”: column title — standard German tech term (ML & NLP, Full-Stack)
- `matrixColumns[2].skills[0]` = “TypeScript”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[2].skills[1]` = “JavaScript”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[2].skills[2]` = “PHP”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[2].skills[3]` = “C#”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[2].skills[4]` = “ASP.NET MVC”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[2].skills[5]` = “Next.js”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[2].skills[6]` = “React”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[2].skills[7]` = “FastAPI”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[2].skills[8]` = “Laravel”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[2].skills[9]` = “REST APIs”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[3].skills[0]` = “PostgreSQL”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[3].skills[1]` = “MySQL”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[3].skills[2]` = “SQL Server”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[3].skills[3]` = “Docker”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[3].skills[4]` = “Docker Compose”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[3].skills[5]` = “Git”: skill / stack / certificate name — proper noun, does not translate
- `matrixColumns[3].skills[6]` = “Linux (Ubuntu)”: skill / stack / certificate name — proper noun, does not translate
- `ui.nav.stack` = “Stack”: 'Stack' is the German word too
- `ui.work.iouLabel` = “registered IoU”: metric label — 'registered IoU' is the term in both locales
- `ui.work.stackLabel` = “Stack”: 'Stack' is the German word too
- `ui.stack.heading` = “Stack”: 'Stack' is the German word too
- `ui.caseStudy.problem` = “Problem”: 'Problem' is the German word too
- `ui.caseStudy.stack` = “Stack”: 'Stack' is the German word too
- `ui.caseStudy.links` = “Links”: 'Links' is the German word too
- `ui.assets.leaselens.iou` = “86.1% IoU”: verified metric label '86.1% IoU' — number, identical by rule
- `ui.assets.etl.airflow` = “Airflow”: Airflow terminology — 'Airflow' / 'Tasks' in both locales
- `ui.assets.etl.tasks` = “Tasks”: Airflow terminology — 'Airflow' / 'Tasks' in both locales

## Open TODO(content) items (unchanged — user must supply)

- OratorPath live dashboard URL (still open; no live link anywhere).
- The CV file and the availability line wording were resolved on main @ 8ab0f7f (CV ships as public/Shamas_Ur_Rehman_CV.pdf; the hero pill reads “Dresden · Werkstudent eligible, 20h/wk”).

**Result: zero unexplained differences.**
