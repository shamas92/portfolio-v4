/**
 * The hero deck: four dummy (placeholder) mockup cards, fanned at
 * rest, that unstack into a loose spread as the reader scrolls.
 *
 * The mechanism, and how it maps to the austinserb.com hero:
 * - At rest the four cards are a fanned stack in the hero's right
 *   column (rotations roughly -5° to +13°, each peeking at a
 *   different edge), like the reference's deck. The hero copy
 *   stays on the left, every word unchanged.
 * - On load the cards settle into their fanned positions (the
 *   taste-skill's entrance: one block settling from .98, staggered
 *   per card, about a second in total).
 * - On scroll the deck lags the text (parallax: the deck moves
 *   down as the page moves up, so it stays in view longer) and
 *   the cards separate, rotate toward upright and grow into a
 *   loose 2×2 spread that overlaps into the Work section — a
 *   continuous, scroll-linked fan-out, transform/opacity only,
 *   driven by --deck-progress (0→1) set from page.tsx.
 * - The landing: the spread scrolls away above the Featured Work
 *   grid. It does NOT land as the grid, because the deck cards
 *   are four dummy placeholders and the grid is three real project
 *   cards — morphing placeholders into real cards would be a
 *   bait-and-switch, and the counts do not match (4 vs 3).
 *
 * The cards are dummy placeholders, and they say so: each title
 * bar reads "<type> · Placeholder" (localised). The four are
 * generic interface shapes only — a dashboard, an app list, a
 * data table, a mobile screen — with no real data, no numbers,
 * no real product names, no invented metrics. They share the
 * portfolio's own window-chrome language (title bar, hairline,
 * theme-aware surfaces) and its 8px radius, not the reference's
 * photographic cards: the reference's project images are its own
 * work and are not copied.
 *
 * The deck is decorative: aria-hidden, pointer-events none, so
 * it never takes focus, never announces itself, and never blocks
 * a click on the Work section it overlaps. Under
 * prefers-reduced-motion (and without JavaScript) it sits at its
 * rest fanned state and does not move.
 */
import { useContent } from "@/i18n/LocaleProvider";

const mono = "var(--font-mono)";

/** Shared dummy window chrome: frame, title bar with the card's
 *  type and a Placeholder tag. No status strip — these are
 *  placeholders, not the real project mockups. */
function DummyWindow({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <svg viewBox="0 0 320 200" aria-hidden="true" focusable="false">
      <rect
        x="1"
        y="1"
        width="318"
        height="198"
        rx="8"
        fill="var(--surface)"
        stroke="var(--rule)"
        strokeWidth="1"
      />
      <line x1="1" y1="24" x2="319" y2="24" stroke="var(--rule)" />
      <circle cx="14" cy="12" r="3" fill="var(--accent)" />
      <circle cx="24" cy="12" r="3" fill="var(--rule)" />
      <circle cx="34" cy="12" r="3" fill="var(--rule)" />
      <text
        x="46"
        y="15.5"
        fontFamily={mono}
        fontSize="8"
        letterSpacing="0.5"
        fill="var(--ink-muted)"
      >
        {title}
      </text>
      {children}
    </svg>
  );
}

/** Generic dashboard: sidebar, top bar, two stat blocks (bars,
 *  not numbers), a bar chart with no axis values. */
