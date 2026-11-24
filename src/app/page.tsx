"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import { useContent } from "@/i18n/LocaleProvider";
import { Reveal } from "@/components/Reveal";
import { WorkSection } from "@/components/WorkSection";
import { Background } from "@/components/Background";
import { SkillsSection } from "@/components/SkillsSection";
import { CertificatesSection } from "@/components/CertificatesSection";

/** Entrance delays: the h1 never animates (it is the LCP element);
 *  the claim, ask, pill, status line and actions rise in at 40ms steps. */
const delay = (ms: number) =>
  ({ "--entrance-delay": `${ms}ms` }) as CSSProperties;

/** Home: hero (role, focus, location, availability, one primary
 *  action), Featured Work, Earlier projects, Background (with the
 *  first-person About as its lead), Skills, Certificates,
 *  Contact (the footer). The work is the first thing after the
 *  hero; the filter pills sit below the flagship row, not above
 *  it, so the first project is visible in the first viewport. */
export default function Home() {
  const content = useContent();
  const ui = content.ui;
  const heroRef = useRef<HTMLElement>(null);

  /* Hero scroll transformation: as the reader scrolls the first
   *  240px, the hero expands — the name grows toward the reader
   *  (scale 1 → 1.22, anchored at its baseline so it grows
   *  upward into the hero's top padding and never collides with
   *  the claim below it) while the supporting lines drift up a
   *  touch and fade only to 0.92, so the role, the ask, the
   *  location pill and the action stay legible throughout the
   *  effect. The progress is a CSS variable on the hero element;
   *  the CSS applies it as transform/opacity only, so there is
   *  no layout shift and the fold does not move. A passive rAF
   *  scroll listener, skipped under reduced motion and without
   *  JavaScript (the variable stays 0). The effect reverses on
   *  scroll-up. The range is 240px, not the full hero height:
   *  the name is off-screen past ~150px of scroll, so the growth
   *  has to happen while it is still in view. */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const progress = Math.min(window.scrollY / 240, 1);
      hero.style.setProperty("--hero-progress", progress.toFixed(3));
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
      <header className="hero" ref={heroRef}>
        <h1 className="hero-name">{content.profile.name}</h1>
        <p className="hero-claim" data-entrance style={delay(40)}>
          {content.profile.claim}
        </p>
        <p className="hero-ask" data-entrance style={delay(80)}>
          {ui.hero.ask}
        </p>
        <p className="hero-pill" data-entrance style={delay(120)}>
          <span className="status-dot" aria-hidden="true" />
          {ui.hero.pill}
        </p>
        <p className="hero-status" data-entrance style={delay(160)}>
          {content.profile.statusLine}
        </p>
        <div className="hero-actions" data-entrance style={delay(200)}>
          <a
            className="btn btn-primary"
            href={`mailto:${content.profile.email}`}
          >
            {ui.hero.emailMe}
          </a>
        </div>
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
        <Reveal>
          <h2 className="section-head" id="background-head">
            {ui.background.heading}
          </h2>
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
        </Reveal>
        <CertificatesSection />
      </section>
    </div>
  );
}
