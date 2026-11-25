/**
 * One track card: wide (~860px), text on the left, the project's
 * photo large on the right — the reference's "Selected work"
 * card, adapted to the verified facts. The photo is the same
 * created visual as the deck and the (retired) grid, the same
 * file in light and dark mode.
 *
 * The text column, in order:
 * - year + role (mono, muted) — the role is the verifiable
 *   participation fact from content.ts, never a claim about
 *   team size.
 * - H3 title (Newsreader, like the other section headings).
 * - one-line summary (rowOutcome).
 * - a stats row, ONLY where the project has verified stats:
 *   LeaseLens (deposit €950.00 / legal cap €535.41 / excess
 *   €414.59) and Sales ETL (1 DAG / 3 tasks / 4 tables). The
 *   other four projects have no verified stats, so the row is
 *   omitted there — never invented.
 * - a proof line (rowProof), except on Sales ETL, where the
 *   proof line ("One DAG, three tasks, four tables.") would
 *   restate the stats row word for word. OratorPath's proof
 *   line is its publication ("Peer-reviewed publication,
 *   2025."), not a stats row — it has no numeric stats.
 * - a Stack list, from the project's verified stack.
 * - two links: "View case study" to the case page, and the
 *   GitHub repo — but only LeaseLens and Sales ETL have a repo
 *   URL in content.ts. OratorPath, HITEC, Quality CRM and
 *   UpliftU have none, so the repo link is omitted on those
 *   four; their only link is the case-study pill. No repo URL
 *   is invented, and the GitHub profile is never linked as if
 *   it were the project repo.
 *
 * The card's opacity is the docking moment's --track-reveal,
 * driven by the scroll listener in page.tsx (0 at rest, 1 once
 * the deck has docked). The default is 1, so the track shows
 * fully without JavaScript and under reduced motion. On mobile
 * and under reduced motion the track is a vertical stack, so
 * the reveal is inert there too.
 */
"use client";

import Link from "next/link";
import type { Project } from "@/content";
import { useContent } from "@/i18n/LocaleProvider";
import { ProjectPhoto } from "./ProjectPhoto";

export function TrackCard({ project }: { project: Project }) {
  const content = useContent();
  const ui = content.ui.work;
  /* The repo link: the first github.com link in the project's
     own links. Only LeaseLens and Sales ETL have one. */
  const repo = project.links.find((l) => l.href.includes("github.com"));
  /* ETL's proof line restates its stats row, so it is omitted
     there; every other card shows its rowProof. */
  const showProof = project.slug !== "sales-etl-pipeline";

  return (
    <article className="track-card" data-slug={project.slug}>
      <div className="track-card-text">
        <p className="track-meta">
          {project.year} · {project.role}
        </p>
        <h3 className="track-title">{project.title}</h3>
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
        {showProof && (
          <p className="track-proof">
            <span className="track-proof-label">{ui.proof}</span>{" "}
            {project.rowProof}
          </p>
        )}
        <p className="track-stack-label">{content.ui.caseStudy.stack}</p>
        <ul className="track-stack">
          {project.stack.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
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
            </a>
          )}
        </div>
      </div>
      <div className="track-photo" aria-hidden="true">
        <ProjectPhoto slug={project.slug} />
      </div>
    </article>
  );
}
