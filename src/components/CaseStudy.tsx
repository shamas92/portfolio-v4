"use client";

import Image from "next/image";
import Link from "next/link";
import { Newsreader } from "next/font/google";
import { useContent } from "@/i18n/LocaleProvider";
import { Annotated } from "./ProofNote";
import { EtlAsset, LeaseLensAsset, OratorPathAsset } from "./SpecAssets";

/* The italic serif for quotes and citations. Loaded only on case
   pages, so the home page never pays for it. */
const newsreaderItalic = Newsreader({
  subsets: ["latin", "latin-ext"],
  weight: ["500"],
  style: ["italic"],
  display: "swap",
  variable: "--font-newsreader-italic",
});

/** The three deck projects also show their interface mockup
 *  in the Evidence section (the same asset as the home card).
 *  The other three projects have no mockup. */
const caseAssets: Record<
  string,
  {
    Component: () => React.JSX.Element;
    captionKey: "leaselens" | "etl" | "orator";
  }
> = {
  leaselens: { Component: LeaseLensAsset, captionKey: "leaselens" },
  "sales-etl-pipeline": { Component: EtlAsset, captionKey: "etl" },
  oratorpath: { Component: OratorPathAsset, captionKey: "orator" },
};

/** One case-study page: the same blocks for every project —
 *  Problem, Contribution, Decision, Result, Evidence, Stack,
 *  Links. Contribution and Decision are one or two sentences each
 *  (the same text as the work card); Result is the outcome
 *  prose. A block is omitted when the project has no verified
 *  content for it; projects with no verified figure have no
 *  Evidence block at all (user decision 2026-11-24). The Links
 *  block is omitted when the project has no links, so no bare
 *  heading ever renders. Sections stack plainly with anchor ids;
 *  the header nav covers site navigation (no rail).
 *  The page looks the project up in the current locale's content
 *  by slug — the server page already validated the slug, so the
 *  lookup always succeeds. */
export function CaseStudy({ slug }: { slug: string }) {
  const content = useContent();
  const ui = content.ui.caseStudy;
  const project = content.projects.find((p) => p.slug === slug)!;
  const caseAsset = caseAssets[slug];
  const hasEvidence = Boolean(
    project.figure ||
    project.evidence ||
    project.image ||
    project.registry ||
    project.limits ||
    caseAsset,
  );

  return (
    <>
      <div className="case-head">
        <Link className="case-back" href="/#work">
          {ui.allProjects}
        </Link>
        <h1 className="case-title">{project.title}</h1>
        <p className="case-meta">
          {project.year} — {project.stack.join(", ")}
        </p>
        <p className="case-role">
          <span className="case-role-label">{ui.role}</span> — {project.role}
        </p>
      </div>

      <section
        className="case-block"
        id="problem"
        aria-labelledby="problem-head"
      >
        <h2 className="case-block-head" id="problem-head">
          {ui.problem}
        </h2>
        <Annotated
          prose={project.problem}
          idPrefix={`${project.slug}-problem`}
        />
      </section>

      <section
        className="case-block"
        id="contribution"
        aria-labelledby="contribution-head"
      >
        <h2 className="case-block-head" id="contribution-head">
          {ui.contribution}
        </h2>
        <p className="case-text">{project.contribution}</p>
      </section>

      <section
        className="case-block"
        id="decision"
        aria-labelledby="decision-head"
      >
        <h2 className="case-block-head" id="decision-head">
          {ui.decision}
        </h2>
        <p className="case-text">{project.decision}</p>
      </section>

      <section className="case-block" id="result" aria-labelledby="result-head">
        <h2 className="case-block-head" id="result-head">
          {ui.result}
        </h2>
        <Annotated prose={project.result} idPrefix={`${project.slug}-result`} />
      </section>

      {hasEvidence && (
        <section
          className="case-block"
          id="evidence"
          aria-labelledby="evidence-head"
        >
          <h2 className="case-block-head" id="evidence-head">
            {ui.evidence}
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

          {caseAsset && (
            <figure className="case-figure case-figure--mockup">
              <caseAsset.Component />
              <figcaption>
                {content.ui.assets[caseAsset.captionKey].caption}
              </figcaption>
            </figure>
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
              <h3 className="case-block-head">{ui.registryHeading}</h3>
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
              <h3 className="case-block-head">{ui.limitsHeading}</h3>
              <ul className="limits-list">
                {project.limits.map((limit) => (
                  <li key={limit}>{limit}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      <section className="case-block" id="stack" aria-labelledby="stack-head">
        <h2 className="case-block-head" id="stack-head">
          {ui.stack}
        </h2>
        <ul className="case-stack-list">
          {project.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      {project.links.length > 0 && (
        <section className="case-block" id="links" aria-labelledby="links-head">
          <h2 className="case-block-head" id="links-head">
            {ui.links}
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
          </div>
        </section>
      )}
    </>
  );
}
