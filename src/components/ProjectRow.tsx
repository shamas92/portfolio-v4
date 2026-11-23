import Link from "next/link";
import type { Project } from "@/content";

/** One ruled Work row: year, name, outcome, proof statement, stack.
 *  The title links to the case-study page; the whole row follows it
 *  via a stretched link. The proof statement is plain text — the
 *  evidence for it lives on the case-study page. */
export function ProjectRow({ project }: { project: Project }) {
  return (
    <li className="work-row">
      <div className="work-row-title">
        <Link className="work-row-link" href={`/work/${project.slug}`}>
          {project.title}
        </Link>
        <span className="work-row-year">{project.year}</span>
      </div>
      <div className="work-row-body">
        <p className="work-row-outcome">{project.rowOutcome}</p>
        <p className="work-row-proof">{project.rowProof}</p>
        <ul className="work-row-stack" aria-label="Stack">
          {project.stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </div>
    </li>
  );
}
