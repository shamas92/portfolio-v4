"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useContent } from "@/i18n/LocaleProvider";
import { DownloadCvButton } from "./DownloadCvButton";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";

const SECTION_IDS = ["work", "background", "contact"] as const;

/** The global header, rebuilt: a fixed bar that is a full-width
 *  flush container at scroll top and morphs into a centered
 *  floating pill once the user scrolls past 24px. Three zones —
 *  wordmark, sliding-pill section nav, utility cluster — and a
 *  mobile dropdown menu below 1024px. Nav is Work, Background,
 *  Contact only; GitHub and LinkedIn live in Contact, not here.
 *
 *  The header is fixed, so the layout reserves its at-top height
 *  with a .header-spacer div; the morph never moves page content.
 *  The active-section pill is a framer-motion shared-layout element
 *  (layoutId); everything else moves in CSS (transform/opacity). */
export function SiteHeader() {
  const content = useContent();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<string | null>("work");
  const [scrolled, setScrolled] = useState(false);
  /* The menu is open for the route it was opened on: a route change
   *  closes it by derivation, with no effect and no ref. */
  const [menuPathname, setMenuPathname] = useState<string | null>(null);
  const isMenuOpen = menuPathname !== null && menuPathname === pathname;
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  /* A nav click names its destination: the pill moves to the
   * clicked item at once and stays there while the smooth scroll
   * runs, instead of trailing the sections the viewport passes
   * through. `topAtClick` is the destination's viewport top when
   * the click happened; `lastY` is the scroll position at the
   * previous computation, so a manual scroll away from the
   * destination is recognised. */
  const navTarget = useRef<{ id: string; topAtClick: number } | null>(null);
  const lastY = useRef<number | null>(null);

  function goTo(id: string) {
    const el = document.getElementById(id);
    navTarget.current = {
      id,
      topAtClick: el ? el.getBoundingClientRect().top : 0,
    };
    setActive(id);
  }

  const ui = content.ui;
  const sections = [
    { id: "work", label: ui.nav.work, href: "/#work" },
    { id: "background", label: ui.nav.background, href: "/#background" },
    { id: "contact", label: ui.nav.contact, href: "/#contact" },
  ];
  const isCasePage = pathname?.startsWith("/work/") ?? false;
  /* On a case page there is no Work section in view, so Work stays
   *  active by rule instead of by scroll-spy. */
  const activeSection = isCasePage ? "work" : active;

  /* Scroll state: the pill morph starts at y >= 24px. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Active-section tracking: a scroll-position computation, not an
   * IntersectionObserver. The observer it replaced watched a 5%
   * band (rootMargin -40%/-55%) that the Contact footer — 441px
   * tall at the page end — never enters at maximum scroll on
   * desktop widths (footer top 459px against a band bottom of
   * 405px at 1440x900), so Contact never became active and the
   * last section to cross the band stayed highlighted. The
   * computation below has a bottom-of-page rule, so the last
   * section is active exactly when the page cannot scroll
   * further. One `active` string means at most one item is
   * active. A nav click names its destination at once (see
   * goTo): the pill moves to the clicked item and holds there
   * while the smooth scroll runs, instead of trailing the
   * sections the viewport passes through. On a case page the
   * whole effect is skipped — Work is active by rule (see
   * activeSection above). */
  useEffect(() => {
    if (isCasePage) return;
    let raf = 0;
    const compute = () => {
      raf = 0;
      const doc = document.documentElement;
      const vh = window.innerHeight;
      const line = vh * 0.4;
      const y = window.scrollY;
      /* Position-based value: the bottom rule, else the last
       * section whose top has crossed the 40% line — the same
       * line the old observer band used. */
      let current: string;
      if (y + vh >= doc.scrollHeight - 4) {
        current = "contact";
      } else {
        current = "work";
        for (const id of SECTION_IDS) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= line) current = id;
        }
      }
      /* A click names its destination: hold it while the smooth
       * scroll runs toward it. It clears the moment the
       * position computation agrees it is current, or the
       * moment the reader scrolls the other way — a wheel, a
       * scrollbar drag, a touch, a key — so a manual scroll
       * never leaves a stale highlight. */
      const target = navTarget.current;
      if (target && current !== target.id) {
        const below = target.topAtClick > line;
        const prevY = lastY.current ?? y;
        const movingAway = below ? y < prevY - 2 : y > prevY + 2;
        if (movingAway) {
          navTarget.current = null;
        } else {
          lastY.current = y;
          setActive(target.id);
          return;
        }
      } else if (target) {
        navTarget.current = null;
      }
      lastY.current = y;
      setActive(current);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(compute);
    };
    /* Direct fragment visits and back/forward: the hash names the
     * active section immediately; the scroll handler confirms it
     * once the jump settles. A back/forward to a different hash
     * drops any click target that is not the hash just landed on. */
    const onHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if ((SECTION_IDS as readonly string[]).includes(hash)) {
        if (navTarget.current?.id !== hash) navTarget.current = null;
        setActive(hash);
      }
    };
    compute();
    onHash();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("hashchange", onHash);
    /* A manual scroll input drops the click target at once, even
     * before the scroll position has moved: the reader has taken
     * control, so the position computation — not the destination
     * — decides the highlight from here on. A programmatic
     * smooth scroll fires none of these. The page may not move
     * (already at the top), so no scroll event follows: schedule
     * a computation so the highlight corrects itself on the next
     * frame instead of going stale. */
    const onInput = (e: Event) => {
      if (!navTarget.current) return;
      if (e.type === "keydown") {
        const k = (e as KeyboardEvent).key;
        if (
          ![
            "ArrowUp",
            "ArrowDown",
            "PageUp",
            "PageDown",
            "Home",
            "End",
            " ",
          ].includes(k)
        )
          return;
      }
      navTarget.current = null;
      onScroll();
    };
    window.addEventListener("wheel", onInput, { passive: true });
    window.addEventListener("touchmove", onInput, { passive: true });
    window.addEventListener("keydown", onInput);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("wheel", onInput);
      window.removeEventListener("touchmove", onInput);
      window.removeEventListener("keydown", onInput);
    };
  }, [isCasePage]);

  function closeMenu(returnFocus = true) {
    setMenuPathname(null);
    if (returnFocus) menuButtonRef.current?.focus();
  }

  function toggleMenu() {
    setMenuPathname((prev) => (prev === pathname ? null : pathname));
  }

  /* Close the menu on hash change (a menu link is an anchor jump,
   *  which does not change the pathname). Links also close it
   *  directly on click; route changes are handled above. */
  useEffect(() => {
    const onHash = () => setMenuPathname(null);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  /* Body scroll lock while the menu is open. */
  useEffect(() => {
    if (!isMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMenuOpen]);

  /* Focus management: on open, focus the first menu link. While
   *  open, Escape closes (and returns focus to the hamburger) and
   *  Tab wraps inside the panel. */
  useEffect(() => {
    if (!isMenuOpen) return;
    const panel = menuRef.current;
    panel
      ?.querySelector<HTMLElement>("a[href], button:not([disabled])")
      ?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const focusables = [
        ...panel.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])",
        ),
      ].filter((el) => el.offsetParent !== null);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  const pillTransition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 420, damping: 32 };

  return (
    <header
      className={`site-header${scrolled ? " is-scrolled" : ""}${
        isMenuOpen ? " is-menu-open" : ""
      }`}
    >
      <div className="site-header-inner">
        <div className="header-left">
          <Link className="site-name" href="/">
            <span className="site-monogram" aria-hidden="true">
              SR
            </span>
            <span className="site-name-words">
              <span className="site-name-text">{content.profile.name}</span>
              <span className="site-name-role">{content.profile.role}</span>
            </span>
          </Link>
        </div>

        <nav className="site-nav" aria-label={ui.navLabel}>
          {sections.map((s) => {
            const isActive = activeSection === s.id;
            return (
              <Link
                key={s.id}
                href={s.href}
                aria-current={isActive ? "true" : undefined}
                /* Highlight at once: goTo names the destination
                 * and holds it while the smooth scroll runs. */
                onClick={() => goTo(s.id)}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-nav-pill"
                    className="nav-pill"
                    transition={pillTransition}
                    aria-hidden="true"
                  />
                )}
                <span className="nav-label">{s.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="site-actions">
          <DownloadCvButton className="copy-btn copy-btn--pill copy-desktop" />
          <DownloadCvButton
            className="copy-btn copy-btn--pill copy-btn--icon copy-mobile"
            iconOnly
          />
          <div className="header-lang">
            <LanguageToggle />
          </div>
          <div className="header-theme">
            <ThemeToggle />
          </div>
          <button
            type="button"
            className="menu-button"
            ref={menuButtonRef}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? ui.header.menuClose : ui.header.menuOpen}
            onClick={toggleMenu}
          >
            <span className="menu-line" aria-hidden="true" />
            <span className="menu-line" aria-hidden="true" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="mobile-menu"
            id="mobile-menu"
            ref={menuRef}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <nav aria-label={ui.header.menuNavLabel}>
              {sections.map((s) => (
                <Link
                  key={s.id}
                  href={s.href}
                  className="mobile-menu-link"
                  aria-current={activeSection === s.id ? "true" : undefined}
                  onClick={() => {
                    goTo(s.id);
                    closeMenu();
                  }}
                >
                  {s.label}
                </Link>
              ))}
            </nav>
            <div className="mobile-menu-strip">
              <p className="mobile-menu-location">{content.profile.location}</p>
              <a
                className="mobile-menu-email"
                href={`mailto:${content.profile.email}`}
                onClick={() => closeMenu()}
              >
                {ui.hero.emailMe}
              </a>
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
