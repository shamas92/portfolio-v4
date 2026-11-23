import Link from "next/link";
import { profile, projects } from "@/content";
import { ProjectRow } from "@/components/ProjectRow";
import { StackGroup } from "@/components/StackGroup";
import { Timeline } from "@/components/Timeline";
import { Todo } from "@/components/Todo";
import { Rail } from "@/components/Rail";
import { CopyEmailButton } from "@/components/CopyEmailButton";

const isProd = process.env.NODE_ENV === "production";

const leaselens = projects.find((p) => p.slug === "leaselens");

export default function Home() {
  return (
    <div className="page">
      <Rail
        items={[
          { href: "#work", label: "Work" },
          { href: "#background", label: "Background" },
          { href: "#stack", label: "Stack" },
          { href: "#contact", label: "Contact" },
        ]}
      />

      <header className="hero">
        <h1 className="hero-name">{profile.name}</h1>
        <p className="hero-claim">
          I build data &amp; ML systems — and{" "}
          <span className="hero-claim-mark">prove every claim</span> on this
          page.
        </p>
        <p className="hero-status">{profile.statusLine}</p>
        {leaselens?.figure && leaselens.tests && leaselens.version && (
          <p className="hero-proof">
            <span className="hero-proof-label">LeaseLens</span>
            <span className="hero-proof-figures">
              {leaselens.figure.value} registered IoU · {leaselens.tests.total}{" "}
              tests · {leaselens.version}
            </span>
          </p>
        )}
        <div className="hero-actions">
          <Link className="btn btn-primary" href="#work">
            See projects
          </Link>
          <CopyEmailButton />
          {!isProd && (
            <>
              <button type="button" className="btn btn-secondary" disabled>
                Download CV
              </button>
              <Todo label="CV download — the user supplies the CV file" />
            </>
          )}
        </div>
        {!isProd && (
          <p className="hero-availability">
            <Todo label="Availability line — the user supplies the wording" />
          </p>
        )}
      </header>

      <section
        className="section"
        id="work"
        aria-labelledby="work-head"
        tabIndex={-1}
      >
        <h2 className="section-head" id="work-head">
          Work
        </h2>
        <p className="section-intro">
          Five shipped systems. Each row states what it does and the strongest
          proof for it.
        </p>
        <ul className="work-list">
          {projects.map((p) => (
            <ProjectRow key={p.slug} project={p} />
          ))}
        </ul>
      </section>

      <section
        className="section"
        id="background"
        aria-labelledby="background-head"
        tabIndex={-1}
      >
        <h2 className="section-head" id="background-head">
          Background
        </h2>
        <Timeline />
      </section>

      <section
        className="section"
        id="stack"
        aria-labelledby="stack-head"
        tabIndex={-1}
      >
        <h2 className="section-head" id="stack-head">
          Stack
        </h2>
        <p className="section-intro">
          Each skill appears once. A linked skill was used in that project.
        </p>
        <StackGroup />
      </section>
    </div>
  );
}
