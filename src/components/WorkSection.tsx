/**
 * The Work section: a horizontal scroll-driven track of the three
 * full projects, like the reference's "Selected work", plus a
 * compact row of the three compact projects below it. The track
 * moves left as the user scrolls vertically (desktop, 1024px and
 * up): a tall scroll range (.track-scroll, 200vh) holds a sticky
 * viewport, and the scroll listener in page.tsx drives --track-x
 * (0→1) across it. The deck docks onto the track's first card
 * before the horizontal movement starts (see page.tsx).
 *
 * The filter is gone: it dimmed cards in a grid where all six
 * were visible at once, which does not fit a horizontal track —
 * the cards pass one at a time, so dimming adds nothing, and
 * the reference has no filter. The filter strings left
 * content.ts / content.de.ts with it. The "View More Projects"
 * link stays, after the track, as the section's closing action.
 *
 * Track navigation (S4): a "Skip the track" link at the track
 * start jumps to #background; a mono counter top-right of the
 * sticky viewport ("2 / 3", written by the scroll listener in
 * page.tsx) and a 2px progress hairline under the viewport,
 * driven by --track-x, orient the visitor inside the track.
 * Both only render where the track is horizontal (desktop with
 * motion allowed); everywhere else the track is a vertical
 * stack and they would overlay the first card.
 *
 * Mobile (<1024px) and reduced motion: the track is a vertical
 * stack of the same cards (photo on top, text below), no sticky,
 * no horizontal translation — the cards are all visible in
 * normal flow. The track's opacity is the docking moment's
 * --track-reveal on desktop only; the default is 1, so the
 * track shows fully without JavaScript.
 */
"use client";

import { useEffect, useState } from "react";
import { useContent, useLocale } from "@/i18n/LocaleProvider";
import { Reveal } from "./Reveal";
import { CompactCard, TrackCard } from "./TrackCard";

export function WorkSection() {
  const content = useContent();
  const { locale } = useLocale();
  const projects = content.projects;
  const ui = content.ui.work;
  const newTabNote =
    locale === "de"
      ? " (öffnet in einem neuen Tab)"
      : " (opens in a new tab)";
  const fullProjects = projects.filter((p) => p.tier === "full");
  const compactProjects = projects.filter((p) => p.tier === "compact");
  /* The track chrome (counter + progress hairline) only exists
     where the track is horizontal: desktop with motion allowed.
     Everywhere else the track is a vertical stack, so the
     counter would overlay the first card. */
  const [showTrackChrome, setShowTrackChrome] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    );
    const update = () => setShowTrackChrome(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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
            {fullProjects.map((project) => (
              <TrackCard key={project.slug} project={project} />
            ))}
          </div>
          {showTrackChrome && (
            <>
              {/* S4: the track counter ("2 / 3") — its text is
                  written by the scroll listener in page.tsx. */}
              <p
                className="track-counter"
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "var(--space-3)",
                  right: "var(--space-3)",
                  zIndex: 5,
                  margin: 0,
                  fontFamily: "var(--font-mono)",
                  fontSize: "14px",
                  color: "var(--ink-muted)",
                }}
              >
                1 / {fullProjects.length}
              </p>
              {/* S4: the progress hairline under the track
                  viewport, driven by --track-x (written by
                  page.tsx). */}
              <div
                className="track-progress"
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 5,
                  height: "2px",
                  background: "var(--accent)",
                  transform: "scaleX(var(--track-x, 0))",
                  transformOrigin: "left center",
                }}
              />
            </>
          )}
        </div>
      </div>
      {/* M7: the compact tier — a row below the track. No photo,
          no stats slot, no proof line; title, one-liner, stack
          chips and a case-study link per card. */}
      {compactProjects.length > 0 && (
        <div
          className="compact-row"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "var(--space-3)",
            marginTop: "var(--space-3)",
          }}
        >
          {compactProjects.map((project) => (
            <CompactCard key={project.slug} project={project} />
          ))}
        </div>
      )}
      <Reveal>
        <p className="work-more">
          <a
            href="https://github.com/shamas92"
            target="_blank"
            rel="noopener noreferrer"
            className="work-more-link"
          >
            {ui.viewMore}
            <span className="work-more-arrow" aria-hidden="true">
              ↗
            </span>
            <span className="visually-hidden">{newTabNote}</span>
          </a>
        </p>
      </Reveal>
    </>
  );
}
