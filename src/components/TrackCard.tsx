/**
 * One track card: 1120 × 640, media on the left, text on the
 * right — the reference's "Selected work" card, matched to the
 * parish measurements (live, 2026-11-26). The photo is the same
 * created visual as the deck, the same file in light and dark
 * mode. The media is a 590 × 590 frame (inset 24px, its own
 * border and radius), with a smaller tilted detail — a tighter
 * crop of the SAME photo, never presented as a screenshot —
 * overlapping its lower edge and ending ~12px above the card
 * bottom, like the reference (only its soft shadow crosses
 * the card's bottom edge).
 *
 * The text column, in order (parish vertical rhythm):
 * - year + role (mono, uppercase, muted) — the role is the
 *   verifiable participation fact from content.ts, never a
 *   claim about team size.
 * - H3 title (Inter Tight, bold, ~48px) — the short title
 *   where content provides one, else the full title.
 * - one-line summary (rowOutcome).
 * - a stats row on EVERY card: three verified figures, figure
 *   over label. LeaseLens (86.1% / 197 / 5), Sales ETL
 *   (1 DAG / 3 tasks / 4 tables), OratorPath (the paper
 *   citation: Vol. 3 / Issue 7 / 843–852), HITEC (6 months /
 *   3 parts / 5 technologies). No figures are invented.
 * - a Stack list, from the project's verified stack, capped
 *   at 5 tags, with no label above it.
 * - the bottom row, pinned to the card's lower edge: a solid
 *   black "Case study" pill on the left, and the GitHub repo
 *   link — only LeaseLens and Sales ETL have a repo URL in
 *   content.ts — and a "Paper" link, only where content has a
 *   paper URL (OratorPath's is empty until the user supplies
 *   one, so no Paper link renders; no URL is invented) — on
 *   the right. OratorPath and HITEC have neither, so the pill
 *   stands alone, honestly.
 *
 * There is no proof line on the track card (the reference has
 * none); rowProof stays in content.ts and renders on the case
 * page. Sales ETL's large media is its photo, like the other
 * three cards; the pipeline diagram (EtlAsset) stays on the
 * case page.
 *
 * The whole card is clickable: the title is a link with a
 * stretched ::after covering the card (see globals.css), so a
 * click on the photo, the summary or the title opens the case
 * page. The repo and paper links sit above that overlay
 * (position relative, z-index 1) so they stay clickable; the
 * "Case study" pill is the same destination as the title, so
 * it needs no special handling. The track shows fully from the
 * start — the deck no longer docks onto it — so the cards are
 * never inert and their links always take focus.
 */
"use client";

import Link from "next/link";
import type { Project } from "@/content";
import { useContent, useLocale } from "@/i18n/LocaleProvider";
import { ProjectPhoto } from "./ProjectPhoto";

/** The card title: the short title where content provides one
 *  (HITEC, Quality CRM), else the full title. Exported so the
 *  Earlier work list uses the same titles. */
export const cardTitle = (project: Project): string =>
  project.shortTitle ?? project.title;

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

  return (
    <article className="track-card" data-slug={project.slug}>
      <div className="track-card-text">
        <p className="track-meta">
          {project.year} · {project.role}
        </p>
        <h3 className="track-title">
          <Link href={`/work/${project.slug}`} className="track-title-link">
            {cardTitle(project)}
          </Link>
        </h3>
        <p className="track-summary">{project.rowOutcome}</p>
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
        <ul className="track-stack">
          {project.stack.slice(0, 5).map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <div className="track-links">
          <Link href={`/work/${project.slug}`} className="track-case">
            {ui.trackCaseStudy}{" "}
            <span className="track-case-arrow" aria-hidden="true">
              →
            </span>
          </Link>
          <span className="track-links-right">
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
          </span>
        </div>
      </div>
      <div className="track-photo" aria-hidden="true">
        <div className="track-photo-main">
          <ProjectPhoto slug={project.slug} />
        </div>
        <div className="track-photo-detail">
          <ProjectPhoto slug={project.slug} variant="detail" />
        </div>
      </div>
    </article>
  );
}
