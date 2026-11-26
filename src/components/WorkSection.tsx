/**
 * The Work section: a horizontal scroll-driven track of the four
 * full projects, like the reference's "Selected work". The track
 * opens with the section intro as its first panel (strong
 * heading + concise supporting line), so the first card follows
 * promptly with no blank lead-in. The track moves left as the
 * user scrolls vertically (desktop, 1024px and up): a tall
 * scroll range (.track-scroll) holds a sticky viewport, and the
 * scroll listener in page.tsx drives --track-x (0→1) across it.
 * The deck stays in the hero and does not dock onto the track;
 * the track shows fully from the start. The earlier projects
 * are NOT listed here — they live on the /work index, linked
 * from the track's lime end card ("All 6 projects").
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
 * start jumps to #background. The reference has no counter, but
 * it does have a green progress line below the section — a 3px
 * lime fill, full width, no rail, no label — that grows
 * left-to-right as the track scrolls, so the track carries
 * one (the .track-progress element in the viewport).
 *
 * Mobile (<1024px) and reduced motion: the track is a vertical
 * stack of the same cards (photo on top, text below), no sticky,
 * no horizontal translation — the cards are all visible in
 * normal flow, the end card last.
 */
"use client";

import Link from "next/link";
import { useContent } from "@/i18n/LocaleProvider";
import { TrackCard } from "./TrackCard";

export function WorkSection() {
  const content = useContent();
  const projects = content.projects;
  const ui = content.ui.work;
  const fullProjects = projects.filter((p) => p.tier === "full");

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
          {/* The green progress line, the reference's: a 3px lime
              fill, full width, no rail, no label, 111px below
              the track cards, growing left-to-right with
              --track-x (0 at the first card, 1 at the last).
              It sits inside the viewport (after the track, so
              it does not move horizontally) and is only shown
              in the desktop track context — hidden below 1024px
              and under reduced motion, where the track is a
              vertical stack. Decorative (aria-hidden). */}
          <div className="track-progress" aria-hidden="true" />
        </div>
      </div>
    </>
  );
}
