"use client";

import Link from "next/link";
import { format, useContent } from "@/i18n/LocaleProvider";
import { tabLabel } from "./HeroShowcase";

/** Skills as 2×2 purpose-first cards (Ubaid model). Each card
 *  names what its group is for in one line — the purpose comes
 *  from the locale content, never invented here — then lists
 *  its skills as pills. A skill names the projects that used
 *  it, as links to the case pages using the short project
 *  labels, so the list is evidence, not a tag cloud. Every
 *  "Used in" link carries an aria-label with the skill and the
 *  full project title ("PostgreSQL — used in Sales ETL
 *  Pipeline"): the visible labels repeat across skills, so
 *  the bare text alone tells a screen reader nothing. Below
 *  the cards, a coursework tier names the skills learned
 *  through the Google certificates and links to the
 *  certificates line in Background. No skill is listed as
 *  unused: the coursework tier is the honest place for skills
 *  with no shipped use on this page. Column titles and purpose
 *  lines come from the locale content; skill names are proper
 *  nouns and do not translate. */
export function SkillsSection() {
  const content = useContent();
  const ui = content.ui.skills;
  const skills = content.skills;

  /* The "Used in" lists carry short project labels ("Sales
   *  ETL", "HITEC"); resolve each to its project through the
   *  tab label first (the same short labels the hero tabs
   *  use), then the short title, then the full title. The
   *  project object gives both the case-page slug for the href
   *  and the full title for the link's aria-label. A label
   *  that resolves to no project renders as plain text, never
   *  as a dead link. */
  const byLabel = new Map<string, (typeof content.projects)[number]>();
  for (const p of content.projects) {
    byLabel.set(tabLabel(p), p);
    if (p.shortTitle) byLabel.set(p.shortTitle, p);
    byLabel.set(p.title, p);
  }

  return (
    <>
      <div className="skills-grid">
        {skills.groups.map((group) => (
          <article className="skills-card" key={group.title}>
            <h3 className="skills-card-head">{group.title}</h3>
            <p className="skills-purpose">{group.purpose}</p>
            <ul className="skills-list">
              {group.items.map((skill) => (
                <li key={skill.name}>
                  <span className="skills-pill">{skill.name}</span>
                  <span className="skills-used">
                    {ui.usedIn}{" "}
                    {skill.usedIn.map((label, i) => {
                      const project = byLabel.get(label);
                      return (
                        <span key={label}>
                          {i > 0 && ", "}
                          {project ? (
                            <Link
                              href={`/work/${project.slug}`}
                              aria-label={format(ui.usedInLabel, {
                                skill: skill.name,
                                project: project.title,
                              })}
                            >
                              {label}
                            </Link>
                          ) : (
                            label
                          )}
                        </span>
                      );
                    })}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <p className="skills-coursework">
        <Link href="/#certificates-line">{skills.coursework}</Link>
      </p>
    </>
  );
}