function DashboardDummy({ title }: { title: string }) {
  const bars: { x: number; h: number; accent?: boolean }[] = [
    { x: 84, h: 20 },
    { x: 114, h: 34 },
    { x: 144, h: 26 },
    { x: 174, h: 48 },
    { x: 204, h: 38 },
    { x: 234, h: 56, accent: true },
    { x: 264, h: 44 },
  ];
  return (
    <DummyWindow title={title}>
      {/* sidebar */}
      <rect
        x="12"
        y="32"
        width="52"
        height="156"
        rx="4"
        fill="var(--bg)"
        stroke="var(--rule)"
      />
      <circle
        cx="38"
        cy="48"
        r="8"
        fill="var(--accent-wash)"
        stroke="var(--rule)"
      />
      {[68, 86, 104, 122].map((y, i) => (
        <rect
          key={y}
          x="20"
          y={y}
          width="36"
          height="6"
          rx="3"
          fill={i === 0 ? "var(--accent)" : "var(--rule)"}
        />
      ))}
      <circle cx="38" cy="172" r="5" fill="var(--rule)" />
      {/* top bar */}
      <rect
        x="72"
        y="32"
        width="236"
        height="24"
        rx="4"
        fill="var(--bg)"
        stroke="var(--rule)"
      />
      <rect
        x="80"
        y="38"
        width="90"
        height="12"
        rx="6"
        fill="var(--rule)"
        opacity="0.35"
      />
      <circle
        cx="296"
        cy="44"
        r="7"
        fill="var(--accent-wash)"
        stroke="var(--rule)"
      />
      {/* stat blocks: bars, not numbers */}
      <rect
        x="72"
        y="64"
        width="114"
        height="42"
        rx="4"
        fill="var(--accent-wash)"
        stroke="var(--rule)"
      />
      <rect
        x="82"
        y="74"
        width="40"
        height="6"
        rx="3"
        fill="var(--ink-muted)"
        opacity="0.6"
      />
      <rect x="82" y="88" width="64" height="10" rx="2" fill="var(--ink)" />
      <rect
        x="194"
        y="64"
        width="114"
        height="42"
        rx="4"
        fill="var(--bg)"
        stroke="var(--rule)"
      />
      <rect
        x="204"
        y="74"
        width="40"
        height="6"
        rx="3"
        fill="var(--ink-muted)"
        opacity="0.6"
      />
      <rect x="204" y="88" width="48" height="10" rx="2" fill="var(--ink)" />
      {/* chart: bars with no axis values */}
      <rect
        x="72"
        y="114"
        width="236"
        height="74"
        rx="4"
        fill="var(--bg)"
        stroke="var(--rule)"
      />
      <line x1="84" y1="172" x2="296" y2="172" stroke="var(--rule)" />
      {bars.map((b) => (
        <rect
          key={b.x}
          x={b.x}
          y={172 - b.h}
          width="14"
          height={b.h}
          rx="2"
          fill={b.accent ? "var(--accent)" : "var(--ink-muted)"}
          opacity={b.accent ? 1 : 0.45}
        />
      ))}
    </DummyWindow>
  );
}

/** Generic app screen: header, three list rows, a primary
 *  action shape. No text beyond the title bar. */
function AppDummy({ title }: { title: string }) {
  const rows = [68, 104, 140];
  return (
    <DummyWindow title={title}>
      <rect
        x="12"
        y="32"
        width="296"
        height="28"
        rx="4"
        fill="var(--bg)"
        stroke="var(--rule)"
      />
      <rect x="24" y="42" width="70" height="8" rx="4" fill="var(--ink)" />
      <rect
        x="252"
        y="38"
        width="44"
        height="16"
        rx="8"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
      {rows.map((y, i) => (
        <g key={y}>
          <circle
            cx="28"
            cy={y + 14}
            r="10"
            fill={i === 0 ? "var(--accent-wash)" : "var(--bg)"}
            stroke="var(--rule)"
          />
          <rect
            x="48"
            y={y + 6}
            width="80"
            height="7"
            rx="3.5"
            fill="var(--ink)"
            opacity="0.85"
          />
          <rect
            x="48"
            y={y + 17}
            width="56"
            height="6"
            rx="3"
            fill="var(--ink-muted)"
            opacity="0.55"
          />
          <rect
            x="260"
            y={y + 7}
            width="36"
            height="14"
            rx="7"
            fill={i === 0 ? "var(--accent)" : "none"}
            stroke={i === 0 ? "none" : "var(--rule)"}
          />
        </g>
      ))}
      <rect
        x="118"
        y="172"
        width="84"
        height="18"
        rx="9"
        fill="var(--accent)"
      />
      <rect x="138" y="178.5" width="44" height="5" rx="2.5" fill="var(--bg)" />
    </DummyWindow>
  );
}

/** Generic data table: header row, four rows of bars and pills,
 *  pagination dots. No values, no numbers. */
function DataDummy({ title }: { title: string }) {
  const rows: { y: number; bar: number; accentPill: boolean }[] = [
    { y: 64, bar: 60, accentPill: false },
    { y: 92, bar: 90, accentPill: true },
    { y: 120, bar: 70, accentPill: false },
    { y: 148, bar: 80, accentPill: false },
  ];
  return (
    <DummyWindow title={title}>
      <rect
        x="12"
        y="32"
        width="296"
        height="24"
        rx="4"
        fill="var(--bg)"
        stroke="var(--rule)"
      />
      {[
        { x: 24, w: 40 },
        { x: 96, w: 60 },
        { x: 176, w: 50 },
        { x: 248, w: 44 },
      ].map((c) => (
        <rect
          key={c.x}
          x={c.x}
          y="41"
          width={c.w}
          height="6"
          rx="3"
          fill="var(--ink-muted)"
          opacity="0.7"
        />
      ))}
      {rows.map((r, i) => (
        <g key={r.y}>
          <rect
            x="20"
            y={r.y + 5}
            width="10"
            height="10"
            rx="2"
            stroke="var(--rule)"
            fill={i === 0 ? "var(--accent)" : "none"}
          />
          <rect
            x="40"
            y={r.y + 7}
            width="48"
            height="6"
            rx="3"
            fill="var(--ink)"
            opacity="0.85"
          />
          <rect
            x="120"
            y={r.y + 6}
            width={r.bar}
            height="8"
            rx="4"
            fill="var(--rule)"
            opacity="0.45"
          />
          <rect
            x="256"
            y={r.y + 4}
            width="36"
            height="12"
            rx="6"
            fill={r.accentPill ? "var(--accent-wash)" : "none"}
            stroke={r.accentPill ? "none" : "var(--rule)"}
          />
        </g>
      ))}
      {[140, 156, 172].map((cx, i) => (
        <circle
          key={cx}
          cx={cx}
          cy="182"
          r="3"
          fill={i === 1 ? "var(--accent)" : "var(--rule)"}
        />
      ))}
    </DummyWindow>
  );
}

