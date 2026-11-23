import Image from "next/image";
import Link from "next/link";
import { Newsreader } from "next/font/google";
import type { Project } from "@/content";
import { Annotated } from "./ProofNote";
import { Rail } from "./Rail";
import { Todo } from "./Todo";

/* The italic serif for quotes and citations. Loaded only on case
   pages, so the home page never pays for it. */
const newsreaderItalic = Newsreader({
  subsets: ["latin", "latin-ext"],
  weight: ["500"],
  style: ["italic"],
  display: "swap",
  variable: "--font-newsreader-italic",
});

/** One case-study page: the same six blocks for every project —
 *  Problem, Architecture, Outcome, Evidence, Stack, Links.
 *  A block is omitted when the project has no verified content for
 *  it; the plain status line stays where Evidence would be empty. */
export function CaseStudy({ project }: { project: Project }) {
  const hasEvidence = Boolean(
    project.figure ||
    project.evidence ||
    project.image ||
    project.registry ||
    project.limits ||
    project.evidenceStatus,
  );

  const railItems = [
    { href: "#problem", label: "Problem" },
    { href: "#architecture", label: "Architecture" },
    { href: "#outcome", label: "Outcome" },
    ...(hasEvidence ? [{ href: "#evidence", label: "Evidence" }] : []),
    { href: "#stack", label: "Stack" },
    ...(project.links.length > 0 || project.todoLinks
      ? [{ href: "#links", label: "Links" }]
      : []),
  ];

  return (
    <>
      <Rail items={railItems} />
      <div className="case-head">
        <Link className="case-back" href="/#work">
          All projects
        </Link>
        <h1 className="case-title">{project.title}</h1>
        <p className="case-meta">
          {project.year} — {project.stack.join(", ")}
        </p>
      </div>

      <section
        className="case-block"
        id="problem"
        aria-labelledby="problem-head"
      >
        <h2 className="case-block-head" id="problem-head">
          Problem
        </h2>
        <Annotated
          prose={project.problem}
          idPrefix={`${project.slug}-problem`}
        />
      </section>

      <section
        className="case-block"
        id="architecture"
        aria-labelledby="architecture-head"
      >
        <h2 className="case-block-head" id="architecture-head">
          Architecture
        </h2>
        <Annotated
          prose={project.architecture}
          idPrefix={`${project.slug}-architecture`}
        />
      </section>

      <section
        className="case-block"
        id="outcome"
        aria-labelledby="outcome-head"
      >
        <h2 className="case-block-head" id="outcome-head">
          Outcome
        </h2>
        <Annotated
          prose={project.outcome}
          idPrefix={`${project.slug}-outcome`}
        />
      </section>

      {hasEvidence && (
        <section
          className="case-block"
          id="evidence"
          aria-labelledby="evidence-head"
        >
          <h2 className="case-block-head" id="evidence-head">
            Evidence
          </h2>

          {project.figure && (
            <div>
              <p className="case-figure-line">{project.figure.value}</p>
              <p className="case-figure-label">{project.figure.label}</p>
            </div>
          )}

          {project.evidence?.kind === "quote" && (
            <blockquote className={`case-quote ${newsreaderItalic.variable}`}>
              <p lang="de">“{project.evidence.text}”</p>
              {project.evidence.gloss && (
                <p className="case-quote-gloss">{project.evidence.gloss}</p>
              )}
              <cite>{project.evidence.cite}</cite>
            </blockquote>
          )}

          {project.evidence?.kind === "citation" && (
            <div className={`case-citation ${newsreaderItalic.variable}`}>
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
                sizes="(min-width: 1024px) 720px, 100vw"
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
            <p className="case-status">{project.evidenceStatus}</p>
          )}
        </section>
      )}

      <section className="case-block" id="stack" aria-labelledby="stack-head">
        <h2 className="case-block-head" id="stack-head">
          Stack
        </h2>
        <ul className="case-stack-list">
          {project.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      {(project.links.length > 0 || project.todoLinks) && (
        <section className="case-block" id="links" aria-labelledby="links-head">
          <h2 className="case-block-head" id="links-head">
            Links
          </h2>
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
        </section>
      )}
    </>
  );
}
