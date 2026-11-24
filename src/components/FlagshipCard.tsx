"use client";

import Link from "next/link";
import type { Project } from "@/content";
import { format, useContent } from "@/i18n/LocaleProvider";
import { useReveal } from "./Reveal";
import { LeaseLensAsset, EtlAsset, OratorPathAsset } from "./SpecAssets";

const assets: Record<string, React.ComponentType> = {
  leaselens: LeaseLensAsset,
  "sales-etl-pipeline": EtlAsset,
  oratorpath: OratorPathAsset,
};

/** One featured card: SVG visual, year, title link, a one-sentence
 *  summary, and the proof — visible without interaction. The
 *  contribution and the decision live in a native <details>
 *  ("How it was built"), keyboard accessible with no JavaScript,
 *  so the card scans in seconds and the substance is one click
 *  away. The rows are the card form of the case page (Problem /
 *  Contribution / Decision / Result), so the card and the page
 *  never disagree. The LeaseLens metrics line keeps the IoU as
 *  alignment accuracy on the v7 demo pairing and the 197 tests
 *  as a separate release fact, never conflated. */
export function FlagshipCard({
  project,
  dimmed,
}: {
  project: Project;
  dimmed: boolean;
}) {
  /* 0.05, not the 0.2 default: the cards are ~1100px tall, so
     only ~18% of one is visible on load at 1440x900 and the
     default threshold would leave the work blank until the
     reader scrolls. */
  const { ref, className } = useReveal<HTMLElement>(0.05);
  const content = useContent();
  const ui = content.ui.work;
  const Asset = assets[project.slug];

  return (
    <article
      ref={ref}
      className={`flagship-card ${className}${dimmed ? " work-dim" : ""}`}
    >
      <div className="flagship-visual">{Asset ? <Asset /> : null}</div>
      <div className="flagship-body">
        <p className="flagship-year">{project.year}</p>
        <h3 className="flagship-title">
          <Link href={`/work/${project.slug}`}>
            {project.title}{" "}
            <span className="flagship-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </h3>
        <p className="flagship-summary">{project.rowOutcome}</p>
        {project.proofCallout && (
          <div className="flagship-proof">
            <p className="flagship-proof-label">{ui.proof}</p>
            <p className="flagship-proof-text">{project.proofCallout}</p>
            {project.slug === "leaselens" &&
              project.figure &&
              project.tests &&
              project.version && (
                <p className="flagship-proof-metrics">
                  <span className="proof-badge">
                    {project.figure.value} {ui.iouLabel}
                  </span>
                  {format(ui.metrics, {
                    version: project.version,
                    total: project.tests.total,
                    backend: project.tests.backend,
                    frontend: project.tests.frontend,
                  })}
                </p>
              )}
          </div>
        )}
        <details className="flagship-details">
          <summary className="flagship-details-summary">
            {ui.detailsLabel}
            <span className="flagship-details-chevron" aria-hidden="true">
              ›
            </span>
          </summary>
          <div className="flagship-rows">
            <div className="flagship-row">
              <p className="flagship-row-label">{ui.builtLabel}</p>
              <p className="flagship-row-text">{project.contribution}</p>
            </div>
            <div className="flagship-row">
              <p className="flagship-row-label">{ui.decisionLabel}</p>
              <p className="flagship-row-text">{project.decision}</p>
            </div>
          </div>
        </details>
        <ul className="flagship-stack" aria-label={ui.stackLabel}>
          {project.stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
