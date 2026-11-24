/**
 * Polished interface mockups for the three flagship cards (and the
 * case-page Evidence sections). Inline SVG, theme-aware through CSS
 * custom properties in presentation attributes (the same pattern the
 * previous diagrams used), fixed aspect ratio via viewBox (400x240)
 * so there is no layout shift. A shared window-chrome language —
 * title bar, status strip — gives the three a coherent visual
 * identity. No invented numbers: the LeaseLens deposit figures and
 * 86.1% IoU are verified, the ETL node and table names are the real
 * ones, and the OratorPath bars are schematic with no numeric
 * labels. Labels come from the locale content, so the mockups read
 * in German too. The ETL connectors keep the animated dash flow
 * (.etl-flow); everything else is static.
 */
"use client";

import type { ReactNode } from "react";
import { useContent } from "@/i18n/LocaleProvider";

const mono = "var(--font-mono)";

/** Shared window chrome: frame, title bar, status strip. */
function MockupWindow({
  ariaLabel,
  title,
  windowTitle,
  status,
  statusAccent = false,
  children,
}: {
  ariaLabel: string;
  title: string;
  windowTitle: string;
  status: string;
  statusAccent?: boolean;
  children: ReactNode;
}) {
  return (
    <svg viewBox="0 0 400 240" role="img" aria-label={ariaLabel}>
      <title>{title}</title>
      {/* window frame */}
      <rect
        x="1"
        y="1"
        width="398"
        height="238"
        rx="6"
        fill="var(--surface)"
        stroke="var(--rule)"
        strokeWidth="1"
      />
      {/* title bar */}
      <line x1="1" y1="30" x2="399" y2="30" stroke="var(--rule)" />
      <circle cx="16" cy="15" r="3.5" fill="var(--accent)" />
      <circle cx="28" cy="15" r="3.5" fill="var(--rule)" />
      <circle cx="40" cy="15" r="3.5" fill="var(--rule)" />
      <text
        x="58"
        y="19"
        fontFamily={mono}
        fontSize="9"
        letterSpacing="1"
        fill="var(--ink-muted)"
      >
        {windowTitle}
      </text>
      {/* status strip */}
      <line x1="1" y1="212" x2="399" y2="212" stroke="var(--rule)" />
      <text
        x="16"
        y="229"
        fontFamily={mono}
        fontSize="9"
        letterSpacing="0.5"
        fill={statusAccent ? "var(--accent-ink)" : "var(--ink-muted)"}
      >
        {status}
      </text>
      {children}
    </svg>
  );
}

