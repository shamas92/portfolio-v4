"use client";

import type { CSSProperties } from "react";
import { useContent } from "@/i18n/LocaleProvider";
import { Reveal } from "@/components/Reveal";
import { WorkSection } from "@/components/WorkSection";
import { Background } from "@/components/Background";
import { SkillsSection } from "@/components/SkillsSection";

/** Entrance delays: the h1 never animates (it is the LCP element);
 *  the claim, ask, pill, status line and actions rise in at 40ms steps. */
const delay = (ms: number) =>
  ({ "--entrance-delay": `${ms}ms` }) as CSSProperties;

/** Home: hero (role, focus, location, availability, one primary
 *  action), Featured Work, Earlier projects, Background (with the
 *  first-person About as its lead), Skills, Contact (the footer).
 *  The work is the first thing after the hero; the filter pills
 *  sit below the flagship row, not above it, so the first project
 *  is visible in the first viewport. */
export default function Home() {
  const content = useContent();
  const ui = content.ui;

  return (
    <div className="page">
      <header className="hero">
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
    </div>
  );
}
