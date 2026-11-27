"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/content";
import { format, useContent } from "@/i18n/LocaleProvider";

/** Outcome charts for case pages (Austin model): one different
 *  chart per metric instead of three identical stat cards. Every
 *  number comes from the project's own verified content — stats,
 *  tests, registry, figure — and every chart is real text and
 *  data in the DOM, never an image of text. Projects with no
 *  verified number (Quality CRM, UpliftU) get no chart at all.
 *  Numbers count up on mount; under prefers-reduced-motion the
 *  final value renders at once and nothing animates. Bar heights
 *  and the donut arc are always the final values — only the
 *  printed number moves. */
export function OutcomeCharts({ project }: { project: Project }) {
  switch (project.slug) {
    case "leaselens":
      return <LeaseLensCharts project={project} />;
    case "sales-etl-pipeline":
      return <StatBars project={project} footnote={project.proofCallout} />;
    case "oratorpath":
      return <OratorPathChart project={project} />;
    case "hitec-cms":
      return <StatBars project={project} footnote={project.rowProof} />;
    default:
      return null;
  }
}

/** Count-up for one number. Starts at 0 and eases to the target
 *  in ~900ms; under reduced motion the target is set at once. The
 *  initial render is always 0, so server and client agree. */
function useCountUp(target: number): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // One frame of 0, then the final value: no animation, and no
      // synchronous setState inside the effect body.
      const raf = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(raf);
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 900);
      setValue(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return value;
}

/** Donut: one percentage as a ring. The value is real SVG text
 *  and the figure carries the full measurement as its label. */
function DonutChart({
  value,
  label,
  footnote,
}: {
  value: number;
  label: string;
  footnote: string;
}) {
  const animated = useCountUp(value);
  const r = 52;
  const circumference = 2 * Math.PI * r;
  const filled = (value / 100) * circumference;
  return (
    <figure className="outcome-chart outcome-chart--donut">
      <p className="outcome-chart-title">{label}</p>
      <svg
        viewBox="0 0 120 120"
        className="outcome-donut"
        role="img"
        aria-label={`${label}: ${value}%`}
      >
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="var(--rule)"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
          transform="rotate(-90 60 60)"
        />
        <text x="60" y="66" textAnchor="middle" className="outcome-donut-value">
          {animated.toFixed(1)}%
        </text>
      </svg>
      <figcaption className="outcome-footnote">{footnote}</figcaption>
    </figure>
  );
}

/** Two horizontal bars side by side: the LeaseLens test split,
 *  backend against frontend. The bars are decorative; the
 *  numbers and labels are real text beside them. */
function BarPair({
  title,
  rows,
  footnote,
}: {
  title: string;
  rows: { value: number; label: string }[];
  footnote: string;
}) {
  const max = Math.max(...rows.map((row) => row.value));
  return (
    <figure className="outcome-chart outcome-chart--bar-pair">
      <p className="outcome-chart-title">{title}</p>
      <ul className="outcome-bar-pair-list">
        {rows.map((row) => (
          <BarPairRow key={row.label} value={row.value} max={max} label={row.label} />
        ))}
      </ul>
      <figcaption className="outcome-footnote">{footnote}</figcaption>
    </figure>
  );
}

function BarPairRow({
  value,
  max,
  label,
}: {
  value: number;
  max: number;
  label: string;
}) {
  const animated = useCountUp(value);
  return (
    <li className="outcome-bar-pair-row">
      <span className="outcome-bar-pair-label">{label}</span>
      <span className="outcome-bar-pair-track" aria-hidden="true">
        <span
          className="outcome-bar-pair-fill"
          style={{ width: `${(value / max) * 100}%` }}
        />
      </span>
      <span className="outcome-bar-pair-value">{Math.round(animated)}</span>
    </li>
  );
}

/** Named segments: one block per jurisdiction, labelled with the
 *  registry's own names. A count with names, not a bare number. */
function Segments({
  title,
  names,
}: {
  title: string;
  names: string[];
}) {
  return (
    <figure className="outcome-chart outcome-chart--segments">
      <p className="outcome-chart-title">{title}</p>
      <ul className="outcome-segments">
        {names.map((name) => (
          <li key={name} className="outcome-segment">
            {name}
          </li>
        ))}
      </ul>
    </figure>
  );
}

