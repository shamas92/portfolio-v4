/**
 * The hero deck: all six projects' photos, fanned at rest, that
 * unstack on scroll and dock onto the Work grid — both rows, the
 * reference's trick, now that the grid is the destination. The
 * deck cards ARE the project cards: the same photo (LeaseLens,
 * Sales ETL, OratorPath, HITEC, Quality CRM, UpliftU), so the
 * fan-out lands without a bait-and-switch.
 *
 * The mechanism (see page.tsx, which drives it):
 * - At rest the six cards are a fanned stack in the hero's
 *   right column (rotations -8° to +9°, each peeking at a
 *   different edge), like the reference's deck. The hero copy
 *   stays on the left, every word unchanged. A photo reads by
 *   colour and composition at small sizes, so the fan works
 *   where six schematic mockups would not: the front card
 *   (LeaseLens) is fully visible, and the other five show a
 *   20–45px strip each — neon rain, dark steel, stage amber,
 *   bright office, warm workshop, bright campus — distinct
 *   enough to tell apart, not to read in detail. The full
 *   photo shows as the cards separate on scroll.
 * - On load the cards settle into their fanned positions (the
 *   taste-skill's entrance: one block settling from .98,
 *   staggered per card, about a second in total).
 * - On scroll (desktop, 1024px and up) the deck pins in the
 *   viewport — the lag equals the scroll distance, capped at the
 *   docking offset — while the Work grid scrolls up to meet it.
 *   The cards unstack, rotate toward upright and grow to the
 *   grid's card width, and their horizontal spread is weighted
 *   late, so they stay fanned while the hero text is still
 *   visible and sweep across only once it has left. Row 2's
 *   cards travel down to the second row as well (their --sy is
 *   measured from their own grid visuals, like --sx). At the
 *   docking offset each card sits exactly over its grid card's
 *   visual, and the deck cross-fades into the grid
 *   (--deck-fade 1→0, --grid-reveal 0→1). The effect reverses
 *   on scroll-up. Everything is transform/opacity only, and the
 *   scroll value is damped toward its target (page.tsx), so the
 *   motion settles instead of stepping with the wheel.
 * - Below 1024px there is no docking: the hero stacks, the
 *   deck stays a compact six-card fan and scrolls away with the
 *   hero (a six-card vertical fan-out would run ~700px long and
 *   slide over the grid), and the grid shows fully. A six-card
 *   fan cannot dock onto a one-column grid in a compact scroll
 *   range, so the mobile deck keeps the previous round's
 *   fan-and-away behaviour, tightened to one stack.
 * - The docking geometry (offsets, scale, docking scroll) is
 *   measured at runtime from the real layout (page.tsx), so it
 *   holds across widths and locales; the CSS values here are
 *   the rest fan and the no-JS fallback spread.
 *
 * The deck is decorative: aria-hidden, pointer-events none, so
 * it never takes focus, never announces itself, and never blocks
 * a click on the Work section it overlaps. Under
 * prefers-reduced-motion (and without JavaScript) it sits at its
 * rest fanned state and does not move, and the grid shows fully.
 */
import { ProjectPhoto } from "./ProjectPhoto";

const CARDS = [
  { id: "leaselens", kind: "a" },
  { id: "sales-etl-pipeline", kind: "b" },
  { id: "oratorpath", kind: "c" },
  { id: "hitec-cms", kind: "d" },
  { id: "quality-crm", kind: "e" },
  { id: "upliftu", kind: "f" },
] as const;

/** The deck. The outer .deck-card carries the scroll transform
 *  (fanned rest → docked on the grid, via --deck-progress and
 *  --deck-x); the inner div carries the load entrance only, so
 *  the two never fight. Entrance delays step 60ms a card, after
 *  the hero text starts (240–540ms), so the whole entrance lands
 *  in about a second. data-project pairs each deck card with its
 *  grid card for the measurement in page.tsx. */
export function HeroDeck() {
  return (
    <div className="hero-deck" aria-hidden="true">
      {CARDS.map((card, i) => (
        <div
          key={card.id}
          className={`deck-card deck-card--${card.kind}`}
          data-project={card.id}
        >
          <div
            className="deck-card-inner"
            style={
              {
                "--entrance-delay": `${240 + i * 60}ms`,
              } as React.CSSProperties
            }
          >
            <ProjectPhoto slug={card.id} eager />
          </div>
        </div>
      ))}
    </div>
  );
}
