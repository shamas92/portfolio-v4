"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Scroll reveal, trigger once at ~20% visibility: a 16px rise
 *  plus an opacity fade. The hidden state applies only when JS
 *  runs (the head script adds .js before first paint), so readers
 *  without JavaScript see the content as-is. */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, className: `reveal${visible ? " is-visible" : ""}` };
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
    <div ref={ref} className={`${revealClass}${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
}
