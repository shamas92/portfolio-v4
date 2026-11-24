#!/usr/bin/env node
/**
 * Header-i18n content-integrity check.
 *
 * Part A — English unchanged: every sentence in the English content
 * at the branch baseline 50023ff (redesign/header-i18n before the
 * polish + HITEC additions) must survive in the restructured
 * src/content.ts or in the fresh production build's rendered HTML,
 * except allowlisted moves.
 *
 * The polish update (this revision) adds the HITEC University Web
 * Platform & Admin Panel project, derives the filter counts from
 * the project list, renames the tier-2 heading, and removes the
 * navbar presence dot and the stale C# note. Those sentences are
 * allowlisted below with their reasons.
 *
 * Part B — German complete: the German locale (src/content.de.ts)
 * must carry every string exactly once, with no missing or extra
 * keys versus the English shape, and every German value that is
 * byte-identical to its English twin must be allowlisted (proper
 * nouns, numbers, links, the verbatim German lease quote).
 *
 * The one intentional difference: the English gloss of the German
 * lease quote is omitted in German, because the quote is already
 * German. That is the only allowed key difference.
 *
 * Run after `npm run build` so the rendered HTML is fresh:
 *   node scripts/header-i18n-integrity.mjs
 * Writes docs/header-i18n-integrity.md and exits 1 on any
 * unexplained difference.
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const BASELINE = "50023ff";
const MIN_LEN = 15; // sentences shorter than this are labels/keys

/* ---- extraction (same approach as scripts/content-integrity.mjs) ---- */

/** All double-quoted string literals, with a flag for property keys. */
function literals(src) {
  const out = [];
  const re = /"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = re.exec(src))) {
    const value = m[1].replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    const after = src.slice(re.lastIndex).match(/^\s*:/);
    out.push({ value, isKey: Boolean(after) });
  }
  return out;
}

function sentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= MIN_LEN);
}

function decodeHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&rsquo;/g, "’")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ");
}

function htmlFiles(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) htmlFiles(p, acc);
    else if (p.endsWith(".html")) acc.push(p);
  }
  return acc;
}

