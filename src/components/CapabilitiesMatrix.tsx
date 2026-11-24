"use client";

import { useContent } from "@/i18n/LocaleProvider";

/** Capabilities matrix: every technology on the site, grouped by
 *  what it does, each exactly once, as plain text with no links.
 *  Column titles come from the locale content; skill names are
 *  proper nouns and do not translate. The mapping (29 skills +
 *  6 stack-only tags = 35 items) is documented in content.ts. */
export function CapabilitiesMatrix() {
  const content = useContent();
  return (
    <div className="matrix">
      {content.matrixColumns.map((col) => (
        <div className="matrix-col" key={col.title}>
          <h3 className="matrix-col-head">{col.title}</h3>
          <ul className="matrix-list">
            {col.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
