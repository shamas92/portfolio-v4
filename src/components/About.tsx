"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import {
  motion,
  useAnimationControls,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { useContent } from "@/i18n/LocaleProvider";
import { scrollToTarget } from "@/lib/scroll";
import type { AboutEntry } from "@/content";

/** About, premium round (2026-11-28): Rossi About intro +
 *  Aahil "Where I've been" experience, with motion.
 *
 *  Layout: the left column is two sticky pieces that hand
 *  off — the side (label, name, place) sticks at 96px while
 *  the statement and facts are read, then scrolls away as the
 *  experience arrives and the role list sticks at the same
 *  96px — so the column never sits empty. The statement is
 *  the section heading (h2, id="about-head"; page.tsx points
 *  aria-labelledby at it, and there is no separate "About"
 *  heading). The MSc card is the larger "lead" card
 *  (entry.lead in the content). Kind is marked by shape, not
 *  only text — Education is a ring + cap icon, Experience a
 *  filled disc + briefcase icon — in the role list and the
 *  card date lines alike. Every fact is rendered from the
 *  locale content verbatim; the bullets are the deduped set
 *  (only msc and bsc keep one bullet each — the rest repeated
 *  the narrative verbatim).
 *
 *  Motion (Framer Motion; Lenis runs the page scroll): the
 *  statement splits by word with scroll-linked opacity, the
 *  lime highlight wipes in once, the timeline rail fills with
 *  scroll progress, cards reveal once with staggered
 *  children. Everything animates transform/opacity only.
 *  Under reduced motion the reveals are fades, the highlight
 *  is fully drawn, and there is no scroll-linked motion at
 *  all.
 *
 *  How the hidden states are applied (fix 2026-11-28): the
 *  server render and the first client render are fully
 *  visible — readers without JavaScript see the content
 *  as-is, and hydration matches. Each motion element owns an
 *  AnimationControls instance and sets its hidden state in a
 *  layout effect after mount (`controls.set`), before first
 *  paint, then starts the visible state when its own
 *  useInView fires. Flipping framer-motion `initial` after
 *  mount does NOT work — `initial` applies only at mount —
 *  which is why the previous mounted-gate left every card
 *  already visible and nothing animated. The one exception
 *  is the statement word opacity, which is a live MotionValue
 *  attached after mount (the `mounted` gate below). */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function About() {
  const content = useContent();
  const about = content.about;
  const ui = content.ui.about;
  const entries = about.entries;
  const reduceMotion = useReducedMotion() === true;

  const [activeId, setActiveId] = useState(entries[0]?.id ?? "");
  const cardRefs = useRef(new Map<string, HTMLElement>());

  /* Mounted: false until the first effect after mount. It
     gates only the statement word opacity below (the live
     MotionValue is attached after mount, so the server
     render and the first client render both show the words
     at full opacity). The card / hairline / highlight
     hidden states do NOT use this gate — they are set by
     AnimationControls in a layout effect, because flipping
     framer-motion `initial` after mount is a no-op. */
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  /* Narrower reveal distance on phones (brief: same reveals,
     shorter distances). */
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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

  /* A role click scrolls to its card through Lenis when it runs
     (the glide), natively otherwise — scrollIntoView smooth
     would fight Lenis's scroll loop. The 96px offset is the
     card's scroll-margin-top, which the native fallback honours
     on its own. Focus stays on the button — the scroll-spy
     updates aria-current as the card arrives, and moving focus
     would fight the smooth scroll. */
  const scrollToCard = (id: string) => {
    const el = cardRefs.current.get(id);
    if (!el) return;
    scrollToTarget(el);
  };

  /* Statement scroll progress: 0 as the statement's top edge
     enters at 85% of the viewport, 1 once its bottom edge has
     risen to 35%. Each word fades 0.25 → 1 across its own
     slice of that range. */
  const statementRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress: statementProgress } = useScroll({
    target: statementRef,
    offset: ["start 0.85", "end 0.35"],
  });

  /* Timeline rail fill: 0 as the card stack's top edge enters
     at 65% of the viewport, 1 once its bottom edge has risen
     to 55% — the fill follows the reader through the cards. */
  const cardsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: railProgress } = useScroll({
    target: cardsRef,
    offset: ["start 0.65", "end 0.55"],
  });

  const kindLabel = (kind: AboutEntry["kind"]) =>
    kind === "education" ? ui.education : ui.experience;

  /* Card reveal distances: 24px rise (16px on phones) +
     opacity, 600ms, children stagger 60ms. The variants
     live in AboutCard below — each card owns its controls
     and sets its hidden state in a layout effect after
     mount (see the header comment: `initial` flipped
     after mount never applies). */

  /* Cursor-following spotlight: the card's ::after is a radial
     lime gradient centred on these CSS vars (~15% opacity).
     Pointer position only — no layout, no scroll listener. */
  const onCardMouseMove = (e: ReactMouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const words = about.statement.split(" ");

  return (
    <>
      <div className="about-layout">
        <div className="about-side">
          <p className="about-label">{about.aboutLabel}</p>
          <p className="about-name">{content.profile.name}</p>
          <p className="about-place">{content.profile.location}</p>
        </div>
        <div className="about-main">
          <h2
            className="about-statement"
            id="about-head"
            ref={statementRef}
            aria-label={about.statement}
          >
            {words.map((word, i) => (
              <StatementWord
                key={`${word}-${i}`}
                word={word}
                index={i}
                total={words.length}
                progress={statementProgress}
                highlight={about.statementHighlight}
                reduceMotion={reduceMotion}
                mounted={mounted}
              />
            ))}
          </h2>
          <dl className="about-facts">
            {about.factRows.map((row, i) => (
              <div className="about-fact" key={row.label}>
                <FactLine reduceMotion={reduceMotion} />
                {i === about.factRows.length - 1 && (
                  <FactLine
                    className="about-fact-line about-fact-line--bottom"
                    reduceMotion={reduceMotion}
                  />
                )}
                <dt className="about-fact-label">{row.label}</dt>
                <dd className="about-fact-value">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="about-exp">
        <nav className="about-roles" aria-label={ui.rolesLabel}>
          {/* Timeline rail: a vertical line between the index
              dots, its lime fill following scroll progress
              through the cards (scaleY, origin top). No fill
              under reduced motion — the plain line stays. */}
          <div className="about-rail" aria-hidden="true">
            <div className="about-rail-track" />
            {!reduceMotion && (
              <motion.div
                className="about-rail-fill"
                style={{ scaleY: railProgress }}
              />
            )}
          </div>
          <ol className="about-role-list">
            {entries.map((entry) => {
              const isActive = activeId === entry.id;
              return (
                <li key={entry.id}>
                  <button
                    type="button"
                    className="about-role"
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => scrollToCard(entry.id)}
                  >
                    <RoleDot
                      kind={entry.kind}
                      active={isActive}
                      reduceMotion={reduceMotion}
                    />
                    <span className="about-role-text">
                      <span className="about-role-meta">
                        {entry.period} ·{" "}
                        <span className="about-kind">
                          <KindIcon kind={entry.kind} />
                          {kindLabel(entry.kind)}
                        </span>
                      </span>
                      <span className="about-role-title">
                        <strong>{entry.org}</strong>
                        <span className="about-role-title-role">
                          {" "}
                          · {entry.role}
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="about-cards" ref={cardsRef}>
          {entries.map((entry) => (
            <AboutCard
              key={entry.id}
              entry={entry}
              isActive={activeId === entry.id}
              reduceMotion={reduceMotion}
              revealY={isMobile ? 16 : 24}
              kindLabel={kindLabel}
              setCardRef={setCardRef}
              onMouseMove={onCardMouseMove}
            />
          ))}
        </div>
      </div>

      <section className="cert-block" aria-labelledby="certificates-head">
        <h3 className="cert-head" id="certificates-head">
          {about.certificates.heading}{" "}
          <span className="cert-count">
            · {about.certificates.items.length}
          </span>{" "}
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

/** One experience card. It owns its reveal controls: the
 *  hidden state is set in a layout effect after mount (before
 *  first paint), and the visible state starts when the card's
 *  own useInView fires. Children stagger 60ms (date → title
 *  → text → bullets → chips); the bullet squares scale in.
 *  Under reduced motion no hidden state is ever set, so the
 *  card is simply visible. */
function AboutCard({
  entry,
  isActive,
  reduceMotion,
  revealY,
  kindLabel,
  setCardRef,
  onMouseMove,
}: {
  entry: AboutEntry;
  isActive: boolean;
  reduceMotion: boolean;
  revealY: number;
  kindLabel: (kind: AboutEntry["kind"]) => string;
  setCardRef: (
    id: string,
  ) => (el: HTMLElement | null) => void;
  onMouseMove: (e: ReactMouseEvent<HTMLElement>) => void;
}) {
  const controls = useAnimationControls();
  const localRef = useRef<HTMLElement | null>(null);
  const inView = useInView(localRef, { once: true });
  /* revealY is in the deps: isMobile resolves in an effect
     after mount, so the first set uses 24px and the re-run
     corrects it to 16px on phones before any card is in
     view. The guard keeps a resize (or a late isMobile
     flip) from hiding a card that already revealed — its
     useInView fired once and will not start it again. */
  const revealedRef = useRef(false);
  useLayoutEffect(() => {
    if (!reduceMotion && !revealedRef.current) controls.set("hidden");
  }, [reduceMotion, controls, revealY]);
  useEffect(() => {
    if (inView) {
      revealedRef.current = true;
      controls.start("visible");
    }
  }, [inView, controls]);

  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : revealY,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: EASE,
        staggerChildren: 0.06,
      },
    },
  };

  return (
    <motion.article
      className={`about-card${entry.lead ? " about-card--lead" : ""}${
        isActive ? " is-active" : ""
      }`}
      id={entry.id}
      ref={(el) => {
        localRef.current = el;
        setCardRef(entry.id)(el);
      }}
      tabIndex={-1}
      variants={cardVariants}
      initial={false}
      animate={controls}
      onMouseMove={onMouseMove}
    >
      <motion.p className="about-card-date" variants={childVariants}>
        <strong>{entry.period}</strong> ·{" "}
        <span className="about-kind">
          <KindIcon kind={entry.kind} />
          {kindLabel(entry.kind)}
        </span>
      </motion.p>
      <motion.h3 className="about-card-title" variants={childVariants}>
        {entry.role} — {entry.org}
      </motion.h3>
      <motion.p className="about-card-narrative" variants={childVariants}>
        {entry.narrative}
      </motion.p>
      {entry.highlights.length > 0 && (
        <motion.ul className="about-highlights" variants={childVariants}>
          {entry.highlights.map((highlight, i) => (
            <motion.li key={i} variants={childVariants}>
              <motion.span
                className="about-hl-square"
                aria-hidden="true"
                variants={squareVariants}
              />
              {renderHighlight(highlight.text, highlight.bolds)}
            </motion.li>
          ))}
        </motion.ul>
      )}
      <motion.ul className="about-pills" variants={childVariants}>
        {entry.pills.map((pill) => (
          <li className="about-pill" key={pill}>
            {pill}
          </li>
        ))}
      </motion.ul>
    </motion.article>
  );
}

/** Card children fade only — the rise belongs to the card.
 *  Bullet squares scale in. */
const childVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: EASE },
  },
};
const squareVariants: Variants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: { duration: 0.3, ease: EASE },
  },
};