export function LeaseLensAsset() {
  const labels = useContent().ui.assets.leaselens;
  return (
    <MockupWindow
      ariaLabel={labels.ariaLabel}
      title={labels.title}
      windowTitle={labels.window}
      status={labels.status}
      statusAccent
    >
      {/* plate labels */}
      <text
        x="16"
        y="42"
        fontFamily={mono}
        fontSize="9"
        letterSpacing="1"
        fill="var(--ink-muted)"
      >
        {labels.moveIn}
      </text>
      <text
        x="208"
        y="42"
        fontFamily={mono}
        fontSize="9"
        letterSpacing="1"
        fill="var(--ink-muted)"
      >
        {labels.moveOut}
      </text>
      {/* move-in plate: the boundary is offset from the room —
          the misalignment the registration check resolves */}
      <rect
        x="16"
        y="48"
        width="176"
        height="88"
        rx="4"
        fill="none"
        stroke="var(--rule)"
        strokeWidth="1"
      />
      <rect
        x="44"
        y="66"
        width="120"
        height="52"
        fill="none"
        stroke="var(--ink-muted)"
        strokeWidth="1.5"
      />
      <rect
        x="50"
        y="60"
        width="104"
        height="36"
        fill="none"
        stroke="var(--rule)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />
      {/* move-out plate: the boundary sits inside the room,
          registered, with a reticle at the centre */}
      <rect
        x="208"
        y="48"
        width="176"
        height="88"
        rx="4"
        fill="none"
        stroke="var(--rule)"
        strokeWidth="1"
      />
      <rect
        x="236"
        y="66"
        width="120"
        height="52"
        fill="none"
        stroke="var(--ink-muted)"
        strokeWidth="1.5"
      />
      <rect
        x="244"
        y="74"
        width="104"
        height="36"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
      <circle
        cx="296"
        cy="92"
        r="9"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
      <line
        x1="287"
        y1="92"
        x2="305"
        y2="92"
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
      <line
        x1="296"
        y1="83"
        x2="296"
        y2="101"
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
      {/* deposit math, from the verified dorm lease */}
      <rect
        x="16"
        y="152"
        width="368"
        height="44"
        rx="4"
        fill="var(--accent-wash)"
      />
      <line x1="136" y1="162" x2="136" y2="186" stroke="var(--rule)" />
      <line x1="256" y1="162" x2="256" y2="186" stroke="var(--rule)" />
      <text
        x="32"
        y="168"
        fontFamily={mono}
        fontSize="8"
        letterSpacing="1"
        fill="var(--ink-muted)"
      >
        {labels.deposit}
      </text>
      <text
        x="32"
        y="186"
        fontFamily={mono}
        fontSize="12"
        fontWeight="600"
        fill="var(--ink)"
      >
        €950.00
      </text>
      <text
        x="152"
        y="168"
        fontFamily={mono}
        fontSize="8"
        letterSpacing="1"
        fill="var(--ink-muted)"
      >
        {labels.cap}
      </text>
      <text
        x="152"
        y="186"
        fontFamily={mono}
        fontSize="12"
        fontWeight="600"
        fill="var(--ink)"
      >
        €535.41
      </text>
      <text
        x="272"
        y="168"
        fontFamily={mono}
        fontSize="8"
        letterSpacing="1"
        fill="var(--ink-muted)"
      >
        {labels.excess}
      </text>
      <text
        x="272"
        y="186"
        fontFamily={mono}
        fontSize="12"
        fontWeight="600"
        fill="var(--accent-ink)"
      >
        €414.59
      </text>
    </MockupWindow>
  );
}

