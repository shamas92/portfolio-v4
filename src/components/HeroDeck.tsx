/**
 * The hero deck: all six projects' photos, fanned at rest — the
 * reference's deck, now staying in the hero. It does not dock
 * onto the Work track on scroll (an earlier version pinned the
 * deck and cross-faded it into the track; that animation was
 * removed, and the track shows fully from the start). The deck
 * cards ARE the project cards: the same photo (LeaseLens, Sales
 * ETL, OratorPath, HITEC, Quality CRM, UpliftU), so the fan
 * reads as the work itself.
 *
 * The front card follows the active tab (page.tsx owns the state,
 * default LeaseLens): the deck re-fans with the active project in
 * front. The re-fan is a 600ms transform transition, enabled only
 * while the tab change settles (the .hero-deck--refan class).
 *
 * The mechanism:
 * - At rest the six cards are a fanned stack in the hero's
 *   right column (rotations -8° to +9°, each peeking at a
 *   different edge), like the reference's deck. The hero copy
 *   stays on the left. A photo reads by colour and composition
 *   at small sizes, so the fan works where six schematic
 *   mockups would not: the front card is fully visible, and the
 *   other five show a 20–45px strip each.
 * - On load the cards settle into their fanned positions (the
 *   taste-skill's entrance: one block settling from .98,
 *   staggered per card, about a second in total).
 * - On scroll the deck does nothing: it stays a static fan and
 *   scrolls away with the hero, at every width. Below 1024px
 *   the hero stacks and the deck is a compact six-card fan.
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

/** The deck. The outer .deck-card carries the fanned rest
 *  transform; the inner div carries the load entrance only, so
 *  the two never fight. Entrance delays step 60ms a card, after
 *  the hero text starts (240–540ms), so the whole entrance lands
 *  in about a second. Only the front card loads eagerly (and
 *  with high fetch priority); the other five are lazy. */
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
     then removed. Skipped on the first render. */
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
