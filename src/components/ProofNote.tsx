"use client";

import { useRef, useState } from "react";
import type { Prose } from "@/content";

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8.5 6.5 12 13 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Claim = { claim: string; note: string };

/** The highlighted claim text. A button, never a hover effect:
 *  opens on click, tap or Enter, closes on Escape. */
export function ClaimButton({
  id,
  claim,
  open,
  onToggle,
  buttonRef,
}: {
  id: string;
  claim: string;
  open: boolean;
  onToggle: () => void;
  buttonRef: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <button
      type="button"
      ref={buttonRef}
      className="claim"
      aria-expanded={open}
      aria-controls={id}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          onToggle();
        }
      }}
    >
      {claim}
    </button>
  );
}

/** The evidence for one claim, shown as an inline note under the
 *  claim. Escape closes it from anywhere inside — including when
 *  focus is on the Close button. */
export function NotePanel({
  id,
  note,
  onClose,
}: {
  id: string;
  note: string;
  onClose: () => void;
}) {
  return (
    <div
      className="margin-note"
      id={id}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <p className="margin-note-head">
        <CheckIcon />
        Evidence
      </p>
      <p>{note}</p>
      <button type="button" className="margin-note-close" onClick={onClose}>
        Close
      </button>
    </div>
  );
}

/** A block of prose whose claims open margin notes. One note open at a
 *  time per block; closing returns focus to the trigger. */
export function Annotated({
  prose,
  idPrefix,
}: {
  prose: Prose;
  idPrefix: string;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const triggers = useRef(new Map<string, HTMLButtonElement>());

  function closeAndRefocus(id: string) {
    setOpenId(null);
    triggers.current.get(id)?.focus();
  }

  function claimId(paragraphIndex: number, claimIndex: number) {
    return `${idPrefix}-${paragraphIndex}-${claimIndex}`;
  }

  const openClaim = (() => {
    if (!openId) return null;
    for (let p = 0; p < prose.length; p++) {
      let c = 0;
      for (const seg of prose[p]) {
        if (typeof seg !== "string") {
          if (claimId(p, c) === openId) return seg as Claim;
          c++;
        }
      }
    }
    return null;
  })();

  return (
    <div className="annotated">
      <div className="prose">
        {prose.map((paragraph, p) => {
          let claimIndex = 0;
          return (
            <p key={p}>
              {paragraph.map((seg, s) => {
                if (typeof seg === "string") return seg;
                const id = claimId(p, claimIndex);
                claimIndex++;
                return (
                  <ClaimButton
                    key={s}
                    id={id}
                    claim={seg.claim}
                    open={openId === id}
                    onToggle={() => setOpenId(openId === id ? null : id)}
                    buttonRef={(el) => {
                      if (el) triggers.current.set(id, el);
                      else triggers.current.delete(id);
                    }}
                  />
                );
              })}
            </p>
          );
        })}
      </div>
      <div className="margin-notes">
        {openClaim && openId && (
          <NotePanel
            id={openId}
            note={openClaim.note}
            onClose={() => closeAndRefocus(openId)}
          />
        )}
      </div>
    </div>
  );
}
