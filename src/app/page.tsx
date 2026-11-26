"use client";

import type { CSSProperties, ReactNode } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { useContent, useLocale } from "@/i18n/LocaleProvider";
import { Reveal } from "@/components/Reveal";
import { HeroShowcase } from "@/components/HeroShowcase";
import { DownloadCvButton } from "@/components/DownloadCvButton";
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

/** Home: hero (profile row, headline, ask, one action, "see the
 *  work first" link, and the deck showcase with its tabs and
 *  caption) in a two-column split, Work (four full projects in
 *  a horizontal scroll-driven track; the earlier projects live
 *  on the /work index, linked from the track's lime end card),
 *  Background (with the first-person
 *  About as its lead), Skills, Contact (the footer). The work
 *  is the first thing after the hero; the "View More Projects"
 *  link sits after the track, so the first project is visible
 *  in the first viewport. The hero deck stays in the hero: it
 *  is a static fanned stack (the tab click re-fans it), and the
 *  track shows fully from the start — there is no docking
 *  animation carrying the deck onto the track. */
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
  /* The track's scroll position, for --track-x: the track
     section's document top and the horizontal travel
     (--track-max). Recomputed on mount, resize, font load and
     locale change, so it holds across widths and languages.
     Below 1024px, or under reduced motion, the track is a
     vertical stack and no measurement is needed. The progress
     denominator is the horizontal travel (not the full scroll
     range), so --track-x reaches 1 once the track has scrolled
     through and stays at 1 during the dwell that follows
     (see measure()). */
  const trackTopRef = useRef(0);
  const trackMaxRef = useRef(0);

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

  /* Work track scroll — the track moves left as the user scrolls
   *  vertically (desktop, 1024px and up), direct 1:1 like the
   *  reference: one vertical pixel moves the track one
   *  horizontal pixel, no smoothing, no lag. The scroll range
   *  (.track-scroll) is set in measure() to --track-max + a
   *  60vh dwell + viewport height: the vertical range for the
   *  track itself equals the horizontal travel exactly, and
   *  the dwell after it keeps the lime end card fully visible
   *  for 60vh of scroll before the section unpins. The CSS
   *  height (610vh) is only the no-JS fallback approximation.
   *  The viewport is sticky,
   *  and the scroll listener writes --track-x (0→1) straight
   *  from the scroll position — the track follows the wheel
   *  immediately and never drifts after the scroll stops. The
   *  variable lives on the .page element, so the track (and the
   *  progress line in WorkSection) read it. Below 1024px there
   *  is no horizontal track: the track shows as a vertical
   *  stack. The deck does not move on scroll — it stays a
   *  static fan in the hero (see HeroDeck.tsx); the track is
   *  fully visible from the start, so its cards never need
   *  `inert` (an earlier docking version hid the track until
   *  the deck docked and toggled inert on its cards, which
   *  dropped links from a fast keyboard Tab pass — that
   *  mechanism is gone).
   *
   *  The track's max translation (--track-max) is measured from
   *  the layout (content width minus viewport width), so the
   *  longer track — four 1120px cards plus the lime end card —
   *  needs no code change here. The counter is gone (the
   *  reference has none); --track-x now drives the track
   *  translate and the green progress line.
   *
   *  A passive scroll listener coalesced to at most one
   *  requestAnimationFrame, skipped under reduced motion and
   *  without JavaScript (the track is a stack then, and
   *  --track-x keeps its CSS default of 0). DOM writes are
   *  skipped when the value has not changed. useLayoutEffect
   *  so the first update lands before paint. */
  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let disposed = false;
    /* Scroll-write cache: coalesce scroll updates to at most
       one requestAnimationFrame, and skip DOM writes whose
       value has not changed. */
    let ticking = false;
    let lastTrackX = "";

    const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;

    /* Write one progress value to --track-x. The write is
       skipped when the rounded progress has not changed. */
    const writeTrack = (progress: number) => {
      const trackX = progress.toFixed(3);
      if (trackX !== lastTrackX) {
        page.style.setProperty("--track-x", trackX);
        lastTrackX = trackX;
      }
    };

    /* Recompute the scroll target from scrollY and write it
       directly — no easing, no smoothing loop: the track
       follows the wheel 1:1, like the reference, and never
       drifts after the scroll stops. The track's horizontal
       progress: 0 until the track section arrives, 1 once it
       has scrolled through. */
    const sync = () => {
      const y = window.scrollY;
      /* Progress over the horizontal travel only: 0 until the
         track section arrives, 1 once it has scrolled through
         (after trackMax of vertical scroll). During the dwell
         that follows, the numerator keeps growing but clamp01
         holds the progress at 1, so the track and the progress
         line stay at their end values and never drift. */
      const progress =
        trackMaxRef.current > 0
          ? clamp01((y - trackTopRef.current) / trackMaxRef.current)
          : 0;
      writeTrack(progress);
    };

    /* Measure the track's scroll range. The section itself is in
       normal flow (only its viewport is sticky), so its document
       top is stable. Below 1024px the track is a vertical stack
       and needs no measurement. */
    const measure = (): boolean => {
      const track = page.querySelector<HTMLElement>(".track");
      const trackViewport =
        page.querySelector<HTMLElement>(".track-viewport");
      const trackScroll = page.querySelector<HTMLElement>(".track-scroll");
      if (!isDesktop() || !track || !trackViewport || !trackScroll) {
        return false;
      }
      /* Reset the track translation so the photos are at their
         rest positions for the measurement. Keep the write
         cache in sync so the next sync() does not rewrite the
         same value. */
      page.style.setProperty("--track-x", "0.000");
      lastTrackX = "0.000";
      /* The track's max translation: content width minus the
         viewport width. Layout-based, so it is safe to measure
         at any scroll position. */
      const max = Math.max(
        0,
        track.scrollWidth - trackViewport.clientWidth,
      );
      track.style.setProperty("--track-max", `${max}px`);
      /* 1:1 ratio + dwell: the vertical scroll range for the
         track itself must equal the horizontal travel, so the
         scroll container's height is set to trackMax + dwell
         + viewport height (the range is height minus viewport
         height). The dwell (60vh) is extra scroll AFTER the
         track reaches 100%, during which the end card stays
         fully visible before the section unpins — like the
         reference, whose end panel gets ~64vh of its own. This
         overrides the CSS fallback height with the exact value
         for this viewport. */
      const dwell = Math.round(window.innerHeight * 0.6);
      trackScroll.style.height = `${max + dwell + window.innerHeight}px`;
      /* Cache the track's top and horizontal travel for
         sync(). The progress denominator is the travel (max),
         not the full range (max + dwell), so --track-x hits 1
         at the end of the track and holds there through the
         dwell. */
      const y = window.scrollY;
      const trackRect = trackScroll.getBoundingClientRect();
      const trackTop = trackRect.top + y;
      trackTopRef.current = trackTop;
      trackMaxRef.current = Math.max(1, max);
      /* Snap the position to the new layout, so the track does
         not sit at a stale position after a resize or font
         load. */
      sync();
      return true;
    };

    /* Coalesce scroll updates to at most one
       requestAnimationFrame: a scroll event only schedules a
       sync if one is not already pending. */
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (!disposed) sync();
      });
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
       Tight now, not Newsreader), which moves the track — measure
       again once they have loaded. */
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (disposed) return;
        measure();
        sync();
      });
    }
    return () => {
      disposed = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
    /* Re-measure when the language changes: the German copy
       wraps differently, so the hero and the track move. */
  }, [locale]);

  /* A hero tab only selects the project: it switches the hero
     showcase (front card, caption, active tab) and nothing
     else. It does NOT scroll the page or change the URL — the
     visitor stays at the hero, at the same scroll position.
     Only the selected project's explicit "View case study"
     action navigates to the case page. (An earlier version
     scrolled the track to the project on tab select; that
     scroll call was removed.) */
  const handleTabSelect = (slug: string) => {
    setActiveSlug(slug);
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
          {/* CTA hierarchy: Email me (primary) > Download CV
              (secondary) > "See the projects" (text link below). */}
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
            <DownloadCvButton className="btn btn-secondary" />
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
        {/* The section heading and intro live inside the track
            (WorkSection renders them as the first panel, the
            reference's "Selected work" text panel), not as a
            header above it — so the first card follows promptly
            with no blank lead-in. */}
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
