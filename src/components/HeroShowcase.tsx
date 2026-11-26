/**
 * The hero's right column: the deck, the caption under it, and
 * the project-name tabs under that — the reference's hero
 * showcase. The deck is decorative (aria-hidden); the caption
 * and the tabs carry the active project's name and summary, so
 * the showcase is fully operable without the deck.
 *
 * - Caption: bold project name + the verified one-line summary
 *   (rowOutcome), and a "View case study" pill to that project's
 *   case page. It follows the active tab with the reference's
 *   exit/enter: the old caption fades out and rises over 200ms,
 *   the new one mounts and fades in, the text and link swapping
 *   at ~300ms. The row keeps a 52px min-height so the layout
 *   never jumps. Under reduced motion the caption swaps
 *   instantly.
 * - Tabs: the four project names (LeaseLens, Sales ETL,
 *   OratorPath, HITEC). The active tab is a black pill with
 *   white text and a lime underline; the rest are plain
 *   grey text. They are real tabs (role="tab", aria-selected),
 *   keyboard-operable, 44px tap targets. Clicking one makes
 *   that project the deck's front card and updates the caption.
 *   The tabs only select — they never scroll the page or
 *   change the URL. Arrow keys move between tabs and select
 *   (automatic activation, wrapping, Home/End jump to the
 *   first/last tab); Tab moves focus between tabs and Enter
 *   selects, as before.
 * - Auto-advance: the showcase steps to the next project every
 *   5 seconds, wrapping, like the reference. It pauses while
 *   the user hovers over the showcase or focuses a tab, and
 *   while the document is hidden; a manual tab selection
 *   restarts the 5s interval. The lime mark under the active
 *   tab is the progress bar: it fills scaleX 0 → 1 over each
 *   interval and resets on advance. There is no auto-advance
 *   under prefers-reduced-motion — the mark is then a static
 *   full-width underline.
 *
 * Tab labels: the two long titles are shortened for the tab
 * row ("Sales ETL", "HITEC"). These are display abbreviations,
 * not the project titles — they need the user's confirmation.
 * The full titles stay in content.ts and on the track cards
 * and case pages.
 */
"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useContent } from "@/i18n/LocaleProvider";
import type { Project } from "@/content";
import { HeroDeck } from "./HeroDeck";

/** The four projects shown in the hero deck and the tabs, in
 *  order. Quality CRM and UpliftU are not here — they live in
 *  the Earlier work list and on the /work index. */
const SHOWCASE_SLUGS = [
  "leaselens",
  "sales-etl-pipeline",
  "oratorpath",
  "hitec-cms",
] as const;

/** Shortened tab labels for the two long titles. Exported so
 *  the Skills section can resolve the same short labels back
 *  to case-page slugs. */
export const TAB_LABELS: Record<string, string> = {
  "sales-etl-pipeline": "Sales ETL",
  "hitec-cms": "HITEC",
  "quality-crm": "Quality CRM",
};

export const tabLabel = (project: Project): string =>
  TAB_LABELS[project.slug] ?? project.title;

/** The caption change: exit 200ms, text and link swap at
 *  ~300ms, enter 200ms — the whole change lands by ~500ms.
 *  Kept as constants so the timing reads next to the CSS
 *  (caption-exit / caption-enter, 200ms each). */
const CAPTION_SWAP_MS = 300;
const CAPTION_DONE_MS = 500;

/** Auto-advance interval: the reference steps every ~4s; the
 *  user asked for every 5 seconds. */
const AUTO_ADVANCE_MS = 5000;

