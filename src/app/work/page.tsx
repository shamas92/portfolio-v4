/**
 * The /work index: every project in one place — the four
 * featured in the track and the two earlier ones — as full-width
 * numbered rows (Aahil model): "01 / 2026 — Title — one-liner —
 * circled →", with year + type + stack chips. The whole row is
 * one link to the case page, so the row fills the 1296px
 * container instead of stopping halfway (audit S4). The track's
 * lime end card ("All 6 projects") links here, and the GitHub
 * link that used to close the Work section lives here instead.
 *
 * A client component, like the home page: the strings come
 * from useContent(), so a stored German choice applies after
 * hydration (the server always renders English first). It
 * inherits the layout's default metadata, also like the home
 * page — a client component cannot export its own.
 */
"use client";

import Link from "next/link";
import { format, useContent, useLocale } from "@/i18n/LocaleProvider";

export default function WorkIndexPage() {
  const content = useContent();
  const { locale } = useLocale();
  const ui = content.ui.workIndex;
  const newTabNote =
    locale === "de"
      ? " (öffnet in einem neuen Tab)"
      : " (opens in a new tab)";
  const count = String(content.projects.length).padStart(2, "0");

  return (
    <div className="page">
      <p>
        <Link href="/" className="case-back">
          <span aria-hidden="true">←</span> {ui.back}
        </Link>
      </p>
      <p className="section-kicker">
        <span className="section-number">{ui.kickerNumber}</span>{" "}
        {format(ui.kickerText, { count })}
      </p>
      <hr className="section-rule" aria-hidden="true" />
      <h1 className="section-head">{ui.heading}</h1>
      <p className="section-intro">{ui.intro}</p>
      <ul className="work-index-list">
        {content.projects.map((project, index) => (
          <li
            key={project.slug}
            className="work-index-item"
            data-slug={project.slug}
          >
            <Link
              href={`/work/${project.slug}`}
              className="work-index-row"
            >
              <span className="work-index-num" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="work-index-main">
                <span className="work-index-meta">
                  {project.year} · {project.category}
                </span>
                <span className="work-index-title">
                  {project.shortTitle ?? project.title}
                </span>
                <span className="work-index-summary">
                  {project.rowOutcome}
                </span>
                <ul className="work-index-stack">
                  {project.stack.slice(0, 5).map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
              <span className="work-index-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="work-more">
        <a
          href={content.profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="work-more-link"
        >
          {content.ui.work.viewMore}
          <span className="work-more-arrow" aria-hidden="true">
            ↗
          </span>
          <span className="visually-hidden">{newTabNote}</span>
        </a>
      </p>
    </div>
  );
}
