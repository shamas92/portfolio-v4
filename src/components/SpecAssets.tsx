/**
 * Custom technical SVG illustrations for the three flagship cards.
 * Inline, theme-aware (currentColor + the accent token), fixed
 * aspect ratio via viewBox so there is no layout shift. The ETL
 * connectors carry the animated dash flow; everything else is
 * static. No invented numbers: the OratorPath bars are schematic
 * (no numeric labels), and the LeaseLens 86.1% IoU label is a
 * verified figure. Labels come from the locale content, so the
 * diagrams read in German too.
 */
"use client";

import { useContent } from "@/i18n/LocaleProvider";

const mono = "var(--font-mono)";

export function LeaseLensAsset() {
  const labels = useContent().ui.assets.leaselens;
  return (
    <svg viewBox="0 0 400 200" role="img" aria-label={labels.ariaLabel}>
      <title>{labels.title}</title>
      {/* room outline */}
      <rect
        x="28"
        y="28"
        width="344"
        height="144"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* split frame */}
      <line
        x1="200"
        y1="28"
        x2="200"
        y2="172"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 4"
        opacity="0.4"
      />
      {/* move-in boundary */}
      <rect
        x="52"
        y="52"
        width="120"
        height="96"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.65"
      />
      {/* move-out boundary, offset to show the misalignment */}
      <rect
        x="72"
        y="62"
        width="120"
        height="96"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
      {/* segmentation bounding box */}
      <rect
        x="180"
        y="70"
        width="150"
        height="80"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeDasharray="5 4"
      />
      {/* alignment reticle */}
      <circle
        cx="255"
        cy="110"
        r="16"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
      <line
        x1="235"
        y1="110"
        x2="275"
        y2="110"
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
      <line
        x1="255"
        y1="90"
        x2="255"
        y2="130"
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
      <text
        x="52"
        y="44"
        fontFamily={mono}
        fontSize="10"
        letterSpacing="1"
        fill="currentColor"
      >
        {labels.moveIn}
      </text>
      <text
        x="372"
        y="44"
        textAnchor="end"
        fontFamily={mono}
        fontSize="10"
        letterSpacing="1"
        fill="var(--accent)"
      >
        {labels.moveOut}
      </text>
      <text
        x="200"
        y="192"
        textAnchor="middle"
        fontFamily={mono}
        fontSize="11"
        fontWeight="500"
        letterSpacing="1"
        fill="var(--accent)"
      >
        {labels.iou}
      </text>
    </svg>
  );
}

export function EtlAsset() {
  const labels = useContent().ui.assets.etl;
  const nodes = [
    { x: 12, lines: [labels.sources] },
    { x: 112, lines: ["MinIO", "Parquet"] },
    { x: 212, lines: [labels.airflow, labels.tasks] },
    { x: 312, lines: ["PostgreSQL"] },
  ];
  const connectors = [88, 188, 288];
  return (
    <svg viewBox="0 0 400 200" role="img" aria-label={labels.ariaLabel}>
      <title>{labels.title}</title>
      {connectors.map((x) => (
        <g key={x}>
          <line
            className="etl-flow"
            x1={x}
            y1="100"
            x2={x + 24}
            y2="100"
            stroke="var(--accent)"
            strokeWidth="1.5"
          />
          <polyline
            points={`${x + 18},96 ${x + 24},100 ${x + 18},104`}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.5"
          />
        </g>
      ))}
      {nodes.map((node) => (
        <g key={node.x}>
          <rect
            x={node.x}
            y="78"
            width="76"
            height="44"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          {node.lines.map((line, i) => (
            <text
              key={line}
              x={node.x + 38}
              y={node.lines.length > 1 ? 97 + i * 13 : 103}
              textAnchor="middle"
              fontFamily={mono}
              fontSize="10"
              letterSpacing="0.5"
              fill="currentColor"
            >
              {line}
            </text>
          ))}
        </g>
      ))}
      <text
        x="200"
        y="160"
        textAnchor="middle"
        fontFamily={mono}
        fontSize="10"
        letterSpacing="1"
        fill="currentColor"
        opacity="0.65"
      >
        {labels.footer}
      </text>
    </svg>
  );
}

export function OratorPathAsset() {
  const labels = useContent().ui.assets.orator;
  const bars = [
    { label: labels.pace, x: 30, width: 64 },
    { label: labels.fillerWords, x: 150, width: 34 },
    { label: labels.clarity, x: 270, width: 82 },
  ];
  return (
    <svg viewBox="0 0 400 200" role="img" aria-label={labels.ariaLabel}>
      <title>{labels.title}</title>
      {/* waveform */}
      <polyline
        points="20,65 28,52 36,78 44,44 52,86 60,58 68,70 76,48 84,80 92,62 100,55 108,74 116,40 124,88 132,60 140,68 148,50 156,82 164,58 172,66 180,46 188,84 196,62 204,56 212,76 220,44 228,86 236,60 244,70 252,52 260,80 268,64 276,58 284,72 292,48 300,84 308,62 316,56 324,74 332,42 340,88 348,60 356,68 364,54 372,76 380,65"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <line
        x1="20"
        y1="100"
        x2="380"
        y2="100"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.35"
      />
      {/* metric bars — schematic heights, no numbers */}
      {bars.map((bar) => (
        <g key={bar.label}>
          <text
            x={bar.x}
            y="128"
            fontFamily={mono}
            fontSize="10"
            letterSpacing="1"
            fill="currentColor"
          >
            {bar.label}
          </text>
          <rect
            x={bar.x}
            y="138"
            width="100"
            height="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.5"
          />
          <rect
            x={bar.x}
            y="138"
            width={bar.width}
            height="10"
            fill="var(--accent)"
          />
        </g>
      ))}
    </svg>
  );
}
