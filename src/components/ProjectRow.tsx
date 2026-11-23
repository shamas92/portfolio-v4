"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { Project } from "@/content";
import { ClaimButton, NotePanel } from "./ProofNote";

/** One ruled Work row: name, year, outcome, proof statement, stack.
 *  The title links to the case-study page; the whole row follows it
 *  via a stretched link, while the proof claim button stays clickable
 *  above the overlay. */
export function ProjectRow({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const noteId = `${project.slug}-proof-note`;

  return (
    <li className="work-row">
      <div className="work-row-title">
        <Link className="work-row-link" href={`/work/${project.slug}`}>
          {project.title}
        </Link>
        <span className="work-row-year">{project.year}</span>
      </div>
      <div className="work-row-body">
        <p className="work-row-outcome">{project.rowOutcome}</p>
        <p className="work-row-proof">
          <ClaimButton
            id={noteId}
            claim={project.rowProof}
            open={open}
            onToggle={() => setOpen(!open)}
            buttonRef={(el) => {
              triggerRef.current = el;
            }}
          />
        </p>
        <ul className="work-row-stack" aria-label="Stack">
          {project.stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </div>
      <div className="margin-notes">
        {open && (
          <NotePanel
            id={noteId}
            note={project.rowProofNote}
            onClose={() => {
              setOpen(false);
              triggerRef.current?.focus();
            }}
          />
        )}
      </div>
    </li>
  );
}
