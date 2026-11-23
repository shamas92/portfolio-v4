"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { projects } from "@/data/projects";
import type { Project } from "@/data/projects";
import { background, site } from "@/data/site";

const plateFor: Record<string, string> = {
  leaselens: "/plates/specimen-leaselens.png",
  "sales-etl-pipeline": "/plates/specimen-etl.png",
  oratorpath: "/plates/specimen-orator.png",
  "quality-crm": "/plates/specimen-crm.png",
  upliftu: "/plates/specimen-uplift.png",
};

/** Short label names for the trays — the full title shows in the exam below. */
const shortTitle: Record<string, string> = {
  leaselens: "LeaseLens",
  "sales-etl-pipeline": "Sales ETL Pipeline",
  oratorpath: "OratorPath",
  "quality-crm": "Quality CRM",
  upliftu: "UpliftU",
};

/** The one measurement line on each tray label — verified facts only. */
const trayMeta: Record<string, string> = {
  leaselens: "86.1% IoU · SAM 3.1",
  "sales-etl-pipeline": "1 DAG · 3 tasks · 4 tables",
  oratorpath: "Peer-reviewed, 2025",
  "quality-crm": "Laravel · MySQL",
  upliftu: "Python · Hugging Face NLP",
};

/** One short line shown when a tray is selected. */
const trayLine: Record<string, string> = {
  leaselens: "Deposit claims checked against the lease and the law.",
  "sales-etl-pipeline": "Sales data, one trustworthy shape.",
  oratorpath: "Measured feedback for speakers.",
  "quality-crm": "One record for every defect.",
  upliftu: "Structured support for students.",
};

/** Full-size figure for the examination. LeaseLens shows the complete annotated
    exhibit; the other projects show their plate. */
const examFigure: Record<string, string> = {
  leaselens: "/plates/specimen-leaselens-exhibit.png",
  "sales-etl-pipeline": "/plates/specimen-etl.png",
  oratorpath: "/plates/specimen-orator.png",
  "quality-crm": "/plates/specimen-crm.png",
  upliftu: "/plates/specimen-uplift.png",
};

const figureCaption: Record<string, string> = {
  leaselens:
    "SAM 3.1 segmentation burn from the v7 demo pairing — the dorm photo itself. 86.1% registered IoU, measured live twice identically.",
  "sales-etl-pipeline":
    "Pipeline diagram: three tasks, four tables. Airflow TaskFlow, Parquet/MinIO staging, PostgreSQL.",
  "quality-crm":
    "Blank axes by design — no figures were measured for this project, so none are shown.",
  upliftu:
    "Blank axes by design — no figures were measured for this project, so none are shown.",
};

const skillGroups: { title: string; items: string[] }[] = [
  { title: "Languages", items: background.skills.languages },
  { title: "Data & BI", items: background.skills.dataAndBi },
  { title: "Frameworks & AI", items: background.skills.frameworksAndAi },
  { title: "Databases", items: background.skills.databases },
  { title: "Tools", items: background.skills.tools },
];

