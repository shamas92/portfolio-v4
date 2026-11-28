import type Lenis from "lenis";

/** The one Lenis instance, owned by <LenisRoot /> in the root
 *  layout. Null when Lenis is not running — under
 *  prefers-reduced-motion, or before it mounts. */
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null): void {
  lenis = instance;
}

export function getLenis(): Lenis | null {
  return lenis;
}

/** Scroll to a target the way the page scrolls: through Lenis
 *  when it is running (lerp ~0.1), natively otherwise. The
 *  offset is the space left above the target's top — 96px
 *  clears the sticky header, the same value as the
 *  scroll-margin-top on sections and experience cards (which
 *  the native scrollIntoView path honours on its own, so it
 *  takes no offset). `immediate` skips the glide — for the
 *  skip link, where a keyboard reader expects to arrive at
 *  once. */
export function scrollToTarget(
  target: string | HTMLElement,
  opts?: { offset?: number; immediate?: boolean },
): void {
  const el =
    typeof target === "string"
      ? document.getElementById(target.replace(/^#/, ""))
      : target;
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, {
      offset: opts?.offset ?? -96,
      immediate: opts?.immediate ?? false,
    });
    return;
  }
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  el.scrollIntoView({
    behavior: reduceMotion || opts?.immediate ? "auto" : "smooth",
    block: "start",
  });
}
