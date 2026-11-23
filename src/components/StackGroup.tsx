import Link from "next/link";
import { skillGroups } from "@/content";

/** Each skill appears once. A skill that was used in a project links
 *  to that project's case study; the rest render as plain text. */
export function StackGroup() {
  return (
    <div className="skill-groups">
      {skillGroups.map((group) => (
        <div className="skill-group" key={group.title}>
          <h3 className="skill-group-head">{group.title}</h3>
          <ul className="skill-list">
            {group.skills.map((skill) =>
              skill.project ? (
                <li key={skill.name}>
                  <Link href={`/work/${skill.project}`}>{skill.name}</Link>
                </li>
              ) : (
                <li key={skill.name}>{skill.name}</li>
              ),
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}