export function EtlAsset() {
  const labels = useContent().ui.assets.etl;
  const nodes: { x: number; lines: string[] }[] = [
    { x: 16, lines: [labels.sources] },
    { x: 108, lines: ["MinIO", "Parquet"] },
    { x: 200, lines: [labels.airflow, labels.tasks] },
    { x: 292, lines: ["PostgreSQL"] },
  ];
  const chips: { x: number; w: number; label: string; accent: boolean }[] = [
    { x: 16, w: 72, label: "dim_date", accent: false },
    { x: 96, w: 92, label: "dim_customer", accent: false },
    { x: 196, w: 88, label: "dim_product", accent: false },
    { x: 292, w: 92, label: "fact_sales", accent: true },
  ];
  return (
    <MockupWindow
      ariaLabel={labels.ariaLabel}
      title={labels.title}
      windowTitle={labels.window}
      status={labels.footer}
    >
      {/* four pipeline stages, numbered, joined by the animated flow */}
      {nodes.map((node, i) => (
        <g key={node.x}>
          <text
            x={node.x + 38}
            y="50"
            fontFamily={mono}
            fontSize="8"
            textAnchor="middle"
            fill="var(--accent-ink)"
          >
            {`0${i + 1}`}
          </text>
          <rect
            x={node.x}
            y="58"
            width="76"
            height="54"
            rx="4"
            fill="var(--bg)"
            stroke="var(--rule)"
            strokeWidth="1"
          />
          {node.lines.length === 1 ? (
            <text
              x={node.x + 38}
              y="89"
              fontFamily={mono}
              fontSize="9"
              textAnchor="middle"
              fill="var(--ink)"
            >
              {node.lines[0]}
            </text>
          ) : (
            <>
              <text
                x={node.x + 38}
                y="83"
                fontFamily={mono}
                fontSize="8"
                textAnchor="middle"
                fill="var(--ink)"
              >
                {node.lines[0]}
              </text>
              <text
                x={node.x + 38}
                y="97"
                fontFamily={mono}
                fontSize="8"
                textAnchor="middle"
                fill="var(--ink)"
              >
                {node.lines[1]}
              </text>
            </>
          )}
        </g>
      ))}
      {[92, 184, 276].map((x1) => (
        <g key={x1}>
          <line
            className="etl-flow"
            x1={x1}
            y1="85"
            x2={x1 + 16}
            y2="85"
            stroke="var(--accent)"
            strokeWidth="1.5"
          />
          <path d={`M ${x1 + 16} 85 l -7 -4 v 8 z`} fill="var(--accent)" />
        </g>
      ))}
      {/* star schema: three dimensions, one fact table */}
      <text
        x="16"
        y="144"
        fontFamily={mono}
        fontSize="8"
        letterSpacing="1"
        fill="var(--ink-muted)"
      >
        {labels.schema}
      </text>
      {chips.map((chip) => (
        <g key={chip.label}>
          <rect
            x={chip.x}
            y="152"
            width={chip.w}
            height="28"
            rx="14"
            fill="var(--bg)"
            stroke={chip.accent ? "var(--accent)" : "var(--rule)"}
            strokeWidth="1"
          />
          <text
            x={chip.x + chip.w / 2}
            y="170"
            fontFamily={mono}
            fontSize="8"
            textAnchor="middle"
            fill={chip.accent ? "var(--accent-ink)" : "var(--ink-muted)"}
          >
            {chip.label}
          </text>
        </g>
      ))}
    </MockupWindow>
  );
}

/** Deterministic waveform: a slow amplitude modulation over a fast
 *  carrier, so the shape reads as speech without inventing data. */
function waveformPoints(): string {
  const pts: string[] = [];
  for (let x = 24; x <= 376; x += 8) {
    const y = 84 + 24 * Math.sin(x * 0.09) * Math.sin(x * 0.021 + 1.2);
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return pts.join(" ");
}

export function OratorPathAsset() {
  const labels = useContent().ui.assets.orator;
  const bars: { label: string; width: number }[] = [
    { label: labels.pace, width: 154 },
    { label: labels.fillerWords, width: 70 },
    { label: labels.clarity, width: 208 },
  ];
  return (
    <MockupWindow
      ariaLabel={labels.ariaLabel}
      title={labels.title}
      windowTitle={labels.window}
      status={labels.paper}
    >
      {/* waveform with a playhead */}
      <rect
        x="16"
        y="48"
        width="368"
        height="72"
        rx="4"
        fill="var(--bg)"
        stroke="var(--rule)"
        strokeWidth="1"
      />
      <polyline
        points={waveformPoints()}
        fill="none"
        stroke="var(--ink)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <line
        x1="200"
        y1="52"
        x2="200"
        y2="116"
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
      <circle cx="200" cy="52" r="3" fill="var(--accent)" />
      {/* metric bars: schematic proportions only, no numbers */}
      {bars.map((bar, i) => {
        const y = 140 + i * 24;
        return (
          <g key={bar.label}>
            <text
              x="16"
              y={y + 8}
              fontFamily={mono}
              fontSize="9"
              fill="var(--ink-muted)"
            >
              {bar.label}
            </text>
            <rect
              x="120"
              y={y}
              width="248"
              height="10"
              rx="5"
              fill="var(--rule)"
              opacity="0.25"
            />
            <rect
              x="120"
              y={y}
              width={bar.width}
              height="10"
              rx="5"
              fill="var(--accent)"
            />
          </g>
        );
      })}
    </MockupWindow>
  );
}
