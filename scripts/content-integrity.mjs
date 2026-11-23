#!/usr/bin/env node
/**
 * Content-integrity check: every sentence, link and image in the
 * Engineering Notebook content (main:src/content.ts) must survive
 * in the new Engineering Spec Sheet build, except the allowlisted
 * removals and rewrites.
 *
 * Run after `npm run build` so the rendered HTML is fresh:
 *   node scripts/content-integrity.mjs
 * Writes docs/spec-sheet-integrity.md and exits 1 on any
 * unexplained difference.
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const MIN_LEN = 15; // sentences shorter than this are labels/keys

/* ---- extraction ---- */

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

/* ---- inputs ---- */

const oldSrc = execSync("git show main:src/content.ts", {
  encoding: "utf8",
});
const newSrc = readFileSync("src/content.ts", "utf8");
const rendered = htmlFiles(".next/server/app")
  .map((f) => decodeHtml(readFileSync(f, "utf8")))
  .join(" ");

/* ---- allowlist: every removal / addition that is not a verbatim
   carry-over, with the reason. Anything outside this list fails. ---- */

const allowedRemoved = new Map([
  [
    "Real-time C#/.NET + SQL Server process monitoring with live dashboards.",
    "Rewritten in direct first-person voice (brief section E): the note now reads 'Built real-time C#/.NET and SQL Server process monitoring with live dashboards, cutting manual logging errors by 20%.'",
  ],
  [
    "The CV credits this work with cutting manual logging errors by 20%.",
    "Rewritten in direct first-person voice (brief section E); the 20% figure is unchanged and now sits in the same sentence.",
  ],
]);

const allowedAdded = new Map([
  [
    "One DAG, three tasks, four tables: dim_date, dim_customer, dim_product, fact_sales.",
    "Flagship proof callout, composed verbatim from the row proof and the outcome claim note (brief section C).",
  ],
  [
    "Peer-reviewed publication, 2025: Spectrum of Engineering Sciences, Vol. 3, Issue 7, pp. 843–852, ISSN 3007-3138.",
    "Flagship proof callout, composed verbatim from the row proof and the evidence citation (brief section C).",
  ],
  [
    "Peer-reviewed publication, 2025: Spectrum of Engineering Sciences, Vol.",
    "First fragment of the OratorPath proof callout above — the sentence splitter breaks at 'Vol.'",
  ],
  [
    "843–852, ISSN 3007-3138.",
    "Second fragment of the OratorPath proof callout above — the sentence splitter breaks at 'Vol.'",
  ],
  [
    "Relational defect tracking in Laravel/MySQL — one record for every defect.",
    "Tier-2 scope line, drawn only from the project's own problem and architecture text (brief section C).",
  ],
  [
    "Structured NLP student support in Python/Hugging Face.",
    "Tier-2 scope line, drawn only from the project's own problem and architecture text (brief section C).",
  ],
  [
    "Built real-time C#/.NET and SQL Server process monitoring with live dashboards, cutting manual logging errors by 20%.",
    "First-person rewrite of the Heavy Industries Taxila bullet (brief section E); the 20% figure is unchanged.",
  ],
]);

/* ---- sentence check ---- */

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

/* ---- link and image check ---- */

const oldLinks = links(oldSrc);
const newLinks = links(newSrc);
const missingLinks = [...oldLinks].filter((l) => !newLinks.has(l));
const addedLinks = [...newLinks].filter((l) => !oldLinks.has(l));

const oldImages = images(oldSrc);
const newImages = images(newSrc);
const missingImages = [...oldImages].filter((i) => !newImages.has(i));
const addedImages = [...newImages].filter((i) => !oldImages.has(i));

/* ---- report ---- */

