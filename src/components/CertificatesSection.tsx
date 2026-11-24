"use client";

import { format, useContent } from "@/i18n/LocaleProvider";

/** Certificates: a dedicated section, typographic only. Four
 *  Google certificates with one shared period (Nov 2025 – Sep
 *  2026). No per-certificate date, credential ID or verification
 *  link is on record, so none is shown or invented — the note
 *  under the list says so. The provider is Google: the
 *  certificate names themselves say so. The intro lives here
 *  rather than in page.tsx because it formats the shared period
 *  from the data. */
export function CertificatesSection() {
  const content = useContent();
  const certs = content.background.certifications;
  const ui = content.ui.certificates;

  return (
    <div>
      <p className="section-intro">
        {format(ui.intro, { period: certs.period })}
      </p>
      <ul className="certificates-grid">
        {certs.items.map((item) => (
          <li className="certificate" key={item}>
            <p className="certificate-provider">Google</p>
            <p className="certificate-name">{item}</p>
          </li>
        ))}
      </ul>
      <p className="certificates-note">{ui.note}</p>
    </div>
  );
}
