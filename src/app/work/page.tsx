/**
 * The /work index: every project in one place — the four
 * featured in the track and the two earlier ones — as a ruled
 * list in the site's own voice (the Earlier work list's rows:
 * year and role, the title linked to the case page, the
 * one-liner and the stack chips). The track's lime end card
 * ("All 6 projects") links here, and the GitHub link that used
 * to close the Work section lives here instead.
 *
 * A client component, like the home page: the strings come
 * from useContent(), so a stored German choice applies after
 * hydration (the server always renders English first). It
 * inherits the layout's default metadata, also like the home
 * page — a client component cannot export its own.
 */
"use client";

import Link from "next/link";
import { useContent, useLocale } from "@/i18n/LocaleProvider";

export default function WorkIndexPage() {
  const content = useContent();
  const { locale } = useLocale();
  const ui = content.ui.workIndex;
  const newTabNote =
    locale === "de"
      ? " (öffnet in einem neuen Tab)"
      : " (opens in a new tab)";

  return (
    <div className="page">
      <p>
        <Link href="/" className="case-back">
          <span aria-hidden="true">←</span> {ui.back}
        </Link>
      </p>
      <h1 className="section-head">{ui.heading}</h1>
      <p className="section-intro">{ui.intro}</p>
      <ul className="earlier-work-list">
        {content.projects.map((project) => (
          <li
            key={project.slug}
            className="earlier-work-item"
            data-slug={project.slug}
          >
            <p className="track-meta">
              {project.year} · {project.role}
            </p>
            <h2 className="earlier-work-title">
              <Link
                href={`/work/${project.slug}`}
                className="earlier-work-link"
              >
                {project.shortTitle ?? project.title}
              </Link>
            </h2>
            <p className="earlier-work-summary">{project.rowOutcome}</p>
            <ul className="track-stack">
              {project.stack.slice(0, 5).map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
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