/** LeaseLens: donut (86.1% registered IoU), bar pair (132 backend
 *  / 65 frontend tests), named segments (5 jurisdictions). */
function LeaseLensCharts({ project }: { project: Project }) {
  const ui = useContent().ui.caseStudy;
  const iou = project.figure ? parseFloat(project.figure.value) : 0;
  const tests = project.tests;
  const jurisdictions = project.registry?.map((r) => r.jurisdiction) ?? [];
  const statLabel = (index: number) => project.stats?.[index]?.label ?? "";
  return (
    <div className="outcome-charts">
      {project.figure && (
        <DonutChart
          value={iou}
          label={statLabel(0)}
          footnote={project.figure.label}
        />
      )}
      {tests && (
        <BarPair
          title={statLabel(1)}
          rows={[
            { value: tests.backend, label: ui.testsBackend },
            { value: tests.frontend, label: ui.testsFrontend },
          ]}
          footnote={format(ui.testsSplit, {
            backend: tests.backend,
            frontend: tests.frontend,
            version: project.version ?? "",
          })}
        />
      )}
      {jurisdictions.length > 0 && (
        <Segments title={statLabel(2)} names={jurisdictions} />
      )}
    </div>
  );
}

/** Vertical bars: one bar per stat (Sales ETL 1/3/4, HITEC 6/3/5).
 *  The value and label of each bar are real text; the bar itself
 *  is decorative. */
function StatBars({
  project,
  footnote,
}: {
  project: Project;
  footnote?: string;
}) {
  const bars = (project.stats ?? [])
    .map((stat) => ({ value: parseInt(stat.value, 10), label: stat.label }))
    .filter((bar) => Number.isFinite(bar.value));
  if (bars.length === 0) return null;
  const max = Math.max(...bars.map((bar) => bar.value));
  return (
    <div className="outcome-charts">
      <figure className="outcome-chart outcome-chart--bars">
        <ul className="outcome-bars">
          {bars.map((bar) => (
            <StatBar key={bar.label} value={bar.value} max={max} label={bar.label} />
          ))}
        </ul>
        {footnote && (
          <figcaption className="outcome-footnote">{footnote}</figcaption>
        )}
      </figure>
    </div>
  );
}

function StatBar({
  value,
  max,
  label,
}: {
  value: number;
  max: number;
  label: string;
}) {
  const animated = useCountUp(value);
  return (
    <li className="outcome-bar">
      <span className="outcome-bar-value">{Math.round(animated)}</span>
      <span className="outcome-bar-track" aria-hidden="true">
        <span
          className="outcome-bar-fill"
          style={{ height: `${(value / max) * 96}px` }}
        />
      </span>
      <span className="outcome-bar-label">{label}</span>
    </li>
  );
}

/** OratorPath: the paper's page span as a ruled bar. Volume and
 *  issue stay text beside it — a journal reference is not a
 *  quantity, so it gets no bar of its own. The page count is
 *  arithmetic on the verified range (852 − 843 + 1 = 10). */
function OratorPathChart({ project }: { project: Project }) {
  const ui = useContent().ui.caseStudy;
  const volume = project.stats?.[0]?.value ?? "";
  const issue = project.stats?.[1]?.value ?? "";
  const pages = project.stats?.[2]?.value ?? "";
  const match = pages.match(/^(\d+)[–-](\d+)$/);
  const pageCount = match ? Number(match[2]) - Number(match[1]) + 1 : 0;
  const animated = useCountUp(pageCount);
  return (
    <div className="outcome-charts">
      <figure className="outcome-chart outcome-chart--span">
        <p className="outcome-chart-title">{project.stats?.[2]?.label ?? ""}</p>
        <div className="outcome-span">
          <span className="outcome-span-range">{pages}</span>
          {pageCount > 0 && (
            <span className="outcome-span-count">
              {format(ui.pagesCount, { count: Math.round(animated) })}
            </span>
          )}
        </div>
        <p className="outcome-span-meta">
          {volume} · {issue}
        </p>
        {project.proofCallout && (
          <figcaption className="outcome-footnote">
            {project.proofCallout}
          </figcaption>
        )}
      </figure>
    </div>
  );
}
