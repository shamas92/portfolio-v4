"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import type { Project } from "@/content";
import { useContent } from "@/i18n/LocaleProvider";
import { ProjectPhoto } from "./ProjectPhoto";
import { useReveal } from "./Reveal";

/** One Work card: the project's photo leads, edge to edge, with
 *  the reference's overlay labels on it — category pill
 *  top-left, title bottom-left, "View case study" pill
 *  bottom-right — over a dark scrim so the white overlay text
 *  stays legible in both themes. The photo is the same file in
 *  light and dark mode. Below the visual: year, one-sentence
 *  summary, and the proof (design-intelligence rule 10: proof
 *  lives on the same card as the claim). The contribution, the
 *  decision and the stack live on the case page only — the grid
 *  card stays scannable, and the visual dominates, as in the
 *  reference.
 *
 *  The description overlay: on hover (fine pointer) and on
 *  keyboard focus, a dark wash fades in over the photo with the
 *  same summary and proof that sit in the body below — the
 *  one-sentence summary plus the proof, nothing else, no new
 *  copy. The category pill and the title fade out to make room
 *  (the longest description, HITEC in German, needs the full
 *  height); the "View case study" pill stays visible and
 *  clickable throughout, and the overlay itself is
 *  pointer-events none, so it can never block the link. Touch
 *  users have no hover, so they read the same summary and proof
 *  in the body below the visual. The overlay is aria-hidden: it
 *  duplicates the body text, which screen readers already get.
 *
 *  Every card is the deck's destination: its opacity is the
 *  moment's --grid-reveal, driven by the scroll listener in
 *  page.tsx (0 at rest, 1 once the deck has docked). The
 *  default is 1, so the grid shows fully without JavaScript and
 *  under reduced motion. The filter dims through the inner
 *  wrapper (.work-dim), so the reveal opacity on the article
 *  and the dim never fight. The whole visual is one link to the
 *  case page, named by the title; the category, the scrim, the
 *  photo and the overlay are aria-hidden inside it. */
export function WorkCard({
  project,
  dimmed,
  index,
}: {
  project: Project;
  dimmed: boolean;
  index: number;
}) {
  const content = useContent();
  const ui = content.ui.work;
  /* Per-card scroll reveal, staggered by index (60ms steps).
     The class is "work-card-reveal": its hidden state is
     scoped below the 1024px docking breakpoint, so on desktop
     the deck engine owns the card's opacity and this is inert.
     The delay rides on --reveal-delay so it touches only the
     reveal transition, never the theme cross-fade. */
  const { ref, className: revealClass } = useReveal<HTMLElement>(
    0.2,
    "work-card-reveal",
  );

  return (
    <article
      data-slug={project.slug}
      ref={ref}
      className={`work-card ${revealClass}`}
      style={{ "--reveal-delay": `${index * 60}ms` } as CSSProperties}
    >
      <div className={`work-card-inner${dimmed ? " work-dim" : ""}`}>
        <Link href={`/work/${project.slug}`} className="work-visual">
          <span className="work-visual-asset" aria-hidden="true">
            <ProjectPhoto slug={project.slug} />
          </span>
          <span className="work-visual-scrim" aria-hidden="true" />
          <span className="work-visual-desc" aria-hidden="true">
            <span className="work-visual-desc-text">
              <span className="work-visual-desc-summary">
                {project.rowOutcome}
              </span>
              <span className="work-visual-desc-proof">
                <span className="work-visual-desc-proof-label">{ui.proof}</span>{" "}
                {project.rowProof}
              </span>
            </span>
          </span>
          <span className="work-category">{project.category}</span>
          <span className="work-visual-foot">
            <h3 className="work-visual-title">{project.title}</h3>
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
