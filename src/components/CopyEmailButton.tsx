"use client";

import { useState } from "react";
import { profile } from "@/content";

export function CopyEmailButton() {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("failed");
      setTimeout(() => setCopyState("idle"), 3000);
    }
  }

  return (
    <>
      <button
        type="button"
        className="copy-btn"
        data-copied={copyState === "copied"}
        onClick={copyEmail}
      >
        {copyState === "copied"
          ? "Copied ✓"
          : copyState === "failed"
            ? "Copy failed — use the email link"
            : "Copy email"}
      </button>
      <span className="visually-hidden" aria-live="polite">
        {copyState === "copied"
          ? "Email address copied to clipboard."
          : copyState === "failed"
            ? "Copy failed. Use the email link instead."
            : ""}
      </span>
    </>
  );
}
