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
 * front. The re-fan is a JS rAF lerp, not a CSS transition — the
 * reference's own implementation interpolates the cards' inline
 * transform/filter with requestAnimationFrame: the main motion
 * lands in ~300ms, ease-out, no overshoot, all four cards moving
 * to their new slots at once, with a long gentle tail settling
 * by ~800ms. A CSS transition would lag behind the lerp and
 * fight it, so there is none on the cards (see globals.css).
 *
 * The mechanism (the reference's geometry, measured):
 * - Four cards, 489 × 336 (16/11), radius 18px, origin
 *   bottom-left, in a 581 × 408 wrapper with 72px top / 92px
 *   right padding — room for the fan to peek up-right.
 * - The fan spreads up-right only, one slot per card: front
 *   (0,0) rotate −2° scale 1 brightness 1; then each deeper
 *   card +30px right, −24px up, +3.5° rotation, −0.06 scale,
 *   −0.12 brightness.
 * - Every card is always visible: the lerp only ever changes a
 *   card's translate/rotate/scale/brightness, never its opacity
 *   and never unmounts it. The newly selected card glides
 *   smoothly from its back slot to the front, and the outgoing
 *   front card glides smoothly to the back — a continuous
 *   rotation, no card fading out or disappearing even briefly.
 * - Rapid tab changes re-target the lerp from the cards'
 *   current interpolated positions (no jump, no snap).
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
import { useEffect, useMemo, useRef, useState } from "react";
import { ProjectPhoto } from "./ProjectPhoto";

const SLUGS = [
  "leaselens",
  "sales-etl-pipeline",
  "oratorpath",
  "hitec-cms",
] as const;

const KINDS = ["a", "b", "c", "d"] as const;

/** The reference's four fan slots, at --deck-scale 1. x/y in px,
 *  rot in degrees, sc the card's own scale, br its brightness. */
const SLOTS = [
  { x: 0, y: 0, rot: -2, sc: 1, br: 1 },
  { x: 34, y: -26, rot: 2.5, sc: 0.94, br: 0.88 },
  { x: 64, y: -50, rot: 6, sc: 0.88, br: 0.76 },
  { x: 90, y: -70, rot: 9.5, sc: 0.82, br: 0.64 },
] as const;

type CardState = { x: number; y: number; rot: number; sc: number; br: number };

/** Exponential time constant for the lerp. The fraction still
 *  to travel after t ms is exp(-t/tau): with tau = 100ms the
 *  cards reach ~95% of their new slot in ~300ms and are
 *  effectively settled by ~800ms — the reference's profile
 *  (fast initial motion, long gentle tail, monotonic, no
 *  overshoot). Because the lerp is exponential, a mid-flight
 *  re-target simply bends toward the new target from wherever
 *  the card is; nothing jumps. */
const TAU_MS = 100;
/** Settle thresholds: once every value is within these of its
 *  target, snap to the exact target and stop the loop. The snap
 *  is sub-pixel and imperceptible. */
const EPS_XY = 0.5;
const EPS_ROT = 0.05;
const EPS_SB = 0.002;
/** Safety: never lerp longer than this, even if frames stall. */
const MAX_LERP_MS = 2000;

const fmt = (n: number) => +n.toFixed(3);

/** The deck. The outer .deck-card carries the fanned position
 *  (written inline by the lerp, so it overrides the kind
 *  classes' rest transform — the classes still set z-index and
 *  are the no-JavaScript rest state); the inner div carries the
 *  load entrance only, so the two never fight. Entrance delays
 *  step 60ms a card, after the hero text starts (240–420ms), so
 *  the whole entrance lands in about a second. Only the front
 *  card loads eagerly (and with high fetch priority); the other
 *  three are lazy. */
export function HeroDeck({ activeSlug }: { activeSlug: string }) {
  /* Display order: the active project first, the rest in their
     canonical order. The kind (a–d) follows the display order,
     so the active card takes the front rest position. Guarded:
     an unknown slug falls back to the first project, so the
     deck never renders a card it has no photo for. */
  const safeSlug = (SLUGS as readonly string[]).includes(activeSlug)
    ? activeSlug
    : SLUGS[0];
  const ordered = useMemo(
    () => [safeSlug, ...SLUGS.filter((s) => s !== safeSlug)],
    [safeSlug],
  );

  const deckRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef(new Map<string, HTMLDivElement>());
  /* Each card's current interpolated position. The lerp reads
     and writes this, never React state, so no re-render runs
     every frame. */
  const currentRef = useRef(new Map<string, CardState>());
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef(0);
  const startRef = useRef(0);
  const firstRender = useRef(true);
  /* Re-trigger the lerp when --deck-scale changes (a resize
     across the 1024px / 768px breakpoints rescales the fan). */
  const [scaleTick, setScaleTick] = useState(0);

  /* Watch --deck-scale (set by the CSS media queries on
     .hero-deck) and re-run the lerp when it changes, so the
     targets always match the responsive fan. */
  useEffect(() => {
    const deck = deckRef.current;
    let last = deck
      ? parseFloat(getComputedStyle(deck).getPropertyValue("--deck-scale")) ||
        1
      : 1;
    const check = () => {
      const d = deckRef.current;
      if (!d) return;
      const s =
        parseFloat(getComputedStyle(d).getPropertyValue("--deck-scale")) || 1;
      if (Math.abs(s - last) > 0.001) {
        last = s;
        setScaleTick((t) => t + 1);
      }
    };
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;
    /* The deck scale is read from the computed style every run,
       so the targets always match the responsive fan. */
    const scale =
      parseFloat(getComputedStyle(deck).getPropertyValue("--deck-scale")) || 1;
    const targets = new Map<string, CardState>();
    ordered.forEach((slug, i) => {
      const s = SLOTS[i];
      targets.set(slug, {
        x: s.x * scale,
        y: s.y * scale,
        rot: s.rot,
        sc: s.sc,
        br: s.br,
      });
    });

    const applyAll = () => {
      for (const [slug, st] of currentRef.current) {
        const el = cardRefs.current.get(slug);
        if (!el) continue;
        el.style.transform = `translate(${fmt(st.x)}px, ${fmt(st.y)}px) rotate(${fmt(st.rot)}deg) scale(${fmt(st.sc)})`;
        el.style.filter = `brightness(${fmt(st.br)})`;
      }
    };

    /* First render: place the cards exactly on their slots, so
       the first paint is already fanned (matching the CSS rest
       state, so there is no jump on hydration). */
    if (firstRender.current) {
      firstRender.current = false;
      currentRef.current = new Map(targets);
      applyAll();
      return;
    }

    /* Reduced motion: swap instantly, no lerp. */
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      currentRef.current = new Map(targets);
      applyAll();
      return;
    }

    /* (Re)start the lerp from the cards' current interpolated
       positions, so a rapid re-target never jumps or snaps.
       Cancel any in-flight loop first. */
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    lastRef.current = performance.now();
    startRef.current = lastRef.current;
    const step = (now: number) => {
      const dt = Math.min(Math.max(now - lastRef.current, 0), 50);
      lastRef.current = now;
      const k = 1 - Math.exp(-dt / TAU_MS);
      let settled = true;
      for (const [slug, t] of targets) {
        const cur = currentRef.current.get(slug) ?? t;
        const next: CardState = {
          x: cur.x + (t.x - cur.x) * k,
          y: cur.y + (t.y - cur.y) * k,
          rot: cur.rot + (t.rot - cur.rot) * k,
          sc: cur.sc + (t.sc - cur.sc) * k,
          br: cur.br + (t.br - cur.br) * k,
        };
        currentRef.current.set(slug, next);
        if (
          Math.abs(t.x - next.x) > EPS_XY ||
          Math.abs(t.y - next.y) > EPS_XY ||
          Math.abs(t.rot - next.rot) > EPS_ROT ||
          Math.abs(t.sc - next.sc) > EPS_SB ||
          Math.abs(t.br - next.br) > EPS_SB
        ) {
          settled = false;
        }
      }
      applyAll();
      if (!settled && now - startRef.current < MAX_LERP_MS) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        /* Snap to the exact targets and stop. */
        currentRef.current = new Map(targets);
        applyAll();
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [ordered, scaleTick]);

  return (
    <div className="hero-deck" aria-hidden="true" ref={deckRef}>
      {ordered.map((slug, i) => (
        <div
          key={slug}
          ref={(el) => {
            if (el) cardRefs.current.set(slug, el);
            else cardRefs.current.delete(slug);
          }}
          className={`deck-card deck-card--${KINDS[i]}`}
        >
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
