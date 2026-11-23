import { background } from "@/content";

export function Timeline() {
  return (
    <>
      <div className="timeline-group">
        <h3 className="timeline-group-head">Education</h3>
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

      <div className="timeline-group">
        <h3 className="timeline-group-head">Experience</h3>
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

      <div className="timeline-group">
        <h3 className="timeline-group-head">Spoken languages</h3>
        <ol className="timeline">
          {background.languages.map((l) => (
            <li className="timeline-row" key={l.language}>
              <p className="timeline-when">{l.level}</p>
              <div className="timeline-what">
                <h3>{l.language}</h3>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="timeline-group">
        <h3 className="timeline-group-head">Certificates</h3>
        <p className="cert-period">{background.certifications.period}</p>
        <ul className="cert-list">
          {background.certifications.items.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
