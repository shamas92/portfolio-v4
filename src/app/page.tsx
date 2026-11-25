"use client";

import type { CSSProperties, ReactNode } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { useContent, useLocale } from "@/i18n/LocaleProvider";
import { Reveal } from "@/components/Reveal";
import { HeroShowcase } from "@/components/HeroShowcase";
import { WorkSection } from "@/components/WorkSection";
import { Background } from "@/components/Background";
import { SkillsSection } from "@/components/SkillsSection";

/** Entrance delays: the profile row and the h1 rise first (the
 *  h1 translate-only, no opacity fade, so the LCP headline
 *  paints on first paint), the supporting lines rise in 60ms
 *  steps after it, and the deck cards settle from 240ms, 80ms
 *  apart, so the whole entrance lands in about a second. */
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

/** Home: hero (profile row, headline, ask, one action, "see the
 *  work first" link, and the deck showcase with its tabs and
 *  caption) in a two-column split, Work (three full projects in
 *  a horizontal scroll-driven track, three compact cards below
 *  it), Background (with the first-person About as its lead),
 *  Skills, Contact (the footer). The work is the first thing
 *  after the hero; the "View More Projects" link sits after the
 *  track, so the first project is visible in the first viewport. */
export default function Home() {
  const content = useContent();
  const { locale } = useLocale();
  const ui = content.ui;
  const pageRef = useRef<HTMLDivElement>(null);
  /* The active project: the deck's front card, the caption and
     the active tab all follow it. Default LeaseLens, the first
     project — the reference's front card is its first project
     too. */
  const [activeSlug, setActiveSlug] = useState("leaselens");
  /* The docking geometry, measured from the real layout (see
     measure below). Recomputed on mount, resize, font load and
     locale change, so it holds across widths and languages. */
  const dockRef = useRef(0);
  const dockOkRef = useRef(false);
  const desktopRef = useRef(false);
  /* The track's scroll range, for --track-x: the track section's
     document top and (height − viewport height). */
  const trackTopRef = useRef(0);
  const trackRangeRef = useRef(0);

  /* The headline, with the claim's highlight phrase wrapped in
     the lime marker span. The highlight phrase comes from
     content (claimHighlight, verbatim inside claim); if it is
     ever absent, the claim renders plain. */
  const renderHeadline = (): ReactNode => {
    const claim = content.profile.claim;
    const hl = content.profile.claimHighlight;
    const i = claim.indexOf(hl);
    if (i < 0) return claim;
    return (
      <>
        {claim.slice(0, i)}
        <span className="hero-highlight">{hl}</span>
        {claim.slice(i + hl.length)}
      </>
    );
  };

  /* Hero deck scroll — the deck becomes the track, like the
   *  reference. The scroll variables live on the .page element
   *  (not the hero), so both the deck and the Work track read
   *  them: --deck-progress (0→1, smootherstep-eased), --deck-x
   *  (the horizontal spread, weighted late on desktop so the
   *  cards stay fanned while the hero text is still visible),
   *  --deck-lag (the deck's parallax), --track-reveal (the
   *  track, 0→1 as the deck docks), --deck-fade (the deck, 1→0
   *  over the same range) and --track-x (the track's horizontal
   *  progress, 0→1 across the tall track section).
   *
   *  Desktop (1024px and up): the deck pins in the viewport —
   *  the lag equals the scroll distance, capped at the docking
   *  offset — while the track scrolls up to meet it. The docking
   *  offset is the scroll at which the track section becomes
   *  sticky (its top reaches the viewport top): at that scroll
   *  the track has not translated yet, so the photos sit at
   *  their rest X and the per-card final offsets and scale,
   *  measured from the track photos' real rects, land each deck
   *  card exactly over its own track card's photo and the
   *  cross-fade is seamless. The photos are vertically centred
   *  in the sticky 100vh viewport — below the deck's pinned
   *  rest centre — so the deck glides down to the viewport
   *  centre as it docks (--sy, the same for all six cards).
   *  The track then translates left as the user scrolls through
   *  the tall track section (sticky viewport), revealing the
   *  three wide cards one by one. The effect reverses on
   *  scroll-up. Below 1024px
   *  there is no docking and no horizontal track: the hero
   *  stacks, the deck stays a compact six-card fan and scrolls
   *  away (no pin, no parallax — it moves 1:1 with the page,
   *  so it never drifts over the Work heading), and the track
   *  shows as a vertical stack.
   *
   *  Smoothness: the deck's scroll position sets a target, and
   *  the displayed progress is damped toward it (0.22 per frame,
   *  ~250ms to settle), so the deck glides instead of stepping
   *  with the wheel. The pin (--deck-lag) is the one value
   *  written straight from the scroll, so the deck never drifts
   *  from its pinned spot after the scroll stops; the spread,
   *  the rotation, the scale and the cross-fade settle toward
   *  it. The loop runs only while the deck is settling and
   *  stops once it lands, so an idle page costs nothing. The
   *  track's --track-x is written straight from the scroll (no
   *  damping): the track follows the wheel, like the reference.
   *
   *  A passive rAF scroll listener, skipped under reduced
   *  motion and without JavaScript (the variables keep their
   *  CSS defaults: deck at its rest fan, track fully visible
   *  as a stack). useLayoutEffect so the first update lands
   *  before paint — the track must not flash visible before
   *  the listener hides it. The hero text itself has no scroll
   *  transform: it scrolls up normally and stays fully opaque
   *  until it leaves the viewport, like the reference. */
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

    /* M3: the track cards are invisible while the reveal is 0,
       so their links must not take focus — toggle `inert` on
       the full track cards while the reveal is 0. The compact
       cards below the track are always visible, so they are
       never inert. */
    const writeReveal = (p: number) => {
      const trackCards = page.querySelectorAll<HTMLElement>(
        ".track .track-card",
      );
      if (desktopRef.current && dockOkRef.current) {
        /* S23: the reveal starts at p = 0.7 (was 0.8), so the
           card text is visible by the time the deck docks. */
        const reveal = smootherstep((p - 0.7) / 0.3);
        page.style.setProperty("--track-reveal", reveal.toFixed(3));
        page.style.setProperty("--deck-fade", (1 - reveal).toFixed(3));
        for (const card of trackCards) card.inert = reveal <= 0;
      } else {
        /* No docking — below 1024px, or before the dock is
           measured: the track is fully visible and the compact
           fan stays fully visible too. It scrolls away; it
           does not fade out. */
        page.style.setProperty("--track-reveal", "1");
        page.style.setProperty("--deck-fade", "1");
        for (const card of trackCards) card.inert = false;
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
           with the page. */
        lagY = 0;
      }
      page.style.setProperty("--deck-lag", `${lagY.toFixed(1)}px`);
      writeDeck(currentP, lagY);
      writeReveal(currentP);
      /* The track's horizontal progress: 0 until the track
         section arrives, 1 once it has scrolled through.
         Written straight from the scroll, no damping. */
      const trackProgress =
        trackRangeRef.current > 0
          ? clamp01((y - trackTopRef.current) / trackRangeRef.current)
          : 0;
      page.style.setProperty("--track-x", trackProgress.toFixed(3));
      /* S4: the track counter ("2 / 3") — the current full card,
         from the track's progress. */
      const counter = page.querySelector<HTMLElement>(".track-counter");
      if (counter) {
        const total = page.querySelectorAll(".track-card").length;
        if (total > 0) {
          const index = Math.min(
            total - 1,
            Math.floor(trackProgress * total),
          );
          counter.textContent = `${index + 1} / ${total}`;
        }
      }
      if (Math.abs(targetP - currentP) >= SETTLE) kick();
    };

    const measure = (): boolean => {
      desktopRef.current = isDesktop();
      const deckCards = Array.from(
        page.querySelectorAll<HTMLElement>(".deck-card[data-project]"),
      );
      const track = page.querySelector<HTMLElement>(".track");
      const trackViewport =
        page.querySelector<HTMLElement>(".track-viewport");
      const trackScroll = page.querySelector<HTMLElement>(".track-scroll");
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
      const trackPhotos = Array.from(
        page.querySelectorAll<HTMLElement>(".track-card .track-photo"),
      );
      /* Tiering (M7): only the full cards have a photo, so the
         photo count must match the full-card count, not six. */
      const trackCards = Array.from(
        page.querySelectorAll<HTMLElement>(".track-card"),
      );
      if (
        !deck ||
        deckCards.length !== 6 ||
        trackCards.length === 0 ||
        trackPhotos.length !== trackCards.length ||
        !track ||
        !trackViewport ||
        !trackScroll
      ) {
        dockOkRef.current = false;
        return false;
      }
      /* Tiering (M7): three full cards, so the track's scroll
         range is 200vh, set on .track-scroll in globals.css
         (desktop media query only); the range reads
         offsetHeight, so it picks the 200vh up directly. */
      /* Reset the track translation so the photos are at their
         rest positions for the measurement. */
      page.style.setProperty("--track-x", "0");
      /* The track's max translation: content width minus the
         viewport width. Layout-based, so it is safe to measure
         at any scroll position. */
      const max = Math.max(
        0,
        track.scrollWidth - trackViewport.clientWidth,
      );
      track.style.setProperty("--track-max", `${max}px`);
      /* Cache the track's scroll range for sync(). The section
         itself is in normal flow (only its viewport is sticky),
         so its document top is stable. */
      const y = window.scrollY;
      const trackRect = trackScroll.getBoundingClientRect();
      const trackTop = trackRect.top + y;
      const trackRange = Math.max(
        1,
        trackScroll.offsetHeight - window.innerHeight,
      );
      trackTopRef.current = trackTop;
      trackRangeRef.current = trackRange;
      /* Force the deck to rest so the rects are the rest rects.
         The caller re-syncs before the next paint, so the deck
         never visibly jumps. */
      page.style.setProperty("--deck-progress", "0");
      page.style.setProperty("--deck-x", "0");
      page.style.setProperty("--deck-lag", "0px");
      const deckRect = deck.getBoundingClientRect();
      const deckCx = deckRect.left + deckRect.width / 2;
      const deckCy = y + deckRect.top + deckRect.height / 2;
      /* The dock completes exactly when the track section
         becomes sticky (its top reaches the viewport top): at
         that scroll the track has not translated yet
         (--track-x is 0), so the photos sit at their rest X
         and the --sx measured below is exact, and the reveal
         completes just as the track starts moving left.
         The photos are vertically centred in the sticky
         100vh viewport, so their centre is the viewport
         centre — below the deck's pinned rest centre. The
         deck therefore glides down to the viewport centre as
         it docks: --sy is that vertical distance, the same
         for all six cards (their photos share one row). */
      const dock = trackTop;
      if (dock < 200) {
        dockOkRef.current = false;
        return false;
      }
      dockRef.current = dock;
      const sy = window.innerHeight / 2 - deckCy;
      for (const card of deckCards) {
        const slug = card.dataset.project;
        const photo = trackPhotos.find(
          (v) => v.closest<HTMLElement>(".track-card")?.dataset.slug === slug,
        );
        if (!photo) {
          /* No track photo: a compact-tier project. Fall back
             to the CSS spread positions (remove the measured
             offsets) so the card glides out and fades with the
             deck instead of docking. */
          card.style.removeProperty("--sx");
          card.style.removeProperty("--sy");
          card.style.removeProperty("--sr");
          card.style.removeProperty("--ss");
          continue;
        }
        const r = photo.getBoundingClientRect();
        card.style.setProperty(
          "--sx",
          `${(r.left + r.width / 2 - deckCx).toFixed(1)}px`,
        );
        card.style.setProperty("--sy", `${sy.toFixed(1)}px`);
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
    /* Fonts change the hero's height (the headline is Inter
       Tight now, not Newsreader), which moves the docking
       offset — measure again once they have loaded. */
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
       wraps differently, so the hero and the track move. */
  }, [locale]);

  /* S4: a hero tab also scrolls the track to that project — the
     full cards by their track position, the compact cards by
     scrolling to the compact row below the track; on the
     vertical stack (mobile / reduced motion / no docking) the
     card itself is scrolled into view. */
  const scrollTrackTo = (slug: string) => {
    const project = content.projects.find((p) => p.slug === slug);
    if (!project) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const behavior: ScrollBehavior = reduced ? "auto" : "smooth";
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (isDesktop && dockOkRef.current && trackRangeRef.current > 0) {
      if (project.tier === "full") {
        const full = content.projects.filter((p) => p.tier === "full");
        const index = full.findIndex((p) => p.slug === slug);
        const progress =
          full.length > 1 ? Math.max(0, index) / (full.length - 1) : 0;
        window.scrollTo({
          top: trackTopRef.current + progress * trackRangeRef.current,
          behavior,
        });
      } else {
        const row =
          pageRef.current?.querySelector<HTMLElement>(".compact-row");
        if (row) {
          window.scrollTo({
            top: Math.max(
              0,
              row.getBoundingClientRect().top + window.scrollY - 96,
            ),
            behavior,
          });
        }
      }
    } else {
      const card = pageRef.current?.querySelector<HTMLElement>(
        `[data-slug="${slug}"]`,
      );
      if (card) {
        window.scrollTo({
          top: Math.max(
            0,
            card.getBoundingClientRect().top + window.scrollY - 96,
          ),
          behavior,
        });
      }
    }
  };

  const handleTabSelect = (slug: string) => {
    setActiveSlug(slug);
    scrollTrackTo(slug);
  };

  return (
    <div className="page" ref={pageRef}>
      {/* data-enter marks the hero as the page's one entrance
          (taste-skill hero-enter): the profile row and the h1
          rise first, the lines rise in 60ms steps, the deck
          settles as one block per card. */}
      <header className="hero" data-enter>
        <div className="hero-copy">
          <p className="hero-profile" data-entrance-soft style={delay(0)}>
            <span className="hero-avatar" aria-hidden="true">
              SR
            </span>
            <span className="hero-profile-text">
              <span className="hero-profile-name">
                {content.profile.name}
              </span>
              <span className="hero-profile-degree">
                {content.profile.statusLine}
              </span>
              <span className="hero-profile-status">
                <span className="status-dot" aria-hidden="true" />
                {ui.hero.pill}
              </span>
            </span>
          </p>
          <h1 className="hero-headline" data-entrance-soft style={delay(60)}>
            {renderHeadline()}
          </h1>
          <p className="hero-ask" data-entrance style={delay(120)}>
            {ui.hero.ask}
          </p>
          <div className="hero-actions" data-entrance style={delay(180)}>
            <a
              className="btn btn-primary hero-btn"
              href={`mailto:${content.profile.email}`}
            >
              {ui.hero.emailMe}
              <span className="btn-arrow" aria-hidden="true">
                →
              </span>
            </a>
          </div>
          <p className="hero-see-work" data-entrance style={delay(240)}>
            <a href="#work">
              {ui.hero.seeWorkFirst}{" "}
              <span aria-hidden="true">↓</span>
            </a>
          </p>
        </div>
        <HeroShowcase activeSlug={activeSlug} onSelect={handleTabSelect} />
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
        </Reveal>
        <SkillsSection />
      </section>
    </div>
  );
}
