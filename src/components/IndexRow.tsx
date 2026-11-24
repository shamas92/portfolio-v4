"use client";

import Link from "next/link";
import type { Project } from "@/content";
import { useContent } from "@/i18n/LocaleProvider";

/** One tier-2 row: year, title link, concrete technical scope,
 *  mono stack tags. The scope line replaces the repeated
 *  "Shipped as an academic project" copy. */
export function IndexRow({
  project,
  dimmed,
}: {
  project: Project;
  dimmed: boolean;
}) {
  const content = useContent();
  return (
    <li className={`index-row${dimmed ? " work-dim" : ""}`}>
      <span className="index-year">{project.year}</span>
      <div className="index-main">
        <h3 className="index-title">
          <Link href={`/work/${project.slug}`}>{project.title}</Link>
          {project.badge && (
            <span className="index-badge">{project.badge}</span>
          )}
        </h3>
        <p className="index-scope">{project.scope}</p>
        <ul className="index-stack" aria-label={content.ui.work.stackLabel}>
          {project.stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </div>
    </li>
  );
}
