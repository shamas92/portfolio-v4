// Single typed content module for the portfolio.
// Every fact here comes from PRODUCT.md or the verified project records.
// Nothing is invented. Where a fact is missing, the content lists it in
// `contentTodos` and the UI renders a visible TODO(content) marker in
// development and omits the line in production.

export const siteUrl = "https://portfolio-v4-rosy-five.vercel.app";

export type Profile = {
  name: string;
  role: string;
  location: string;
  claim: string;
  statusLine: string;
  email: string;
  github: string;
  linkedin: string;
  workEligibility: string;
};

export const profile: Profile = {
  name: "Shamas Ur Rehman",
  role: "Software Engineer",
  location: "Dresden, Germany",
  claim: "I build data & ML systems.",
  statusLine: "MSc Computer Science, TU Dresden",
  email: "shamasrehman249@gmail.com",
  github: "https://github.com/shamas92",
  linkedin: "https://linkedin.com/in/shamasrehman",
  workEligibility: "Working-student eligible, 20 hours a week.",
};

/** Missing facts. Rendered as TODO(content) markers in dev, omitted in prod. */
export const contentTodos = [
  {
    id: "available-from",
    label: "Available-from month (start date)",
  },
];

/** A paragraph is a list of plain strings and annotated claims.
 *  A claim renders highlighted; its note opens in the margin column. */
export type Inline = string | { claim: string; note: string };
export type Prose = Inline[][];

