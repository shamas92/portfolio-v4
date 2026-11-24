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
    role: "Softwareentwickler",
    location: "Dresden, Deutschland",
    claim:
      "Ich baue Daten- & ML-Systeme — und belege jede Aussage auf dieser Seite.",
    statusLine: "MSc Informatik, TU Dresden, Dresden, Deutschland",
    email: "shamasrehman249@gmail.com",
    github: "https://github.com/shamas92",
    linkedin: "https://linkedin.com/in/shamasrehman",
    workEligibility: "Werkstudent, 20 Stunden pro Woche möglich.",
  },

  projects: [
    {
      slug: "leaselens",
      title: "LeaseLens",
      year: 2026,
      rowOutcome:
        "Ein Arbeitsbereich für Mieternachweise, der Kautionsforderungen mit Mietvertrag und Gesetz abgleicht.",
      rowProof:
        "86.1% registered IoU beim v7-Demo-Paar, zweimal live identisch gemessen.",
      stack: ["Next.js", "TypeScript", "FastAPI", "Python", "SAM 3.1"],
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
          ". Im Vereinigten Königreich sind es fünf Wochen Miete, in New York ein Monat und in Frankreich ein oder zwei Monate — je nachdem, ob die Wohnung möbliert ist. Ein Mieter braucht den Vertragstext und die lokale Regel nebeneinander, und eine Prüfung, die beides verbindet.",
        ],
      ],
      architecture: [
        [
          "Das Frontend ist Next.js und TypeScript. Das Backend ist FastAPI und Python. Das Modell liest den Mietvertrag und markiert die relevanten Stellen. Ein deterministischer Validator ",
          {
            claim:
              "prüft jedes markierte Zitat wortwörtlich gegen den Vertragstext",
            note: "Das Modell markiert Stellen. Der Validator — nicht das Modell — entscheidet, ob ein Zitat wortwörtlich mit dem Vertrag übereinstimmt.",
          },
          " und jede Quellenangabe gegen ein Register mit fünf Rechtsordnungen. ",
          {
            claim: "Die Kautionsberechnung läuft in Python, nie im Modell",
            note: "Obergrenze und Überschuss werden in Python aus den Vertragszahlen berechnet. Das Modell berührt die Rechenlogik nicht.",
          },
          ", sodass eine Zahl, die das Modell erfindet, nicht ins Ergebnis gelangen kann.",
        ],
        [
          "Der Fotonachweis kommt von SAM 3.1, das den Schaden in den Einzugs- und Auszugsfotos segmentiert; die beiden Umrisse werden erst ausgerichtet und dann verglichen. Diese Ausrichtung ist es, was „registered“ in der IoU-Kennzahl bedeutet.",
        ],
      ],
      outcome: [
        [
          "Version 1.0.0 erschien am 2026-11-09 mit ",
          {
            claim: "197 Tests",
            note: "132 Backend, 65 Frontend, bei v1.0.0.",
          },
          ". Das Projekt wurde in den Meta Global AI Developer Hackathon 2026 aufgenommen, Indie Developer Track, als Team Shamas, Teamnummer 4919, war aber kein Top-Finalist.",
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
        label: "registered IoU, v7-Demo-Paar, zweimal live identisch gemessen",
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
      year: 2026,
      rowOutcome:
        "Verkaufsdaten aus mehreren Quellen, geladen in eine einzige verlässliche Form.",
      rowProof: "Ein DAG, drei Tasks, vier Tabellen.",
      stack: [
        "Apache Airflow",
        "Docker Compose",
        "PostgreSQL",
        "MinIO",
        "Parquet",
      ],
      problem: [
        [
          "Verkaufsdaten kamen aus mehreren Quellen, ohne eine einzige verlässliche Form für die Analyse.",
        ],
      ],
      architecture: [
        [
          "Ein Airflow-DAG führt drei Tasks aus. Rohdateien landen als Parquet in MinIO und werden dann in ein Kimball-Star-Schema in PostgreSQL geladen, mit vier Tabellen: dim_date, dim_customer, dim_product, fact_sales. Upserts nutzen psycopg2 ON CONFLICT, sodass ein erneuter Lauf keine Zeilen dupliziert, und Mailpit sendet eine Warnung, wenn ein Lauf fehlschlägt.",
        ],
      ],
      outcome: [
        [
          "Die Pipeline läuft mit ",
          {
            claim: "einem DAG, drei Tasks und vier Tabellen",
            note: "dim_date, dim_customer, dim_product, fact_sales. Im Repository geprüft.",
          },
          ". Es gibt keine Stored Procedures. Die Upserts leben in Python.",
        ],
      ],
      proofCallout:
        "Ein DAG, drei Tasks, vier Tabellen: dim_date, dim_customer, dim_product, fact_sales.",
      image: {
        src: "/images/etl-diagram.png",
        width: 1728,
        height: 1440,
        alt: "Diagramm der ETL-Pipeline: ein DAG, drei Tasks, vier Tabellen",
        caption:
          "Pipeline-Diagramm: drei Tasks, vier Tabellen. Airflow TaskFlow, Parquet/MinIO-Staging, PostgreSQL.",
      },
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
      year: 2025,
      rowOutcome:
        "Gemessenes Feedback für Entwickler, die öffentlich sprechen.",
      rowProof: "Peer-reviewte Publikation, 2025.",
      stack: ["PyTorch", "Hugging Face", "NLP"],
      problem: [
        [
          "Feedback zum öffentlichen Sprechen war für Softwareentwickler anekdotisch, nicht gemessen.",
        ],
      ],
      architecture: [
        [
          "OratorPath ist ein KI-Coach für öffentliches Sprechen, gebaut mit PyTorch, Hugging Face und NLP, mit einem Live-Dashboard. Es war das Abschlussprojekt, und der Coach analysiert Sprache und gibt gemessenes Feedback statt Eindrücke zurück.",
        ],
      ],
      outcome: [
        [
          "Die Arbeit wurde als Paper mitverfasst und in einem ",
          {
            claim: "peer-reviewten Journal",
            note: "Spectrum of Engineering Sciences, Bd. 3, Heft 7, S. 843–852, 2025, ISSN 3007-3138.",
          },
          " veröffentlicht.",
        ],
      ],
      evidence: {
        kind: "citation",
        text: "Eine KI-gestützte Sprachanalyse zur Verbesserung von Kommunikation und öffentlichem Sprechen in der globalen Softwareentwicklung.",
        cite: "Spectrum of Engineering Sciences, Bd. 3, Heft 7, S. 843–852, 2025, ISSN 3007-3138.",
      },
      proofCallout:
        "Peer-reviewte Publikation, 2025: Spectrum of Engineering Sciences, Bd. 3, Heft 7, S. 843–852, ISSN 3007-3138.",
      links: [],
      todoLinks: [{ label: "Live-Dashboard-URL" }],
    },
    {
      slug: "hitec-cms",
      title: "HITEC University Webplattform & Admin-Panel",
      year: 2025,
      rowOutcome:
        "Datenbankgestützte Universitäts-Webmodule, ein internes CMS-Admin-Panel sowie ein integrierter RAG-Support-Chatbot.",
      rowProof:
        "Umgesetzt im IT-Praktikum (Mai–Okt 2025); internes Admin-Panel & CMS, Live-Betrieb extern fortgeführt.",
      stack: ["C#", "ASP.NET MVC", "SQL Server", "Python", "RAG"],
      problem: [
        [
          "Die Webpräsenz der HITEC University brauchte datenbankgestützte Module und ein internes Admin-Panel für die Inhaltsverwaltung — dazu einen Support-Chatbot, der Fragen aus Universitätsdokumenten beantwortet.",
        ],
      ],
      architecture: [
        [
          "Das Backend ist ASP.NET MVC in C# mit einem SQL-Server-Schema hinter den Webmodulen. Das interne Admin-Panel bietet CRUD-Workflows für das Content-Management-System. Ein RAG-Support-Chatbot in Python/Hugging Face beantwortet Fragen auf Basis der Universitätsdokumente.",
        ],
      ],
      outcome: [
        [
          "Umgesetzt im IT-Praktikum (Mai–Okt 2025); internes Admin-Panel & CMS, Live-Betrieb extern fortgeführt.",
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
      year: 2024,
      rowOutcome:
        "Defekte und Qualitätsprobleme in einem Datensatz statt in informellen Notizen.",
      rowProof: "Als akademisches Projekt veröffentlicht.",
      stack: ["Laravel", "MySQL", "PHP"],
      problem: [
        [
          "Defekte und Qualitätsprobleme wurden informell erfasst, ohne einen einzigen Datensatz.",
        ],
      ],
      architecture: [
        [
          "Ein Laravel- und MySQL-CRM für Qualitätsmanagement und Defect-Tracking, 2024 als akademisches Projekt gebaut.",
        ],
      ],
      outcome: [["Als akademisches Projekt veröffentlicht."]],
      scope:
        "Relationales Defect-Tracking in Laravel/MySQL — ein Datensatz für jeden Defekt.",
      links: [],
    },
    {
      slug: "upliftu",
      title: "UpliftU",
      year: 2024,
      rowOutcome:
        "Gesprächsbasierte Unterstützung für Studierende, in strukturierter Form.",
      rowProof: "Als akademisches Projekt veröffentlicht.",
      stack: ["Python", "Hugging Face", "NLP"],
      problem: [
        [
          "Gesprächsbasierte Unterstützung für Studierende hatte keine strukturierte, messbare Form.",
        ],
      ],
      architecture: [
        [
          "Python-basierte Gesprächsunterstützung mit Hugging-Face-NLP, für Studierende.",
        ],
      ],
      outcome: [["Als akademisches Projekt veröffentlicht."]],
      scope: "Strukturierte NLP-Studierendenbetreuung in Python/Hugging Face.",
      links: [],
    },
  ],

  background: {
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
    certifications: {
      items: [
        "Google Advanced Data Analytics",
        "Google Data Analytics",
        "Google IT Automation with Python",
        "Google Project Management",
      ],
      period: "Nov. 2025 – Sep. 2026",
    },
  },

  skillGroups: [
    {
      title: "Languages",
      skills: [
        { name: "Python", project: "leaselens" },
        { name: "SQL", project: "sales-etl-pipeline" },
        { name: "C#" },
        { name: "TypeScript", project: "leaselens" },
        { name: "JavaScript" },
        { name: "PHP", project: "quality-crm" },
      ],
    },
    {
      title: "Data & BI",
      skills: [
        { name: "Pandas" },
        { name: "NumPy" },
        { name: "Matplotlib" },
        { name: "scikit-learn" },
        { name: "time-series analysis" },
        { name: "anomaly detection" },
        { name: "Tableau" },
        { name: "Excel" },
      ],
    },
    {
      title: "Frameworks & AI",
      skills: [
        { name: "FastAPI", project: "leaselens" },
        { name: "ASP.NET MVC" },
        { name: "Next.js", project: "leaselens" },
        { name: "React", project: "leaselens" },
        { name: "PyTorch", project: "oratorpath" },
        { name: "Hugging Face", project: "oratorpath" },
        { name: "RAG" },
        { name: "NLP", project: "oratorpath" },
      ],
    },
    {
      title: "Databases",
      skills: [
        { name: "SQL Server" },
        { name: "MySQL", project: "quality-crm" },
        { name: "PostgreSQL", project: "sales-etl-pipeline" },
      ],
    },
    {
      title: "Tools",
      skills: [
        { name: "Git" },
        { name: "Docker", project: "sales-etl-pipeline" },
        { name: "Linux (Ubuntu)" },
        { name: "REST APIs" },
      ],
    },
  ],

  matrixColumns: [
    {
      title: "Daten & Pipelines",
      skills: [
        "SQL",
        "Pandas",
        "NumPy",
        "Matplotlib",
        "scikit-learn",
        "time-series analysis",
        "anomaly detection",
        "Tableau",
        "Excel",
        "Parquet",
        "MinIO",
        "Apache Airflow",
      ],
    },
    {
      title: "ML & NLP",
      skills: ["Python", "PyTorch", "Hugging Face", "RAG", "NLP", "SAM 3.1"],
    },
    {
      title: "Full-Stack",
      skills: [
        "TypeScript",
        "JavaScript",
        "PHP",
        "C#",
        "ASP.NET MVC",
        "Next.js",
        "React",
        "FastAPI",
        "Laravel",
        "REST APIs",
      ],
    },
    {
      title: "Infra & Datenbanken",
      skills: [
        "PostgreSQL",
        "MySQL",
        "SQL Server",
        "Docker",
        "Docker Compose",
        "Git",
        "Linux (Ubuntu)",
      ],
    },
  ],

  ui: {
    skipLink: "Zum Inhalt springen",
    navLabel: "Bereiche",
    nav: {
      work: "Projekte",
      background: "Werdegang",
      stack: "Stack",
      contact: "Kontakt",
    },
    header: {
      githubLabel: "Shamas Ur Rehman auf GitHub",
      linkedinLabel: "Shamas Ur Rehman auf LinkedIn",
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
      pill: "Dresden · Werkstudent, 20 Std./Woche",
      viewWork: "Wichtigste Projekte ansehen",
      downloadCv: "Lebenslauf herunterladen",
    },
    work: {
      heading: "Projekte",
      intro:
        "Drei zentrale Systeme, jeweils mit Architektur und Nachweis. Drei frühere Systeme folgen in einem kompakten Index.",
      all: "Alle",
      showingAll: "Alle {total} Projekte werden angezeigt.",
      showingSome: "{n} von {total} Projekten verwenden {tag}.",
      earlierSystems: "Frühere & institutionelle Systeme",
      proof: "Nachweis",
      iouLabel: "registered IoU",
      metrics:
        "{version} · {total} Tests ({backend} Backend, {frontend} Frontend)",
      stackLabel: "Stack",
    },
    background: {
      heading: "Werdegang",
      experience: "Berufserfahrung",
      education: "Ausbildung",
      languagesLabel: "Sprachen",
      certificatesLabel: "Zertifikate",
    },
    stack: {
      heading: "Stack",
      intro:
        "Alle Fähigkeiten, gruppiert nach dem, was sie leisten. Die Filter über den Projekten filtern nach Stack.",
    },
    footer: {
      heading: "Kontakt",
      closing: "Jede Aussage auf dieser Seite hat ihren Nachweis.",
    },
    caseStudy: {
      allProjects: "Alle Projekte",
      problem: "Problem",
      architecture: "Architektur",
      outcome: "Ergebnis",
      evidence: "Nachweise",
      stack: "Stack",
      links: "Links",
      registryHeading: "Kautionsobergrenzen im Register",
      limitsHeading: "Grenzen",
    },
    proofNote: { evidence: "Nachweis", close: "Schließen" },
    assets: {
      leaselens: {
        ariaLabel:
          "Geteiltes Schema: Einzugs- und Auszugsgrenzen eines Zimmers, ausgerichtet, mit einem 86.1-Prozent-IoU-Fadenkreuz",
        title:
          "Einzugs- und Auszugsgrenzen eines Zimmers, ausgerichtet, 86.1% IoU",
        moveIn: "EINZUG",
        moveOut: "AUSZUG",
        iou: "86.1% IoU",
      },
      etl: {
        ariaLabel:
          "Pipeline-Diagramm: Quellen speisen MinIO und Parquet, Airflow-Tasks laden das PostgreSQL-Star-Schema",
        title:
          "Quellen speisen MinIO und Parquet, Airflow-Tasks laden PostgreSQL",
        sources: "Quellen",
        airflow: "Airflow",
        tasks: "Tasks",
        footer: "1 DAG · 3 TASKS · 4 TABELLEN",
      },
      orator: {
        ariaLabel:
          "Sprachwellenform mit strukturierten Kennzahlenbalken für Tempo, Füllwörter und Klarheit",
        title:
          "Sprachwellenform mit Kennzahlenbalken: Tempo, Füllwörter, Klarheit",
        pace: "TEMPO",
        fillerWords: "FÜLLWÖRTER",
        clarity: "KLARHEIT",
      },
    },
    meta: {
      titleSuffix: "Softwareentwickler, Dresden",
      description:
        "Persönliches Portfolio von Shamas Ur Rehman, MSc-Informatikstudent an der TU Dresden. Sechs veröffentlichte Systeme, jedes mit seinem Nachweis.",
    },
  },
};
