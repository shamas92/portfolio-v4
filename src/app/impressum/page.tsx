import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Impressum",
  description:
    "Impressum von Shamas Ur Rehman — Angaben gemäß § 5 TMG.",
  alternates: { canonical: "/impressum" },
};

/* Impressum nach § 5 TMG. Die Anschrift steht nur auf dieser
   Seite, nicht auf den öffentlichen Panels der Startseite. */
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
          Angaben gemäß § 5 TMG
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
          Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
        </h2>
        <p className="case-text">
          Shamas Ur Rehman, Anschrift wie oben.
        </p>
      </section>
    </div>
  );
}
