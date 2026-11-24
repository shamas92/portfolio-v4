"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useContent } from "@/i18n/LocaleProvider";
import { CopyEmailButton } from "./CopyEmailButton";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const SECTION_IDS = ["work", "background", "stack", "contact"] as const;

/** The global header, rebuilt: a fixed bar that is a full-width
 *  flush container at scroll top and morphs into a centered
 *  floating pill once the user scrolls past 24px. Three zones —
 *  wordmark + presence, sliding-pill section nav, utility cluster
 *  — and a mobile dropdown menu below 768px.
 *
 *  The header is fixed, so the layout reserves its at-top height
 *  with a .header-spacer div; the morph never moves page content.
 *  The active-section pill is a framer-motion shared-layout element
 *  (layoutId); everything else moves in CSS (transform/opacity). */
export function SiteHeader() {
  const content = useContent();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);
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
    { id: "stack", label: ui.nav.stack, href: "/#stack" },
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
          <span
            className="presence has-tooltip"
            title={ui.header.availabilityTooltip}
          >
            <span className="presence-dot" aria-hidden="true" />
            <span className="visually-hidden">
              {ui.header.availabilityTooltip}
            </span>
            <span className="tooltip" aria-hidden="true">
              {ui.header.availabilityTooltip}
            </span>
          </span>
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
          <a
            className="site-action-icon has-tooltip"
            href={content.profile.github}
            target="_blank"
            rel="noreferrer"
            aria-label={ui.header.githubLabel}
          >
            <GithubIcon />
            <span className="tooltip" aria-hidden="true">
              GitHub
            </span>
          </a>
          <a
            className="site-action-icon has-tooltip"
            href={content.profile.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label={ui.header.linkedinLabel}
          >
            <LinkedinIcon />
            <span className="tooltip" aria-hidden="true">
              LinkedIn
            </span>
          </a>
          <CopyEmailButton variant="pill" className="copy-desktop" />
          <CopyEmailButton variant="pill" iconOnly className="copy-mobile" />
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
                className="site-action-icon"
                href={content.profile.github}
                target="_blank"
                rel="noreferrer"
                aria-label={ui.header.githubLabel}
              >
                <GithubIcon />
              </a>
              <a
                className="site-action-icon"
                href={content.profile.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label={ui.header.linkedinLabel}
              >
                <LinkedinIcon />
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
