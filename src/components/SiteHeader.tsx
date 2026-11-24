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

  const ui = content.ui;
  const sections = [
    { id: "work", label: ui.nav.work, href: "/#work" },
    { id: "background", label: ui.nav.background, href: "/#background" },
    { id: "contact", label: ui.nav.contact, href: "#contact" },
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

  /* Scroll-spy: the section in the middle band of the viewport is
   *  active. On a case page the observer is skipped — Work is
   *  active by rule (see activeSection above). */
  useEffect(() => {
    if (isCasePage) return;
    const targets = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (targets.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
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
            <span className="site-name-text">{content.profile.name}</span>
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
                  onClick={() => closeMenu()}
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