/** A fact hairline that draws in left→right once on view,
 *  600ms. Same controls pattern as the cards: hidden in a
 *  layout effect after mount, drawn when its own useInView
 *  fires. Under reduced motion it is simply drawn. */
function FactLine({
  className = "about-fact-line",
  reduceMotion,
}: {
  className?: string;
  reduceMotion: boolean;
}) {
  const controls = useAnimationControls();
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true });
  useLayoutEffect(() => {
    if (!reduceMotion) controls.set({ scaleX: 0 });
  }, [reduceMotion, controls]);
  useEffect(() => {
    if (inView) {
      controls.start({
        scaleX: 1,
        transition: { duration: 0.6, ease: EASE },
      });
    }
  }, [inView, controls]);
  return (
    <motion.span
      ref={ref}
      className={className}
      aria-hidden="true"
      initial={false}
      animate={controls}
    />
  );
}

/** The lime highlight behind "measure"/"messen": wipes in
 *  left→right (scaleX, origin left) once on view, 600ms +
 *  150ms delay. Same controls pattern as the cards. Under
 *  reduced motion it is simply drawn. */
function HighlightBg({ reduceMotion }: { reduceMotion: boolean }) {
  const controls = useAnimationControls();
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true });
  useLayoutEffect(() => {
    if (!reduceMotion) controls.set({ scaleX: 0 });
  }, [reduceMotion, controls]);
  useEffect(() => {
    if (inView) {
      controls.start({
        scaleX: 1,
        transition: { duration: 0.6, ease: EASE, delay: 0.15 },
      });
    }
  }, [inView, controls]);
  return (
    <motion.span
      ref={ref}
      className="about-hl-bg"
      aria-hidden="true"
      initial={false}
      animate={controls}
    />
  );
}

