"use client";

import type { CSSProperties } from "react";
import { useLayoutEffect, useRef } from "react";
import { useContent, useLocale } from "@/i18n/LocaleProvider";
import { Reveal } from "@/components/Reveal";
import { HeroDeck } from "@/components/HeroDeck";
import { WorkSection } from "@/components/WorkSection";
import { Background } from "@/components/Background";
import { SkillsSection } from "@/components/SkillsSection";
import { CertificatesSection } from "@/components/CertificatesSection";

/** Entrance delays: the h1 rises translate-only (no opacity
 *  fade, so the LCP headline paints on first paint) and the
 *  supporting lines rise in 60ms steps after it; the deck cards
 *  settle from 240ms, 80ms apart, so the whole entrance lands
 *  in about a second. */
const delay = (ms: number) =>
  ({ "--entrance-delay": `${ms}ms` }) as CSSProperties;

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
/* Quintic smootherstep: zero first and second derivatives at
   both ends, so the deck eases out of rest and into the dock
   with no visible kink — softer than smoothstep at the ends,
   where the eye catches a step. */
const smootherstep = (p: number) => {
  const t = clamp01(p);
  return t * t * t * (t * (t * 6 - 15) + 10);
};

/** Home: hero (role, focus, location, availability, one primary
 *  action) in a two-column split with the fanned deck of all six
 *  projects' photos on the right, Work (all six projects in one
 *  3×2 image-led grid), Background (with the first-person About
 *  as its lead), Skills, Certificates, Contact (the footer). The
 *  work is the first thing after the hero; the filter pills sit
 *  below the grid, not above it, so the first project is visible
 *  in the first viewport. */
