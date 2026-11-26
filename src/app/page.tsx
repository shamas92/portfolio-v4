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
 *  caption) in a two-column split, Work (three full projects in
 *  a horizontal scroll-driven track, the earlier projects as a
 *  compact list below it), Background (with the first-person
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
  /* The track's scroll range, for --track-x: the track
     section's document top and (height − viewport height).
     Recomputed on mount, resize, font load and locale change,
     so it holds across widths and languages. Below 1024px, or
     under reduced motion, the track is a vertical stack and no
     measurement is needed. */
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

  /* Work track scroll — the track moves left as the user scrolls
   *  vertically (desktop, 1024px and up): a tall scroll range
   *  (.track-scroll, 160vh) holds a sticky viewport, and the
   *  scroll listener drives --track-x (0→1) across it. The
   *  variable lives on the .page element, so the track reads it;
   *  it is written from the scroll (no damping), so the track
   *  follows the wheel, like the reference. Below 1024px
   *  there is no horizontal track: the track shows as a vertical
   *  stack. The deck does not move on scroll — it stays a static
   *  fan in the hero (see HeroDeck.tsx); the track is fully
   *  visible from the start, so its cards never need `inert`
   *  (an earlier docking version hid the track until the deck
   *  docked and toggled inert on its cards, which dropped links
   *  from a fast keyboard Tab pass — that mechanism is gone).
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
    /* Scroll-write caches (item 5): coalesce scroll updates to
       at most one requestAnimationFrame, and skip DOM writes
       whose value has not changed. */
    let ticking = false;
    let lastTrackX = "";
    let lastCounterIndex = -1;
    /* The counter element is rendered conditionally (desktop +
       motion allowed), so resolve it lazily and cache it; the
       card count is fixed for the session (it only changes on
       locale, which re-runs this effect). */
    let counterEl: HTMLElement | null = null;
    const totalCards = page.querySelectorAll(".track-card").length;

    const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;

    /* The track's horizontal progress: 0 until the track section
       arrives, 1 once it has scrolled through. Written from the
       scroll, no damping. Also updates the track counter
       ("2 / 3") — the current full card, from the track's
       progress. DOM writes are skipped when the value has not
       changed: --track-x only when the rounded progress
       differs, the counter only when the displayed index
       differs. */
    const sync = () => {
      const y = window.scrollY;
      const trackProgress =
        trackRangeRef.current > 0
          ? clamp01((y - trackTopRef.current) / trackRangeRef.current)
          : 0;
      const trackX = trackProgress.toFixed(3);
      if (trackX !== lastTrackX) {
        page.style.setProperty("--track-x", trackX);
        lastTrackX = trackX;
      }
      if (totalCards > 0) {
        if (!counterEl) {
          counterEl = page.querySelector<HTMLElement>(".track-counter");
        }
        if (counterEl) {
          const index = Math.min(
            totalCards - 1,
            Math.floor(trackProgress * totalCards),
          );
          if (index !== lastCounterIndex) {
            counterEl.textContent = `${index + 1} / ${totalCards}`;
            lastCounterIndex = index;
          }
        }
      }
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
      /* Cache the track's scroll range for sync(). */
      const y = window.scrollY;
      const trackRect = trackScroll.getBoundingClientRect();
      const trackTop = trackRect.top + y;
      const trackRange = Math.max(
        1,
        trackScroll.offsetHeight - window.innerHeight,
      );
      trackTopRef.current = trackTop;
      trackRangeRef.current = trackRange;
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
