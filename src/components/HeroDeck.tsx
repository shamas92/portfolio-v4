/**
 * The hero deck: all six projects' photos, fanned at rest, that
 * unstack on scroll and dock onto the Work track — the reference's
 * trick, now that the track is the destination. The deck cards ARE
 * the project cards: the same photo (LeaseLens, Sales ETL,
 * OratorPath, HITEC, Quality CRM, UpliftU), so the fan-out lands
 * without a bait-and-switch.
 *
 * The front card follows the active tab (page.tsx owns the state,
 * default LeaseLens): the deck re-fans with the active project in
 * front. The re-fan is a 600ms transform transition, enabled only
 * while the tab change settles (the .hero-deck--refan class), so
 * it never fights the scroll-driven docking transform, which
 * stays immediate. The deck cards keep their data-project slug,
 * so the docking measurement in page.tsx pairs each card with
 * its track photo by slug, not by position — a different front
 * card does not break the dock.
 *
 * The mechanism (see page.tsx, which drives it):
 * - At rest the six cards are a fanned stack in the hero's
 *   right column (rotations -8° to +9°, each peeking at a
 *   different edge), like the reference's deck. The hero copy
 *   stays on the left. A photo reads by colour and composition
 *   at small sizes, so the fan works where six schematic
 *   mockups would not: the front card is fully visible, and the
 *   other five show a 20–45px strip each. The full photo shows
 *   as the cards separate on scroll.
 * - On load the cards settle into their fanned positions (the
 *   taste-skill's entrance: one block settling from .98,
 *   staggered per card, about a second in total).
 * - On scroll (desktop, 1024px and up) the deck pins in the
 *   viewport — the lag equals the scroll distance, capped at the
 *   docking offset — while the Work track scrolls up to meet it.
 *   The cards unstack, rotate toward upright and grow to the
 *   track photos' size, and their horizontal spread is weighted
 *   late, so they stay fanned while the hero text is still
 *   visible and sweep across only once it has left. At the
 *   docking offset each card sits exactly over its own track
 *   card's photo, and the deck cross-fades into the track
 *   (--deck-fade 1→0, --track-reveal 0→1). The effect reverses
 *   on scroll-up. Everything is transform/opacity only, and the
 *   scroll value is damped toward its target (page.tsx), so the
 *   motion settles instead of stepping with the wheel.
 * - Below 1024px there is no docking: the hero stacks, the
 *   deck stays a compact six-card fan and scrolls away with the
 *   hero, and the track shows as a vertical stack. A six-card
 *   fan cannot dock onto a horizontal track in a compact scroll
 *   range, so the mobile deck keeps the fan-and-away behaviour.
 * - The docking geometry (offsets, scale, docking scroll) is
 *   measured at runtime from the real layout (page.tsx), so it
 *   holds across widths and locales; the CSS values here are
 *   the rest fan and the no-JS fallback spread.
 *
 * The deck is decorative: aria-hidden, pointer-events none, so
 * it never takes focus, never announces itself, and never blocks
 * a click. The tabs and the caption below it carry the active
 * project's name and summary, so nothing is lost. Under
 * prefers-reduced-motion (and without JavaScript) it sits at its
 * rest fanned state and does not move, and the track shows fully.
 */
import { useEffect, useRef, useState } from "react";
import { ProjectPhoto } from "./ProjectPhoto";

const SLUGS = [
  "leaselens",
  "sales-etl-pipeline",
  "oratorpath",
  "hitec-cms",
  "quality-crm",
  "upliftu",
] as const;

const KINDS = ["a", "b", "c", "d", "e", "f"] as const;

/** The deck. The outer .deck-card carries the scroll transform
 *  (fanned rest → docked on the track, via --deck-progress and
 *  --deck-x); the inner div carries the load entrance only, so
 *  the two never fight. Entrance delays step 60ms a card, after
 *  the hero text starts (240–540ms), so the whole entrance lands
 *  in about a second. data-project pairs each deck card with its
 *  track photo for the measurement in page.tsx. */
export function HeroDeck({ activeSlug }: { activeSlug: string }) {
  /* Display order: the active project first, the rest in their
     canonical order. The kind (a–f) follows the display order,
     so the active card takes the front rest position. */
  const ordered = [
    activeSlug,
    ...SLUGS.filter((s) => s !== activeSlug),
  ];
  /* Re-fan transition: enabled for 650ms after the active tab
     changes, so the cards glide to their new rest positions,
     then removed so the scroll-driven transform stays
     immediate. Skipped on the first render. */
  const [refanning, setRefanning] = useState(false);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setRefanning(true);
    const t = setTimeout(() => setRefanning(false), 650);
    return () => clearTimeout(t);
  }, [activeSlug]);

  return (
    <div
      className={`hero-deck${refanning ? " hero-deck--refan" : ""}`}
      aria-hidden="true"
    >
      {ordered.map((slug, i) => (
        <div
          key={slug}
          className={`deck-card deck-card--${KINDS[i]}`}
          data-project={slug}
        >
          <div
            className="deck-card-inner"
            style={
              {
                "--entrance-delay": `${240 + i * 60}ms`,
              } as React.CSSProperties
            }
          >
            <ProjectPhoto slug={slug} eager />
          </div>
        </div>
      ))}
    </div>
  );
}
