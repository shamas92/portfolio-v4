"use client";

import { useContent } from "@/i18n/LocaleProvider";
import { LocationPanel } from "./LocationPanel";

/** Background: Experience on the left, Education on the right
 *  (two-column desktop grid), with spoken languages in a metadata
 *  strip underneath and the Dresden location panel after it. The
 *  first-person About lead lives in the section header in
 *  page.tsx, so it animates with the heading. Certificates live
 *  in their own section now (see CertificatesSection), not in
 *  this strip. Every fact is rendered from the locale content
 *  verbatim. */
export function Background() {
  const content = useContent();
  const background = content.background;
  const ui = content.ui.background;

  return (
    <>
      <div className="bg-grid">
        <div>
          <h3 className="bg-col-head">{ui.experience}</h3>
          <ol className="timeline">
            {background.experience.map((x) => (
              <li className="timeline-row" key={x.role + x.org}>
                <p className="timeline-when">{x.period}</p>
                <div className="timeline-what">
                  <h3>
                    {x.role} — {x.org}
                  </h3>
                  <p>{x.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h3 className="bg-col-head">{ui.education}</h3>
          <ol className="timeline">
            {background.education.map((e) => (
              <li className="timeline-row" key={e.degree}>
                <p className="timeline-when">{e.period}</p>
                <div className="timeline-what">
                  <h3>
                    {e.degree} — {e.school}
                  </h3>
                  <p>{e.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="meta-strip">
        <div>
          <p className="meta-group-label">{ui.languagesLabel}</p>
          <p className="meta-group-items">
            {background.languages
              .map((l) => `${l.language} ${l.level}`)
              .join(" · ")}
          </p>
        </div>
      </div>

      <LocationPanel />
    </>
  );
}
