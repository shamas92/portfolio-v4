"use client";

import Link from "next/link";
import { useContent } from "@/i18n/LocaleProvider";
import { tabLabel } from "./HeroShowcase";

/** Skills: every skill, grouped by what it does, each exactly
 *  once. A skill names the projects that used it — as links to
 *  the case pages, using the short project labels — so the list
 *  is evidence, not a tag cloud. The name sits on its own line
 *  above the "Used in" line (the CSS puts the gap between
 *  them). Below the groups, a coursework tier names the skills
 *  learned through the Google certificates and links to the
 *  certificates line in Background. No skill is listed as
 *  unused: the coursework tier is the honest place for skills
 *  with no shipped use on this page. Column titles come from
 *  the locale content; skill names are proper nouns and do not
 *  translate. */
export function SkillsSection() {
  const content = useContent();
  const ui = content.ui.skills;
  const skills = content.skills;

  /* The "Used in" lists carry short project labels ("Sales
   *  ETL", "HITEC"); resolve each to its case-page slug through
   *  the tab label first (the same short labels the hero tabs
   *  use), then the short title, then the full title. A label
   *  that resolves to no project renders as plain text, never
   *  as a dead link. */
  const byLabel = new Map(
    content.projects.map((p) => [tabLabel(p), p.slug]),
  );
  const byShortTitle = new Map(
    content.projects.map((p) => [p.shortTitle, p.slug]),
  );
  const byTitle = new Map(content.projects.map((p) => [p.title, p.slug]));

  return (
    <>
      <div className="skills-grid">
        {skills.groups.map((group) => (
          <div className="skills-col" key={group.title}>
            <h3 className="skills-col-head">{group.title}</h3>
            <ul className="skills-list">
              {group.items.map((skill) => (
                <li key={skill.name}>
                  <span className="skills-name">{skill.name}</span>
                  <span className="skills-used">
                    {ui.usedIn}{" "}
                    {skill.usedIn.map((label, i) => {
                      const slug =
                        byLabel.get(label) ??
                        byShortTitle.get(label) ??
                        byTitle.get(label);
                      return (
                        <span key={label}>
                          {i > 0 && ", "}
                          {slug ? (
                            <Link href={`/work/${slug}`}>{label}</Link>
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
          </div>
        ))}
      </div>
      <p className="skills-coursework">
        <Link href="/#certificates-line">{skills.coursework}</Link>
      </p>
    </>
  );
}
