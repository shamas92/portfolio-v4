"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useContent } from "@/i18n/LocaleProvider";
import { DownloadCvButton } from "./DownloadCvButton";
import { Reveal } from "./Reveal";
import type { AboutEntry } from "@/content";

/** About, rebuilt on the Rossi About + Aahil "Where I've been"
 *  devices: a left column (mono label, name, place, Download
 *  CV) beside the big statement — the statement IS the section
 *  heading (h2, id="about-head"; page.tsx points
 *  aria-labelledby at it, and there is no separate "About"
 *  heading) — with hairline fact rows under it. (The "See the
 *  projects" link below the fact rows is gone — removed
 *  2026-11-28, premium round.) The statement's lime highlight
 *  reuses .hero-highlight; its draw-in animation runs at page
 *  load and is finished long before anyone scrolls here, so the
 *  word reads fully drawn (see the CSS spec).
 *
 *  Experience is a sticky left role list beside a PRE-RENDERED
 *  stack of detail cards — no swap, fade or slide. Clicking a
 *  role scrolls to its card (scroll-margin-top on the card
 *  keeps the date line out from under the sticky header);
 *  scrolling moves the active marker both ways via the
 *  IntersectionObserver below. Cards use our surface, 1px
 *  var(--rule) border and radius language — not Aahil's hard
 *  offset shadow or yellow; lime square markers + lime active
 *  dot are the accent. The certificates block sits under the
 *  experience grid, full width, as before. The location panel
 *  and the meta-strip are gone: the place lives in the BASED IN
 *  fact row, the languages in the LANGUAGES row. Every fact is
 *  rendered from the locale content verbatim. */

export function About() {
  const content = useContent();
  const about = content.about;
  const ui = content.ui.about;
  const entries = about.entries;

  const [activeId, setActiveId] = useState(entries[0]?.id ?? "");
  const cardRefs = useRef(new Map<string, HTMLElement>());

  /* Scroll-spy, both directions: the observer watches the
     cards through a narrow band around 40–45% of the viewport
     height. The card crossing the band becomes active; between
     cards nothing intersects and the last active row stays put.
     Cards are tall (narrative + highlights + pills), so each
     one crosses the band while scrolling. */
  useEffect(() => {
    const cards = entries
      .map((entry) => cardRefs.current.get(entry.id))
      .filter((el): el is HTMLElement => el !== undefined);
    if (cards.length === 0) return;
    const observer = new IntersectionObserver(
      (obsEntries) => {
        for (const oe of obsEntries) {
          if (oe.isIntersecting) setActiveId(oe.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [entries]);

  const setCardRef =
    (id: string) =>
    (el: HTMLElement | null): void => {
      if (el) cardRefs.current.set(id, el);
      else cardRefs.current.delete(id);
    };

  /* A role click scrolls to its card: smooth unless the user
     asked for reduced motion. Focus stays on the button — the
     scroll-spy updates aria-current as the card arrives, and
     moving focus would fight the smooth scroll. */
  const scrollToCard = (id: string) => {
    const el = cardRefs.current.get(id);
    if (!el) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    el.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const kindLabel = (kind: AboutEntry["kind"]) =>
    kind === "education" ? ui.education : ui.experience;

  /* The statement, with its highlight word wrapped in the lime
     marker span — the same split the hero headline uses
     (statementHighlight, verbatim inside the statement). */
  const renderStatement = (): ReactNode => {
    const s = about.statement;
    const hl = about.statementHighlight;
    const i = s.indexOf(hl);
    if (i < 0) return s;
    return (
      <>
        {s.slice(0, i)}
        <span className="hero-highlight">{hl}</span>
        {s.slice(i + hl.length)}
      </>
    );
  };

  return (
    <>
      <Reveal>
        <div className="about-layout">
          <div className="about-side">
            <p className="about-label">{about.aboutLabel}</p>
            <p className="about-name">{content.profile.name}</p>
            <p className="about-place">{content.profile.location}</p>
            <DownloadCvButton className="btn btn-secondary" />
          </div>
          <div className="about-main">
            <h2 className="about-statement" id="about-head">
              {renderStatement()}
            </h2>
            <dl className="about-facts">
              {about.factRows.map((row) => (
                <div className="about-fact" key={row.label}>
                  <dt className="about-fact-label">{row.label}</dt>
                  <dd className="about-fact-value">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Reveal>

      <div className="about-exp">
        <nav className="about-roles" aria-label={ui.rolesLabel}>
          <ol className="about-role-list">
            {entries.map((entry) => (
              <li key={entry.id}>
                <button
                  type="button"
                  className="about-role"
                  aria-current={
                    activeId === entry.id ? "true" : undefined
                  }
                  onClick={() => scrollToCard(entry.id)}
                >
                  <span className="about-role-dot" aria-hidden="true" />
                  <span className="about-role-text">
                    <span className="about-role-meta">
                      {entry.period} · {kindLabel(entry.kind)}
                    </span>
                    <span className="about-role-title">
                      <strong>{entry.org}</strong> · {entry.role}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="about-cards">
          {entries.map((entry) => (
            <article
              className="about-card"
              id={entry.id}
              key={entry.id}
              ref={setCardRef(entry.id)}
              tabIndex={-1}
            >
              <p className="about-card-date">
                <strong>{entry.period}</strong> · {kindLabel(entry.kind)}
              </p>
              <h3 className="about-card-title">
                {entry.role} — {entry.org}
              </h3>
              <p className="about-card-narrative">{entry.narrative}</p>
              <ul className="about-highlights">
                {entry.highlights.map((highlight, i) => (
                  <li key={i}>
                    {renderHighlight(highlight.text, highlight.bolds)}
                  </li>
                ))}
              </ul>
              <ul className="about-pills">
                {entry.pills.map((pill) => (
                  <li className="about-pill" key={pill}>
                    {pill}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>

      <section className="cert-block" aria-labelledby="certificates-head">
        <h3 className="cert-head" id="certificates-head">
          {about.certificates.heading}{" "}
          <span className="cert-period">
            ({about.certificates.period})
          </span>
        </h3>
        <ul className="cert-chips">
          {about.certificates.items.map((cert) => (
            <li key={cert} className="cert-chip">
              {cert}
            </li>
          ))}
        </ul>
        {/* TODO(owner): credential URLs for the four
            certificates (see contentTodos) — the chips
            become links once the owner supplies them. */}
      </section>
    </>
  );
}

/** Split a highlight on its bold substrings, in order. A bold
 *  that does not occur verbatim in the text renders plain and
 *  warns in development, so content drift shows up instead of
 *  failing silently. Overlapping bolds keep the first. */
function renderHighlight(text: string, bolds: string[]): ReactNode[] {
  type Span = { start: number; end: number };
  const spans: Span[] = [];
  for (const b of bolds) {
    if (!b) continue;
    const i = text.indexOf(b);
    if (i < 0) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `About highlight bold not found verbatim: ${JSON.stringify(b)} in ${JSON.stringify(text)}`,
        );
      }
      continue;
    }
    spans.push({ start: i, end: i + b.length });
  }
  spans.sort((a, b) => a.start - b.start);
  const out: ReactNode[] = [];
  let pos = 0;
  spans.forEach((s, k) => {
    if (s.start < pos) return;
    if (s.start > pos) out.push(text.slice(pos, s.start));
    out.push(<strong key={k}>{text.slice(s.start, s.end)}</strong>);
    pos = s.end;
  });
  if (pos < text.length) out.push(text.slice(pos));
  return out;
}
