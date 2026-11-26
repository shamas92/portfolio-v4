import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from "@/content";

const description =
  "Impressum von Shamas Ur Rehman — Angaben gemäß § 5 DDG.";

export const metadata: Metadata = {
  title: "Impressum",
  description,
  alternates: { canonical: "/impressum" },
  openGraph: {
    type: "website",
    url: `${siteUrl}/impressum`,
    title: "Impressum — Shamas Ur Rehman",
    description,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Shamas Ur Rehman",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Impressum — Shamas Ur Rehman",
    description,
    images: ["/og.png"],
  },
};

/* Impressum nach § 5 DDG. Die Anschrift steht nur auf dieser
   Seite, nicht auf den öffentlichen Panels der Startseite.
   TODO(owner-confirm-legal): Die Gesetzesangaben wurden von
   § 5 TMG auf § 5 DDG und von § 55 Abs. 2 RStV auf § 18 Abs. 2
   MStV umgestellt — bitte bestätigen, dass die neuen Angaben so
   korrekt sind. */
export default function ImpressumPage() {
  return (
    <div className="page">
      <div className="case-head">
        <Link className="case-back" href="/">
          ← Startseite
        </Link>
        <h1 className="case-title">Impressum</h1>
      </div>

      <section className="case-block" aria-labelledby="angaben-head">
        <h2 className="case-block-head" id="angaben-head">
          Angaben gemäß § 5 DDG
        </h2>
        <address className="case-text" style={{ fontStyle: "normal" }}>
          Shamas Ur Rehman
          <br />
          Fritz-Löffler-Straße 12
          <br />
          01069 Dresden
          <br />
          Deutschland
        </address>
        <p className="case-text">
          E-Mail:{" "}
          <a href="mailto:shamasrehman249@gmail.com">
            shamasrehman249@gmail.com
          </a>
        </p>
      </section>

      <section className="case-block" aria-labelledby="verantwortlich-head">
        <h2 className="case-block-head" id="verantwortlich-head">
          Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
        </h2>
        <p className="case-text">
          Shamas Ur Rehman, Anschrift wie oben.
        </p>
      </section>
    </div>
  );
}
