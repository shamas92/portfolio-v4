"use client";

import Link from "next/link";
import type { Project } from "@/content";
import { useContent } from "@/i18n/LocaleProvider";
import { useReveal } from "./Reveal";
import {
  LeaseLensAsset,
  EtlAsset,
  OratorPathAsset,
  HitecAsset,
  QualityAsset,
  UpliftAsset,
} from "./SpecAssets";

const assets: Record<string, React.ComponentType> = {
  leaselens: LeaseLensAsset,
  "sales-etl-pipeline": EtlAsset,
  oratorpath: OratorPathAsset,
  "hitec-cms": HitecAsset,
  "quality-crm": QualityAsset,
  upliftu: UpliftAsset,
};

/** One Work card: the project's SVG visual leads, edge to edge,
 *  with the reference's overlay labels on it — category pill
 *  top-left, title bottom-left, "View case study" pill
 *  bottom-right — over a dark scrim so the white overlay text
 *  stays legible in both themes. Below the visual: year,
 *  one-sentence summary, and the proof (design-intelligence
 *  rule 10: proof lives on the same card as the claim). The
 *  contribution, the decision and the stack live on the case
 *  page only — the grid card stays scannable, and the visual
 *  dominates, as in the reference.
 *
 *  Row 1 (the three deck projects) does NOT use the Reveal:
 *  its opacity is the deck moment's --grid-reveal, driven by
 *  the scroll listener in page.tsx — the deck cross-fades into
 *  these cards as it docks. Row 2 reveals with the site's
 *  Reveal as it enters the viewport. The filter dims through
 *  the inner wrapper (.work-dim), so the reveal opacity on the
 *  article and the dim never fight. The whole visual is one
 *  link to the case page, named by the title; the category,
 *  the scrim and the SVG are aria-hidden inside it. */
export function WorkCard({
  project,
  row,
  dimmed,
}: {
  project: Project;
  row: 1 | 2;
  dimmed: boolean;
}) {
  const { ref, className } = useReveal<HTMLElement>(0.2);
  const content = useContent();
  const ui = content.ui.work;
  const Asset = assets[project.slug];

  return (
    <article
      ref={row === 2 ? ref : undefined}
      data-slug={project.slug}
      className={`work-card${row === 1 ? " work-card--row1" : ""}${
        row === 2 ? ` ${className}` : ""
      }`}
    >
      <div className={`work-card-inner${dimmed ? " work-dim" : ""}`}>
        <Link href={`/work/${project.slug}`} className="work-visual">
          <span className="work-visual-asset" aria-hidden="true">
            {Asset ? <Asset /> : null}
          </span>
          <span className="work-visual-scrim" aria-hidden="true" />
          <span className="work-category">{project.category}</span>
          <span className="work-visual-foot">
            <span className="work-visual-title">{project.title}</span>
            <span className="work-view">
              {ui.viewCaseStudy}{" "}
              <span className="work-view-arrow" aria-hidden="true">
                ↗
              </span>
            </span>
          </span>
        </Link>
        <div className="work-body">
          <p className="work-year">{project.year}</p>
          <p className="work-summary">{project.rowOutcome}</p>
          <p className="work-proof">
            <span className="work-proof-label">{ui.proof}</span>{" "}
            {project.rowProof}
          </p>
        </div>
      </div>
    </article>
  );
}
