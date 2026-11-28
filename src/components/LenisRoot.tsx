"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { scrollToTarget, setLenis } from "@/lib/scroll";

/** Lenis smooth scroll, site-wide (user decision 2026-11-28,
 *  "Build it with Lenis too"): lerp 0.1. It is page-global by
 *  design, so it smooths the Work track too — the track's
 *  sync() reads the smoothed scrollY and glides instead of
 *  tracking the wheel exactly, which reverses the deliberate
 *  1:1 direct scroll from 2026-11-26. There is no second
 *  smoothing stage anywhere: the track writes --track-x
 *  straight from scrollY, and the progress line keeps its own
 *  100ms sweep.
 *
 *  Gated off under prefers-reduced-motion at init: no Lenis
 *  instance, no rAF loop, native scroll throughout. While
 *  Lenis runs, <html data-lenis="on"> disables the CSS
 *  scroll-behavior: smooth (globals.css), so a jump is never
 *  double-animated (native smooth + Lenis).
 *
 *  Same-page anchor clicks are routed through lenis.scrollTo
 *  by the delegated handler below (footer Explore links, the
 *  Skills coursework link, the skip link). The header nav is
 *  the exception: SiteHeader.goTo names its destination and
 *  stops the event before it reaches this handler, because it
 *  also sets the active-section state. Cross-page links
 *  (e.g. a case page's back link to /#work) are left to Next —
 *  Lenis syncs to the native scroll after the navigation. */
export function LenisRoot() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const lenis = new Lenis({ lerp: 0.1 });
    setLenis(lenis);
    document.documentElement.setAttribute("data-lenis", "on");
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest?.(
        "a[href]",
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      /* Same-page hash links only: "#id" anywhere, or "/#id"
         while already on the home page. Anything else —
         route changes, mailto, external — passes through. */
      let hash = "";
      if (href.startsWith("#")) {
        hash = href.slice(1);
      } else if (
        href.startsWith("/#") &&
        window.location.pathname === "/"
      ) {
        hash = href.slice(2);
      } else {
        return;
      }
      const el = hash ? document.getElementById(hash) : null;
      if (!el) return;
      e.preventDefault();
      /* The skip link arrives at once and moves focus to its
         target; every other anchor glides with the 96px
         header offset. */
      const isSkipLink = anchor.classList.contains("skip-link");
      scrollToTarget(el, {
        immediate: isSkipLink,
      });
      window.history.pushState(null, "", `#${hash}`);
      if (isSkipLink) {
        el.focus({ preventScroll: true });
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      document.documentElement.removeAttribute("data-lenis");
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