export type Project = {
  slug: string;
  title: string;
  year: number;
  /** One-sentence outcome for the Work row. */
  rowOutcome: string;
  /** One proof statement for the Work row. */
  rowProof: string;
  stack: string[];
  /** What he built on this project — one or two sentences, used on
   *  the flagship card ("Built") and the case page (Contribution).
   *  States the work, never the team size: solo vs team is not
   *  verifiable from the repo or the content, so it is not claimed. */
  contribution: string;
  /** The one meaningful technical decision, with its trade-off —
   *  one or two sentences, used on the card ("Decision") and the
   *  case page. The trade-off is stated as design rationale, never
   *  as a measured figure. */
  decision: string;
  /** The verifiable role or participation fact for the case page
   *  ("My role"). Only what a source states: a job title, a
   *  hackathon team name, a thesis, an academic project. */
  role: string;
  problem: Prose;
  result: Prose;
  /** The one verified figure, when one exists. */
  figure?: { value: string; label: string };
  /** Production release version, when one exists. */
  version?: string;
  /** Test counts at the release, when measured. */
  tests?: { total: number; backend: number; frontend: number };
  /** Plain-English proof callout for the flagship card, composed
   *  verbatim from the project's own figure, tests and notes. */
  proofCallout?: string;
  /** Concrete technical scope for the tier-2 index rows, drawn
   *  only from the project's own problem, contribution and decision
   *  text. */
  scope?: string;
  /** The one piece of evidence that proves it — a quote or a citation. */
  evidence?: {
    kind: "quote" | "citation";
    text: string;
    /** English gloss for a German quote. */
    gloss?: string;
    /** Attribution line under the evidence. */
    cite: string;
  };
  image?: {
    src: string;
    width: number;
    height: number;
    alt: string;
    caption: string;
  };
  /** The five-jurisdiction registry, LeaseLens only. */
  registry?: { jurisdiction: string; rule: string }[];
  /** Honest limits, stated where they exist. */
  limits?: string[];
  /** Badge shown on the tier-2 row, e.g. "Internal / Archived"
   *  for a project with no public site. */
  badge?: string;
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "leaselens",
    title: "LeaseLens",
    year: 2026,
    rowOutcome:
      "A tenant evidence workspace that checks deposit claims against the lease and the law.",
    rowProof:
      "86.1% registered IoU on the v7 demo pairing, measured live twice identically.",
    stack: ["Next.js", "TypeScript", "FastAPI", "Python", "SAM 3.1"],
    contribution:
      "Built the deterministic validator, the five-jurisdiction deposit-cap registry, and the SAM 3.1 photo-evidence flow on a Next.js/TypeScript frontend and a FastAPI/Python backend.",
    decision:
      "The model flags passages; the validator decides. Deposit math runs in Python, never in the model, so a number the model invents cannot reach the result — at the cost of a second, deterministic pass over every flagged quote.",
    role: "Hackathon entry, Team Shamas #4919 (Indie Developer Track)",
    problem: [
      [
        "A tenant who rents in another country signs a lease, pays a deposit, and months later gets a claim for damage or cleaning. The question is simple: does the claim match the lease and the law? Answering it means reading a long document in a foreign language, and the deposit cap changes at every border.",
      ],
      [
        "German law caps the deposit at ",
        {
          claim: "three times the monthly cold rent",
          note: "BGB §551. The registry holds the rule for five jurisdictions: Germany, the UK, New York, France, and Japan. Japan has no cap figure.",
        },
        ". The UK caps it at five weeks' rent, New York at one month, and France at one or two months, depending on whether the flat is furnished. A tenant needs the lease text and the local rule next to each other, and a check that ties the two together.",
      ],
    ],
    result: [
      [
        "Version 1.0.0 shipped on 2026-11-09 with ",
        {
          claim: "197 tests",
          note: "132 backend, 65 frontend, at v1.0.0.",
        },
        ". Accepted into the Meta Global AI Developer Hackathon 2026 (Indie Developer Track, Team Shamas #4919); not a top finalist.",
      ],
      [
        "The dorm demo runs the check on a real lease. The deposit in the lease is €950.00. The legal cap for that flat is €535.41, so the excess is €414.59. The photo evidence for the same flat scored ",
        {
          claim: "86.1% registered IoU",
          note: "Registered IoU measures overlap after the two photos are aligned, so the score compares the same wall instead of two photos taken from different spots. The v7 demo pairing scored 86.1%, measured live twice identically. Aligned 1588, move-out 1722.",
        },
        " on the v7 demo pairing.",
      ],
    ],
    figure: {
      value: "86.1%",
      label:
        "registered IoU, v7 demo pairing — single-pair score, no baseline; measured live twice identically",
    },
    version: "v1.0.0",
    tests: { total: 197, backend: 132, frontend: 65 },
    proofCallout:
      "Registered IoU measures overlap after the two photos are aligned, so the score compares the same wall instead of two photos taken from different spots.",
    evidence: {
      kind: "quote",
      text: "Die vor dem Einzug zu zahlende Kaution beträgt 950,00 EUR.",
      gloss: "The deposit to be paid before moving in is €950.00.",
      cite: "Verified verbatim excerpt from the dorm lease. German deposit cap: 3× monthly cold rent (BGB §551).",
    },
    image: {
      src: "/images/leaselens-sam-exhibit.png",
      width: 740,
      height: 640,
      alt: "Dorm lease photo with SAM 3.1 segmentation overlay",
      caption:
        "SAM 3.1 segmentation burn from the v7 demo pairing, the dorm photo itself. 86.1% registered IoU, measured live twice identically.",
    },
    registry: [
      {
        jurisdiction: "Germany",
        rule: "BGB §551: at most 3× monthly cold rent",
      },
      {
        jurisdiction: "United Kingdom",
        rule: "Tenant Fees Act 2019: 5 weeks' rent",
      },
      { jurisdiction: "New York, US", rule: "GOL §7-108: 1 month" },
      {
        jurisdiction: "France",
        rule: "Loi 89-462, art. 22: 1 month unfurnished, 2 months furnished",
      },
      {
        jurisdiction: "Japan",
        rule: "Civil Code art. 622-2: no deposit-cap figure exists",
      },
    ],
    limits: [
      "SAM cannot isolate the door-frame dent or capture small burn specks.",
      "The socket needs a click, not a concept phrase.",
      "The QR handoff was never scan-tested on a real phone.",
      "No hosted live-demo URL is verified.",
    ],
    links: [
      {
        label: "LeaseLens on GitHub",
        href: "https://github.com/shamas92/leaselens",
      },
      { label: "LeaseLens demo film", href: "https://youtu.be/le_KM97lm5w" },
    ],
  },
  {
    slug: "sales-etl-pipeline",
    title: "Sales ETL Pipeline",
    year: 2026,
    rowOutcome:
      "Sales data from several sources, loaded into one trustworthy shape.",
    rowProof: "One DAG, three tasks, four tables.",
    stack: [
      "Apache Airflow",
      "Docker Compose",
      "PostgreSQL",
      "MinIO",
      "Parquet",
    ],
    contribution:
      "Built the Airflow DAG, the Parquet/MinIO staging, the Kimball star schema, and the duplicate-proof upserts.",
    decision:
      "Upserts live in Python (psycopg2 ON CONFLICT), not in stored procedures: a rerun cannot duplicate rows, and the logic stays in the codebase where it can be read and tested. Mailpit alerts when a run fails.",
    role: "Personal project",
    problem: [
      [
        "Sales data arrived from several sources with no single, trustworthy shape for analysis.",
      ],
    ],
    result: [
      [
        "The pipeline runs with ",
        {
          claim: "one DAG, three tasks, and four tables",
          note: "dim_date, dim_customer, dim_product, fact_sales. Verified in the repository.",
        },
        ". The seed loads 4 mock rows and keeps ",
        {
          claim: "3 unique transactions after dedup",
          note: "The repository seeds 4 mock rows; dedup leaves 3 unique transactions. No larger dataset or runtime has been measured.",
        },
        ", a rerun duplicates nothing, and a failed run alerts by email.",
      ],
    ],
    proofCallout:
      "One DAG, three tasks, four tables: dim_date, dim_customer, dim_product, fact_sales.",
    image: {
      src: "/images/etl-diagram.png",
      width: 1728,
      height: 1440,
      alt: "Diagram of the ETL pipeline: one DAG, three tasks, four tables",
      caption:
        "Pipeline diagram: three tasks, four tables. Airflow TaskFlow, Parquet/MinIO staging, PostgreSQL.",
    },
    links: [
      {
        label: "Sales ETL Pipeline on GitHub",
        href: "https://github.com/shamas92/sales-etl-pipeline",
      },
    ],
  },
  {
    slug: "oratorpath",
    title: "OratorPath",
    year: 2025,
    rowOutcome: "Measured feedback for developers who speak in public.",
    rowProof: "Peer-reviewed publication, 2025.",
    stack: ["PyTorch", "Hugging Face", "NLP"],
    contribution:
      "Built the speech-analysis coach (PyTorch, Hugging Face, NLP) as the final-year thesis project and co-authored the published paper.",
    decision:
      "The coach returns measured feedback — pace, filler words, clarity — instead of impressions. Numbers make progress comparable across sessions; they say nothing about delivery, which the speaker still has to judge.",
    role: "Final-year thesis project; co-author of the published paper",
    problem: [
      [
        "Public-speaking feedback for software developers was anecdotal, not measured.",
      ],
    ],
    result: [
      [
        "The work was co-authored as a paper and published in a ",
        {
          claim: "peer-reviewed journal",
          note: "Spectrum of Engineering Sciences, Vol. 3, Issue 7, pp. 843–852, 2025, ISSN 3007-3138.",
        },
        ". The dashboard is no longer live; the paper is the record.",
      ],
    ],
    evidence: {
      kind: "citation",
      text: "An AI-driven speech analysis for enhancing communication and public speaking in global software development.",
      cite: "Spectrum of Engineering Sciences, Vol. 3, Issue 7, pp. 843–852, 2025, ISSN 3007-3138.",
    },
    proofCallout:
      "Peer-reviewed publication, 2025: Spectrum of Engineering Sciences, Vol. 3, Issue 7, pp. 843–852, ISSN 3007-3138.",
    links: [],
  },
  {
    slug: "hitec-cms",
    title: "HITEC University Web Platform & Admin Panel",
    year: 2025,
    rowOutcome:
      "Database-backed university web modules, an internal content-management admin panel, and an integrated RAG support chatbot.",
    rowProof:
      "Delivered during IT Department internship (May–Oct 2025); internal admin panel & CMS, live site maintained externally post-internship.",
    stack: ["C#", "ASP.NET MVC", "SQL Server", "Python", "RAG"],
    contribution:
      "Built the database-backed web modules, the internal CMS admin panel, and the RAG support chatbot during the IT Department internship.",
    decision:
      "The chatbot answers from university documents (RAG) instead of general knowledge, so its answers stay grounded in the institution's own material — at the cost of only knowing what is in those documents.",
    role: "IT Department intern, HITEC University (May–Oct 2025)",
    problem: [
      [
        "HITEC University's web presence ran on modules that needed a database behind them, and the internal team needed an admin panel to manage content — plus a support chatbot that could answer questions from university documents.",
      ],
    ],
    result: [
      [
        "Delivered during the IT Department internship (May–Oct 2025); internal admin panel & CMS, live site maintained externally post-internship.",
      ],
    ],
    scope:
      "Database-backed university web modules, an internal content-management admin panel, and an integrated RAG support chatbot.",
    badge: "Internal / Archived",
    links: [],
  },
  {
    slug: "quality-crm",
    title: "Quality Management & Defect-Tracking CRM",
    year: 2024,
    rowOutcome: "Defects and quality issues in one record, not informal notes.",
    rowProof: "Shipped as an academic project.",
    stack: ["Laravel", "MySQL", "PHP"],
    contribution:
      "Built a Laravel/MySQL CRM that keeps defects and quality issues in one relational record.",
    decision:
      "One relational record per defect instead of informal notes: heavier to set up than a spreadsheet, but every issue has one place to live.",
    role: "Academic project (2024)",
    problem: [
      [
        "Defects and quality issues were tracked informally, with no single record.",
      ],
    ],
    result: [["Shipped as an academic project."]],
    scope:
      "Relational defect tracking in Laravel/MySQL — one record for every defect.",
    links: [],
  },
  {
    slug: "upliftu",
    title: "UpliftU",
    year: 2024,
    rowOutcome: "Conversational support for students, in a structured form.",
    rowProof: "Shipped as an academic project.",
    stack: ["Python", "Hugging Face", "NLP"],
    contribution:
      "Built conversational student support with Hugging Face NLP in Python.",
    decision:
      "Structured NLP support instead of free-form chat, so conversations follow a form instead of drifting.",
    role: "Academic project (2024)",
    problem: [
      ["Conversational support for students had no structured, measured form."],
    ],
    result: [["Shipped as an academic project."]],
    scope: "Structured NLP student support in Python/Hugging Face.",
    links: [],
  },
];

