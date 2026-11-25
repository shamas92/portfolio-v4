/**
 * The hero's right column: the deck, the caption under it, and
 * the project-name tabs under that — the reference's hero
 * showcase. The deck is decorative (aria-hidden); the caption
 * and the tabs carry the active project's name and summary, so
 * the showcase is fully operable without the deck.
 *
 * - Caption: bold project name + the verified one-line summary
 *   (rowOutcome), and a "View case study" pill to that project's
 *   case page. It follows the active tab.
 * - Tabs: the six project names. The active tab is a black pill
 *   with white text; the rest are plain grey text. They are real
 *   buttons (aria-pressed), keyboard-operable, 44px tap targets.
 *   Clicking one makes that project the deck's front card and
 *   updates the caption.
 *
 * Tab labels: the three long titles are shortened for the tab
 * row ("Sales ETL", "HITEC", "Quality CRM"). These are display
 * abbreviations, not the project titles — they need the user's
 * confirmation. The full titles stay in content.ts and on the
 * track cards and case pages.
 */
"use client";

import Link from "next/link";
import { useContent } from "@/i18n/LocaleProvider";
import type { Project } from "@/content";
import { HeroDeck } from "./HeroDeck";

/** Shortened tab labels for the three long titles. Exported so
 *  the Skills section can resolve the same short labels back
 *  to case-page slugs. */
export const TAB_LABELS: Record<string, string> = {
  "sales-etl-pipeline": "Sales ETL",
  "hitec-cms": "HITEC",
  "quality-crm": "Quality CRM",
};

export const tabLabel = (project: Project): string =>
  TAB_LABELS[project.slug] ?? project.title;

export function HeroShowcase({
  activeSlug,
  onSelect,
}: {
  activeSlug: string;
  onSelect: (slug: string) => void;
}) {
  const content = useContent();
  const projects = content.projects;
  const ui = content.ui.work;
  const active =
    projects.find((p) => p.slug === activeSlug) ?? projects[0]!;

  return (
    <div className="hero-showcase">
      <HeroDeck activeSlug={active.slug} />
      <div
        className="hero-caption"
        data-entrance
        style={{ "--entrance-delay": "300ms" } as React.CSSProperties}
      >
        <p className="hero-caption-text">
          <strong>{active.title}</strong>{" "}
          <span>{active.rowOutcome}</span>
        </p>
        <Link href={`/work/${active.slug}`} className="hero-caption-link">
          {ui.viewCaseStudy}{" "}
          <span className="hero-caption-arrow" aria-hidden="true">
            ↗
          </span>
        </Link>
      </div>
      <div
        className="hero-tabs"
        role="group"
        aria-label={ui.heading}
        data-entrance
        style={{ "--entrance-delay": "360ms" } as React.CSSProperties}
      >
        {projects.map((project) => {
          const isActive = project.slug === active.slug;
          return (
            <button
              key={project.slug}
              type="button"
              className="hero-tab"
              aria-pressed={isActive}
              onClick={() => onSelect(project.slug)}
            >
              {tabLabel(project)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