/** One statement word. Its opacity is scroll-linked: 0.25
 *  until the scroll progress reaches the word's slice of the
 *  statement, 1 after it. The word is its own component so
 *  the useTransform hook count is stable per word (the word
 *  count differs between locales). The h2 carries the full
 *  statement in aria-label; every word is aria-hidden. */
function StatementWord({
  word,
  index,
  total,
  progress,
  highlight,
  reduceMotion,
  mounted,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  highlight: string;
  reduceMotion: boolean;
  mounted: boolean;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const opacity = useTransform(progress, [start, end], [0.25, 1]);
  const parts = splitHighlight(word, highlight);
  return (
    <>
      <motion.span
        aria-hidden="true"
        style={
          reduceMotion || !mounted ? undefined : { opacity }
        }
      >
        {parts ? (
          <>
            {parts.pre}
            <span className="about-hl">
              <HighlightBg reduceMotion={reduceMotion} />
              <span className="about-hl-text">{parts.mid}</span>
            </span>
            {parts.post}
          </>
        ) : (
          word
        )}
      </motion.span>
      {index < total - 1 ? " " : ""}
    </>
  );
}

/** Split a word on the highlight substring, if the word
 *  contains it (the EN highlight sits inside "measure." —
 *  the period stays outside the lime). */
function splitHighlight(
  word: string,
  hl: string,
): { pre: string; mid: string; post: string } | null {
  const i = word.indexOf(hl);
  if (i < 0) return null;
  return {
    pre: word.slice(0, i),
    mid: hl,
    post: word.slice(i + hl.length),
  };
}

/** The index dot. Kind is shape: Education is a ring,
 *  Experience a filled disc (see the CSS). The active dot
 *  scales up and settles once — a single pulse when its row
 *  becomes active — and stays still under reduced motion. */
function RoleDot({
  kind,
  active,
  reduceMotion,
}: {
  kind: AboutEntry["kind"];
  active: boolean;
  reduceMotion: boolean;
}) {
  const className = `about-role-dot about-role-dot--${kind}`;
  if (reduceMotion) {
    return <span className={className} aria-hidden="true" />;
  }
  return (
    <motion.span
      className={className}
      aria-hidden="true"
      animate={active ? { scale: [1.45, 1] } : { scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    />
  );
}

/** Kind icon, 14px, currentColor: a graduation cap for
 *  Education, a briefcase for Experience. */
function KindIcon({ kind }: { kind: AboutEntry["kind"] }) {
  if (kind === "education") {
    return (
      <svg
        viewBox="0 0 16 16"
        width="14"
        height="14"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path d="M8 1.5 15 5 8 8.5 1 5 8 1.5Z" />
        <path d="M4.5 6.8v2.7c0 1.2 1.6 2 3.5 2s3.5-.8 3.5-2V6.8" />
        <path d="M13.5 5.5v3" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <rect x="2" y="5.5" width="12" height="7" rx="1" />
      <path d="M5.5 5.5v-1a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1" />
      <path d="M2 8.5h12" />
    </svg>
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
