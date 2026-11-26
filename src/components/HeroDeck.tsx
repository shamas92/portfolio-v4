/**
 * The hero deck: the four most important projects' photos,
 * fanned at rest — the reference's deck, now staying in the
 * hero. It does not dock onto the Work track on scroll (an
 * earlier version pinned the deck and cross-faded it into the
 * track; that animation was removed, and the track shows fully
 * from the start). The deck cards ARE the project cards: the
 * same photo (LeaseLens, Sales ETL, OratorPath, HITEC), so the
 * fan reads as the work itself.
 *
 * The front card follows the active tab (page.tsx owns the state,
 * default LeaseLens): the deck re-fans with the active project in
 * front. The re-fan is a 300ms transform + filter transition,
 * enabled only while the tab change settles (the .hero-deck--refan
 * class) — the reference's card-change motion, measured: the
 * main motion lands in ~300ms, ease-out, no overshoot, all four
 * cards moving to their new slots at once.
 *
 * The mechanism (the reference's geometry, measured):
 * - Four cards, 489 × 336 (16/11), radius 18px, origin
 *   bottom-left, in a 581 × 408 wrapper with 72px top / 92px
 *   right padding — room for the fan to peek up-right.
 * - The fan spreads up-right only, one slot per card: front
 *   (0,0) rotate −2° scale 1 brightness 1; then each deeper
 *   card +30px right, −24px up, +3.5° rotation, −0.06 scale,
 *   −0.12 brightness.
 * - On load the cards settle into their fanned positions (the
 *   taste-skill's entrance: one block settling from .98,
 *   staggered per card, about a second in total).
 * - On scroll the deck does nothing: it stays a static fan and
 *   scrolls away with the hero, at every width. Below 1024px
 *   the hero stacks and the deck scales down (same fan, smaller
 *   cards) and scrolls away with the hero.
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
] as const;

const KINDS = ["a", "b", "c", "d"] as const;

/** The deck. The outer .deck-card carries the fanned rest
 *  transform; the inner div carries the load entrance only, so
 *  the two never fight. Entrance delays step 60ms a card, after
 *  the hero text starts (240–420ms), so the whole entrance lands
 *  in about a second. Only the front card loads eagerly (and
 *  with high fetch priority); the other three are lazy. */
export function HeroDeck({ activeSlug }: { activeSlug: string }) {
  /* Display order: the active project first, the rest in their
     canonical order. The kind (a–d) follows the display order,
     so the active card takes the front rest position. Guarded:
     an unknown slug falls back to the first project, so the
     deck never renders a card it has no photo for. */
  const safeSlug = (SLUGS as readonly string[]).includes(activeSlug)
    ? activeSlug
    : SLUGS[0];
  const ordered = [
    safeSlug,
    ...SLUGS.filter((s) => s !== safeSlug),
  ];
  /* Re-fan transition: enabled for 350ms after the active tab
     changes (a 300ms transition plus a small buffer), so the
     cards glide to their new rest positions, then removed.
     Skipped on the first render. */
  const [refanning, setRefanning] = useState(false);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setRefanning(true);
    const t = setTimeout(() => setRefanning(false), 350);
    return () => clearTimeout(t);
  }, [activeSlug]);

  return (
    <div
      className={`hero-deck${refanning ? " hero-deck--refan" : ""}`}
      aria-hidden="true"
    >
      {ordered.map((slug, i) => (
        <div key={slug} className={`deck-card deck-card--${KINDS[i]}`}>
          <div
            className="deck-card-inner"
            style={
              {
                "--entrance-delay": `${240 + i * 60}ms`,
              } as React.CSSProperties
            }
          >
            <ProjectPhoto
              slug={slug}
              variant="deck"
              eager={i === 0}
              fetchPriority={i === 0 ? "high" : undefined}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
