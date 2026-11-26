// German locale for the portfolio. Typed against SiteContent, so a
// missing or mistyped German string is a compile error, not a
// runtime gap. English (content.ts) is the source of truth.
//
// Translation rules applied here:
// - Faithful, idiomatic German; nothing invented, nothing dropped.
// - Every number, date value, metric, version, test count, link and
//   table name stays byte-identical (86.1%, 197, €950.00, v1.0.0,
//   2026-11-09, dim_date, 3.48/4.00). Only the words around them
//   translate: month names (Oct → Okt.) and "present" → "heute".
// - The 86.1% IoU and the 197 tests stay separate facts, as in
//   English. The HIT 20% figure stays.
// - The German lease quote stays verbatim in both locales. Its
//   English gloss is omitted here on purpose: the quote is already
//   German, so a German gloss would repeat it word for word. The
//   BGB §551 note around it is translated.
// - Skill names, stack tags, course titles, the journal name and
//   statute names are proper nouns and stay as they are.
import type { SiteContent } from "./content";

export const deContent: SiteContent = {
  profile: {
    name: "Shamas Ur Rehman",
    role: "Data-Engineering-Student",
    location: "Dresden, Deutschland",
    address: "Dresden, Deutschland",
    claim: "Ich baue Datenpipelines und ML-Systeme.",
    claimHighlight: "Datenpipelines",
    statusLine: "MSc Informatik, TU Dresden",
    email: "shamasrehman249@gmail.com",
    github: "https://github.com/shamas92",
    linkedin: "https://linkedin.com/in/shamasrehman",
    workEligibility: "Werkstudent, 20 Stunden pro Woche.",
  },

  projects: [
    {
      slug: "leaselens",
      title: "LeaseLens",
      tier: "full",
      year: 2026,
      category: "Hackathon",
      rowOutcome:
        "Ein Arbeitsbereich für Mieternachweise, der Kautionsforderungen mit Mietvertrag und Gesetz abgleicht.",
      rowProof:
        "Kaution €950.00 gegenüber Obergrenze €535.41: Überschuss von €414.59 in einem echten Mietvertrag festgestellt.",
      stats: [
        { value: "86.1%", label: "registered IoU, v7-Demo" },
        { value: "197", label: "Tests, 132 Backend · 65 Frontend" },
        { value: "5", label: "Rechtsordnungen im Register" },
      ],
      stack: ["Next.js", "TypeScript", "FastAPI", "Python", "SAM 3.1"],
      contribution:
        "Ich habe den deterministischen Validator, das Register der Kautionsobergrenzen für fünf Rechtsordnungen und den Fotonachweis mit SAM 3.1 gebaut — auf einem Next.js/TypeScript-Frontend und einem FastAPI/Python-Backend.",
      decision:
        "Das Modell markiert Stellen; der Validator entscheidet. Die Kautionsberechnung läuft in Python, nie im Modell, sodass eine Zahl, die das Modell erfindet, nicht ins Ergebnis gelangen kann — auf Kosten eines zweiten, deterministischen Durchlaufs über jedes markierte Zitat.",
      role: "Hackathon · Team Shamas #4919",
      problem: [
        [
          "Wer in einem anderen Land mietet, unterschreibt einen Vertrag, zahlt eine Kaution und bekommt Monate später eine Forderung für Schäden oder Reinigung. Die Frage ist einfach: Stimmt die Forderung mit Mietvertrag und Gesetz überein? Um das zu beantworten, muss man ein langes Dokument in einer fremden Sprache lesen — und die Kautionsobergrenze ändert sich an jeder Grenze.",
        ],
        [
          "Das deutsche Recht begrenzt die Kaution auf ",
          {
            claim: "das Dreifache der monatlichen Kaltmiete",
            note: "BGB §551. Das Register enthält die Regel für fünf Rechtsordnungen: Deutschland, Vereinigtes Königreich, New York, Frankreich und Japan. Japan hat keine Obergrenze als Zahl.",
          },
          " und im Vereinigten Königreich sind es fünf Wochen Miete, in New York ein Monat und in Frankreich ein oder zwei Monate, je nachdem, ob die Wohnung möbliert ist. Ein Mieter braucht den Vertragstext und die lokale Regel nebeneinander, und eine Prüfung, die beides verbindet.",
        ],
      ],
      result: [
        [
          "Version 1.0.0 erschien am 2026-11-09 mit ",
          {
            claim: "197 Tests",
            note: "132 Backend, 65 Frontend, bei v1.0.0.",
          },
          " und wurde in den Meta Global AI Developer Hackathon 2026 aufgenommen (Indie Developer Track, Team Shamas #4919); kein Top-Finalist.",
        ],
        [
          "Die Wohnheim-Demo führt die Prüfung mit einem echten Mietvertrag durch. Die Kaution im Vertrag beträgt €950.00. Die gesetzliche Obergrenze für diese Wohnung liegt bei €535.41, der Überschuss also bei €414.59. Der Fotonachweis für dieselbe Wohnung erreichte ",
          {
            claim: "86.1% registered IoU",
            note: "Registered IoU misst die Überlappung, nachdem die beiden Fotos ausgerichtet wurden — der Wert vergleicht also dieselbe Wand statt zwei Fotos aus verschiedenen Blickwinkeln. Das v7-Demo-Paar erreichte 86.1%, zweimal live identisch gemessen. Ausgerichtet 1588, Auszug 1722.",
          },
          " beim v7-Demo-Paar.",
        ],
      ],
      figure: {
        value: "86.1%",
        label:
          "registered IoU, v7-Demo-Paar — Einzelpaar-Score, keine Baseline; zweimal live identisch gemessen",
      },
      version: "v1.0.0",
      tests: { total: 197, backend: 132, frontend: 65 },
      proofCallout:
        "Registered IoU misst die Überlappung, nachdem die beiden Fotos ausgerichtet wurden — der Wert vergleicht also dieselbe Wand statt zwei Fotos aus verschiedenen Blickwinkeln.",
      evidence: {
        kind: "quote",
        text: "Die vor dem Einzug zu zahlende Kaution beträgt 950,00 EUR.",
        cite: "Geprüfter wörtlicher Auszug aus dem Wohnheim-Mietvertrag. Deutsche Kautionsobergrenze: 3× monatliche Kaltmiete (BGB §551).",
      },
      image: {
        src: "/images/leaselens-sam-exhibit.png",
        width: 740,
        height: 640,
        alt: "Wohnheimfoto mit SAM-3.1-Segmentierungsüberlagerung",
        caption:
          "SAM-3.1-Segmentierung aus dem v7-Demo-Paar, das Wohnheimfoto selbst. 86.1% registered IoU, zweimal live identisch gemessen.",
      },
      registry: [
        {
          jurisdiction: "Deutschland",
          rule: "BGB §551: höchstens 3× monatliche Kaltmiete",
        },
        {
          jurisdiction: "Vereinigtes Königreich",
          rule: "Tenant Fees Act 2019: 5 Wochen Miete",
        },
        { jurisdiction: "New York, USA", rule: "GOL §7-108: 1 Monat" },
        {
          jurisdiction: "Frankreich",
          rule: "Loi 89-462, Art. 22: 1 Monat unmöbliert, 2 Monate möbliert",
        },
        {
          jurisdiction: "Japan",
          rule: "Civil Code, Art. 622-2: keine Kautionsobergrenze als Zahl",
        },
      ],
      limits: [
        "SAM kann die Delle im Türrahmen nicht isolieren und kleine Brandflecken nicht erfassen.",
        "Die Steckdose lässt sich nur per Klick finden, nicht per Beschreibung.",
        "Die QR-Übergabe wurde nie auf einem echten Smartphone getestet.",
        "Es gibt keine geprüfte URL für eine gehostete Live-Demo.",
      ],
      links: [
        {
          label: "LeaseLens auf GitHub",
          href: "https://github.com/shamas92/leaselens",
        },
        { label: "LeaseLens-Demofilm", href: "https://youtu.be/le_KM97lm5w" },
      ],
    },
    {
      slug: "sales-etl-pipeline",
      title: "Sales ETL Pipeline",
      tier: "full",
      year: 2026,
      category: "Data Engineering",
      rowOutcome:
        "Verkaufsdaten aus mehreren Quellen, geladen in eine einzige verlässliche Form.",
      rowProof:
        "Ein DAG, drei Tasks, vier Tabellen, im Repository geprüft.",
      stats: [
        { value: "4", label: "Tabellen, Star-Schema" },
        { value: "3", label: "Tasks, Airflow-DAG" },
      ],
      stack: [
        "Apache Airflow",
        "Docker Compose",
        "PostgreSQL",
        "MinIO",
        "Parquet",
      ],
      contribution:
        "Ich habe den Airflow-DAG, das Parquet/MinIO-Staging, das Kimball-Star-Schema und die duplikatsicheren Upserts gebaut.",
      decision:
        "Upserts leben in Python (psycopg2 ON CONFLICT), nicht in Stored Procedures: Ein erneuter Lauf kann keine Zeilen duplizieren, und die Logik bleibt in der Codebasis, wo man sie lesen und testen kann. Mailpit warnt, wenn ein Lauf fehlschlägt.",
      role: "Eigenes Projekt",
      problem: [
        [
          "Verkaufsdaten kamen aus mehreren Quellen, ohne eine einzige verlässliche Form für die Analyse.",
        ],
      ],
      result: [
        [
          "Die Pipeline läuft mit ",
          {
            claim: "einem DAG, drei Tasks und vier Tabellen",
            note: "dim_date, dim_customer, dim_product, fact_sales. Im Repository geprüft.",
          },
          " und lädt einen 4-zeiligen Mock-Seed; dabei bleiben ",
          {
            claim: "3 eindeutige Transaktionen nach der Deduplizierung",
            note: "Das Repository seedet 4 Mock-Zeilen; nach der Deduplizierung bleiben 3 eindeutige Transaktionen. Kein größerer Datensatz und keine Laufzeit wurden gemessen.",
          },
          " im Star-Schema. Ein fehlgeschlagener Lauf löst eine E-Mail-Warnung aus.",
        ],
        [
          "Noch zu tun: ein synthetischer Lauf mit 1 Mio. Zeilen, ein Test mit erneutem Lauf, Datenqualitätsprüfungen und Laufzeiten sowie ein Screenshot des Airflow-DAGs. Bis dahin werden keine Ergebniszahlen behauptet.",
        ],
      ],
      proofCallout:
        "Ein DAG, drei Tasks, vier Tabellen: dim_date, dim_customer, dim_product, fact_sales.",
      links: [
        {
          label: "Sales-ETL-Pipeline auf GitHub",
          href: "https://github.com/shamas92/sales-etl-pipeline",
        },
      ],
    },
    {
      slug: "oratorpath",
      title: "OratorPath",
      tier: "full",
      year: 2025,
      category: "Abschlussarbeit & Paper",
      rowOutcome:
        "Gemessenes Feedback für Entwickler, die öffentlich sprechen.",
      rowProof:
        "Veröffentlicht in *Spectrum of Engineering Sciences*, Bd. 3, Heft 7, S. 843–852 (2025).",
      stack: ["PyTorch", "Hugging Face", "NLP"],
      contribution:
        "Ich habe den Sprachanalyse-Coach (PyTorch, Hugging Face, NLP) als Abschlussprojekt gebaut und das veröffentlichte Paper mitverfasst.",
      decision:
        "Der Coach gibt gemessenes Feedback zurück — Tempo, Füllwörter, Klarheit — statt Eindrücke. Zahlen machen Fortschritt über Sitzungen hinweg vergleichbar; über den Vortrag selbst sagen sie nichts, das muss der Sprecher weiterhin selbst beurteilen.",
      role: "Abschlussarbeit · Mitautor, veröffentlichtes Paper",
      problem: [
        [
          "Feedback zum öffentlichen Sprechen war für Softwareentwickler anekdotisch, nicht gemessen.",
        ],
      ],
      result: [
        [
          "Die Arbeit wurde als Paper mitverfasst und in einem ",
          {
            claim: "peer-reviewten Journal",
            note: "Spectrum of Engineering Sciences, Bd. 3, Heft 7, S. 843–852, 2025, ISSN 3007-3138.",
          },
          " im Jahr 2025 veröffentlicht. Das Dashboard ist nicht mehr live; das Paper ist der Nachweis.",
        ],
      ],
      evidence: {
        kind: "citation",
        text: "Eine KI-gestützte Sprachanalyse zur Verbesserung von Kommunikation und öffentlichem Sprechen in der globalen Softwareentwicklung.",
        cite: "Spectrum of Engineering Sciences, Bd. 3, Heft 7, S. 843–852, 2025, ISSN 3007-3138.",
      },
      proofCallout:
        "Peer-reviewte Publikation, 2025: Spectrum of Engineering Sciences, Bd. 3, Heft 7, S. 843–852, ISSN 3007-3138.",
      /* Paper-URL/DOI liegt nicht vor. Leer, bis der Nutzer sie
         liefert — keine URL erfinden. */
      paperUrl: "",
      links: [],
    },
    {
      slug: "hitec-cms",
      title: "HITEC University Webplattform & Admin-Panel",
      shortTitle: "HITEC Webplattform & Admin-Panel",
      tier: "full",
      year: 2025,
      category: "Intern / Archiviert",
      rowOutcome:
        "Datenbankgestützte Universitäts-Webmodule, ein internes CMS-Admin-Panel sowie ein integrierter RAG-Support-Chatbot.",
      rowProof:
        "Umgesetzt im IT-Praktikum (Mai–Okt 2025); internes Admin-Panel & CMS, Live-Betrieb extern fortgeführt.",
      stack: ["C#", "ASP.NET MVC", "SQL Server", "Python", "RAG"],
      contribution:
        "Ich habe die datenbankgestützten Webmodule, das interne CMS-Admin-Panel und den RAG-Support-Chatbot im IT-Praktikum gebaut.",
      decision:
        "Der Chatbot antwortet aus Universitätsdokumenten (RAG) statt aus Allgemeinwissen, sodass seine Antworten in den eigenen Unterlagen der Hochschule verankert bleiben — auf Kosten dessen, dass er nur kennt, was in diesen Dokumenten steht.",
      role: "Praktikant in der IT-Abteilung, Mai–Okt. 2025",
      problem: [
        [
          "Die Webpräsenz der HITEC University brauchte datenbankgestützte Module und ein internes Admin-Panel für die Inhaltsverwaltung — dazu einen Support-Chatbot, der Fragen aus Universitätsdokumenten beantwortet.",
        ],
      ],
      result: [
        [
          "Gebaut im IT-Praktikum (Mai–Okt. 2025): datenbankgestützte Webmodule, ein internes CMS-Admin-Panel und ein RAG-Support-Chatbot. Das Projekt ist intern und archiviert, ohne öffentliche Website oder Repository, und die Live-Website wird seit dem Ende des Praktikums extern betreut.",
        ],
      ],
      scope:
        "Datenbankgestützte Universitäts-Webmodule, ein internes CMS-Admin-Panel sowie ein integrierter RAG-Support-Chatbot.",
      badge: "Intern / Archiviert",
      links: [],
    },
    {
      slug: "quality-crm",
      title: "Quality Management & Defect-Tracking CRM",
      shortTitle: "Defect-Tracking CRM",
      tier: "compact",
      year: 2024,
      category: "Fehlerverfolgung",
      rowOutcome:
        "Defekte und Qualitätsprobleme in einem Datensatz statt in informellen Notizen.",
      stack: ["Laravel", "MySQL", "PHP"],
      contribution:
        "Ich habe ein Laravel/MySQL-CRM gebaut, das Defekte und Qualitätsprobleme in einem relationalen Datensatz hält.",
      decision:
        "Ein relationaler Datensatz pro Defekt statt informeller Notizen: aufwendiger einzurichten als eine Tabelle, aber jedes Problem hat einen Ort, an dem es lebt.",
      role: "Akademisches Projekt",
      problem: [
        [
          "Defekte und Qualitätsprobleme wurden informell erfasst, ohne einen einzigen Datensatz.",
        ],
      ],
      result: [
        [
          "Als akademisches Projekt 2024 gebaut: ein Laravel/MySQL-CRM, das Defekte und Qualitätsprobleme in einem relationalen Datensatz hält. Kein Repository und keine Live-Website liegt vor.",
        ],
      ],
      scope:
        "Relationales Defect-Tracking in Laravel/MySQL — ein Datensatz für jeden Defekt.",
      links: [],
    },
    {
      slug: "upliftu",
      title: "UpliftU",
      tier: "compact",
      year: 2024,
      category: "Studierenden-Support",
      rowOutcome:
        "Gesprächsbasierte Unterstützung für Studierende, in strukturierter Form.",
      stack: ["Python", "Hugging Face", "NLP"],
      contribution:
        "Ich habe gesprächsbasierte Studierendenbetreuung mit Hugging-Face-NLP in Python gebaut.",
      decision:
        "Strukturierte NLP-Unterstützung statt freiem Chat, sodass Gespräche einer Form folgen, statt zu driften.",
      role: "Akademisches Projekt",
      problem: [
        [
          "Gesprächsbasierte Unterstützung für Studierende hatte keine strukturierte, messbare Form.",
        ],
      ],
      result: [
        [
          "Als akademisches Projekt 2024 gebaut: gesprächsbasierte Studierendenbetreuung mit Hugging-Face-NLP in Python, strukturiert über Dialogabläufe. Kein Repository und keine Live-Website liegt vor.",
        ],
      ],
      scope: "Strukturierte NLP-Studierendenbetreuung in Python/Hugging Face.",
      links: [],
    },
  ],

  background: {
    about:
      "Ich studiere Informatik im Master an der TU Dresden, nach einem Bachelor in Software Engineering an der HITEC University in Pakistan. Sechs Monate habe ich in der IT-Abteilung einer Universität datenbankgestützte Webmodule und einen RAG-Chatbot gebaut; in meiner eigenen Zeit baue ich Datenpipelines und ML-Systeme — zuletzt LeaseLens, das Kautionsforderungen gegen Mietvertrag und Gesetz prüft. Ich suche eine Werkstudentenstelle im Data Engineering oder ML in Dresden, 20 Stunden pro Woche, und will Arbeit, deren Ergebnis man messen kann.",
    education: [
      {
        degree: "MSc Informatik",
        school: "TU Dresden",
        period: "Okt. 2026 – heute",
        note: "Scalable Data Engineering, Data Visualization, Requirements Engineering.",
      },
      {
        degree: "BSc Software Engineering",
        school: "HITEC University Taxila",
        period: "Sep. 2021 – Aug. 2025",
        note: "CGPA 3.48/4.00 (deutsche Note 1.7).",
      },
    ],
    experience: [
      {
        role: "Praktikant in der IT-Abteilung",
        org: "HITEC University",
        period: "Mai – Okt. 2025",
        note: "C#/ASP.NET-MVC-Portalmodule; RAG-Support-Chatbot in Python/Hugging Face über Universitätsdokumente.",
      },
      {
        role: "Praktikant",
        org: "Heavy Industries Taxila",
        period: "Jul. – Aug. 2024",
        note: "Echtzeit-Prozessmonitoring mit C#/.NET und SQL Server sowie Live-Dashboards aufgebaut und manuelle Logging-Fehler um 20% gesenkt.",
      },
    ],
    languages: [
      { language: "Englisch", level: "C1 (IELTS 7.5)" },
      { language: "Deutsch", level: "A1/A2 (Kurs an der TU Dresden)" },
      { language: "Urdu", level: "Muttersprache" },
    ],
    certifications:
      "Google-Zertifikate (2025–2026): Advanced Data Analytics · Data Analytics · IT Automation with Python · Project Management.",
  },

  skills: {
    groups: [
      {
        title: "Data Engineering",
        items: [
          { name: "Apache Airflow", usedIn: ["Sales ETL"] },
          { name: "SQL", usedIn: ["Sales ETL"] },
          { name: "PostgreSQL", usedIn: ["Sales ETL"] },
          { name: "Parquet", usedIn: ["Sales ETL"] },
          { name: "MinIO", usedIn: ["Sales ETL"] },
          { name: "Docker", usedIn: ["LeaseLens", "Sales ETL"] },
          { name: "Docker Compose", usedIn: ["Sales ETL"] },
        ],
      },
      {
        title: "Programmiersprachen",
        items: [
          {
            name: "Python",
            usedIn: ["LeaseLens", "Sales ETL", "OratorPath", "HITEC", "UpliftU"],
          },
          { name: "C#", usedIn: ["HITEC"] },
          { name: "TypeScript", usedIn: ["LeaseLens"] },
          { name: "PHP", usedIn: ["Quality CRM"] },
        ],
      },
      {
        title: "Frameworks & KI",
        items: [
          { name: "FastAPI", usedIn: ["LeaseLens"] },
          { name: "ASP.NET MVC", usedIn: ["HITEC"] },
          { name: "Next.js", usedIn: ["LeaseLens"] },
          { name: "React", usedIn: ["LeaseLens"] },
          { name: "PyTorch", usedIn: ["OratorPath"] },
          { name: "Hugging Face", usedIn: ["OratorPath", "UpliftU"] },
          { name: "SAM 3.1", usedIn: ["LeaseLens"] },
        ],
      },
      {
        title: "Datenbanken",
        items: [
          { name: "SQL Server", usedIn: ["HITEC"] },
          { name: "MySQL", usedIn: ["Quality CRM"] },
        ],
      },
      {
        title: "Werkzeuge",
        items: [
          {
            name: "Git",
            usedIn: [
              "LeaseLens",
              "Sales ETL",
              "OratorPath",
              "HITEC",
              "Quality CRM",
              "UpliftU",
            ],
          },
          { name: "REST APIs", usedIn: ["LeaseLens"] },
        ],
      },
    ],
    coursework:
      "Kursarbeit (Google-Zertifikate): Pandas · NumPy · Matplotlib · scikit-learn · Tableau · Excel",
  },

  ui: {
    skipLink: "Zum Inhalt springen",
    navLabel: "Bereiche",
    nav: {
      work: "Projekte",
      background: "Werdegang",
      contact: "Kontakt",
    },
    header: {
      menuOpen: "Menü öffnen",
      menuClose: "Menü schließen",
      menuNavLabel: "Bereiche",
    },
    copy: {
      label: "E-Mail kopieren",
      copied: "Kopiert ✓",
      failed: "Kopieren fehlgeschlagen — E-Mail-Link verwenden",
      copiedLive: "E-Mail-Adresse in die Zwischenablage kopiert.",
      failedLive: "Kopieren fehlgeschlagen. Bitte den E-Mail-Link verwenden.",
      iconLabel: "E-Mail-Adresse kopieren",
    },
    theme: {
      toLight: "Zum hellen Modus wechseln",
      toDark: "Zum dunklen Modus wechseln",
    },
    language: {
      label: "Sprache",
    },
    hero: {
      pill: "Werkstudent, 20 Std./Woche",
      ask: "Ich suche eine Werkstudentenstelle in Datenentwicklung oder ML.",
      emailMe: "E-Mail schreiben",
      downloadCv: "Lebenslauf herunterladen",
      seeWorkFirst: "Die Projekte ansehen",
    },
    work: {
      heading: "Neueste Projekte",
      intro: "Vier Projekte im Detail, zwei weitere darunter.",
      proof: "Nachweis",
      viewCaseStudy: "Fallstudie ansehen",
      viewMore: "Mehr auf GitHub",
      allProjects: "Alle 6 Projekte",
      earlierHeading: "Frühere Projekte",
    },
    workIndex: {
      heading: "Alle Projekte",
      intro:
        "Alle sechs Projekte — die vier aus der Übersicht und die zwei früheren.",
      back: "Startseite",
    },
    background: {
      heading: "Werdegang",
      experience: "Berufserfahrung",
      education: "Ausbildung",
      languagesLabel: "Sprachen",
      location: {
        eyebrow: "Standort",
        nowIn: "Jetzt in Dresden",
      },
    },
    skills: {
      heading: "Skills",
      usedIn: "Eingesetzt in",
    },
    footer: {
      heading: "Kontakt",
    },
    form: {
      heading: "Nachricht schreiben",
      nameLabel: "Name",
      namePlaceholder: "Ihr Name",
      emailLabel: "E-Mail",
      emailPlaceholder: "sie@beispiel.de",
      messageLabel: "Nachricht",
      messagePlaceholder: "Erzählen Sie mir von der Stelle und dem Team.",
      submit: "Nachricht senden",
      nameRequired: "Bitte geben Sie Ihren Namen an.",
      emailRequired: "Bitte geben Sie Ihre E-Mail-Adresse an.",
      emailInvalid: "Diese E-Mail-Adresse sieht nicht korrekt aus.",
      messageRequired: "Bitte schreiben Sie eine Nachricht.",
      statusSent: "Nachricht gesendet — ich antworte innerhalb von 2 Werktagen.",
      statusFailed:
        "Die Nachricht konnte nicht gesendet werden. Bitte schreiben Sie mir direkt.",
    },
    caseStudy: {
      allProjects: "Alle Projekte",
      problem: "Problem",
      contribution: "Beitrag",
      myPart: "Mein Teil",
      decision: "Entscheidung",
      result: "Ergebnis",
      evidence: "Nachweise",
      stack: "Stack",
      links: "Links",
      role: "Meine Rolle",
      registryHeading: "Kautionsobergrenzen im Register",
      limitsHeading: "Grenzen",
    },
    proofNote: { evidence: "Nachweis", close: "Schließen" },
    assets: {
      leaselens: {
        ariaLabel:
          "Interface-Mockup der LeaseLens-Nachweisprüfung: Einzugs- und Auszugsgrenzen eines Zimmers, registriert gegeneinander, Kautionszahlen und eine 86.1-prozentige registrierte IoU",
        title:
          "LeaseLens-Mockup der Nachweisprüfung — registrierte Einzugs- und Auszugsgrenzen, 86.1% IoU",
        moveIn: "EINZUG",
        moveOut: "AUSZUG",
        iou: "86.1% IoU",
        window: "LeaseLens — Nachweisprüfung",
        deposit: "KAUTION",
        cap: "OBERGRENZE",
        excess: "MEHRBETRAG",
        status: "86.1% registrierte IoU — Einzelpaar-Wert, ohne Basiswert",
        caption:
          "Interface-Mockup der Nachweisprüfung — Illustration, kein Produkt-Screenshot.",
      },
      etl: {
        ariaLabel:
          "Interface-Mockup der Sales-ETL-Pipeline: Quellen speisen MinIO- und Parquet-Staging, Airflow-Tasks laden das PostgreSQL-Star-Schema",
        title:
          "Sales-ETL-Pipeline-Mockup — Quellen, MinIO und Parquet, Airflow-Tasks, PostgreSQL-Star-Schema",
        sources: "Quellen",
        airflow: "Airflow",
        tasks: "Tasks",
        footer: "1 DAG · 3 TASKS · 4 TABELLEN",
        window: "Sales-ETL-Pipeline — Airflow",
        schema: "STAR-SCHEMA",
        caption: "Pipeline-Mockup — Illustration, kein Produkt-Screenshot.",
      },
      orator: {
        ariaLabel:
          "Interface-Mockup der OratorPath-Sprachanalyse: Wellenform mit schematischen Kennzahlenbalken für Tempo, Füllwörter und Klarheit",
        title:
          "OratorPath-Mockup der Sprachanalyse — Wellenform und Kennzahlenbalken: Tempo, Füllwörter, Klarheit",
        pace: "TEMPO",
        fillerWords: "FÜLLWÖRTER",
        clarity: "KLARHEIT",
        window: "OratorPath — Sprachanalyse",
        paper: "Spectrum of Engineering Sciences · Bd. 3, Heft 7 · 2025",
        caption:
          "Mockup der Sprachanalyse — schematische Balken, keine Messwerte.",
      },
      hitec: {
        ariaLabel:
          "Interface-Mockup des HITEC-Admin-Panels: Modulliste, Inhaltstabelle und der RAG-Support-Chatbot, der aus Hochschuldokumenten antwortet",
        title:
          "HITEC-Admin-Panel-Mockup — Webmodule, Inhaltsverwaltung, RAG-Support-Chatbot",
        window: "HITEC — Admin-Panel",
        status: "Intern / Archiviert",
        caption: "Admin-Panel-Mockup — Illustration, kein Produkt-Screenshot.",
      },
      quality: {
        ariaLabel:
          "Interface-Mockup der Quality-CRM-Fehlerliste: Fehler in einem Datensatz mit Status und Verantwortlichem",
        title:
          "Quality-CRM-Mockup — Fehlerliste mit Status und Verantwortlichem",
        window: "Quality CRM — Fehlerverfolgung",
        status: "Laravel · MySQL",
        caption:
          "Fehlerverfolgungs-Mockup — Illustration, kein Produkt-Screenshot.",
      },
      upliftu: {
        ariaLabel:
          "Interface-Mockup von UpliftU: strukturierte Studierendenbetreuung mit Gespräch und Formular",
        title: "UpliftU-Mockup — strukturierte Studierendenbetreuung",
        window: "UpliftU — Studierendenbetreuung",
        status: "Python · Hugging Face NLP",
        caption:
          "Studierendenbetreuungs-Mockup — Illustration, kein Produkt-Screenshot.",
      },
    },
    meta: {
      titleSuffix: "Data-Engineering-Student, Dresden",
      description:
        "Shamas Ur Rehman, MSc-Informatikstudent an der TU Dresden. Datenpipelines und ML-Systeme: LeaseLens, eine Sales-ETL-Pipeline und vier weitere Projekte, jedes mit seinem Nachweis.",
    },
  },
};