const lines = [];
lines.push("# Content integrity — Engineering Notebook → Engineering Spec Sheet");
lines.push("");
lines.push(
  `Old source: \`main:src/content.ts\` (commit deaf356). New source: \`src/content.ts\` on \`redesign/spec-sheet\`, checked against the fresh production build's rendered HTML.`,
);
lines.push("");
lines.push("## Summary");
lines.push("");
lines.push(`- Old sentences checked: ${oldSentences.length}`);
lines.push(`- Old sentences preserved verbatim or as part of a longer note: ${oldSentences.length - missing.length}`);
lines.push(`- Old sentences removed under the allowlist: ${missing.filter((s) => allowedRemoved.has(s)).length}`);
lines.push(`- Unexplained missing sentences: ${unexplainedMissing.length}`);
lines.push(`- New sentences added under the allowlist: ${added.filter((s) => allowedAdded.has(s)).length}`);
lines.push(`- Unexplained added sentences: ${unexplainedAdded.length}`);
lines.push(`- Links: ${oldLinks.size} old, ${newLinks.size} new, ${missingLinks.length} missing, ${addedLinks.length} added`);
lines.push(`- Images: ${oldImages.size} old, ${newImages.size} new, ${missingImages.length} missing, ${addedImages.length} added`);
lines.push("");
lines.push("## Removed sentences (allowlisted)");
lines.push("");
for (const s of missing) {
  lines.push(`- “${s}”: ${allowedRemoved.get(s) ?? "NO REASON: UNEXPLAINED"}`);
}
lines.push("");
lines.push("## Added sentences (allowlisted)");
lines.push("");
for (const s of added) {
  lines.push(`- “${s}”: ${allowedAdded.get(s) ?? "NO REASON: UNEXPLAINED"}`);
}
lines.push("");
lines.push("## Links");
lines.push("");
for (const l of [...oldLinks].sort()) {
  lines.push(`- ${l}: ${newLinks.has(l) ? "kept" : "MISSING"}`);
}
for (const l of addedLinks) lines.push(`- ${l}: ADDED`);
lines.push("");
lines.push("## Images");
lines.push("");
for (const i of [...oldImages].sort()) {
  lines.push(`- ${i}: ${newImages.has(i) ? "kept" : "MISSING"}`);
}
for (const i of addedImages) lines.push(`- ${i}: ADDED`);
lines.push("");
lines.push("## Component copy outside content.ts (manual check)");
lines.push("");
lines.push(
  "- Hero proof strip removed (brief section B): it was composed in page.tsx from the figure, tests and version fields, and those fields still render — in the LeaseLens flagship card metrics line and on the case page.",
);
lines.push(
  "- Availability pill “Dresden · Werkstudent eligible, 20h/wk” is new component copy; the facts are profile.location (“Dresden, Germany”) and profile.workEligibility (“Working-student eligible, 20 hours a week.”), both kept verbatim. “20h/wk” is an abbreviation, not a new fact.",
);
lines.push(
  "- “View Flagship Work” replaces the “See projects” button label (presentation copy only).",
);
lines.push(
  "- Filter pill labels are the project stack tags verbatim, plus “All”, “SQL”, “Docker” and “C#”. SQL covers PostgreSQL/MySQL, Docker covers Docker Compose, C# matches no shipped project and the note says so.",
);
lines.push(
  "- Capabilities matrix column headings (Data & Pipelines, ML & NLP, Full-Stack, Infra & DBs) are new presentation labels; every skill name inside them is verbatim from skillGroups or a project stack.",
);
lines.push(
  "- “Earlier systems” and “Proof” are new presentation labels on the Work section and flagship cards.",
);
lines.push(
  "- The rowProof sentences are no longer rendered as a row element on the home page, but every one of them survives in src/content.ts and in the case-page meta descriptions, so the sentence check passes them.",
);
lines.push(
  "- The LeaseLens proof callout reuses the outcome claim note verbatim (“Registered IoU measures overlap after the two photos are aligned, so the score compares the same wall instead of two photos taken from different spots.”); the metrics line is composed from the figure, version and tests fields.",
);
lines.push(
  "- Spoken languages and certificates moved from timeline groups into a horizontal metadata strip; every language, level, certificate and the Nov 2025 – Sep 2026 period is unchanged.",
);
lines.push(
  "- Section order is unchanged (Hero, Work, Background, Stack, Contact). The footer is unchanged.",
);
lines.push(
  "- The three SVG illustrations carry no numbers except the verified “86.1% IoU” label on the LeaseLens asset; the OratorPath bars are schematic and unlabeled.",
);
lines.push("");

const unexplained =
  unexplainedMissing.length +
  unexplainedAdded.length +
  missingLinks.length +
  addedLinks.length +
  missingImages.length +
  addedImages.length;

lines.push(
  unexplained === 0
    ? "**Result: zero unexplained differences.**"
    : `**Result: ${unexplained} unexplained difference(s) — see above.**`,
);
lines.push("");

writeFileSync("docs/spec-sheet-integrity.md", lines.join("\n"));
console.log(lines.join("\n"));
if (unexplained > 0) process.exit(1);
