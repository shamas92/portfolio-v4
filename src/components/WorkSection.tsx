/**
 * The Work section: a horizontal scroll-driven track of the four
 * full projects, like the reference's "Selected work", plus a
 * compact "Earlier work" list of the two earlier projects
 * below it. The track opens with the section intro as its first
 * panel (strong heading + concise supporting line), so the
 * first card follows promptly with no blank lead-in. The track
 * moves left as the user scrolls vertically (desktop, 1024px
 * and up): a tall scroll range (.track-scroll, 220vh) holds a
 * sticky viewport, and the scroll listener in page.tsx drives
 * --track-x (0→1) across it. The deck stays in the hero and
 * does not dock onto the track; the track shows fully from the
 * start.
 *
 * The filter is gone: it dimmed cards in a grid where all six
 * were visible at once, which does not fit a horizontal track —
 * the cards pass one at a time, so dimming adds nothing, and
 * the reference has no filter. The filter strings left
 * content.ts / content.de.ts with it. The track closes with a
 * lime end card ("All 6 projects", the reference's "All 8
 * projects" end card adapted to the portfolio's six projects),
 * a whole-card link to the /work index — that replaces the
 * "More on GitHub" link, which now lives on the /work page.
 *
 * Track navigation (S4): a "Skip the track" link at the track
 * start jumps to #background. The reference has no counter and
 * no progress hairline, so the track carries neither — the
 * scroll-driven movement itself shows the position.
 *
 * Mobile (<1024px) and reduced motion: the track is a vertical
 * stack of the same cards (photo on top, text below), no sticky,
 * no horizontal translation — the cards are all visible in
 * normal flow, the end card last.
 *
 * Earlier work: a ruled list, not cards — year and role, the
 * title (a link to the case page, stretched over the row), the
 * one-liner and the stack chips. No photo, no stats slot, no
 * proof line. The heading comes from content.ts
 * (ui.work.earlierHeading).
 */
"use client";

import Link from "next/link";
import { useContent } from "@/i18n/LocaleProvider";
import { TrackCard, cardTitle } from "./TrackCard";

export function WorkSection() {
  const content = useContent();
  const projects = content.projects;
  const ui = content.ui.work;
  const earlierWorkHeading = ui.earlierHeading;
  const fullProjects = projects.filter((p) => p.tier === "full");
  const compactProjects = projects.filter((p) => p.tier === "compact");

  return (
    <>
      {/* S4: skip the track — at the track start, jumps to
          #background. A text link, 44px target. */}
      <a
        href="#background"
        className="track-skip"
        style={{
          display: "flex",
          alignItems: "center",
          width: "fit-content",
          minHeight: "44px",
          margin: "0 0 var(--space-3)",
          fontWeight: 600,
          color: "var(--accent-ink)",
          textDecoration: "none",
        }}
      >
        Skip the track <span aria-hidden="true">↓</span>
      </a>
      <div className="track-scroll">
        <div className="track-viewport">
          <div className="track">
            {/* The section intro as the track's first panel (the
                reference's "Selected work" text panel): the
                strong heading and the concise supporting line.
                It sits at the start of the track, so the first
                card follows promptly with no blank lead-in. On
                the vertical stack (mobile / reduced motion) it
                reads as the section header above the cards. */}
            <div className="track-intro">
              <h2 className="section-head" id="work-head">
                {ui.heading}
              </h2>
              <p className="section-intro">{ui.intro}</p>
            </div>
            {fullProjects.map((project) => (
              <TrackCard key={project.slug} project={project} />
            ))}
            {/* The end card: a lime "All 6 projects" card, the
                reference's "All 8 projects" end card adapted to
                the portfolio's six projects — a whole-card link
                to the /work index. It is NOT a .track-card. */}
            <Link href="/work" className="track-end-card">
              <span className="track-end-title">{ui.allProjects}</span>
              <span className="track-end-circle" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
      {/* Earlier work: the compact tier as a ruled list below the
          track. No photo, no stats slot, no proof line; year and
          role, the title (linked, stretched over the row), the
          one-liner and the stack chips per row. */}
      {compactProjects.length > 0 && (
        <div className="earlier-work">
          <h3 className="earlier-work-heading">{earlierWorkHeading}</h3>
          <ul className="earlier-work-list">
            {compactProjects.map((project) => (
              <li
                key={project.slug}
                className="earlier-work-item"
                data-slug={project.slug}
              >
                <p className="track-meta">
                  {project.year} · {project.role}
                </p>
                <h4 className="earlier-work-title">
                  <Link
                    href={`/work/${project.slug}`}
                    className="earlier-work-link"
                  >
                    {cardTitle(project)}
                  </Link>
                </h4>
                <p className="earlier-work-summary">{project.rowOutcome}</p>
                <ul className="track-stack">
                  {project.stack.slice(0, 5).map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
