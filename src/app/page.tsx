"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import { useContent } from "@/i18n/LocaleProvider";
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

/** Home: hero (role, focus, location, availability, one primary
 *  action) in a two-column split with the fanned dummy deck on
 *  the right, Featured Work, Earlier projects, Background (with
 *  the first-person About as its lead), Skills, Certificates,
 *  Contact (the footer). The work is the first thing after the
 *  hero; the filter pills sit below the flagship row, not above
 *  it, so the first project is visible in the first viewport. */
export default function Home() {
  const content = useContent();
  const ui = content.ui;
  const heroRef = useRef<HTMLElement>(null);

  /* Hero deck scroll: as the reader scrolls the first 320px,
   *  the deck lags the text (parallax: it moves down as the page
   *  moves up, so it stays in view longer) and the four dummy
   *  cards separate, rotate toward upright and grow into a loose
   *  2×2 spread that overlaps into the Work section. The progress
   *  is a CSS variable on the hero element (--deck-progress, 0→1,
   *  smoothstep-eased so the fan-out eases at both ends); the lag
   *  is --deck-lag (0.5× scroll, capped at 160px). The CSS applies
   *  both as transform only, so there is no layout shift and the
   *  fold does not move. The effect reverses on scroll-up. The
   *  hero text itself has no scroll transform: it scrolls up
   *  normally and stays fully opaque until it leaves the viewport,
   *  like the reference. A passive rAF scroll listener, skipped
   *  under reduced motion and without JavaScript (the variables
   *  stay 0, so the deck sits at its rest fanned state). */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const p = Math.min(y / 320, 1);
      const eased = p * p * (3 - 2 * p);
      hero.style.setProperty("--deck-progress", eased.toFixed(3));
      hero.style.setProperty(
        "--deck-lag",
        `${Math.min(y * 0.5, 160).toFixed(1)}px`,
      );
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="page">
      {/* data-enter marks the hero as the page's one entrance
          (taste-skill hero-enter): the h1 rises translate-only,
          the lines rise in 60ms steps, the deck settles as one
          block per card. */}
      <header className="hero" ref={heroRef} data-enter>
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
