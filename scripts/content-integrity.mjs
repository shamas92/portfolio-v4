#!/usr/bin/env node
/**
 * Content-integrity check: every sentence, link and image in the old
 * Annotated Proof content (main:src/content.ts) must survive in the
 * new Engineering Notebook build, except the allowlisted removals.
 *
 * Run after `npm run build` so the rendered HTML is fresh:
 *   node scripts/content-integrity.mjs
 * Writes docs/content-integrity.md and exits 1 on any unexplained
 * difference.
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
    "MSc Computer Science, TU Dresden.",
    "Intro reworded as the hero status line (allowed: duplicate Dresden fix).",
  ],
  [
    "Software engineer in Dresden.",
    "Intro reworded; role and location survive in the document title and the footer location line.",
  ],
  [
    "No figures were measured for this project, so none are shown.",
    "Reworded to the plain status line 'No figures were measured for this project.' (user decision 5).",
  ],
  [
    "GitHub",
    "Case link label renamed to a descriptive label for accessibility, e.g. 'LeaseLens on GitHub'.",
  ],
  [
    "Demo film",
    "Case link label renamed to 'LeaseLens demo film' for accessibility.",
  ],
]);

const allowedAdded = new Map([
  [
    "MSc Computer Science, TU Dresden, Dresden, Germany",
    "Hero status line, reworded from the old intro (allowed: duplicate Dresden fix).",
  ],
  [
    "No figures were measured for this project.",
    "Plain status line (user decision 5).",
  ],
  [
    "LeaseLens on GitHub",
    "Descriptive case link label (accessibility).",
  ],
  [
    "LeaseLens demo film",
    "Descriptive case link label (accessibility).",
  ],
  [
    "Sales ETL Pipeline on GitHub",
    "Descriptive case link label (accessibility).",
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
lines.push("# Content integrity — Annotated Proof → Engineering Notebook");
lines.push("");
lines.push(
  `Old source: \`main:src/content.ts\` (commit b7c0689). New source: \`src/content.ts\` on \`redesign/notebook\`, checked against the fresh production build's rendered HTML.`,
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
  lines.push(`- “${s}” — ${allowedRemoved.get(s) ?? "NO REASON — UNEXPLAINED"}`);
}
lines.push("");
lines.push("## Added sentences (allowlisted)");
lines.push("");
for (const s of added) {
  lines.push(`- “${s}” — ${allowedAdded.get(s) ?? "NO REASON — UNEXPLAINED"}`);
}
lines.push("");
lines.push("## Links");
lines.push("");
for (const l of [...oldLinks].sort()) {
  lines.push(`- ${l} — ${newLinks.has(l) ? "kept" : "MISSING"}`);
}
for (const l of addedLinks) lines.push(`- ${l} — ADDED`);
lines.push("");
lines.push("## Images");
lines.push("");
for (const i of [...oldImages].sort()) {
  lines.push(`- ${i} — ${newImages.has(i) ? "kept" : "MISSING"}`);
}
for (const i of addedImages) lines.push(`- ${i} — ADDED`);
lines.push("");
lines.push("## Component copy outside content.ts (manual check)");
lines.push("");
lines.push(
  "- Footer line “Every claim on this page carries its evidence.” is new presentation copy; the sentiment is the hero claim “I build data & ML systems — and prove every claim on this page.”, kept verbatim.",
);
lines.push(
  "- Footer location line “Dresden, Germany” is new as a separate line; the fact was in the old intro (“Software engineer in Dresden.”) and the document title.",
);
lines.push(
  "- Section order changed Work, Stack, Background → Work, Background, Stack (per the redesign brief). Section intros are unchanged.",
);
lines.push(
  "- “Spoken languages” replaces the “Languages” heading in the timeline (allowed: label-clash fix); the programming group keeps “Languages”.",
);
lines.push(
  "- The row proof notes are gone as a row element; each note's text survives in the case-page claim notes (LeaseLens note merged into the outcome claim note, ETL and OratorPath notes verbatim).",
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

writeFileSync("docs/content-integrity.md", lines.join("\n"));
console.log(lines.join("\n"));
if (unexplained > 0) process.exit(1);