export function HeroShowcase({
  activeSlug,
  onSelect,
}: {
  activeSlug: string;
  onSelect: (slug: string) => void;
}) {
  const content = useContent();
  /* The four showcase projects, in canonical order, regardless
     of the content file's order. Memoised so the arrow-key
     handler's dependencies stay stable. */
  const ordered: Project[] = useMemo(() => {
    const list: Project[] = [];
    for (const slug of SHOWCASE_SLUGS) {
      const p = content.projects.find((p) => p.slug === slug);
      if (p) list.push(p);
    }
    return list;
  }, [content.projects]);
  const ui = content.ui.work;
  const active =
    ordered.find((p) => p.slug === activeSlug) ?? ordered[0]!;

  /* Caption exit/enter: the caption shows `shownSlug` and
     animates exiting → entering → idle when the active tab
     changes. The text and link swap at ~300ms; the whole
     change lands by ~500ms. Rapid changes restart the
     sequence from the current caption and settle on the last
     tab. Reduced motion swaps instantly (no exit/enter). */
  const [shownSlug, setShownSlug] = useState(active.slug);
  const [captionPhase, setCaptionPhase] = useState<
    "idle" | "exiting" | "entering"
  >("idle");
  const shownSlugRef = useRef(active.slug);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (shownSlugRef.current === active.slug) return;
    /* All state updates run inside timeout callbacks, never
       synchronously in the effect body: the exit starts on the
       next tick, the text and link swap at ~300ms, and the
       change lands by ~500ms. Rapid changes clear the pending
       timeouts and restart from the current caption. Reduced
       motion swaps instantly (no exit/enter). */
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      const t = setTimeout(() => {
        shownSlugRef.current = active.slug;
        setShownSlug(active.slug);
        setCaptionPhase("idle");
      }, 0);
      return () => clearTimeout(t);
    }
    const tExit = setTimeout(() => setCaptionPhase("exiting"), 0);
    const tSwap = setTimeout(() => {
      shownSlugRef.current = active.slug;
      setShownSlug(active.slug);
      setCaptionPhase("entering");
    }, CAPTION_SWAP_MS);
    const tDone = setTimeout(() => {
      setCaptionPhase("idle");
    }, CAPTION_DONE_MS);
    return () => {
      clearTimeout(tExit);
      clearTimeout(tSwap);
      clearTimeout(tDone);
    };
  }, [active.slug]);

  const shown =
    ordered.find((p) => p.slug === shownSlug) ?? ordered[0]!;

  /* ---- Auto-advance (every 5s, wrapping) ----
   * A single rAF loop fills the lime mark under the active tab
   * (scaleX 0 → 1 over the interval) and steps to the next
   * project when the interval elapses. The loop reads and
   * writes refs, never React state, so it never re-renders.
   * - Reset: any selection change (manual click, keyboard, or
   *   an auto-advance step) restarts the 5s interval from 0.
   * - Pause: hovering the showcase, focusing a tab, or hiding
   *   the document freezes the elapsed time; resuming continues
   *   from the frozen point. The mark freezes with it.
   * - Reduced motion: no loop at all — the mark stays a static
   *   full-width underline (see globals.css). */
  const markRef = useRef<HTMLSpanElement | null>(null);
  const advRafRef = useRef<number | null>(null);
  const advStartRef = useRef(0);
  const advAccRef = useRef(0);
  const advElapsedRef = useRef(0);
  const advPrevSlugRef = useRef(activeSlug);
  const pauseSources = useRef({ hover: false, focus: false, hidden: false });
  const onSelectRef = useRef(onSelect);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [paused, setPaused] = useState(false);

  /* Keep the latest onSelect without re-running the loop
     effect when the parent re-renders. */
  useEffect(() => {
    onSelectRef.current = onSelect;
  });

  const updatePaused = useCallback(() => {
    const p =
      pauseSources.current.hover ||
      pauseSources.current.focus ||
      pauseSources.current.hidden;
    setPaused((prev) => (prev === p ? prev : p));
  }, []);

  /* Reduced motion turns auto-advance off (and the
     .hero-showcase--auto class with it, so the lime mark is a
     static full-width underline). The state update runs inside
     a timeout callback, never synchronously in the effect body
     (see the caption effect above for the same rule). */
  useEffect(() => {
    const t = setTimeout(() => {
      const reduceMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setAutoAdvance(!reduceMotion);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  /* Hiding the document pauses the interval; showing it again
     resumes from the frozen point. */
  useEffect(() => {
    const onVis = () => {
      pauseSources.current.hidden = document.hidden;
      updatePaused();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [updatePaused]);

  useEffect(() => {
    if (!autoAdvance) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    /* A new selection restarts the 5s interval from 0. */
    if (advPrevSlugRef.current !== activeSlug) {
      advAccRef.current = 0;
      advElapsedRef.current = 0;
      advPrevSlugRef.current = activeSlug;
    }
    if (paused) return;
    advStartRef.current = performance.now();
    const tick = (now: number) => {
      const elapsed = advAccRef.current + (now - advStartRef.current);
      advElapsedRef.current = elapsed;
      const progress = Math.min(elapsed / AUTO_ADVANCE_MS, 1);
      if (markRef.current) {
        markRef.current.style.transform = `scaleX(${progress})`;
      }
      if (elapsed >= AUTO_ADVANCE_MS) {
        const idx = SHOWCASE_SLUGS.indexOf(
          activeSlug as (typeof SHOWCASE_SLUGS)[number],
        );
        const next = SHOWCASE_SLUGS[(idx + 1) % SHOWCASE_SLUGS.length];
        onSelectRef.current(next);
        return;
      }
      advRafRef.current = requestAnimationFrame(tick);
    };
    advRafRef.current = requestAnimationFrame(tick);
    return () => {
      if (advRafRef.current !== null) cancelAnimationFrame(advRafRef.current);
      advRafRef.current = null;
      /* Freeze the elapsed time so a pause resumes from the
         same point (and the mark with it). */
      advAccRef.current = Math.min(advElapsedRef.current, AUTO_ADVANCE_MS);
    };
  }, [activeSlug, paused, autoAdvance]);

  /* ---- Arrow-key tab navigation (WAI-ARIA tabs pattern) ----
   * ArrowRight/ArrowDown moves to the next tab, ArrowLeft/
   * ArrowUp to the previous, wrapping at the ends; Home and
   * End jump to the first and last tab. Moving also selects
   * (automatic activation), so the card, caption and link
   * follow the focus — the same selection a click makes, and
   * it restarts the 5s auto-advance interval like any manual
   * selection. Focus stays inside the tablist while arrowing,
   * so auto-advance stays paused (see the onBlur guard).
   * Tab still moves focus between tabs and Enter still
   * selects, as before. */
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const onTablistKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const keys = [
        "ArrowRight",
        "ArrowLeft",
        "ArrowDown",
        "ArrowUp",
        "Home",
        "End",
      ];
      if (!keys.includes(e.key)) return;
      e.preventDefault();
      const currentIdx = tabRefs.current.findIndex(
        (el) => el === document.activeElement,
      );
      const base =
        currentIdx >= 0
          ? currentIdx
          : ordered.findIndex((p) => p.slug === active.slug);
      let next = base;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        next = (base + 1) % ordered.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        next = (base - 1 + ordered.length) % ordered.length;
      } else if (e.key === "Home") {
        next = 0;
      } else if (e.key === "End") {
        next = ordered.length - 1;
      }
      const el = tabRefs.current[next];
      if (el) el.focus();
      onSelect(ordered[next].slug);
    },
    [active.slug, onSelect, ordered],
  );

  return (
    <div
      className={`hero-showcase${autoAdvance ? " hero-showcase--auto" : ""}`}
      onMouseEnter={() => {
        pauseSources.current.hover = true;
        updatePaused();
      }}
      onMouseLeave={() => {
        pauseSources.current.hover = false;
        updatePaused();
      }}
    >
      <HeroDeck activeSlug={active.slug} />
      <div
        className="hero-caption"
        data-entrance
        style={{ "--entrance-delay": "300ms" } as React.CSSProperties}
      >
        <div
          key={shown.slug}
          className={`hero-caption-inner hero-caption-inner--${captionPhase}`}
        >
          <p className="hero-caption-text">
            <strong>{shown.title}</strong>{" "}
            <span>{shown.rowOutcome}</span>
          </p>
          <Link href={`/work/${shown.slug}`} className="hero-caption-link">
            {ui.viewCaseStudy}{" "}
            <span className="hero-caption-arrow" aria-hidden="true">
              ↗
            </span>
          </Link>
        </div>
      </div>
      <div
        className="hero-tabs"
        role="tablist"
        aria-label={content.ui.hero.featuredProjects}
        data-entrance
        style={{ "--entrance-delay": "360ms" } as React.CSSProperties}
        onKeyDown={onTablistKeyDown}
        onFocus={() => {
          pauseSources.current.focus = true;
          updatePaused();
        }}
        onBlur={(e) => {
          /* Focus moving between tabs stays paused; only focus
             leaving the tablist entirely resumes. */
          if (e.currentTarget.contains(e.relatedTarget as Node)) return;
          pauseSources.current.focus = false;
          updatePaused();
        }}
      >
        {ordered.map((project, i) => {
          const isActive = project.slug === active.slug;
          return (
            <button
              key={project.slug}
              type="button"
              role="tab"
              className="hero-tab"
              aria-selected={isActive}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              onClick={() => onSelect(project.slug)}
            >
              {tabLabel(project)}
              {isActive && (
                <span
                  className="hero-tab-mark"
                  aria-hidden="true"
                  ref={markRef}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
