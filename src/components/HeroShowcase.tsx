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
 *   white text and a static lime underline; the rest are plain
 *   grey text. They are real tabs (role="tab", aria-selected),
 *   keyboard-operable, 44px tap targets. Clicking one makes
 *   that project the deck's front card and updates the caption.
 *   The tabs only select — they never scroll the page or
 *   change the URL.
 *
 * Tab labels: the two long titles are shortened for the tab
 * row ("Sales ETL", "HITEC"). These are display abbreviations,
 * not the project titles — they need the user's confirmation.
 * The full titles stay in content.ts and on the track cards
 * and case pages.
 */
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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

export function HeroShowcase({
  activeSlug,
  onSelect,
}: {
  activeSlug: string;
  onSelect: (slug: string) => void;
}) {
  const content = useContent();
  /* The four showcase projects, in canonical order, regardless
     of the content file's order. */
  const ordered: Project[] = [];
  for (const slug of SHOWCASE_SLUGS) {
    const p = content.projects.find((p) => p.slug === slug);
    if (p) ordered.push(p);
  }
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

  return (
    <div className="hero-showcase">
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
      >
        {ordered.map((project) => {
          const isActive = project.slug === active.slug;
          return (
            <button
              key={project.slug}
              type="button"
              role="tab"
              className="hero-tab"
              aria-selected={isActive}
              onClick={() => onSelect(project.slug)}
            >
              {tabLabel(project)}
              {isActive && (
                <span className="hero-tab-mark" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
