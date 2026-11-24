/**
 * Pixel field: the contact ending's closing band, inspired by the
 * reference's orange pixels rising from the bottom. A
 * deterministic seeded grid (72 x 5 cells) whose density grows
 * toward the bottom, in the portfolio's oxide-red accent with a
 * few rule-coloured squares for variation. Static SVG — no
 * animation, no canvas, no JavaScript at runtime — so it costs
 * nothing and is fully static under prefers-reduced-motion. It
 * is revealed by the existing Reveal (opacity/transform only).
 * Decorative: aria-hidden, no text, no meaning. */
const COLS = 72;
const ROWS = 5;
const CELL = 12;
const SIZE = 10;

type Pixel = { x: number; y: number; fill: string; opacity: number };

function hash(n: number): number {
  const h = Math.sin(n) * 43758.5453;
  return h - Math.floor(h);
}

const PIXELS: Pixel[] = [];
for (let row = 0; row < ROWS; row++) {
  const density = 0.05 + 0.85 * Math.pow(row / (ROWS - 1), 1.6);
  for (let col = 0; col < COLS; col++) {
    if (hash(col * 127.1 + row * 311.7) < density) {
      const h2 = hash(col * 269.5 + row * 183.3);
      PIXELS.push({
        x: col * CELL,
        y: row * CELL,
        fill: h2 < 0.78 ? "var(--accent)" : "var(--rule)",
        opacity: h2 < 0.5 ? 1 : h2 < 0.78 ? 0.55 : 0.8,
      });
    }
  }
}

export function PixelField() {
  return (
    <svg
      className="footer-pixel-field"
      viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      {PIXELS.map((p, i) => (
        <rect
          key={i}
          x={p.x}
          y={p.y}
          width={SIZE}
          height={SIZE}
          fill={p.fill}
          opacity={p.opacity}
        />
      ))}
    </svg>
  );
}
