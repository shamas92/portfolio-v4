/**
 * The Work section: a horizontal scroll-driven track of the six
 * projects, like the reference's "Selected work". The track moves
 * left as the user scrolls vertically (desktop, 1024px and up):
 * a tall scroll range (.track-scroll, 320vh) holds a sticky
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
 * Mobile (<1024px) and reduced motion: the track is a vertical
 * stack of the same cards (photo on top, text below), no sticky,
 * no horizontal translation — the cards are all visible in
 * normal flow. The track's opacity is the docking moment's
 * --track-reveal on desktop only; the default is 1, so the
 * track shows fully without JavaScript.
 */
"use client";

import { useContent } from "@/i18n/LocaleProvider";
import { Reveal } from "./Reveal";
import { TrackCard } from "./TrackCard";

export function WorkSection() {
  const content = useContent();
  const projects = content.projects;
  const ui = content.ui.work;

  return (
    <>
      <div className="track-scroll">
        <div className="track-viewport">
          <div className="track">
            {projects.map((project) => (
              <TrackCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </div>
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
          </a>
        </p>
      </Reveal>
    </>
  );
}