export default function Home() {
  const [selected, setSelected] = useState<Project>(projects[0]);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );

  function scrollToId(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    // Move focus with the viewport so the next Tab stays in the section.
    el.focus({ preventScroll: true });
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("failed");
      setTimeout(() => setCopyState("idle"), 3000);
    }
  }

  return (
    <>
      <main>
        {/* ============ The cabinet: one wall of drawers ============ */}
      <div className="cabinet" id="top">
        <header className="masthead">
          <div>
            <h1 className="brand-name">{site.name}</h1>
            <p className="brand-tag">
              I build data &amp; ML systems — and prove every claim on this
              page.
            </p>
          </div>
          <nav className="topnav" aria-label="Sections">
            <a href="#work" onClick={(e) => { e.preventDefault(); scrollToId("work"); }}>
              Work
            </a>
            <a href="#stack" onClick={(e) => { e.preventDefault(); scrollToId("stack"); }}>
              Stack
            </a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToId("contact"); }}>
              Contact
            </a>
            <button
              type="button"
              className="drawer-cta"
              onClick={() => {
                setSelected(projects[0]);
                scrollToId("work");
              }}
            >
              Examine the work
            </button>
          </nav>
        </header>

        <button
          type="button"
          className="drawer-front drawer-front-work"
          aria-label="Open the Work drawer"
          onClick={() => scrollToId("work")}
        >
          <span className="drawer-label">Work</span>
          <span className="brass-pull" aria-hidden="true" />
        </button>

        <div className="frame-side frame-left" aria-hidden="true" />
        <div className="frame-side frame-right" aria-hidden="true" />

        <div className="drawer-open" role="group" aria-label="Five projects, newest first">
          {projects.map((p) => (
            <button
              key={p.slug}
              type="button"
              className="tray"
              aria-pressed={selected.slug === p.slug}
              aria-label={`Examine ${p.title}`}
              onClick={() => setSelected(p)}
            >
              <span className="tray-specimen">
                <Image
                  src={plateFor[p.slug]}
                  alt={`${p.title} specimen`}
                  fill
                  sizes="(max-width: 1200px) 100vw, 35vw"
                  style={{
                    objectPosition:
                      p.slug === "leaselens" ? "center 75%" : "center",
                  }}
                />
              </span>
              <span className="tray-label">
                <span className="tray-title">
                  {shortTitle[p.slug]} {p.year}
                </span>
                <span className="tray-meta">{trayMeta[p.slug]}</span>
                <span className="tray-detail-line">{trayLine[p.slug]}</span>
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="drawer-front drawer-front-stack"
          aria-label="Open the Stack drawer"
          onClick={() => scrollToId("stack")}
        >
          <span className="drawer-label">Stack</span>
          <span className="brass-pull" aria-hidden="true" />
        </button>

        <div className="drawer-contact">
          <span className="drawer-tab" aria-hidden="true">
            Contact
          </span>
          <div className="contact-col">
            <p className="contact-title">Languages</p>
            <p>Python · TypeScript · SQL · C# · JavaScript · PHP</p>
          </div>
          <div className="contact-col">
            <p className="contact-title">Data / Analytics</p>
            <p>Pandas · NumPy · scikit-learn · Tableau · Excel</p>
          </div>
          <div className="contact-col">
            <p className="contact-title">Contact</p>
            <p>
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <br />
              <a
                href={site.github}
                target="_blank"
                rel="noreferrer"
              >
                github.com/shamas92
              </a>
              <br />
              <a
                href={site.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                linkedin.com/in/shamasrehman
              </a>
            </p>
          </div>
          <div className="contact-col">
            <p className="contact-title">Dresden</p>
            <p>Dresden, Germany</p>
          </div>
        </div>

        <button
          type="button"
          className="drawer-front drawer-front-background"
          aria-label="Open the Background drawer"
          onClick={() => scrollToId("background")}
        >
          <span className="drawer-label">Background</span>
          <span className="brass-pull" aria-hidden="true" />
        </button>
      </div>

      {/* ============ Examination: the selected tray, opened ============ */}
      <section
        className="section"
        id="work"
        aria-labelledby="work-head"
        tabIndex={-1}
      >
        <h2 className="section-head" id="work-head">
          Selected work
        </h2>
        <p className="section-sub">
          Five projects, chosen. Each tray holds its proof — a figure, a
          citation, or a diagram — and nothing it cannot prove. Pick a project
          here, or in the drawer above.
        </p>
        <ul className="exam-switcher" aria-label="Choose a project to examine">
          {projects.map((p) => (
            <li key={p.slug}>
              <button
                type="button"
                aria-pressed={selected.slug === p.slug}
                onClick={() => setSelected(p)}
              >
                {shortTitle[p.slug]} {p.year}
              </button>
            </li>
          ))}
        </ul>
        <div className="exam" aria-live="polite">
          {selected.specimen?.kind === "citation" ? (
            <div className="exam-citation">
              <p>“{selected.specimen.text}”</p>
              <cite>Peer-reviewed publication, 2025</cite>
            </div>
          ) : (
            <figure className="exam-figure">
              <Image
                src={examFigure[selected.slug]}
                alt={`${selected.title} specimen, full size`}
                width={740}
                height={640}
              />
              <figcaption>{figureCaption[selected.slug]}</figcaption>
            </figure>
          )}
          <div className="exam-body">
            <h3>
              {selected.title}
              <span>{selected.year}</span>
            </h3>
            {selected.figure && (
              <>
                <p className="exam-figure-line">{selected.figure.value}</p>
                <p className="exam-figure-label">{selected.figure.label}</p>
              </>
            )}
            <div className="exam-block">
              <h4>Problem</h4>
              <p>{selected.problem}</p>
            </div>
            <div className="exam-block">
              <h4>Architecture</h4>
              <p>{selected.architecture}</p>
            </div>
            <div className="exam-block">
              <h4>Outcome</h4>
              <p>{selected.outcome}</p>
            </div>
            {selected.specimen?.kind === "quote" && (
              <blockquote className="exam-quote">
                <p>“{selected.specimen.text}”</p>
                <cite>
                  Verified verbatim excerpt from the dorm lease. German
                  deposit cap: 3× monthly cold rent (BGB §551).
                </cite>
              </blockquote>
            )}
            <ul className="tech-tags">
              {selected.tech.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            {selected.links.length > 0 && (
              <div className="doors">
                {selected.links.map((l) => (
                  <a
                    key={l.href}
                    className="door"
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {l.label}
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <hr className="section-rule" />

      {/* ============ Stack ============ */}
      <section
        className="section"
        id="stack"
        aria-labelledby="stack-head"
        tabIndex={-1}
      >
        <h2 className="section-head" id="stack-head">
          Technical stack
        </h2>
        <p className="section-sub">
          The tools behind the trays — grouped, no percentages, no bars.
        </p>
        <div className="skill-groups">
          {skillGroups.map((g) => (
            <div className="skill-group" key={g.title}>
              <h3>{g.title}</h3>
              <ul>
                {g.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <hr className="section-rule" />

      {/* ============ Background ============ */}
      <section
        className="section"
        id="background"
        aria-labelledby="background-head"
        tabIndex={-1}
      >
        <h2 className="section-head" id="background-head">
          Background
        </h2>
        <p className="section-sub">
          {site.claim} Education and work, newest first.
        </p>
        <div className="timeline">
          {background.education.map((e) => (
            <div className="timeline-row" key={e.degree}>
              <p className="timeline-when">{e.period}</p>
              <div className="timeline-what">
                <h3>
                  {e.degree} — {e.school}
                </h3>
                <p>{e.note}</p>
              </div>
            </div>
          ))}
          {background.experience.map((x) => (
            <div className="timeline-row" key={x.role + x.org}>
              <p className="timeline-when">{x.period}</p>
              <div className="timeline-what">
                <h3>
                  {x.role} — {x.org}
                </h3>
                <p>{x.note}</p>
              </div>
            </div>
          ))}
          <div className="timeline-row">
            <p className="timeline-when">Languages</p>
            <div className="timeline-what">
              <h3>Languages</h3>
              <p>
                {background.languages
                  .map((l) => `${l.language} — ${l.level}`)
                  .join(" · ")}
              </p>
            </div>
          </div>
        </div>
        <ul className="cert-list">
          {background.certifications.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>

    </main>
    {/* ============ Footer / contact ============ */}
    <footer className="footer" id="contact" tabIndex={-1}>
      <div className="footer-inner">
        <div>
          <a className="footer-email" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </div>
        <div className="footer-links">
          <a href={site.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={site.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <button type="button" className="copy-btn" onClick={copyEmail}>
            {copyState === "copied" ? (
              <>
                <Check
                  aria-hidden="true"
                  style={{ width: 14, height: 14, verticalAlign: -2 }}
                />{" "}
                Copied
              </>
            ) : copyState === "failed" ? (
              <>Copy failed — use the email link</>
            ) : (
              <>
                <Copy
                  aria-hidden="true"
                  style={{ width: 14, height: 14, verticalAlign: -2 }}
                />{" "}
                Copy email
              </>
            )}
          </button>
        </div>
        <p className="footer-note">
          Designed as a specimen cabinet. Every claim on this page is
          verified; anything unverified carries no figure.
        </p>
      </div>
    </footer>
    </>
  );
}
