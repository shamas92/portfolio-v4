"use client";

import Image from "next/image";
import Link from "next/link";
import { Newsreader } from "next/font/google";
import { useContent, useLocale } from "@/i18n/LocaleProvider";
import { Annotated } from "./ProofNote";
import { EtlAsset, LeaseLensAsset, OratorPathAsset } from "./SpecAssets";
import { OutcomeCharts } from "./OutcomeCharts";

/* The italic serif for quotes and citations. Loaded only on case
   pages, so the home page never pays for it. `preload: false`
   stops the App Router's <Link> prefetch from pulling the italic
   preloads onto the home page (where the face is never used and
   the browser warns about the unused preloads); the font still
   loads on demand when a case page renders it. */
const newsreaderItalic = Newsreader({
  subsets: ["latin", "latin-ext"],
  weight: ["500"],
  style: ["italic"],
  display: "swap",
  preload: false,
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

/** A two-line section heading (Austin model): a statement line
 *  over a plain second line that says what the section shows. */
function TwoLineHead({
  id,
  line,
  sub,
}: {
  id: string;
  line: string;
  sub: string;
}) {
  return (
    <h2 className="case-block-head case-block-head--two" id={id}>
      <span className="case-block-head-line">{line}</span>
      <span className="case-block-head-sub">{sub}</span>
    </h2>
  );
}

/** One case-study page (Aahil model): a narrow centred column
 *  with a "BUILT WITH" pill card and full-width Visit/GitHub
 *  buttons in the right rail. The head is outcome-led — the
 *  one-line outcome under the title, then a Year / Category /
 *  Role meta row and the scope pills. There is no verified
 *  "Client" per project, so the meta row carries the year, the
 *  category and the role instead of a made-up client name.
 *  Result and Evidence carry two-line headings; Problem and
 *  Decision keep their single-line heads. The stack lives only
 *  in the rail card and the links only in the rail, so there is
 *  no separate Stack or Links section. A block is omitted when
 *  the project has no verified content for it; projects with no
 *  verified figure have no Evidence block at all (user decision
 *  2026-11-24). "What I'd change" is omitted — the words are
 *  the owner's (TODO(owner)), never invented. Sections stack
 *  plainly with anchor ids; the header nav covers site
 *  navigation (no rail). External links carry a visually-hidden
 *  new-tab note for screen-reader users. The page looks the
 *  project up in the current locale's content by slug — the
 *  server page already validated the slug, so the lookup always
 *  succeeds. */
export function CaseStudy({ slug }: { slug: string }) {
  const content = useContent();
  const { locale } = useLocale();
  const ui = content.ui.caseStudy;
  const project = content.projects.find((p) => p.slug === slug)!;
  const caseAsset = caseAssets[slug];
  const newTabNote =
    locale === "de"
      ? " (öffnet in einem neuen Tab)"
      : " (opens in a new tab)";
  const hasEvidence = Boolean(
    project.figure ||
    project.evidence ||
    project.image ||
    project.registry ||
    project.limits ||
    caseAsset,
  );

  return (
    <div className="case-layout">
      <div className="case-main">
        <div className="case-head">
          <Link className="case-back" href="/#work">
            {ui.allProjects}
          </Link>
          <h1 className="case-title">{project.title}</h1>
          <p className="case-lede">{project.rowOutcome}</p>
          <p className="case-meta">
            {project.year} · {project.category}
          </p>
          <p className="case-role">
            <span className="case-role-label">{ui.role}</span> — {project.role}
          </p>
          {project.scopePills && project.scopePills.length > 0 && (
            <ul className="case-scope-list" aria-label={ui.scope}>
              {project.scopePills.map((pill) => (
                <li key={pill}>{pill}</li>
              ))}
            </ul>
          )}
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
          <p className="case-my-part">
            <span className="case-my-part-label">{ui.myPart}</span> —{" "}
            {project.contribution}
          </p>
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

        <section
          className="case-block"
          id="result"
          aria-labelledby="result-head"
        >
          <TwoLineHead
            id="result-head"
            line={ui.outcomeTitle}
            sub={ui.outcomeSub}
          />
          <Annotated
            prose={project.result}
            idPrefix={`${project.slug}-result`}
          />
          <OutcomeCharts project={project} />
        </section>

        {hasEvidence && (
          <section
            className="case-block"
            id="evidence"
            aria-labelledby="evidence-head"
          >
            <TwoLineHead
              id="evidence-head"
              line={ui.evidenceTitle}
              sub={ui.evidenceSub}
            />

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
      </div>

      <aside className="case-rail" aria-label={ui.builtWith}>
        <div className="case-rail-card">
          <h2 className="case-rail-head" id="built-with-head">
            {ui.builtWith}
          </h2>
          <ul className="case-rail-stack" aria-labelledby="built-with-head">
            {project.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        {project.links.length > 0 && (
          <nav className="case-rail-links" aria-label={ui.links}>
            {project.links.map((l) => (
              <a
                key={l.href}
                className="btn btn-secondary case-rail-link"
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {l.label}
                <span className="visually-hidden">{newTabNote}</span>
              </a>
            ))}
          </nav>
        )}
      </aside>
    </div>
  );
}
