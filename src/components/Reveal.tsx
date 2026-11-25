"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Scroll reveal, trigger once at ~20% visibility: a 16px rise
 *  plus an opacity fade. The hidden state applies only when JS
 *  runs (the head script adds .js before first paint), so readers
 *  without JavaScript see the content as-is.
 *
 *  The threshold is overridable because a tall target can sit
 *  with its top in the viewport while less than 20% of it is
 *  visible — the work cards are ~500px tall, so at 1440x900
 *  the 0.2 default fires once ~100px shows. A taller target
 *  passes a lower threshold, so the work is visible on arrival
 *  instead of blank. */
export function useReveal<T extends HTMLElement>(
  threshold = 0.2,
  baseClass = "reveal",
) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    /* No reduced-motion branch here: the stylesheet already shows
       reveal targets instantly under prefers-reduced-motion, so
       the observer only ever adds the visible class. */
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, className: `${baseClass}${visible ? " is-visible" : ""}` };
}

export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { ref, className: revealClass } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`${revealClass}${className ? ` ${className}` : ""}`}
    >
      {children}
    </div>
  );
}