export type EducationEntry = {
  degree: string;
  school: string;
  period: string;
  note: string;
};

export type ExperienceEntry = {
  role: string;
  org: string;
  period: string;
  note: string;
};

export type BackgroundContent = {
  /** First-person introduction, 2–3 sentences, rendered as the
   *  lead paragraph of the Background section. */
  about: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  languages: { language: string; level: string }[];
  certifications: { items: string[]; period: string };
};

export const background: BackgroundContent = {
  about:
    "I am an MSc Computer Science student at TU Dresden, after a BSc in Software Engineering from HITEC University in Pakistan. I spent six months in a university IT department building database-backed web modules and a RAG chatbot, and I build data pipelines and ML systems in my own time — most recently LeaseLens, which checks rental deposit claims against the lease and the law. I am looking for a working-student role in data engineering or ML in Dresden, 20 hours a week, and I want work where the result can be measured.",
  education: [
    {
      degree: "MSc Computer Science",
      school: "TU Dresden",
      period: "Oct 2026 – present",
      note: "Scalable Data Engineering, Data Visualization, Requirements Engineering.",
    },
    {
      degree: "BSc Software Engineering",
      school: "HITEC University Taxila",
      period: "Sep 2021 – Aug 2025",
      note: "CGPA 3.48/4.00 (German grade 1.7).",
    },
  ],
  experience: [
    {
      role: "IT Department Intern",
      org: "HITEC University",
      period: "May – Oct 2025",
      note: "C#/ASP.NET MVC portal modules; RAG support chatbot in Python/Hugging Face over university docs.",
    },
    {
      role: "Intern",
      org: "Heavy Industries Taxila",
      period: "Jul – Aug 2024",
      note: "Built real-time C#/.NET and SQL Server process monitoring with live dashboards, cutting manual logging errors by 20%.",
    },
  ],
  languages: [
    { language: "English", level: "C1 (IELTS 7.5)" },
    { language: "German", level: "A1/A2 (TU Dresden course)" },
    { language: "Urdu", level: "Native" },
  ],
  certifications: {
    items: [
      "Google Advanced Data Analytics",
      "Google Data Analytics",
      "Google IT Automation with Python",
      "Google Project Management",
    ],
    period: "Nov 2025 – Sep 2026",
  },
};

