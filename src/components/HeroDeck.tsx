/**
 * The hero deck: the three deck projects' real mockups, fanned
 * at rest, that unstack on scroll and dock onto the Work grid's
 * first row — the reference's trick, now that the grid is the
 * destination. The deck cards ARE the row-1 project cards: the
 * same SVG visuals (LeaseLens, Sales ETL, OratorPath), so the
 * fan-out lands without a bait-and-switch.
 *
 * The mechanism (see page.tsx, which drives it):
 * - At rest the three cards are a fanned stack in the hero's
 *   right column (rotations roughly -5° to +7°, each peeking at
 *   a different edge), like the reference's deck. The hero copy
 *   stays on the left, every word unchanged.
 * - On load the cards settle into their fanned positions (the
 *   taste-skill's entrance: one block settling from .98,
 *   staggered per card, about a second in total).
 * - On scroll (desktop, 1024px and up) the deck pins in the
 *   viewport — the lag equals the scroll distance, capped at the
 *   docking offset — while the Work grid scrolls up to meet it.
 *   The cards separate, rotate toward upright and grow to the
 *   grid's card width, and their horizontal spread is weighted
 *   late, so they stay fanned while the hero text is still
 *   visible and sweep across only once it has left. At the
 *   docking offset each card sits exactly over its grid card's
 *   visual, and the deck cross-fades into the grid
 *   (--deck-fade 1→0, --grid-reveal 0→1). The effect reverses
 *   on scroll-up. Everything is transform/opacity only.
 * - Below 1024px there is no docking: the hero stacks, the
 *   deck fans downward in a vertical stack and scrolls away,
 *   and the grid reveals with the site's Reveal. A three-card
 *   fan cannot dock onto a one-column grid in a compact scroll
 *   range, so the mobile deck keeps the previous round's
 *   fan-and-away behaviour.
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
import { LeaseLensAsset, EtlAsset, OratorPathAsset } from "./SpecAssets";

const CARDS = [
  { id: "leaselens", kind: "a", render: LeaseLensAsset },
  { id: "sales-etl-pipeline", kind: "b", render: EtlAsset },
  { id: "oratorpath", kind: "c", render: OratorPathAsset },
] as const;

/** The deck. The outer .deck-card carries the scroll transform
 *  (fanned rest → docked on the grid, via --deck-progress and
 *  --deck-x); the inner div carries the load entrance only, so
 *  the two never fight. Entrance delays step 80ms a card, after
 *  the hero text starts (240–400ms), so the whole entrance lands
 *  in about a second. data-project pairs each deck card with its
 *  grid card for the measurement in page.tsx. */
export function HeroDeck() {
  return (
    <div className="hero-deck" aria-hidden="true">
      {CARDS.map((card, i) => {
        const Mockup = card.render;
        return (
          <div
            key={card.id}
            className={`deck-card deck-card--${card.kind}`}
            data-project={card.id}
          >
            <div
              className="deck-card-inner"
              style={
                {
                  "--entrance-delay": `${240 + i * 80}ms`,
                } as React.CSSProperties
              }
            >
              <Mockup />
            </div>
          </div>
        );
      })}
    </div>
  );
}
