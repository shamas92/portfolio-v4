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

/** One flagship card: SVG visual, year, title link, one-sentence
 *  problem, plain-English proof callout, mono stack tags. The
 *  LeaseLens metrics line keeps the IoU as alignment accuracy on
 *  the v7 demo pairing and the 197 tests as a separate release
 *  fact, never conflated. */
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
        <p className="flagship-problem">{project.rowOutcome}</p>
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
        <ul className="flagship-stack" aria-label={ui.stackLabel}>
          {project.stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