/** Each skill appears once. `projects` lists the slugs of the
 *  projects that used it — the Skills section renders them as
 *  "used in" links. A skill with no `projects` has no shipped use
 *  on this page and is shown under the "no shipped use" line
 *  instead of being dropped. */
export type SkillGroup = {
  title: string;
  skills: { name: string; projects?: string[] }[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Languages",
    skills: [
      { name: "Python", projects: ["leaselens", "hitec-cms", "upliftu"] },
      { name: "SQL", projects: ["sales-etl-pipeline"] },
      { name: "C#", projects: ["hitec-cms"] },
      { name: "TypeScript", projects: ["leaselens"] },
      { name: "JavaScript" },
      { name: "PHP", projects: ["quality-crm"] },
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
      { name: "Parquet", projects: ["sales-etl-pipeline"] },
    ],
  },
  {
    title: "Frameworks & AI",
    skills: [
      { name: "FastAPI", projects: ["leaselens"] },
      { name: "ASP.NET MVC", projects: ["hitec-cms"] },
      { name: "Next.js", projects: ["leaselens"] },
      { name: "React", projects: ["leaselens"] },
      { name: "PyTorch", projects: ["oratorpath"] },
      { name: "Hugging Face", projects: ["oratorpath", "upliftu"] },
      { name: "RAG", projects: ["hitec-cms"] },
      { name: "NLP", projects: ["oratorpath", "upliftu"] },
      { name: "SAM 3.1", projects: ["leaselens"] },
      { name: "Laravel", projects: ["quality-crm"] },
    ],
  },
  {
    title: "Databases",
    skills: [
      { name: "SQL Server", projects: ["hitec-cms"] },
      { name: "MySQL", projects: ["quality-crm"] },
      { name: "PostgreSQL", projects: ["sales-etl-pipeline"] },
    ],
  },
  {
    title: "Tools",
    skills: [
      {
        name: "Git",
        projects: [
          "leaselens",
          "sales-etl-pipeline",
          "oratorpath",
          "hitec-cms",
          "quality-crm",
          "upliftu",
        ],
      },
      { name: "Docker", projects: ["sales-etl-pipeline"] },
      { name: "Docker Compose", projects: ["sales-etl-pipeline"] },
      { name: "MinIO", projects: ["sales-etl-pipeline"] },
      { name: "Apache Airflow", projects: ["sales-etl-pipeline"] },
      { name: "Linux (Ubuntu)" },
      { name: "REST APIs" },
    ],
  },
];

