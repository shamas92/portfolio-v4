"use client";

import Link from "next/link";
import { useContent } from "@/i18n/LocaleProvider";

/** Skills: every skill, grouped by what it does, each exactly
 *  once. A skill that a project used names the project — as a
 *  link to the case page — so the list is evidence, not a tag
 *  cloud. A skill used by every project says so in words instead
 *  of six links. Skills with no shipped use on this page are
 *  gathered under one honest line at the bottom, not dropped.
 *  Column titles come from the locale content; skill names are
 *  proper nouns and do not translate. */
export function SkillsSection() {
  const content = useContent();
  const ui = content.ui.skills;
  const totalProjects = content.projects.length;
  const bySlug = new Map(content.projects.map((p) => [p.slug, p.title]));

  const used: { group: string; name: string; projects: string[] }[] = [];
  const unused: string[] = [];
  for (const group of content.skillGroups) {
    for (const skill of group.skills) {
      if (skill.projects && skill.projects.length > 0) {
        used.push({ group: group.title, name: skill.name, projects: skill.projects });
      } else {
        unused.push(skill.name);
      }
    }
  }

  return (
    <>
      <div className="skills-grid">
        {content.skillGroups.map((group) => {
          const items = used.filter((s) => s.group === group.title);
          if (items.length === 0) return null;
          return (
            <div className="skills-col" key={group.title}>
              <h3 className="skills-col-head">{group.title}</h3>
              <ul className="skills-list">
                {items.map((skill) => (
                  <li key={skill.name}>
                    <span className="skills-name">{skill.name}</span>{" "}
                    <span className="skills-used">
                      {ui.usedIn}{" "}
                      {skill.projects.length === totalProjects ? (
                        ui.everyProject
                      ) : (
                        skill.projects.map((slug, i) => (
                          <span key={slug}>
                            {i > 0 && ", "}
                            <Link href={`/work/${slug}`}>
                              {bySlug.get(slug) ?? slug}
                            </Link>
                          </span>
                        ))
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      {unused.length > 0 && (
        <p className="skills-studied">
          <span className="skills-studied-label">{ui.noShippedUse}: </span>
          {unused.join(" · ")}
        </p>
      )}
    </>
  );
}
