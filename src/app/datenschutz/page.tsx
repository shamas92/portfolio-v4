import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description:
    "Datenschutzerklärung von Shamas Ur Rehman — was diese Website speichert und was nicht.",
  alternates: { canonical: "/datenschutz" },
};

/* Datenschutzerklärung. Jeder Satz ist gegen den Code geprüft:
   kein Tracking, keine Cookies, keine Drittanbieter-Inhalte,
   Schriften lokal, Theme und Sprache nur im localStorage.
   Das Kontaktformular läuft über den E-Mail-Dienst Resend. */
export default function DatenschutzPage() {
  return (
    <div className="page">
      <div className="case-head">
        <Link className="case-back" href="/">
          ← Startseite
        </Link>
        <h1 className="case-title">Datenschutzerklärung</h1>
      </div>

      <section className="case-block" aria-labelledby="verantwortlicher-head">
        <h2 className="case-block-head" id="verantwortlicher-head">
          Verantwortlicher
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

      <section className="case-block" aria-labelledby="hosting-head">
        <h2 className="case-block-head" id="hosting-head">
          Hosting
        </h2>
        <p className="case-text">
          Diese Website wird bei Vercel Inc. gehostet. Beim Aufruf einer
          Seite verarbeitet Vercel technische Zugriffsdaten (IP-Adresse,
          Datum und Uhrzeit des Zugriffs, aufgerufene Seite, Browser und
          Betriebssystem), um die Seite auszuliefern und abzusichern.
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
          Interesse an einem sicheren Betrieb der Website).
        </p>
      </section>

      <section className="case-block" aria-labelledby="cookies-head">
        <h2 className="case-block-head" id="cookies-head">
          Cookies, Tracking und Inhalte von Drittanbietern
        </h2>
        <p className="case-text">
          Diese Website verwendet keine Cookies, keine Analysewerkzeuge
          und kein Tracking. Es werden keine Inhalte von Drittanbietern
          nachgeladen. Alle Schriftarten werden vom eigenen Server
          geladen.
        </p>
      </section>

      <section className="case-block" aria-labelledby="einstellungen-head">
        <h2 className="case-block-head" id="einstellungen-head">
          Lokale Einstellungen
        </h2>
        <p className="case-text">
          Die gewählte Darstellung (hell oder dunkel) und die gewählte
          Sprache (Deutsch oder Englisch) werden lokal in Ihrem Browser
          gespeichert. Diese Angaben verlassen Ihren Browser nicht und
          werden an keinen Server gesendet.
        </p>
      </section>

      <section className="case-block" aria-labelledby="kontakt-head">
        <h2 className="case-block-head" id="kontakt-head">
          Kontaktformular
        </h2>
        <p className="case-text">
          Wenn Sie das Kontaktformular nutzen, übermitteln Sie Name,
          E-Mail-Adresse und Nachricht. Diese Angaben werden nur
          verwendet, um Ihre Anfrage zu beantworten. Die Übermittlung
          erfolgt über den E-Mail-Dienst Resend, der die Nachricht an
          mich weiterleitet. Ihre Angaben werden nicht an andere Dritte
          weitergegeben und nicht für Werbung verwendet.
        </p>
        <p className="case-text">
          Angaben aus dem Kontaktformular werden gelöscht, sobald sie
          für die Beantwortung Ihrer Anfrage nicht mehr nötig sind.
        </p>
      </section>

      <section className="case-block" aria-labelledby="rechte-head">
        <h2 className="case-block-head" id="rechte-head">
          Ihre Rechte
        </h2>
        <p className="case-text">
          Sie haben das Recht, Auskunft über die gespeicherten Daten zu
          erhalten, sie berichtigen oder löschen zu lassen und die
          Verarbeitung einzuschränken. Sie haben außerdem das Recht auf
          Datenübertragbarkeit. Wenden Sie sich dazu an die oben
          genannte E-Mail-Adresse. Sie haben das Recht, sich bei einer
          Datenschutz-Aufsichtsbehörde zu beschweren.
        </p>
      </section>
    </div>
  );
}