function links(text) {
  return new Set(text.match(/https?:\/\/[^\s"'<>)]+/g) ?? []);
}

function images(text) {
  return new Set(
    text.match(/\/[^\s"'<>)]+\.(?:png|jpg|jpeg|webp|avif)/g) ?? [],
  );
}

/* ---- Part A inputs ---- */

const oldSrc = execSync(`git show ${BASELINE}:src/content.ts`, {
  encoding: "utf8",
});
const newSrc = readFileSync("src/content.ts", "utf8");
const rendered = htmlFiles(".next/server/app")
  .map((f) => decodeHtml(readFileSync(f, "utf8")))
  .join(" ");

/* ---- Part A allowlist: moves from components into content.ts.
   The header-i18n restructure moved presentation copy that used to
   live hardcoded in components into the typed ui object, and moved
   the matrix column headings out of CapabilitiesMatrix. Every
   allowlisted sentence below is copy that already shipped in the
   Spec Sheet build, now typed as content. ---- */

const allowedRemoved = new Map([
  [
    "Dresden · Werkstudent 20h/wk",
    "Navbar presence-dot tooltip, removed with the dot itself (the polish brief removes the redundant dot; the hero pill carries the availability line).",
  ],
  [
    "No shipped project lists C#.",
    "C# filter note, first sentence. The new HITEC project lists C#, so the note's claim is now false; the note and its special case are removed.",
  ],
  [
    "It appears in Background — the HITEC internship and Heavy Industries Taxila.",
    "C# filter note, second sentence. Removed with the note (see above).",
  ],
  [
    "Two earlier systems follow in a compact index.",
    "Work intro, second sentence. Three earlier systems now follow (HITEC added); the sentence is replaced by the three-systems version.",
  ],
  [
    "Showing all 5 projects.",
    "Work filter note. The count is now a derived {total} placeholder (6 projects); the hard-coded 5 is gone.",
  ],
  [
    "{n} of 5 projects use {tag}.",
    "Work filter-note template. The count is now a derived {total} placeholder; the hard-coded 5 is gone.",
  ],
  [
    "Earlier systems",
    "Tier-2 heading. Renamed to Earlier & Institutional Systems now that the tier holds an institutional project.",
  ],
  [
    "Five shipped systems, each shown with its proof.",
    "Meta description, second sentence. Six shipped systems now (HITEC added).",
  ],
]);

const allowedAdded = new Map([
  [
    "Data & Pipelines",
    "Capabilities-matrix column heading, previously hardcoded in CapabilitiesMatrix; now content.matrixColumns[0].title.",
  ],
  [
    "Skip to content",
    "Skip-link label, previously hardcoded in layout.tsx; now ui.skipLink.",
  ],
  [
    "Shamas Ur Rehman on GitHub",
    "GitHub icon aria-label, previously hardcoded in SiteHeader; now ui.header.githubLabel.",
  ],
  [
    "Shamas Ur Rehman on LinkedIn",
    "LinkedIn icon aria-label, previously hardcoded in SiteHeader; now ui.header.linkedinLabel.",
  ],
  [
    "Dresden · Werkstudent 20h/wk",
    "Presence-dot tooltip, previously hardcoded in SiteHeader; now ui.header.presence.",
  ],
  [
    "Copy failed — use the email link",
    "CopyEmailButton failure title, previously hardcoded in CopyEmailButton; now ui.copyEmail.copyFailed.",
  ],
  [
    "Email address copied to clipboard.",
    "CopyEmailButton aria-live announcement, previously hardcoded in CopyEmailButton; now ui.copyEmail.copiedAnnouncement.",
  ],
  [
    "Use the email link instead.",
    "CopyEmailButton failure announcement, previously hardcoded in CopyEmailButton; now ui.copyEmail.failedAnnouncement.",
  ],
  [
    "Copy email address",
    "CopyEmailButton aria-label, previously hardcoded in CopyEmailButton; now ui.copyEmail.iconLabel.",
  ],
  [
    "Switch to light mode",
    "ThemeToggle label, previously hardcoded in ThemeToggle; now ui.theme.toLight.",
  ],
  [
    "Switch to dark mode",
    "ThemeToggle label, previously hardcoded in ThemeToggle; now ui.theme.toDark.",
  ],
  [
    "Dresden · Werkstudent eligible, 20h/wk",
    "Hero availability pill, previously hardcoded in page.tsx; now ui.hero.pill.",
  ],
  [
    "View Flagship Work",
    "Hero CTA label, previously hardcoded in page.tsx; now ui.hero.viewWork.",
  ],
  [
    "Three flagship systems, each with its architecture and its proof.",
    "Work section intro, first sentence, previously hardcoded in page.tsx; now ui.work.intro.",
  ],
  [
    "Two earlier systems follow in a compact index.",
    "Work section intro, second sentence, previously hardcoded in page.tsx; now ui.work.intro.",
  ],
  [
    "Showing all 5 projects.",
    "Work filter note, previously composed in WorkSection; now ui.work.showingAll.",
  ],
  [
    "{n} of 5 projects use {tag}.",
    "Work filter-note template, previously composed in WorkSection; now ui.work.showingSome.",
  ],
  [
    "No shipped project lists C#.",
    "C# filter note, first sentence, previously composed in WorkSection; now ui.work.cSharpNote.",
  ],
  [
    "It appears in Background — the HITEC internship and Heavy Industries Taxila.",
    "C# filter note, second sentence, previously composed in WorkSection; now ui.work.cSharpNote.",
  ],
  [
    "Earlier systems",
    "Work section tier-2 heading, previously hardcoded in WorkSection; now ui.work.earlierSystems.",
  ],
  [
    "{version} · {total} tests ({backend} backend, {frontend} frontend)",
    "Flagship metrics template, previously composed in FlagshipCard from the figure/version/tests fields; now ui.work.metrics.",
  ],
  [
    "Spoken languages",
    "Background metadata-strip label, previously hardcoded in Background; now ui.background.languagesLabel.",
  ],
  [
    "Every skill, grouped by what it does.",
    "Stack section intro, first sentence, previously hardcoded in page.tsx; now ui.stack.intro.",
  ],
  [
    "The pills above the projects filter them by stack.",
    "Stack section intro, second sentence, previously hardcoded in page.tsx; now ui.stack.intro.",
  ],
  [
    "Every claim on this page carries its evidence.",
    "Footer closing line, previously hardcoded in SiteFooter; now ui.footer.closing.",
  ],
  [
    "Deposit caps in the registry",
    "Case-study registry heading, previously hardcoded in CaseStudy; now ui.caseStudy.registryHeading.",
  ],
  [
    "Split-frame schematic: move-in and move-out room boundaries aligned, with an 86.1 percent IoU reticle",
    "LeaseLens SVG aria-label, previously hardcoded in SpecAssets; now ui.assets.leaselens.ariaLabel.",
  ],
  [
    "Move-in and move-out room boundaries aligned, 86.1% IoU",
    "LeaseLens SVG title, previously hardcoded in SpecAssets; now ui.assets.leaselens.title.",
  ],
  [
    "Pipeline diagram: sources feed MinIO and Parquet, Airflow tasks load the PostgreSQL star schema",
    "ETL SVG aria-label, previously hardcoded in SpecAssets; now ui.assets.etl.ariaLabel.",
  ],
  [
    "Sources feed MinIO and Parquet, Airflow tasks load PostgreSQL",
    "ETL SVG title, previously hardcoded in SpecAssets; now ui.assets.etl.title.",
  ],
  [
    "1 DAG · 3 TASKS · 4 TABLES",
    "ETL SVG footer label, previously hardcoded in SpecAssets; now ui.assets.etl.footer.",
  ],
  [
    "Speech waveform with structured metric bars for pace, filler words, and clarity",
    "OratorPath SVG aria-label, previously hardcoded in SpecAssets; now ui.assets.orator.ariaLabel.",
  ],
  [
    "Speech waveform with metric bars: pace, filler words, clarity",
    "OratorPath SVG title, previously hardcoded in SpecAssets; now ui.assets.orator.title.",
  ],
  [
    "Software Engineer, Dresden",
    "Document title suffix, previously in layout.tsx metadata; now ui.meta.titleSuffix.",
  ],
  [
    "Personal portfolio of Shamas Ur Rehman, MSc Computer Science student at TU Dresden.",
    "Meta description, first sentence, previously in layout.tsx metadata; now ui.meta.description.",
  ],
  [
    "Five shipped systems, each shown with its proof.",
    "Meta description, second sentence, previously in layout.tsx metadata; now ui.meta.description.",
  ],
  [
    "Showing all {total} projects.",
    "Work filter note, derived count. Replaces the hard-coded 'Showing all 5 projects.' now that the count comes from the project list.",
  ],
  [
    "{n} of {total} projects use {tag}.",
    "Work filter-note template, derived count. Replaces the hard-coded '{n} of 5 projects use {tag}.'.",
  ],
  [
    "Three earlier systems follow in a compact index.",
    "Work intro, second sentence. Replaces 'Two earlier systems follow in a compact index.' (HITEC added).",
  ],
  [
    "Earlier & Institutional Systems",
    "Tier-2 heading. Replaces 'Earlier systems' now that the tier holds an institutional project.",
  ],
  [
    "Six shipped systems, each shown with its proof.",
    "Meta description, second sentence. Replaces 'Five shipped systems, each shown with its proof.' (HITEC added).",
  ],
  [
    "HITEC University Web Platform & Admin Panel",
    "New project (HITEC University Web Platform & Admin Panel, 2025) — title. User-briefed 2026-11-24.",
  ],
  [
    "Database-backed university web modules, an internal content-management admin panel, and an integrated RAG support chatbot.",
    "New project — one-sentence summary. User-briefed 2026-11-24.",
  ],
  [
    "Delivered during IT Department internship (May–Oct 2025); internal admin panel & CMS, live site maintained externally post-internship.",
    "New project — proof / delivery line. User-briefed 2026-11-24.",
  ],
  [
    "Delivered during the IT Department internship (May–Oct 2025); internal admin panel & CMS, live site maintained externally post-internship.",
    "New project — Outcome block, sentence 1. The proof line restated with 'the' for sentence grammar; same facts, user-briefed 2026-11-24.",
  ],
  [
    "HITEC University's web presence ran on modules that needed a database behind them, and the internal team needed an admin panel to manage content — plus a support chatbot that could answer questions from university documents.",
    "New project — Problem block. Rephrased from the user-briefed summary and the existing Background internship entry; no new claim.",
  ],
  [
    "The backend is ASP.NET MVC in C#, with a SQL Server schema behind the web modules.",
    "New project — Architecture block, sentence 1. User-briefed stack (ASP.NET MVC, C#, SQL Server).",
  ],
  [
    "The internal admin panel provides CRUD workflows for the content management system.",
    "New project — Architecture block, sentence 2. User-briefed (admin CRUD workflows).",
  ],
  [
    "A RAG support chatbot in Python/Hugging Face answers questions over university documents.",
    "New project — Architecture block, sentence 3. From the existing Background internship entry (RAG support chatbot in Python/Hugging Face over university docs).",
  ],
  [
    "Internal / Archived",
    "New project — Tier 2 row badge. No external live URL exists, so the row links to the internal case page and carries this badge.",
  ],
]);

/* ---- Part A sentence check ---- */

const oldLits = literals(oldSrc).filter((l) => !l.isKey);
const newLits = literals(newSrc).filter((l) => !l.isKey);
const oldSentences = [...new Set(oldLits.flatMap((l) => sentences(l.value)))];
const newSentences = [...new Set(newLits.flatMap((l) => sentences(l.value)))];

const missing = oldSentences.filter(
  (s) => !newSrc.includes(s) && !rendered.includes(s),
);
const added = newSentences.filter((s) => !oldSrc.includes(s));

const unexplainedMissing = missing.filter((s) => !allowedRemoved.has(s));
const unexplainedAdded = added.filter((s) => !allowedAdded.has(s));

/* ---- Part A link and image check ---- */

const oldLinks = links(oldSrc);
const newLinks = links(newSrc);
const missingLinks = [...oldLinks].filter((l) => !newLinks.has(l));
const addedLinks = [...newLinks].filter((l) => !oldLinks.has(l));

const oldImages = images(oldSrc);
const newImages = images(newSrc);
const missingImages = [...oldImages].filter((i) => !newImages.has(i));
const addedImages = [...newImages].filter((i) => !oldImages.has(i));

/* ---- Part B: deep key + value comparison of the two locales ---- */

const { enContent } = await import("../src/content.ts");
const { deContent } = await import("../src/content.de.ts");

/** All leaf paths of a value: { "a.b[0].c": "string" }. */
function leafPaths(value, prefix = "", out = new Map()) {
  if (typeof value === "string") {
    out.set(prefix, value);
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => leafPaths(v, `${prefix}[${i}]`, out));
  } else if (value !== null && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      leafPaths(v, prefix ? `${prefix}.${k}` : k, out);
    }
  } else if (value !== undefined) {
    out.set(prefix, String(value));
  }
  return out;
}

const enLeaves = leafPaths(enContent);
const deLeaves = leafPaths(deContent);

const missingKeys = [...enLeaves.keys()].filter((k) => !deLeaves.has(k));
const extraKeys = [...deLeaves.keys()].filter((k) => !enLeaves.has(k));

/* The one intentional key difference: the English gloss of the
 *  German lease quote is omitted in German. */
const allowedMissingKeys = new Map([
  [
    "projects[0].evidence.gloss",
    "English gloss of the German lease quote; omitted in German because the quote is already German.",
  ],
]);
const allowedExtraKeys = new Map([]);

const unexplainedMissingKeys = missingKeys.filter(
  (k) => !allowedMissingKeys.has(k),
);
const unexplainedExtraKeys = extraKeys.filter((k) => !allowedExtraKeys.has(k));

/* German values byte-identical to English: allowed only where the
 *  value is a proper noun, number, link, or the verbatim German
 *  quote. Anything else is an untranslated string. */
const allowedIdentical = new Map([
  ["profile.email", "Email address, identical in both locales."],
  ["profile.github", "URL, identical in both locales."],
  ["profile.linkedin", "URL, identical in both locales."],
  [
    "projects[0].evidence.text",
    "The German lease quote, verbatim in both locales.",
  ],
  ["projects[0].slug", "URL slug, identical in both locales."],
  ["projects[1].slug", "URL slug, identical in both locales."],
  ["projects[2].slug", "URL slug, identical in both locales."],
  ["projects[3].slug", "URL slug, identical in both locales."],
  ["projects[4].slug", "URL slug, identical in both locales."],
  ["projects[5].slug", "URL slug, identical in both locales."],
  ["projects[0].figure.value", "Metric '86.1%', identical in both locales."],
  ["projects[0].figure.label", "Unit 'IoU', identical in both locales."],
  [
    "projects[0].version",
    "Version string 'v1.0.0', identical in both locales.",
  ],
  ["projects[0].links[0].href", "URL, identical in both locales."],
  ["projects[0].links[1].href", "URL, identical in both locales."],
  ["projects[1].links[0].href", "URL, identical in both locales."],
  ["projects[2].links[0].href", "URL, identical in both locales."],
  ["projects[2].links[1].href", "URL, identical in both locales."],
  ["projects[3].links[0].href", "URL, identical in both locales."],
  ["projects[4].links[0].href", "URL, identical in both locales."],
]);

/** Why a German value may legitimately be byte-identical to its
 *  English twin. Returns null when the identity is not explained. */
function identicalReason(path) {
  if (
    path.includes(".stack[") ||
    path.includes(".skills") ||
    path.includes("certifications.items[")
  )
    return "skill / stack / certificate name — proper noun, does not translate";
  if (
    path.endsWith(".href") ||
    path.endsWith(".slug") ||
    path.endsWith(".email") ||
    path.endsWith(".github") ||
    path.endsWith(".linkedin") ||
    path.includes(".image.")
  )
    return "link / slug / address / image path — identical by definition";
  if (path === "profile.name") return "person's name";
  if (path.endsWith(".year") || path.includes(".tests."))
    return "year / test count — number, identical by rule";
  if (path.endsWith(".kind")) return "evidence-kind key (quote / citation)";
  if (path.startsWith("projects[") && path.endsWith(".title"))
    return "project title — proper noun";
  if (
    path.endsWith(".school") ||
    path.endsWith(".org") ||
    path.endsWith(".degree")
  )
    return "institution / degree name — proper noun";
  if (path.endsWith(".language")) return "language name — same word in German";
  if (path.endsWith(".level"))
    return "test level (C1, IELTS 7.5) — identical by rule";
  if (path.includes("education[") && path.endsWith(".note"))
    return "course titles — proper nouns";
  if (path.endsWith(".jurisdiction"))
    return "jurisdiction name — same word in German (Japan)";
  if (path.startsWith("skillGroups[") && path.endsWith(".title"))
    return "skill-group title carried verbatim — not rendered (the matrix uses the translated matrixColumns titles)";
  if (path.startsWith("matrixColumns[") && path.endsWith(".title"))
    return "column title — standard German tech term (ML & NLP, Full-Stack)";
  if (path === "ui.work.iouLabel")
    return "metric label — 'registered IoU' is the term in both locales";
  if (path === "ui.assets.leaselens.iou")
    return "verified metric label '86.1% IoU' — number, identical by rule";
  if (path === "ui.assets.etl.airflow" || path === "ui.assets.etl.tasks")
    return "Airflow terminology — 'Airflow' / 'Tasks' in both locales";
  if (
    path === "ui.nav.stack" ||
    path === "ui.work.stackLabel" ||
    path === "ui.stack.heading" ||
    path === "ui.caseStudy.stack"
  )
    return "'Stack' is the German word too";
  if (path === "ui.caseStudy.problem")
    return "'Problem' is the German word too";
  if (path === "ui.caseStudy.links") return "'Links' is the German word too";
  if (path.includes(".outcome[") && path.endsWith(".claim"))
    return "metric claim '86.1% registered IoU' — number, identical by rule";
  return null;
}

const identical = [];
for (const [path, enValue] of enLeaves) {
  if (!deLeaves.has(path)) continue;
  const deValue = deLeaves.get(path);
  if (deValue !== enValue) continue;
  identical.push({ path, value: enValue, reason: identicalReason(path) });
}

const unexplainedIdentical = identical.filter(
  (i) => !allowedIdentical.has(i.path) && i.reason === null,
);
const explainedIdentical = identical.filter(
  (i) => allowedIdentical.has(i.path) || i.reason !== null,
);

/* ---- report ---- */

const lines = [];
lines.push("# Content integrity — header-i18n + polish (HITEC project)");
lines.push("");
lines.push(
  `Baseline: \`src/content.ts\` at commit ${BASELINE} (redesign/header-i18n before the polish + HITEC additions). New source: \`src/content.ts\` + \`src/content.de.ts\` on \`redesign/header-i18n\`, checked against the fresh production build's rendered HTML (English SSR) and a runtime deep comparison of the two locales (Node type-stripping import). Additions and removals in the polish update are allowlisted below with their reasons.`,
);
lines.push("");
lines.push("## Part A — English unchanged");
lines.push("");
lines.push(`- Old sentences checked: ${oldSentences.length}`);
lines.push(
  `- Old sentences preserved verbatim or as part of a longer note: ${oldSentences.length - missing.length}`,
);
lines.push(
  `- Old sentences removed under the allowlist: ${missing.filter((s) => allowedRemoved.has(s)).length}`,
);
lines.push(`- Unexplained missing sentences: ${unexplainedMissing.length}`);
lines.push(
  `- New sentences added under the allowlist: ${added.filter((s) => allowedAdded.has(s)).length}`,
);
lines.push(`- Unexplained added sentences: ${unexplainedAdded.length}`);
lines.push(
  `- Links: ${oldLinks.size} old, ${newLinks.size} new, ${missingLinks.length} missing, ${addedLinks.length} added`,
);
lines.push(
  `- Images: ${oldImages.size} old, ${newImages.size} new, ${missingImages.length} missing, ${addedImages.length} added`,
);
lines.push("");
lines.push("### Removed sentences (allowlisted)");
lines.push("");
for (const s of missing) {
  lines.push(`- “${s}”: ${allowedRemoved.get(s) ?? "NO REASON: UNEXPLAINED"}`);
}
if (missing.length === 0) lines.push("- None.");
lines.push("");
lines.push("### Added sentences (allowlisted)");
lines.push("");
for (const s of added) {
  lines.push(`- “${s}”: ${allowedAdded.get(s) ?? "NO REASON: UNEXPLAINED"}`);
}
if (added.length === 0) lines.push("- None.");
lines.push("");
lines.push("### Links");
lines.push("");
for (const l of [...oldLinks].sort()) {
  lines.push(`- ${l}: ${newLinks.has(l) ? "kept" : "MISSING"}`);
}
for (const l of addedLinks) lines.push(`- ${l}: ADDED`);
lines.push("");
lines.push("### Images");
lines.push("");
for (const i of [...oldImages].sort()) {
  lines.push(`- ${i}: ${newImages.has(i) ? "kept" : "MISSING"}`);
}
for (const i of addedImages) lines.push(`- ${i}: ADDED`);
lines.push("");
lines.push("## Part B — German complete");
lines.push("");
lines.push(`- English string leaves: ${enLeaves.size}`);
lines.push(`- German string leaves: ${deLeaves.size}`);
lines.push(
  `- Keys in English but not German: ${missingKeys.length} (${missingKeys.filter((k) => allowedMissingKeys.has(k)).length} allowlisted)`,
);
lines.push(
  `- Keys in German but not English: ${extraKeys.length} (${extraKeys.filter((k) => allowedExtraKeys.has(k)).length} allowlisted)`,
);
lines.push(
  `- German values byte-identical to English: ${identical.length} (${explainedIdentical.length} explained as proper nouns, links, numbers, or the verbatim quote)`,
);
lines.push(`- Unexplained identical values: ${unexplainedIdentical.length}`);
lines.push("");
lines.push("### Missing keys in German");
lines.push("");
for (const k of missingKeys) {
  lines.push(
    `- \`${k}\`: ${allowedMissingKeys.get(k) ?? "NO REASON: UNEXPLAINED"}`,
  );
}
if (missingKeys.length === 0) lines.push("- None.");
lines.push("");
lines.push("### Extra keys in German");
lines.push("");
for (const k of extraKeys) {
  lines.push(
    `- \`${k}\`: ${allowedExtraKeys.get(k) ?? "NO REASON: UNEXPLAINED"}`,
  );
}
if (extraKeys.length === 0) lines.push("- None.");
lines.push("");
lines.push("### German values identical to English (explained)");
lines.push("");
for (const i of identical) {
  const reason =
    allowedIdentical.get(i.path) ?? i.reason ?? "NO REASON: UNEXPLAINED";
  lines.push(`- \`${i.path}\` = “${i.value}”: ${reason}`);
}
if (identical.length === 0) lines.push("- None.");
lines.push("");
lines.push("## Open TODO(content) items (unchanged — user must supply)");
lines.push("");
lines.push(
  "- OratorPath live dashboard URL (still open; no live link anywhere).",
);
lines.push(
  "- The CV file and the availability line wording were resolved on main @ 8ab0f7f (CV ships as public/Shamas_Ur_Rehman_CV.pdf; the hero pill reads “Dresden · Werkstudent eligible, 20h/wk”).",
);
lines.push("");

const unexplained =
  unexplainedMissing.length +
  unexplainedAdded.length +
  missingLinks.length +
  addedLinks.length +
  missingImages.length +
  addedImages.length +
  unexplainedMissingKeys.length +
  unexplainedExtraKeys.length +
  unexplainedIdentical.length;

lines.push(
  unexplained === 0
    ? "**Result: zero unexplained differences.**"
    : `**Result: ${unexplained} unexplained difference(s) — see above.**`,
);
lines.push("");

writeFileSync("docs/header-i18n-integrity.md", lines.join("\n"));
console.log(lines.join("\n"));
if (unexplained > 0) process.exit(1);
