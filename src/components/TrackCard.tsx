/**
 * One track card: wide (1120px) and 640px tall, text on the
 * right, the project's photo large on the left — the reference's
 * "Selected work" card, adapted to the verified facts. The photo
 * is the same created visual as the deck and the (retired) grid,
 * the same file in light and dark mode.
 *
 * The text column, in order (16px between groups, 8px within):
 * - year + role (mono, muted) — the role is the verifiable
 *   participation fact from content.ts, never a claim about
 *   team size.
 * - H3 title (Newsreader, like the other section headings) — the
 *   short title where content provides one, else the full title.
 * - one-line summary (rowOutcome).
 * - a stats row, ONLY where the project has verified stats:
 *   LeaseLens and Sales ETL. The other full card has no stats
 *   row: no figures are invented for it.
 * - a proof line (rowProof), ONLY where the project has one.
 *   Quality CRM and UpliftU have none, so the line is omitted
 *   there — never filled with a completion statement. Sales ETL
 *   has one ("A rerun duplicates nothing; a failed run alerts
 *   by email."); OratorPath's is its publication.
 * - a Stack list, from the project's verified stack, capped at
 *   5 tags.
 * - links: "View case study" to the case page, the GitHub repo
 *   — but only LeaseLens and Sales ETL have a repo URL in
 *   content.ts — and a "Paper" link, only where content has a
 *   paper URL (OratorPath's is empty until the user supplies
 *   one, so no Paper link renders; no URL is invented).
 *
 * Sales ETL's right column is the pipeline diagram (EtlAsset),
 * not the laptop photo: a data-engineering recruiter wants the
 * system, not the device. The deck keeps the laptop photo.
 *
 * The whole card is clickable: the title is a link with a
 * stretched ::after covering the card (see globals.css), so a
 * click on the photo, the summary or the title opens the case
 * page. The repo and paper links sit above that overlay
 * (position relative, z-index 1) so they stay clickable; the
 * "View case study" pill is the same destination as the title,
 * so it needs no special handling. The track shows fully from
 * the start — the deck no longer docks onto it — so the cards
 * are never inert and their links always take focus.
 */
"use client";

import Link from "next/link";
import type { Project } from "@/content";
import { useContent, useLocale } from "@/i18n/LocaleProvider";
import { ProjectPhoto } from "./ProjectPhoto";
import { EtlAsset } from "./SpecAssets";

/** The card title: the short title where content provides one
 *  (HITEC, Quality CRM), else the full title. Exported so the
 *  Earlier work list uses the same titles. */
export const cardTitle = (project: Project): string =>
  project.shortTitle ?? project.title;

/** Render proof text, turning *...* markers into italics
 *  (the journal name in the OratorPath proof). Plain text
 *  without markers renders unchanged. */
function renderProof(text: string) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <span key={i}>{part}</span>;
  });
}

export function TrackCard({ project }: { project: Project }) {
  const content = useContent();
  const { locale } = useLocale();
  const ui = content.ui.work;
  const newTabNote =
    locale === "de"
      ? " (öffnet in einem neuen Tab)"
      : " (opens in a new tab)";
  /* The repo link: the first github.com link in the project's
     own links. Only LeaseLens and Sales ETL have one. */
  const repo = project.links.find((l) => l.href.includes("github.com"));
  /* The paper link: only where content has a paper URL.
     OratorPath's is empty until the user supplies one. */
  const paper = project.paperUrl || undefined;
  /* The proof line renders only where the project has one. */
  const showProof = Boolean(project.rowProof);
  /* S9: the ETL track card shows the pipeline diagram, not the
     laptop photo. The deck keeps the photo. */
  const isEtl = project.slug === "sales-etl-pipeline";

  return (
    <article className="track-card" data-slug={project.slug}>
      {/* The gap between groups is 16px (globals.css) so the
          content fits the 640px card height in both languages;
          the links row pins to the bottom edge. */}
      <div className="track-card-text">
        <div
          style={{ display: "flex", flexDirection: "column", gap: "8px" }}
        >
          <p className="track-meta">
            {project.year} · {project.role}
          </p>
          <h3 className="track-title">
            <Link href={`/work/${project.slug}`} className="track-title-link">
              {cardTitle(project)}
            </Link>
          </h3>
          <p className="track-summary">{project.rowOutcome}</p>
        </div>
        {project.stats && (
          <ul className="track-stats">
            {project.stats.map((stat) => (
              <li className="track-stat" key={stat.label}>
                <span className="track-stat-value">{stat.value}</span>
                <span className="track-stat-label">{stat.label}</span>
              </li>
            ))}
          </ul>
        )}
        {showProof && (
          <p className="track-proof">
            <span className="track-proof-label">{ui.proof}</span>{" "}
            {renderProof(project.rowProof as string)}
          </p>
        )}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "8px" }}
        >
          <p className="track-stack-label">{content.ui.caseStudy.stack}</p>
          <ul className="track-stack">
            {project.stack.slice(0, 5).map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>
        <div className="track-links">
          <Link href={`/work/${project.slug}`} className="track-case">
            {ui.viewCaseStudy}{" "}
            <span className="track-case-arrow" aria-hidden="true">
              ↗
            </span>
          </Link>
          {repo && (
            <a
              href={repo.href}
              target="_blank"
              rel="noopener noreferrer"
              className="track-repo"
            >
              GitHub{" "}
              <span aria-hidden="true">↗</span>
              <span className="visually-hidden">{newTabNote}</span>
            </a>
          )}
          {paper && (
            <a
              href={paper}
              target="_blank"
              rel="noopener noreferrer"
              className="track-repo"
            >
              Paper{" "}
              <span aria-hidden="true">↗</span>
              <span className="visually-hidden">{newTabNote}</span>
            </a>
          )}
        </div>
      </div>
      <div
        className="track-photo"
        aria-hidden="true"
        style={
          isEtl
            ? {
                display: "flex",
                alignItems: "center",
                background: "var(--surface)",
              }
            : undefined
        }
      >
        {isEtl ? (
          <div style={{ width: "100%", padding: "0 var(--space-3)" }}>
            <EtlAsset />
          </div>
        ) : (
          <ProjectPhoto slug={project.slug} />
        )}
      </div>
    </article>
  );
}
