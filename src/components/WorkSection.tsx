"use client";

import { useMemo, useState } from "react";
import { projects, type Project } from "@/content";
import { FlagshipCard } from "./FlagshipCard";
import { IndexRow } from "./IndexRow";

const FLAGSHIPS = ["leaselens", "sales-etl-pipeline", "oratorpath"];
const TIER2 = ["quality-crm", "upliftu"];

/** Pills, in the order the brief names them, then the remaining
 *  project stack tags alphabetically. Counts are the number of
 *  shipped projects whose stack matches the pill. */
const PILLS = [
  "All",
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

type Pill = (typeof PILLS)[number];

/** A project matches a pill when one of its stack tags is the pill,
 *  or the pill is a shorthand for a tag: Docker covers Docker
 *  Compose, SQL covers the SQL databases. C# matches no shipped
 *  project — it appears in Background, and the note says so. */
function matches(project: Project, pill: Pill): boolean {
  if (pill === "All") return true;
  const stack = project.stack.map((s) => s.toLowerCase());
  const p = pill.toLowerCase();
  if (stack.includes(p)) return true;
  if (p === "docker") return stack.includes("docker compose");
  if (p === "sql")
    return stack.some((s) =>
      ["postgresql", "mysql", "sql server"].includes(s),
    );
  return false;
}

/** The filter highlights in place with CSS opacity transitions:
 *  matching cards stay full, the rest dim. No layout library is
 *  needed because nothing reorders — the filter never hides a
 *  project, so the section works with JavaScript disabled too
 *  (the pills simply do not render and all five stay visible). */
export function WorkSection() {
  const [active, setActive] = useState<Pill>("All");

  const counts = useMemo(() => {
    const map = new Map<Pill, number>();
    for (const pill of PILLS) {
      map.set(pill, projects.filter((p) => matches(p, pill)).length);
    }
    return map;
  }, []);

  const flagships = FLAGSHIPS.map(
    (slug) => projects.find((p) => p.slug === slug)!,
  );
  const tier2 = TIER2.map((slug) => projects.find((p) => p.slug === slug)!);
  const matched = projects.filter((p) => matches(p, active)).length;

  const note =
    active === "All"
      ? "Showing all 5 projects."
      : active === "C#"
        ? "No shipped project lists C#. It appears in Background — the HITEC internship and Heavy Industries Taxila."
        : `${matched} of 5 projects use ${active}.`;

  return (
    <>
      <div
        className="filter-pills"
        role="group"
        aria-label="Filter projects by stack"
      >
        {PILLS.map((pill) => (
          <button
            key={pill}
            type="button"
            className="filter-pill"
            aria-pressed={active === pill}
            onClick={() => setActive(pill)}
          >
            {pill} ({counts.get(pill) ?? 0})
          </button>
        ))}
      </div>
      <p className="filter-note" aria-live="polite">
        {note}
      </p>

      <div className="flagship-grid">
        {flagships.map((project) => (
          <FlagshipCard
            key={project.slug}
            project={project}
            dimmed={!matches(project, active)}
          />
        ))}
      </div>

      <h3 className="index-heading">Earlier systems</h3>
      <ul className="index-list">
        {tier2.map((project) => (
          <IndexRow
            key={project.slug}
            project={project}
            dimmed={!matches(project, active)}
          />
        ))}
      </ul>
    </>
  );
}
