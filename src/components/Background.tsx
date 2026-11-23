import { background } from "@/content";

/** Background: Experience on the left, Education on the right
 *  (two-column desktop grid), with spoken languages and
 *  certificates compressed into a horizontal metadata strip
 *  underneath. Every fact is rendered from content.ts verbatim. */
export function Background() {
  return (
    <>
      <div className="bg-grid">
        <div>
          <h3 className="bg-col-head">Experience</h3>
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
          <h3 className="bg-col-head">Education</h3>
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
          <p className="meta-group-label">Spoken languages</p>
          <p className="meta-group-items">
            {background.languages
              .map((l) => `${l.language} ${l.level}`)
              .join(" · ")}
          </p>
        </div>
        <div>
          <p className="meta-group-label">Certificates</p>
          <p className="meta-group-items">
            {background.certifications.items.join(" · ")}{" "}
            <span className="meta-period">
              · {background.certifications.period}
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
