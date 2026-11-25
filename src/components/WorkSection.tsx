"use client";

import { useMemo, useState } from "react";
import { format, useContent } from "@/i18n/LocaleProvider";
import type { Project } from "@/content";
import { WorkCard } from "./WorkCard";

/** Pills, in the order the brief names them, then the remaining
 *  project stack tags alphabetically. Counts are the number of
 *  shipped projects whose stack matches the pill. "All" is the
 *  only pill label that translates; the rest are stack tags. */
const PILLS = [
  "Python",
  "TypeScript",
  "SQL",
  "PyTorch",
  "Docker",
  "Next.js",
  "FastAPI",
  "PostgreSQL",
  "C#",
  "Apache Airflow",
  "Docker Compose",
  "Hugging Face",
  "Laravel",
  "MinIO",
  "MySQL",
  "NLP",
  "Parquet",
  "PHP",
  "SAM 3.1",
] as const;

type Pill = (typeof PILLS)[number] | "All";

/** "All" first, then the stack tags. */
const ALL_PILLS: Pill[] = ["All", ...PILLS];

/** A project matches a pill when one of its stack tags is the pill,
 *  or the pill is a shorthand for a tag: Docker covers Docker
 *  Compose, SQL covers the SQL databases. */
function matches(project: Project, pill: Pill): boolean {
  if (pill === "All") return true;
  const stack = project.stack.map((s) => s.toLowerCase());
  const p = pill.toLowerCase();
  if (stack.includes(p)) return true;
  if (p === "docker") return stack.includes("docker compose");
  if (p === "sql")
    return stack.some((s) => ["postgresql", "mysql", "sql server"].includes(s));
  return false;
}

/** The Work grid: all six projects as equal image-led cards in
 *  one 3×2 grid (3 columns on desktop, 2 on tablet, 1 on a
 *  phone), in the reference's style — the photo leads, overlay
 *  labels on it, summary and proof below. The Featured/Earlier
 *  distinction is gone: all six cards are the hero deck's
 *  destination, and their opacity is the docking moment's
 *  --grid-reveal (see WorkCard), so there is no per-row reveal
 *  any more — the deck IS the reveal.
 *
 *  The filter highlights in place with CSS opacity transitions:
 *  matching cards stay full, the rest dim. No layout library is
 *  needed because nothing reorders — the filter never hides a
 *  project, so the section works with JavaScript disabled too
 *  (the pills simply do not render and all six stay visible).
 *  The filter sits below the grid, so the first project is
 *  visible in the first viewport. The disclosure is closed by
 *  default: twenty pills would otherwise wrap into a block
 *  taller than a project card and compete with the work. The
 *  disclosure button always shows the active filter, and the
 *  results note stays visible below it, so the state is clear
 *  even while the pills are closed. */
export function WorkSection() {
  const content = useContent();
  const projects = content.projects;
  const ui = content.ui.work;
  const [active, setActive] = useState<Pill>("All");
  const [filterOpen, setFilterOpen] = useState(false);

  const counts = useMemo(() => {
    const map = new Map<Pill, number>();
    for (const pill of ALL_PILLS) {
      map.set(pill, projects.filter((p) => matches(p, pill)).length);
    }
    return map;
  }, [projects]);

  const matched = projects.filter((p) => matches(p, active)).length;

  const note =
    active === "All"
      ? format(ui.showingAll, { total: projects.length })
      : format(ui.showingSome, {
          n: matched,
          tag: active,
          total: projects.length,
        });

  return (
    <>
      <div className="work-grid">
        {projects.map((project) => (
          <WorkCard
            key={project.slug}
            project={project}
            dimmed={!matches(project, active)}
          />
        ))}
      </div>

      <div className="filter-bar">
        <button
          type="button"
          className="filter-disclosure"
          aria-expanded={filterOpen}
          aria-controls="filter-pills"
          onClick={() => setFilterOpen((v) => !v)}
        >
          <span className="filter-disclosure-label">
            {ui.filterBy}
            {active !== "All" && `: ${active}`}
          </span>
          <span className="filter-disclosure-chevron" aria-hidden="true">
            ›
          </span>
        </button>
        {active !== "All" && (
          <button
            type="button"
            className="filter-clear"
            onClick={() => setActive("All")}
          >
            {ui.filterClear}
          </button>
        )}
      </div>
      {filterOpen && (
        <div
          className="filter-pills"
          id="filter-pills"
          role="group"
          aria-label={ui.filterLabel}
        >
          {ALL_PILLS.map((pill) => (
            <button
              key={pill}
              type="button"
              className="filter-pill"
              aria-pressed={active === pill}
              onClick={() => setActive(pill)}
            >
              {pill === "All" ? ui.all : pill} ({counts.get(pill) ?? 0})
            </button>
          ))}
        </div>
      )}
      <p className="filter-note" aria-live="polite">
        {note}
      </p>
    </>
  );
}