/** Generic mobile screen: a phone frame with a hero block, text
 *  lines and a bottom nav, flanked by two floating chips. */
function MobileDummy({ title }: { title: string }) {
  return (
    <DummyWindow title={title}>
      {/* left floating chip */}
      <rect
        x="24"
        y="88"
        width="60"
        height="26"
        rx="13"
        fill="var(--surface)"
        stroke="var(--rule)"
      />
      <circle cx="38" cy="101" r="5" fill="var(--accent)" />
      <rect
        x="48"
        y="98.5"
        width="24"
        height="5"
        rx="2.5"
        fill="var(--ink-muted)"
        opacity="0.6"
      />
      {/* right floating chip */}
      <circle
        cx="292"
        cy="92"
        r="15"
        fill="var(--surface)"
        stroke="var(--rule)"
      />
      <circle cx="292" cy="92" r="5" fill="var(--accent)" />
      {/* phone */}
      <rect
        x="118"
        y="28"
        width="84"
        height="156"
        rx="12"
        fill="var(--surface)"
        stroke="var(--rule)"
        strokeWidth="1.5"
      />
      <rect x="130" y="36" width="24" height="4" rx="2" fill="var(--rule)" />
      <circle cx="188" cy="38" r="2.5" fill="var(--rule)" />
      <rect
        x="126"
        y="46"
        width="68"
        height="52"
        rx="4"
        fill="var(--accent-wash)"
        stroke="var(--rule)"
      />
      <rect
        x="126"
        y="108"
        width="48"
        height="5"
        rx="2.5"
        fill="var(--ink-muted)"
        opacity="0.6"
      />
      <rect
        x="126"
        y="118"
        width="36"
        height="5"
        rx="2.5"
        fill="var(--ink-muted)"
        opacity="0.6"
      />
      {[126, 150, 174].map((x, i) => (
        <rect
          key={x}
          x={x}
          y="130"
          width="16"
          height="16"
          rx="4"
          fill={i === 1 ? "var(--accent)" : "var(--bg)"}
          stroke={i === 1 ? "none" : "var(--rule)"}
        />
      ))}
      {[134, 150, 166, 182].map((cx, i) => (
        <circle
          key={cx}
          cx={cx}
          cy="168"
          r="3"
          fill={i === 1 ? "var(--accent)" : "var(--rule)"}
        />
      ))}
    </DummyWindow>
  );
}

const CARDS = [
  { id: "dashboard", kind: "a", type: "Dashboard", render: DashboardDummy },
  { id: "app", kind: "b", type: "App", render: AppDummy },
  { id: "data", kind: "c", type: "Data", render: DataDummy },
  { id: "mobile", kind: "d", type: "Mobile", render: MobileDummy },
] as const;

/** The deck. The outer .deck-card carries the scroll transform
 *  (fanned rest → 2×2 spread, via --deck-progress); the inner
 *  div carries the load entrance only, so the two never fight.
 *  Entrance delays step 80ms a card, after the hero text starts
 *  (40–200ms), so the whole entrance lands in about a second. */
export function HeroDeck() {
  const placeholder = useContent().ui.heroDeck.placeholder;
  return (
    <div className="hero-deck" aria-hidden="true">
      {CARDS.map((card, i) => {
        const Mockup = card.render;
        return (
          <div key={card.id} className={`deck-card deck-card--${card.kind}`}>
            <div
              className="deck-card-inner"
              style={
                {
                  "--entrance-delay": `${240 + i * 80}ms`,
                } as React.CSSProperties
              }
            >
              <Mockup title={`${card.type} · ${placeholder}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
