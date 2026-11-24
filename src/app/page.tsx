import Link from "next/link";
import type { CSSProperties } from "react";
import { profile } from "@/content";
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
  return (
    <div className="page">
      <header className="hero">
        <h1 className="hero-name">{profile.name}</h1>
        <p className="hero-claim" data-entrance style={delay(40)}>
          I build data &amp; ML systems — and prove every claim on this page.
        </p>
        <p className="hero-pill" data-entrance style={delay(80)}>
          <span className="status-dot" aria-hidden="true" />
          Dresden · Werkstudent eligible, 20h/wk
        </p>
        <p className="hero-status" data-entrance style={delay(120)}>
          {profile.statusLine}
        </p>
        <div className="hero-actions" data-entrance style={delay(160)}>
          <Link className="btn btn-primary" href="#work">
            View Flagship Work
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
            Work
          </h2>
          <p className="section-intro">
            Three flagship systems, each with its architecture and its proof.
            Two earlier systems follow in a compact index.
          </p>
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
            Background
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
            Stack
          </h2>
          <p className="section-intro">
            Every skill, grouped by what it does. The pills above the projects
            filter them by stack.
          </p>
        </Reveal>
        <CapabilitiesMatrix />
      </section>
    </div>
  );
}
