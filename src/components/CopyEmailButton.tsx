"use client";

import { useEffect, useRef, useState } from "react";
import { useContent } from "@/i18n/LocaleProvider";

function EnvelopeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="m3.5 7 8.5 6 8.5-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12.5 9.5 18 20 6.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Copy-email action. Four shapes from one component: the outline
 *  button the footer uses, a high-contrast pill, an icon-only
 *  pill, and a plain text link (the footer-links row, audit S3:
 *  the whole row is one text treatment, no pills next to bare
 *  links). The label swaps inline to "Copied ✓" for 2 seconds with a
 *  scale pop, and the icon morphs from envelope to check
 *  (transform/opacity only). An aria-live region announces the
 *  result. */
export function CopyEmailButton({
  variant = "outline",
  iconOnly = false,
  className = "",
}: {
  variant?: "outline" | "pill" | "text";
  iconOnly?: boolean;
  className?: string;
}) {
  const content = useContent();
  const ui = content.ui.copy;
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(content.profile.email);
      setCopyState("copied");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("failed");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopyState("idle"), 3000);
    }
  }

  const label =
    copyState === "copied"
      ? ui.copied
      : copyState === "failed"
        ? ui.failed
        : ui.label;

  return (
    <>
      <button
        type="button"
        className={`copy-btn copy-btn--${variant}${
          iconOnly ? " copy-btn--icon" : ""
        }${className ? ` ${className}` : ""}`}
        data-copied={copyState === "copied"}
        onClick={copyEmail}
        aria-label={iconOnly ? ui.iconLabel : undefined}
        title={iconOnly ? ui.label : undefined}
      >
        <span className="copy-icon" aria-hidden="true">
          <span className="copy-icon-envelope">
            <EnvelopeIcon />
          </span>
          <span className="copy-icon-check">
            <CheckIcon />
          </span>
        </span>
        {!iconOnly && <span className="copy-label">{label}</span>}
      </button>
      <span className="visually-hidden" aria-live="polite">
        {copyState === "copied"
          ? ui.copiedLive
          : copyState === "failed"
            ? ui.failedLive
            : ""}
      </span>
    </>
  );
}