/** Every user-visible UI string on the site, in one typed shape.
 *  English is the source of truth; the German locale (content.de.ts)
 *  is typed against this exact shape, so a missing German string is
 *  a type error, not a runtime gap. Templates use {placeholder}
 *  slots, filled by the format() helper in the locale provider.
 *  Numbers, dates, metrics and links never live in these templates
 *  as translated values — they are filled in from the content data
 *  and stay byte-identical across locales. */
export type UiStrings = {
  skipLink: string;
  navLabel: string;
  nav: { work: string; background: string; contact: string };
  header: {
    menuOpen: string;
    menuClose: string;
    menuNavLabel: string;
  };
  copy: {
    label: string;
    copied: string;
    failed: string;
    copiedLive: string;
    failedLive: string;
    iconLabel: string;
  };
  theme: { toLight: string; toDark: string };
  language: { label: string };
  hero: { pill: string; ask: string; emailMe: string; downloadCv: string };
  work: {
    heading: string;
    intro: string;
    featured: string;
    all: string;
    showingAll: string;
    showingSome: string;
    earlierSystems: string;
    filterLabel: string;
    detailsLabel: string;
    filterBy: string;
    filterClear: string;
    proof: string;
    iouLabel: string;
    metrics: string;
    stackLabel: string;
    builtLabel: string;
    decisionLabel: string;
  };
  background: {
    heading: string;
    experience: string;
    education: string;
    languagesLabel: string;
    certificatesLabel: string;
  };
  skills: {
    heading: string;
    intro: string;
    usedIn: string;
    everyProject: string;
    noShippedUse: string;
  };
  footer: { heading: string; closing: string };
  caseStudy: {
    allProjects: string;
    problem: string;
    contribution: string;
    decision: string;
    result: string;
    evidence: string;
    stack: string;
    links: string;
    role: string;
    registryHeading: string;
    limitsHeading: string;
  };
  proofNote: { evidence: string; close: string };
  assets: {
    leaselens: {
      ariaLabel: string;
      title: string;
      moveIn: string;
      moveOut: string;
      iou: string;
    };
    etl: {
      ariaLabel: string;
      title: string;
      sources: string;
      airflow: string;
      tasks: string;
      footer: string;
    };
    orator: {
      ariaLabel: string;
      title: string;
      pace: string;
      fillerWords: string;
      clarity: string;
    };
  };
  meta: { titleSuffix: string; description: string };
};

