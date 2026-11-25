"use client";

import { useEffect, useState } from "react";
import { useContent } from "@/i18n/LocaleProvider";

/** Dresden location panel: a compact, honest treatment inspired
 *  by the topographic reference. The contour lines are a
 *  decorative motif — abstract wavy rings generated here, never
 *  presented as real Dresden topography (no elevations, peaks or
 *  coordinates are shown). The facts are the verified ones:
 *  Dresden, Germany, plus a live Dresden clock (Europe/Berlin).
 *  The clock renders only after mount so the server and client
 *  HTML match; the time span reserves its width so the panel
 *  does not shift when the clock appears. No street address is
 *  shown here: the public site names the city only, and the full
 *  address stays in the CV PDF. */

function contourPath(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  wobble: number,
  phase: number,
): string {
  const steps = 48;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 2;
    const r =
      1 +
      wobble * Math.sin(3 * theta + phase) +
      (wobble / 2) * Math.sin(5 * theta + phase * 2);
    const x = cx + rx * r * Math.cos(theta);
    const y = cy + ry * r * Math.sin(theta);
    pts.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return `${pts.join(" ")} Z`;
}

const CONTOURS = [30, 54, 78, 102, 126, 150].map((rx, i) => ({
  d: contourPath(200, 100, rx, rx * 0.62, 0.07, i * 0.9),
  accent: i === 0,
}));

const dresdenTime = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Berlin",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZoneName: "short",
});

export function LocationPanel() {
  const content = useContent();
  const loc = content.ui.background.location;
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="location-panel">
      <div className="location-contours" aria-hidden="true">
        <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
          {CONTOURS.map((c) => (
            <path
              key={c.d}
              d={c.d}
              fill="none"
              stroke={c.accent ? "var(--accent)" : "var(--rule)"}
              strokeWidth="1"
              opacity={c.accent ? 1 : 0.7}
            />
          ))}
          <circle cx="200" cy="100" r="3" fill="var(--accent)" />
        </svg>
      </div>
      <div className="location-body">
        <p className="location-eyebrow">{loc.eyebrow}</p>
        <p className="location-place">{content.profile.location}</p>
        <p className="location-clock">
          {loc.nowIn} ·{" "}
          <time
            dateTime={now ? now.toISOString() : undefined}
            className="location-clock-time"
          >
            {now ? dresdenTime.format(now) : ""}
          </time>
        </p>
      </div>
    </div>
  );
}