export default function Home() {
  const content = useContent();
  const { locale } = useLocale();
  const ui = content.ui;
  const pageRef = useRef<HTMLDivElement>(null);
  /* The docking geometry, measured from the real layout (see
     measure below). Recomputed on mount, resize, font load and
     locale change, so it holds across widths and languages. */
  const dockRef = useRef(0);
  const dockOkRef = useRef(false);
  const desktopRef = useRef(false);

  /* Hero deck scroll — the deck becomes the grid, like the
   *  reference. The scroll variables live on the .page element
   *  (not the hero), so both the deck and the Work grid read
   *  them: --deck-progress (0→1, smootherstep-eased), --deck-x
   *  (the horizontal spread, weighted late on desktop so the
   *  cards stay fanned while the hero text is still visible),
   *  --deck-lag (the deck's parallax), --grid-reveal (the grid,
   *  0→1 as the deck docks) and --deck-fade (the deck, 1→0 over
   *  the same range).
   *
   *  Desktop (1024px and up): the deck pins in the viewport —
   *  the lag equals the scroll distance, capped at the docking
   *  offset — while the grid scrolls up to meet it. The docking
   *  offset is the scroll at which the first row's visuals reach
   *  the deck's pinned position; the per-card final offsets and
   *  scale are measured from the grid's real rects, so each deck
   *  card lands exactly over its own grid card's visual and the
   *  cross-fade is seamless. Row 2's cards travel down as well:
   *  their --sy is the measured distance from the pinned deck
   *  centre to their own visual's centre. The effect reverses
   *  on scroll-up. Below 1024px there is no docking: the hero
   *  stacks, the deck stays a compact six-card fan and scrolls
   *  away (no pin, no parallax — it moves 1:1 with the page,
   *  so it never drifts over the Work heading), and the grid
   *  shows fully — a six-card fan cannot dock onto a
   *  one-column grid in a compact scroll range.
   *
   *  Smoothness: the scroll position sets a target, and the
   *  displayed progress is damped toward it (0.22 per frame,
   *  ~250ms to settle), so the deck glides instead of stepping
   *  with the wheel. The pin (--deck-lag) is the one value
   *  written straight from the scroll, so the deck never drifts
   *  from its pinned spot after the scroll stops; the spread,
   *  the rotation, the scale and the cross-fade settle toward
   *  it. The loop runs only while the deck is settling and
   *  stops once it lands, so an idle page costs nothing.
   *
   *  A passive rAF scroll listener, skipped under reduced
   *  motion and without JavaScript (the variables keep their
   *  CSS defaults: deck at its rest fan, grid fully visible).
   *  useLayoutEffect so the first update lands before paint —
   *  the grid must not flash visible before the listener hides
   *  it. The hero text itself has no scroll transform: it
   *  scrolls up normally and stays fully opaque until it leaves
   *  the viewport, like the reference. */
  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let disposed = false;
    /* The scroll-derived target and the displayed value: the
       loop damps the displayed one toward the target. */
    let targetP = 0;
    let currentP = 0;
    /* The deck pin, written straight from the scroll. */
    let lagY = 0;
    const LERP = 0.22;
    const SETTLE = 0.0005;

    const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;

    /* The deck's own variables (progress, spread, pin). The
       reveal reads the same progress, so the cross-fade and the
       spread settle together. */
    const writeDeck = (p: number, lag: number) => {
      const eased = smootherstep(p);
      const spread = smootherstep((p - 0.45) / 0.55);
      page.style.setProperty("--deck-progress", eased.toFixed(3));
      page.style.setProperty("--deck-x", spread.toFixed(3));
      page.style.setProperty("--deck-lag", `${lag.toFixed(1)}px`);
    };

    const writeReveal = (p: number) => {
      if (desktopRef.current && dockOkRef.current) {
        const reveal = smootherstep((p - 0.8) / 0.2);
        page.style.setProperty("--grid-reveal", reveal.toFixed(3));
        page.style.setProperty("--deck-fade", (1 - reveal).toFixed(3));
      } else {
        /* No docking — below 1024px, or before the dock is
           measured: the grid is fully visible and the compact
           fan stays fully visible too. It scrolls away; it
           does not fade out. The old fallback wrote fade 0
           here, which hid the whole deck on phones and
           tablets. */
        page.style.setProperty("--grid-reveal", "1");
        page.style.setProperty("--deck-fade", "1");
      }
    };

    /* The settle loop: one frame damps the displayed progress a
       fifth of the way to its target, then stops once it lands.
       It never runs on an idle page. */
    const tick = () => {
      raf = 0;
      if (disposed) return;
      const diff = targetP - currentP;
      if (Math.abs(diff) < SETTLE) {
        currentP = targetP;
        writeDeck(currentP, lagY);
        writeReveal(currentP);
        return;
      }
      currentP += diff * LERP;
      writeDeck(currentP, lagY);
      writeReveal(currentP);
      raf = requestAnimationFrame(tick);
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    /* Read the scroll, set the target and the pin, write the
       current state, and start the loop if the deck still has
       settling to do. Called on scroll, resize, font load and
       locale change. */
    const sync = () => {
      const y = window.scrollY;
      if (desktopRef.current && dockOkRef.current && dockRef.current > 0) {
        targetP = clamp01(y / dockRef.current);
        lagY = Math.min(y, dockRef.current);
      } else {
        targetP = 0;
        /* No pin below 1024px: the compact fan scrolls 1:1
           with the page. A lag here (the earlier 0.5×, capped
           at 160px) let the fan drift down over the Work
           heading as the section scrolled up under it — the
           photos covered the heading on phones. */
        lagY = 0;
      }
      page.style.setProperty("--deck-lag", `${lagY.toFixed(1)}px`);
      writeDeck(currentP, lagY);
      writeReveal(currentP);
      if (Math.abs(targetP - currentP) >= SETTLE) kick();
    };

    const measure = (): boolean => {
      desktopRef.current = isDesktop();
      const deckCards = Array.from(
        page.querySelectorAll<HTMLElement>(".deck-card[data-project]"),
      );
      if (!desktopRef.current) {
        /* Mobile/tablet: the CSS media queries own the spread,
           so any desktop measurement left on the cards must go. */
        for (const card of deckCards) {
          card.style.removeProperty("--sx");
          card.style.removeProperty("--sy");
          card.style.removeProperty("--sr");
          card.style.removeProperty("--ss");
        }
        dockOkRef.current = false;
        return false;
      }
      const deck = page.querySelector<HTMLElement>(".hero-deck");
      const gridVisuals = Array.from(
        page.querySelectorAll<HTMLElement>(".work-card .work-visual"),
      );
      if (!deck || deckCards.length !== 6 || gridVisuals.length !== 6) {
        dockOkRef.current = false;
        return false;
      }
      /* Force the deck to rest so the rects are the rest rects.
         The caller re-syncs before the next paint, so the deck
         never visibly jumps. */
      page.style.setProperty("--deck-progress", "0");
      page.style.setProperty("--deck-x", "0");
      page.style.setProperty("--deck-lag", "0px");
      const y = window.scrollY;
      const deckRect = deck.getBoundingClientRect();
      const deckCx = deckRect.left + deckRect.width / 2;
      const deckCy = y + deckRect.top + deckRect.height / 2;
      const first = gridVisuals[0]!.getBoundingClientRect();
      const dock = first.top + y + first.height / 2 - deckCy;
      if (dock < 200) {
        dockOkRef.current = false;
        return false;
      }
      dockRef.current = dock;
      for (const card of deckCards) {
        const slug = card.dataset.project;
        const visual = gridVisuals.find(
          (v) => v.closest<HTMLElement>(".work-card")?.dataset.slug === slug,
        );
        if (!visual) {
          dockOkRef.current = false;
          return false;
        }
        const r = visual.getBoundingClientRect();
        card.style.setProperty(
          "--sx",
          `${(r.left + r.width / 2 - deckCx).toFixed(1)}px`,
        );
        /* Row 1 lands through the lag (the pinned deck), so its
           final y offset is 0; row 2's cards travel down to the
           second row — the distance from the pinned deck centre
           to their own visual's centre. Each card is measured
           from its own visual, so differing body heights across
           columns cannot throw a row off. */
        card.style.setProperty(
          "--sy",
          `${(r.top + y + r.height / 2 - deckCy - dock).toFixed(1)}px`,
        );
        card.style.setProperty("--sr", "0deg");
        card.style.setProperty("--ss", (r.width / card.offsetWidth).toFixed(3));
      }
      dockOkRef.current = true;
      return true;
    };

    const onScroll = () => {
      sync();
    };
    const onResize = () => {
      measure();
      sync();
    };
    measure();
    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    /* Fonts change the hero's height (the name is Newsreader),
       which moves the docking offset — measure again once they
       have loaded. */
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (disposed) return;
        measure();
        sync();
      });
    }
    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
    /* Re-measure when the language changes: the German copy
       wraps differently, so the hero and the grid move. */
  }, [locale]);

  return (
    <div className="page" ref={pageRef}>
      {/* data-enter marks the hero as the page's one entrance
          (taste-skill hero-enter): the h1 rises translate-only,
          the lines rise in 60ms steps, the deck settles as one
          block per card. */}
      <header className="hero" data-enter>
        <div className="hero-copy">
          <h1 className="hero-name" data-entrance-soft style={delay(0)}>
            {content.profile.name}
          </h1>
          <p className="hero-claim" data-entrance style={delay(60)}>
            {content.profile.claim}
          </p>
          <p className="hero-ask" data-entrance style={delay(120)}>
            {ui.hero.ask}
          </p>
          <p className="hero-pill" data-entrance style={delay(180)}>
            <span className="status-dot" aria-hidden="true" />
            {ui.hero.pill}
          </p>
          <p className="hero-status" data-entrance style={delay(240)}>
            {content.profile.statusLine}
          </p>
          <div className="hero-actions" data-entrance style={delay(300)}>
            <a
              className="btn btn-primary"
              href={`mailto:${content.profile.email}`}
            >
              {ui.hero.emailMe}
            </a>
          </div>
        </div>
        <HeroDeck />
      </header>

      <section
        className="section"
        id="work"
        aria-labelledby="work-head"
        tabIndex={-1}
      >
        <Reveal>
          <h2 className="section-head" id="work-head">
            {ui.work.heading}
          </h2>
          <p className="section-intro">{ui.work.intro}</p>
        </Reveal>
        <WorkSection />
      </section>

      <section
        className="section"
        id="background"
        aria-labelledby="background-head"
        tabIndex={-1}
      >
        {/* The section header block — head plus lead — animates
            together in one Reveal, the same pattern as Work and
            Skills. The lead lives here, not in Background, so the
            header and its opening paragraph never drift apart. */}
        <Reveal>
          <h2 className="section-head" id="background-head">
            {ui.background.heading}
          </h2>
          <p className="about-lead">{content.background.about}</p>
        </Reveal>
        <Background />
      </section>

      <section
        className="section"
        id="skills"
        aria-labelledby="skills-head"
        tabIndex={-1}
      >
        <Reveal>
          <h2 className="section-head" id="skills-head">
            {ui.skills.heading}
          </h2>
          <p className="section-intro">{ui.skills.intro}</p>
        </Reveal>
        <SkillsSection />
      </section>

      <section
        className="section"
        id="certificates"
        aria-labelledby="certificates-head"
        tabIndex={-1}
      >
        <Reveal>
          <h2 className="section-head" id="certificates-head">
            {ui.certificates.heading}
          </h2>
          <p className="section-intro">{ui.certificates.intro}</p>
        </Reveal>
        <CertificatesSection />
      </section>
    </div>
  );
}