export const ui: UiStrings = {
  skipLink: "Skip to content",
  navLabel: "Sections",
  nav: {
    work: "Work",
    background: "Background",
    contact: "Contact",
  },
  header: {
    menuOpen: "Open menu",
    menuClose: "Close menu",
    menuNavLabel: "Sections",
  },
  copy: {
    label: "Copy email",
    copied: "Copied ✓",
    failed: "Copy failed — use the email link",
    copiedLive: "Email address copied to clipboard.",
    failedLive: "Copy failed. Use the email link instead.",
    iconLabel: "Copy email address",
  },
  theme: {
    toLight: "Switch to light mode",
    toDark: "Switch to dark mode",
  },
  language: {
    label: "Language",
  },
  hero: {
    pill: "Dresden · Working-student eligible, 20h/wk",
    ask: "Looking for a working-student role in full-stack software and data engineering.",
    emailMe: "Email me",
    downloadCv: "Download CV",
  },
  work: {
    heading: "Work",
    intro:
      "Featured work first, with the problem, the contribution, and the evidence.",
    featured: "Featured",
    all: "All",
    showingAll: "Showing all {total} projects.",
    showingSome: "{n} of {total} projects use {tag}.",
    earlierSystems: "Earlier projects",
    filterLabel: "Filter projects by stack",
    detailsLabel: "How it was built",
    filterBy: "Filter by technology",
    filterClear: "Clear filter",
    proof: "Proof",
    iouLabel: "registered IoU",
    metrics:
      "{version} · {total} tests ({backend} backend, {frontend} frontend)",
    stackLabel: "Stack",
    builtLabel: "Built",
    decisionLabel: "Decision",
  },
  background: {
    heading: "Background",
    experience: "Experience",
    education: "Education",
    languagesLabel: "Spoken languages",
    certificatesLabel: "Certificates",
  },
  skills: {
    heading: "Skills",
    intro:
      "Every skill, grouped by what it does. Each one names the project that used it; the ones with no shipped use on this page are listed separately, not dropped.",
    usedIn: "Used in",
    everyProject: "every project",
    noShippedUse: "No shipped use on this page",
  },
  footer: {
    heading: "Contact",
    closing: "Every claim on this page carries its evidence.",
  },
  caseStudy: {
    allProjects: "All projects",
    problem: "Problem",
    contribution: "Contribution",
    decision: "Decision",
    result: "Result",
    evidence: "Evidence",
    stack: "Stack",
    links: "Links",
    role: "My role",
    registryHeading: "Deposit caps in the registry",
    limitsHeading: "Limits",
  },
  proofNote: { evidence: "Evidence", close: "Close" },
  assets: {
    leaselens: {
      ariaLabel:
        "Split-frame schematic: move-in and move-out room boundaries aligned, with an 86.1 percent IoU reticle",
      title: "Move-in and move-out room boundaries aligned, 86.1% IoU",
      moveIn: "MOVE-IN",
      moveOut: "MOVE-OUT",
      iou: "86.1% IoU",
    },
    etl: {
      ariaLabel:
        "Pipeline diagram: sources feed MinIO and Parquet, Airflow tasks load the PostgreSQL star schema",
      title: "Sources feed MinIO and Parquet, Airflow tasks load PostgreSQL",
      sources: "Sources",
      airflow: "Airflow",
      tasks: "Tasks",
      footer: "1 DAG · 3 TASKS · 4 TABLES",
    },
    orator: {
      ariaLabel:
        "Speech waveform with structured metric bars for pace, filler words, and clarity",
      title: "Speech waveform with metric bars: pace, filler words, clarity",
      pace: "PACE",
      fillerWords: "FILLER WORDS",
      clarity: "CLARITY",
    },
  },
  meta: {
    titleSuffix: "Software Engineer, Dresden",
    description:
      "Personal portfolio of Shamas Ur Rehman, MSc Computer Science student at TU Dresden. Six shipped systems, each shown with its proof.",
  },
};

/** The full translatable content of the site, in one typed shape.
 *  content.de.ts must satisfy this exact type. */
export type SiteContent = {
  profile: Profile;
  projects: Project[];
  background: BackgroundContent;
  skillGroups: SkillGroup[];
  ui: UiStrings;
};

/** English content — the source of truth. */
export const enContent: SiteContent = {
  profile,
  projects,
  background,
  skillGroups,
  ui,
};
