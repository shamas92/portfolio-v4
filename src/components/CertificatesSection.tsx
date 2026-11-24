"use client";

import { useContent } from "@/i18n/LocaleProvider";

/** Certificates: editorial cards, not a plain list. Four Google
 *  certificates with one shared period (Nov 2025 – Sep 2026).
 *  Each card is a plate: an index (01–04) and the provider in
 *  mono, the certificate name in Newsreader, and the shared
 *  period in mono under a hairline. No per-certificate date,
 *  credential ID or verification link is on record, so none is
 *  shown or invented — the note under the list says so. The
 *  provider is Google: the certificate names themselves say so.
 *  The period is on every card (each card is a self-contained
 *  record), so the intro states only the count. */
export function CertificatesSection() {
  const content = useContent();
  const certs = content.background.certifications;
  const ui = content.ui.certificates;

  return (
    <div>
      <ul className="certificates-grid">
        {certs.items.map((item, i) => (
          <li className="certificate" key={item}>
            <div className="certificate-top">
              <span className="certificate-index">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="certificate-provider">Google</span>
            </div>
            <p className="certificate-name">{item}</p>
            <p className="certificate-period">{certs.period}</p>
          </li>
        ))}
      </ul>
      <p className="certificates-note">{ui.note}</p>
    </div>
  );
}
