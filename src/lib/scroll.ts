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
 *  landing is 96px above the target's top — the sticky
 *  header's clearance, the same value as the
 *  scroll-margin-top on sections and experience cards. The
 *  native scrollIntoView path honours scroll-margin-top on
 *  its own, so it takes no offset — and neither does the
 *  Lenis path: Lenis's scrollTo already subtracts the
 *  element's scroll-margin-top before applying the offset,
 *  so passing −96 double-counted it and every Lenis jump
 *  landed at 192px. Offset 0 in the Lenis path lands at
 *  96px, like the native path. `immediate` skips the glide
 *  — for the skip link, where a keyboard reader expects to
 *  arrive at once. */
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
      offset: opts?.offset ?? 0,
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
