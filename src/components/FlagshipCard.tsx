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

/** One featured card: SVG visual, year, title link, and four
 *  labelled rows — Problem, Built (contribution), Decision, Proof —
 *  then the mono stack tags. The rows are the card form of the case
 *  page (Problem / Contribution / Decision / Result), so the card
 *  and the page never disagree. The LeaseLens metrics line keeps
 *  the IoU as alignment accuracy on the v7 demo pairing and the
 *  197 tests as a separate release fact, never conflated. */
export function FlagshipCard({
  project,
  dimmed,
}: {
  project: Project;
  dimmed: boolean;
}) {
  const { ref, className } = useReveal<HTMLElement>();
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
        <div className="flagship-rows">
          <div className="flagship-row">
            <p className="flagship-row-label">
              {content.ui.caseStudy.problem}
            </p>
            <p className="flagship-row-text">{project.rowOutcome}</p>
          </div>
          <div className="flagship-row">
            <p className="flagship-row-label">{ui.builtLabel}</p>
            <p className="flagship-row-text">{project.contribution}</p>
          </div>
          <div className="flagship-row">
            <p className="flagship-row-label">{ui.decisionLabel}</p>
            <p className="flagship-row-text">{project.decision}</p>
          </div>
          <div className="flagship-row">
            <p className="flagship-row-label">{ui.proof}</p>
            <p className="flagship-row-text">{project.proofCallout}</p>
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
        </div>
        <ul className="flagship-stack" aria-label={ui.stackLabel}>
          {project.stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
