"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useContent } from "@/i18n/LocaleProvider";
import { DownloadCvButton } from "@/components/DownloadCvButton";
import { Reveal } from "@/components/Reveal";
import { WorkSection } from "@/components/WorkSection";
import { Background } from "@/components/Background";
import { CapabilitiesMatrix } from "@/components/CapabilitiesMatrix";

/** Entrance delays: the h1 never animates (it is the LCP element);
 *  the claim, pill, status line and actions rise in at 40ms steps. */
const delay = (ms: number) =>
  ({ "--entrance-delay": `${ms}ms` }) as CSSProperties;

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
        <p className="hero-pill" data-entrance style={delay(80)}>
          <span className="status-dot" aria-hidden="true" />
          {ui.hero.pill}
        </p>
        <p className="hero-status" data-entrance style={delay(120)}>
          {content.profile.statusLine}
        </p>
        <div className="hero-actions" data-entrance style={delay(160)}>
          <Link className="btn btn-primary" href="#work">
            {ui.hero.viewWork}
          </Link>
          <DownloadCvButton className="btn btn-secondary" />
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
        id="stack"
        aria-labelledby="stack-head"
        tabIndex={-1}
      >
        <Reveal>
          <h2 className="section-head" id="stack-head">
            {ui.stack.heading}
          </h2>
          <p className="section-intro">{ui.stack.intro}</p>
        </Reveal>
        <CapabilitiesMatrix />
      </section>
    </div>
  );
}
