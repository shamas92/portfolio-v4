"use client";

import { useContent } from "@/i18n/LocaleProvider";
import { DownloadCvButton } from "./DownloadCvButton";
import { LocationPanel } from "./LocationPanel";

/** Background as the Parish "No black box" device: a sticky left
 *  column (short intro + links) beside a single time-ordered
 *  timeline on a lime vertical rail, with mono time labels.
 *  The section title and the first-person About lead live in
 *  the section header in page.tsx, so they animate with the
 *  heading. Certificates are their own headed chip block under
 *  the timeline, not a plain line under Education. Spoken
 *  languages stay in the metadata strip underneath, and the
 *  Dresden location panel follows it. Every fact is rendered
 *  from the locale content verbatim.
 *
 *  The timeline merges the two content lists into one order,
 *  newest first: the current degree (education[0]) first, then
 *  experience newest-first, then the earliest degree
 *  (education[1]) last. That order is the content's own order —
 *  experience is stored newest-first and education[0] is the
 *  MSc — so a new experience entry added at the head of
 *  experience[] lands in the right place. */
export function Background() {
  const content = useContent();
  const background = content.background;
  const ui = content.ui.background;

  type TimelineEntry = {
    kind: "education" | "experience";
    title: string;
    period: string;
    note: string;
  };

  const toEntry = (
    kind: TimelineEntry["kind"],
    title: string,
    period: string,
    note: string,
  ): TimelineEntry => ({ kind, title, period, note });

  const firstDegree = background.education[0];
  const lastDegree = background.education[1];
  const entries: TimelineEntry[] = [
    ...(firstDegree
      ? [
          toEntry(
            "education",
            `${firstDegree.degree} — ${firstDegree.school}`,
            firstDegree.period,
            firstDegree.note,
          ),
        ]
      : []),
    ...background.experience.map((x) =>
      toEntry("experience", `${x.role} — ${x.org}`, x.period, x.note),
    ),
    ...(lastDegree
      ? [
          toEntry(
            "education",
            `${lastDegree.degree} — ${lastDegree.school}`,
            lastDegree.period,
            lastDegree.note,
          ),
        ]
      : []),
  ];

  return (
    <>
      <div className="bg-layout">
        <div className="bg-sticky">
          <p className="bg-intro">{background.timelineIntro}</p>
          <div className="bg-links">
            <a className="bg-link" href="#work">
              {content.ui.hero.seeWorkFirst}{" "}
              <span aria-hidden="true">↓</span>
            </a>
            <DownloadCvButton className="btn btn-secondary" />
          </div>
        </div>

        <div>
          <ol className="timeline timeline--rail">
            {entries.map((entry) => (
              <li className="timeline-row" key={entry.title + entry.period}>
                <p className="timeline-when">{entry.period}</p>
                <div className="timeline-what">
                  <p className="timeline-kind">
                    {entry.kind === "education"
                      ? ui.education
                      : ui.experience}
                  </p>
                  <h3>{entry.title}</h3>
                  <p>{entry.note}</p>
                </div>
              </li>
            ))}
          </ol>

          <section
            className="cert-block"
            aria-labelledby="certificates-head"
          >
            <h3 className="cert-head" id="certificates-head">
              {background.certificates.heading}{" "}
              <span className="cert-period">
                ({background.certificates.period})
              </span>
            </h3>
            <ul className="cert-chips">
              {background.certificates.items.map((cert) => (
                <li key={cert} className="cert-chip">
                  {cert}
                </li>
              ))}
            </ul>
            {/* TODO(owner): credential URLs for the four
                certificates (see contentTodos) — the chips
                become links once the owner supplies them. */}
          </section>
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
