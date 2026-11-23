import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content";
import { Annotated } from "./ProofNote";
import { Todo } from "./Todo";

/** One case-study page: the same four blocks for every project —
 *  Problem, Architecture, Outcome, Proof. */
export function CaseStudy({ project }: { project: Project }) {
  return (
    <>
      <div className="case-head">
        <Link className="case-back" href="/#work">
          All projects
        </Link>
        <h1 className="case-title">{project.title}</h1>
        <p className="case-meta">
          {project.year} — {project.stack.join(", ")}
        </p>
      </div>

      <section className="case-block" aria-labelledby="problem-head">
        <h2 className="case-block-head" id="problem-head">
          Problem
        </h2>
        <Annotated
          prose={project.problem}
          idPrefix={`${project.slug}-problem`}
        />
      </section>

      <section className="case-block" aria-labelledby="architecture-head">
        <h2 className="case-block-head" id="architecture-head">
          Architecture
        </h2>
        <Annotated
          prose={project.architecture}
          idPrefix={`${project.slug}-architecture`}
        />
      </section>

      <section className="case-block" aria-labelledby="outcome-head">
        <h2 className="case-block-head" id="outcome-head">
          Outcome
        </h2>
        <Annotated
          prose={project.outcome}
          idPrefix={`${project.slug}-outcome`}
        />
      </section>

      <section className="case-block" aria-labelledby="proof-head">
        <h2 className="case-block-head" id="proof-head">
          Proof
        </h2>

        {project.figure && (
          <div>
            <p className="case-figure-line">{project.figure.value}</p>
            <p className="case-figure-label">{project.figure.label}</p>
          </div>
        )}

        {project.evidence?.kind === "quote" && (
          <blockquote className="case-quote">
            <p lang="de">“{project.evidence.text}”</p>
            {project.evidence.gloss && (
              <p className="case-quote-gloss">{project.evidence.gloss}</p>
            )}
            <cite>{project.evidence.cite}</cite>
          </blockquote>
        )}

        {project.evidence?.kind === "citation" && (
          <div className="case-citation">
            <p>“{project.evidence.text}”</p>
            <cite>{project.evidence.cite}</cite>
          </div>
        )}

        {project.image && (
          <figure className="case-figure">
            <Image
              src={project.image.src}
              width={project.image.width}
              height={project.image.height}
              sizes="(max-width: 768px) 100vw, 640px"
              alt={project.image.alt}
            />
            <figcaption>{project.image.caption}</figcaption>
          </figure>
        )}

        {project.registry && (
          <div>
            <h3 className="case-block-head">Deposit caps in the registry</h3>
            <ul className="registry-list">
              {project.registry.map((r) => (
                <li key={r.jurisdiction}>
                  <span className="registry-place">{r.jurisdiction}: </span>
                  {r.rule}
                </li>
              ))}
            </ul>
          </div>
        )}

        {project.limits && (
          <div>
            <h3 className="case-block-head">Limits</h3>
            <ul className="limits-list">
              {project.limits.map((limit) => (
                <li key={limit}>{limit}</li>
              ))}
            </ul>
          </div>
        )}

        {project.evidenceStatus && (
          <p className="case-note">{project.evidenceStatus}</p>
        )}

        {(project.links.length > 0 || project.todoLinks) && (
          <div className="case-links">
            {project.links.map((l) => (
              <a
                key={l.href}
                className="btn btn-secondary"
                href={l.href}
                target="_blank"
                rel="noreferrer"
              >
                {l.label}
              </a>
            ))}
            {project.todoLinks?.map((t) => (
              <Todo key={t.label} label={t.label} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
