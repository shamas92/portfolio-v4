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
  address: string;
  claim: string;
  /** The word or phrase the hero headline highlights in lime.
   *  Must occur verbatim inside claim. */
  claimHighlight: string;
  statusLine: string;
  email: string;
  github: string;
  linkedin: string;
  workEligibility: string;
};

export const profile: Profile = {
  name: "Shamas Ur Rehman",
  role: "Data Engineering Student",
  location: "Dresden, Germany",
  address: "Dresden, Germany",
  claim: "I build data pipelines and ML systems.",
  claimHighlight: "data pipelines",
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
  {
    id: "credential-url-advanced-data-analytics",
    label: "TODO(owner): credential URL, Google Advanced Data Analytics",
  },
  {
    id: "credential-url-data-analytics",
    label: "TODO(owner): credential URL, Google Data Analytics",
  },
  {
    id: "credential-url-it-automation-python",
    label: "TODO(owner): credential URL, Google IT Automation with Python",
  },
  {
    id: "credential-url-project-management",
    label: "TODO(owner): credential URL, Google Project Management",
  },
];

/** A paragraph is a list of plain strings and annotated claims.
 *  A claim renders highlighted; its note opens in the margin column. */
export type Inline = string | { claim: string; note: string };
export type Prose = Inline[][];

export type Project = {
  slug: string;
  title: string;
  /** Tier for the Work track: 'full' cards get the 860px track
   *  card with stats/proof; 'compact' cards render in the compact
   *  row below the track, with no photo, stats slot or proof line. */
  tier: "full" | "compact";
  /** Short title for the track card, when the case-page title is
   *  too long for the card. The full title stays on the case page. */
  shortTitle?: string;
  year: number;
  /** Short honest category for the Work grid's overlay pill,
   *  drawn from the project's own role: Hackathon, Data
   *  Engineering, Thesis & Paper, Internal / Archived,
   *  Defect Tracking, Student Support. */
  category: string;
  /** One-sentence outcome for the Work row. */
  rowOutcome: string;
  /** One proof statement for the Work row. Omitted where there
   *  is no actual proof — the "Proof" label appears only where
   *  proof exists, never as a completion statement. */
  rowProof?: string;
  /** Verified stats for the track card's stats row. Only
   *  LeaseLens and Sales ETL have one; the rest omit it. The
   *  values are the project's own verified figures. */
  stats?: { value: string; label: string }[];
  stack: string[];
  /** What he built on this project — one or two sentences, used on
   *  the case page (Contribution). States the work, never the team
   *  size: solo vs team is not verifiable from the repo or the
   *  content, so it is not claimed. */
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
  /** Short scope pills for the case-page head, paraphrased only
   *  from the project's own contribution and scope text. */
  scopePills?: string[];
  problem: Prose;
  result: Prose;
  /** The one verified figure, when one exists. */
  figure?: { value: string; label: string };
  /** Production release version, when one exists. */
  version?: string;
  /** Test counts at the release, when measured. */
  tests?: { total: number; backend: number; frontend: number };
  /** Plain-English proof callout, composed verbatim from the
   *  project's own figure, tests and notes. */
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
  /** Paper URL/DOI for a published paper, when one is on record.
   *  Empty until the user supplies it — never invent a URL. */
  paperUrl?: string;
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "leaselens",
    title: "LeaseLens",
    tier: "full",
    year: 2026,
    category: "Hackathon",
    rowOutcome:
      "A tenant evidence workspace that checks deposit claims against the lease and the law.",
    rowProof:
      "Deposit €950.00 vs legal cap €535.41: excess €414.59 flagged on a real lease.",
    stats: [
      { value: "86.1%", label: "registered IoU" },
      { value: "197", label: "tests" },
      { value: "5", label: "jurisdictions" },
    ],
    stack: ["Next.js", "TypeScript", "FastAPI", "Python", "SAM 3.1"],
    contribution:
      "Built the deterministic validator, the five-jurisdiction deposit-cap registry, and the SAM 3.1 photo-evidence flow on a Next.js/TypeScript frontend and a FastAPI/Python backend.",
    decision:
      "The model flags passages; the validator decides. Deposit math runs in Python, never in the model, so a number the model invents cannot reach the result — at the cost of a second, deterministic pass over every flagged quote.",
    role: "Hackathon · Team Shamas #4919",
    scopePills: ["Deposit-cap registry", "Photo evidence", "5 jurisdictions"],
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
        " and the UK caps it at five weeks' rent, New York at one month, and France at one or two months, depending on whether the flat is furnished. A tenant needs the lease text and the local rule next to each other, and a check that ties the two together.",
      ],
    ],
    result: [
      [
        "Version 1.0.0 shipped on 2026-11-09 with ",
        {
          claim: "197 tests",
          note: "132 backend, 65 frontend, at v1.0.0.",
        },
        " and was accepted into the Meta Global AI Developer Hackathon 2026 (Indie Developer Track, Team Shamas #4919); not a top finalist.",
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
    tier: "full",
    year: 2026,
    category: "Data Engineering",
    rowOutcome:
      "Sales data from several sources, loaded into one trustworthy shape.",
    rowProof: "One DAG, three tasks, four tables, verified in the repository.",
    stats: [
      { value: "1", label: "DAG" },
      { value: "3", label: "tasks" },
      { value: "4", label: "tables" },
    ],
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
    scopePills: ["Airflow DAG", "Star schema", "Duplicate-proof upserts"],
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
        " and loads a 4-row mock seed, keeping ",
        {
          claim: "3 unique transactions after dedup",
          note: "The repository seeds 4 mock rows; dedup leaves 3 unique transactions. No larger dataset or runtime has been measured.",
        },
        " in the star schema. A failed run alerts by email.",
      ],
      [
        "What is still to be done: a 1M-row synthetic run, a rerun test, data-quality checks and timings, and an Airflow DAG screenshot. Until then, no outcome numbers are claimed.",
      ],
    ],
    proofCallout:
      "One DAG, three tasks, four tables: dim_date, dim_customer, dim_product, fact_sales.",
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
    tier: "full",
    year: 2025,
    category: "Thesis & Paper",
    rowOutcome: "Measured feedback for developers who speak in public.",
    rowProof:
      "Published in *Spectrum of Engineering Sciences*, Vol. 3, Issue 7, pp. 843–852 (2025).",
    stats: [
      { value: "Vol. 3", label: "volume" },
      { value: "Issue 7", label: "issue" },
      { value: "843–852", label: "pages" },
    ],
    stack: ["PyTorch", "Hugging Face", "NLP"],
    contribution:
      "Built the speech-analysis coach (PyTorch, Hugging Face, NLP) as the final-year thesis project and co-authored the published paper.",
    decision:
      "The coach returns measured feedback — pace, filler words, clarity — instead of impressions. Numbers make progress comparable across sessions; they say nothing about delivery, which the speaker still has to judge.",
    role: "Thesis · Co-author, published paper",
    scopePills: ["Speech analysis", "Published paper"],
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
        " in 2025. The dashboard is no longer live; the paper is the record.",
      ],
    ],
    evidence: {
      kind: "citation",
      text: "An AI-driven speech analysis for enhancing communication and public speaking in global software development.",
      cite: "Spectrum of Engineering Sciences, Vol. 3, Issue 7, pp. 843–852, 2025, ISSN 3007-3138.",
    },
    proofCallout:
      "Peer-reviewed publication, 2025: Spectrum of Engineering Sciences, Vol. 3, Issue 7, pp. 843–852, ISSN 3007-3138.",
    /* Paper URL/DOI is not on record. Empty until the user
       supplies it — do not invent one. */
    paperUrl: "",
    links: [],
  },
  {
    slug: "hitec-cms",
    title: "HITEC University Web Platform & Admin Panel",
    shortTitle: "HITEC Web Platform & Admin Panel",
    tier: "full",
    year: 2025,
    category: "Internal / Archived",
    rowOutcome:
      "Database-backed university web modules, an internal content-management admin panel, and an integrated RAG support chatbot.",
    rowProof:
      "Delivered during IT Department internship (May–Oct 2025); internal admin panel & CMS, live site maintained externally post-internship.",
    stats: [
      { value: "6 months", label: "months, May–Oct 2025" },
      { value: "3 parts", label: "parts: modules, CMS, chatbot" },
      { value: "5 technologies", label: "technologies" },
    ],
    stack: ["C#", "ASP.NET MVC", "SQL Server", "Python", "RAG"],
    contribution:
      "Built the database-backed web modules, the internal CMS admin panel, and the RAG support chatbot during the IT Department internship.",
    decision:
      "The chatbot answers from university documents (RAG) instead of general knowledge, so its answers stay grounded in the institution's own material — at the cost of only knowing what is in those documents.",
    role: "IT Department intern, May–Oct 2025",
    problem: [
      [
        "HITEC University's web presence ran on modules that needed a database behind them, and the internal team needed an admin panel to manage content — plus a support chatbot that could answer questions from university documents.",
      ],
    ],
    result: [
      [
        "Built during the IT Department internship (May–Oct 2025): database-backed web modules, an internal CMS admin panel, and a RAG support chatbot. The project is internal and archived, with no public site or repository, and the live site is maintained externally now that the internship has ended.",
      ],
    ],
    scope:
      "Database-backed university web modules, an internal content-management admin panel, and an integrated RAG support chatbot.",
    scopePills: ["Web modules", "CMS admin panel", "RAG chatbot"],
    badge: "Internal / Archived",
    links: [],
  },
  {
    slug: "quality-crm",
    title: "Quality Management & Defect-Tracking CRM",
    shortTitle: "Defect-Tracking CRM",
    tier: "compact",
    year: 2024,
    category: "Defect Tracking",
    rowOutcome: "Defects and quality issues in one record, not informal notes.",
    stack: ["Laravel", "MySQL", "PHP"],
    contribution:
      "Built a Laravel/MySQL CRM that keeps defects and quality issues in one relational record.",
    decision:
      "One relational record per defect instead of informal notes: heavier to set up than a spreadsheet, but every issue has one place to live.",
    role: "Academic project",
    problem: [
      [
        "Defects and quality issues were tracked informally, with no single record.",
      ],
    ],
    result: [
      [
        "Built as an academic project in 2024: a Laravel/MySQL CRM that keeps defects and quality issues in one relational record. No repository or live site is on record.",
      ],
    ],
    scope:
      "Relational defect tracking in Laravel/MySQL — one record for every defect.",
    scopePills: ["Defect records", "Laravel/MySQL"],
    links: [],
  },
  {
    slug: "upliftu",
    title: "UpliftU",
    tier: "compact",
    year: 2024,
    category: "Student Support",
    rowOutcome: "Conversational support for students, in a structured form.",
    stack: ["Python", "Hugging Face", "NLP"],
    contribution:
      "Built conversational student support with Hugging Face NLP in Python.",
    decision:
      "Structured NLP support instead of free-form chat, so conversations follow a form instead of drifting.",
    role: "Academic project",
    problem: [
      ["Conversational support for students had no structured, measured form."],
    ],
    result: [
      [
        "Built as an academic project in 2024: conversational student support with Hugging Face NLP in Python, structured around dialogue flows. No repository or live site is on record.",
      ],
    ],
    scope: "Structured NLP student support in Python/Hugging Face.",
    scopePills: ["Structured dialogue", "Hugging Face NLP"],
    links: [],
  },
];

/** One highlight line on an experience card. `bolds` lists
 *  substrings of `text` that render bold — tech names,
 *  metrics, outcomes only, never new words. The component
 *  splits `text` on them; a bold that does not occur verbatim
 *  renders plain (and warns in development). */
export type Highlight = {
  text: string;
  bolds: string[];
};

export type AboutEntry = {
  /** Stable slug for the card id and the role-list target. */
  id: string;
  kind: "education" | "experience";
  /** Education: degree ("MSc Computer Science"); Experience:
   *  role ("Freelance Web Developer"). */
  role: string;
  /** Education: school ("TU Dresden"); Experience: company
   *  ("Tools420"). The card title is `{role} — {org}`; the
   *  role list shows the org bold. */
  org: string;
  period: string;
  narrative: string;
  highlights: Highlight[];
  /** Stack pills. The MSc pills are the three verified course
   *  names only — Python/SQL are unverified for the MSc. */
  pills: string[];
};

export type AboutContent = {
  /** The big statement, rendered as the section heading (h2,
   *  id="about-head"). The statement IS the heading; there is
   *  no separate "About" heading. */
  statement: string;
  /** Word inside statement highlighted in lime. Must occur
   *  verbatim inside statement. */
  statementHighlight: string;
  /** Mono label above the name in the left column. */
  aboutLabel: string;
  /** Hairline-separated fact rows under the statement. */
  factRows: { label: string; value: string }[];
  /** Experience + education, newest first, in display order:
   *  MSc, Tools420, HITEC intern, Heavy Industries intern,
   *  BSc. One card per entry; the role list follows this order. */
  entries: AboutEntry[];
  /** Certificates as a headed chip block under the experience
   *  cards. Replaces the old single-line `certifications`
   *  string. */
  certificates: {
    heading: string;
    period: string;
    items: string[];
  };
};

export const about: AboutContent = {
  statement:
    "I'm a data engineering student who turns messy data into systems people can measure. I care about pipelines that hold up, evidence you can check, and work where the result is a number, not a claim.",
  statementHighlight: "measure",
  aboutLabel: "( ABOUT ME )",
  factRows: [
    {
      label: "DEGREE",
      value:
        "MSc Computer Science, TU Dresden · BSc Software Engineering, HITEC University Taxila",
    },
    {
      label: "LANGUAGES",
      value: "English C1 (IELTS 7.5) · German A1/A2 · Urdu native",
    },
    {
      label: "BASED IN",
      value:
        "Dresden, Germany · open to working-student roles, 20 hours a week",
    },
  ],
  entries: [
    {
      id: "msc",
      kind: "education",
      role: "MSc Computer Science",
      org: "TU Dresden",
      period: "Oct 2026 – present",
      narrative:
        "MSc Computer Science at TU Dresden since October 2026. Coursework so far: Scalable Data Engineering, Data Visualization, and Requirements Engineering, where my group designed an on-device health consulting bot and I owned the stakeholder, technical-context and business-process work. I am looking for a working-student role in data engineering or ML in Dresden, 20 hours a week.",
      highlights: [
        {
          text: "Coursework: Scalable Data Engineering, Data Visualization, Requirements Engineering",
          bolds: [
            "Scalable Data Engineering",
            "Data Visualization",
            "Requirements Engineering",
          ],
        },
        {
          text: "Requirements Engineering Exercise 03: on-device health consulting bot — stakeholder acquisition, technical context, business processes (my slides 11–14)",
          bolds: ["Requirements Engineering Exercise 03", "slides 11–14"],
        },
      ],
      pills: [
        "Scalable Data Engineering",
        "Data Visualization",
        "Requirements Engineering",
      ],
    },
    {
      id: "tools420",
      kind: "experience",
      role: "Freelance Web Developer",
      org: "Tools420",
      period: "Nov 2025 – Aug 2026",
      narrative:
        "Freelance web developer for Tools420, a Canadian online store selling vaporizers and accessories since 2016. I built custom WordPress backend architectures and proprietary plugins in raw PHP, MySQL and JavaScript, and ran database migrations and deployments with zero unplanned downtime. I worked as a technical sub-contractor under a senior engineering team, across frontend, backend, database and tests.",
      highlights: [
        {
          text: "Custom WordPress backend architectures and proprietary plugins in raw PHP, MySQL and JavaScript",
          bolds: ["WordPress", "raw PHP, MySQL and JavaScript"],
        },
        {
          text: "Database migrations and deployments with zero unplanned downtime",
          bolds: ["zero unplanned downtime"],
        },
        {
          text: "Technical sub-contractor under a senior engineering team — frontend, backend, database and tests",
          bolds: [
            "Technical sub-contractor",
            "frontend, backend, database and tests",
          ],
        },
      ],
      pills: ["WordPress", "WooCommerce", "PHP", "MySQL", "JavaScript"],
    },
    {
      id: "hitec",
      kind: "experience",
      role: "IT Department Intern",
      org: "HITEC University",
      period: "May – Oct 2025",
      narrative:
        "Six-month internship in HITEC University's IT department. I built database-backed web modules and a CMS admin panel in C# and ASP.NET MVC on SQL Server, and a RAG support chatbot in Python that answers questions over university documents. The systems are internal and archived; the public site is maintained by another team.",
      highlights: [
        {
          text: "Database-backed web modules and a CMS admin panel in C# / ASP.NET MVC on SQL Server",
          bolds: ["C# / ASP.NET MVC", "SQL Server"],
        },
        {
          text: "RAG support chatbot in Python over university documents",
          bolds: ["RAG", "Python"],
        },
        {
          text: "Six months, May–Oct 2025; systems internal and archived",
          bolds: ["Six months, May–Oct 2025"],
        },
      ],
      pills: ["C#", "ASP.NET MVC", "SQL Server", "Python", "RAG"],
    },
    {
      id: "hit",
      kind: "experience",
      role: "Intern",
      org: "Heavy Industries Taxila",
      period: "Jul – Aug 2024",
      narrative:
        "Two-month internship at Heavy Industries Taxila. I built real-time process monitoring in C#/.NET on SQL Server, with live dashboards for the shop floor, cutting manual logging errors by 20%.",
      highlights: [
        {
          text: "Real-time process monitoring in C#/.NET on SQL Server, with live dashboards",
          bolds: ["C#/.NET on SQL Server", "live dashboards"],
        },
        {
          text: "Cutting manual logging errors by 20%",
          bolds: ["20%"],
        },
      ],
      pills: ["C#", ".NET", "SQL Server"],
    },
    {
      id: "bsc",
      kind: "education",
      role: "BSc Software Engineering",
      org: "HITEC University Taxila",
      period: "Sep 2021 – Aug 2025",
      narrative:
        "BSc Software Engineering at HITEC University Taxila, finished August 2025 with a CGPA of 3.48 out of 4.00 (German grade 1.7). My thesis became OratorPath, a public-speaking training platform, co-authored into a published paper. Earlier academic work includes a Laravel/MySQL defect-tracking CRM and UpliftU, an NLP project on Hugging Face.",
      highlights: [
        {
          text: "CGPA 3.48/4.00 (German grade 1.7)",
          bolds: ["CGPA 3.48/4.00", "German grade 1.7"],
        },
        {
          text: "Thesis became OratorPath — co-authored into a published paper (Spectrum of Engineering Sciences, Vol. 3, Issue 7, 2025)",
          bolds: ["OratorPath", "published paper"],
        },
        {
          text: "Academic projects: Laravel/MySQL defect-tracking CRM · UpliftU (Python / Hugging Face NLP)",
          bolds: [
            "Laravel/MySQL defect-tracking CRM",
            "UpliftU (Python / Hugging Face NLP)",
          ],
        },
      ],
      pills: ["Laravel", "MySQL", "PHP", "Python", "Hugging Face"],
    },
  ],
  certificates: {
    heading: "Google certificates",
    period: "2025–2026",
    items: [
      "Advanced Data Analytics",
      "Data Analytics",
      "IT Automation with Python",
      "Project Management",
    ],
  },
};

/** Skills as evidence tiers. Each skill appears once, with the
 *  short project labels that used it — the Skills section renders
 *  them as "used in" links. Every item here has a `usedIn`, so
 *  there is no "no shipped use" list. Skills with no shipped use
 *  on this page live in `coursework` instead: the Google
 *  certificates name the evidence (coursework), not the absence. */
export type Skills = {
  groups: {
    title: string;
    /** One-line purpose statement for the card (Ubaid model):
     *  what this group's skills are for. Localised. */
    purpose: string;
    items: { name: string; usedIn: string[] }[];
  }[];
  coursework: string;
};

export const skills: Skills = {
  groups: [
    {
      title: "Data engineering",
      purpose:
        "The pipeline stack. Airflow schedules each load, PostgreSQL and Parquet hold the result, and Docker makes the run repeatable.",
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
      title: "Languages",
      purpose:
        "Python does most of the work here. C#, TypeScript and PHP cover the projects that asked for them.",
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
      title: "Frameworks & AI",
      purpose:
        "FastAPI and Next.js serve the products; PyTorch, Hugging Face and SAM 3.1 run the models behind them.",
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
      title: "Databases & tools",
      purpose:
        "SQL Server and MySQL hold the project data, Git tracks every change, and REST APIs connect the pieces.",
      items: [
        { name: "SQL Server", usedIn: ["HITEC"] },
        { name: "MySQL", usedIn: ["Quality CRM"] },
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
    "Coursework (Google certificates): Pandas · NumPy · Matplotlib · scikit-learn · Tableau · Excel",
};

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
  nav: { work: string; about: string; skills: string; contact: string };
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
  hero: {
    pill: string;
    ask: string;
    emailMe: string;
    downloadCv: string;
    seeWorkFirst: string;
    /** Accessible label for the hero's project-name tablist. */
    featuredProjects: string;
  };
  work: {
    heading: string;
    intro: string;
    proof: string;
    viewCaseStudy: string;
    /** Track card's bottom-row pill: "Case study" (shorter than
     *  the hero caption's "View case study", which keeps its own
     *  wording). */
    trackCaseStudy: string;
    viewMore: string;
    /** The track's lime end card: "All 6 projects", a whole-card
     *  link to the /work index. */
    allProjects: string;
    /** Heading for the compact "Earlier work" list (Quality CRM,
     *  UpliftU) below the four featured projects. */
    earlierHeading: string;
  };
  /** The /work index page: every project in one place. */
  workIndex: {
    heading: string;
    intro: string;
    back: string;
    /** Spine kicker number above the heading ("Work"). */
    kickerNumber: string;
    /** Spine kicker text, template with {count} = project count,
     *  zero-padded to two digits by the component. */
    kickerText: string;
  };
  about: {
    /** Kicker text above the statement ("01 About"). The
     *  statement is the section heading; there is no separate
     *  "About" heading string. */
    kicker: string;
    experience: string;
    education: string;
    /** Accessible label for the sticky role list. */
    rolesLabel: string;
  };
  skills: {
    heading: string;
    usedIn: string;
    /** aria-label template for one "Used in" link: "{skill} — used
     *  in {project}". {project} is the full project title. */
    usedInLabel: string;
  };
  footer: {
    heading: string;
    /** Lime CTA panel heading (huge, on the lime panel). */
    ctaHeading: string;
    /** Lime CTA panel subline. Reuses the reply-time promise the
     *  form already makes in `ui.form.statusSent`. */
    ctaSub: string;
    /** Footer column headings. */
    exploreHeading: string;
    elsewhereHeading: string;
    currentlyHeading: string;
    /** "Currently" column, plain text (no dot, no pill — the hero
     *  pill is the site's one availability indicator). */
    currentlyWorking: string;
    currentlyLooking: string;
    /** Bottom bar: "Built with Next.js, hosted on Vercel". */
    builtWith: string;
  };
  form: {
    heading: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submit: string;
    nameRequired: string;
    emailRequired: string;
    emailInvalid: string;
    messageRequired: string;
    statusSent: string;
    statusFailed: string;
  };
  caseStudy: {
    allProjects: string;
    problem: string;
    contribution: string;
    myPart: string;
    decision: string;
    result: string;
    evidence: string;
    stack: string;
    links: string;
    role: string;
    registryHeading: string;
    limitsHeading: string;
    /** Two-line Result heading: "The Outcome." / "See the results." */
    outcomeTitle: string;
    outcomeSub: string;
    /** Two-line Evidence heading: "The Evidence." / "What proves it." */
    evidenceTitle: string;
    evidenceSub: string;
    /** Rail card heading ("Built with", shown uppercased by CSS). */
    builtWith: string;
    /** Accessible label for the scope-pills list. */
    scope: string;
    /** Bar-pair labels for the LeaseLens test split. */
    testsBackend: string;
    testsFrontend: string;
    /** Footnote template: "{backend} backend, {frontend} frontend,
     *  at {version}". */
    testsSplit: string;
    /** Template for the OratorPath page count: "{count} pages". */
    pagesCount: string;
  };
  proofNote: { evidence: string; close: string };
  assets: {
    leaselens: {
      ariaLabel: string;
      title: string;
      moveIn: string;
      moveOut: string;
      iou: string;
      window: string;
      deposit: string;
      cap: string;
      excess: string;
      status: string;
      caption: string;
    };
    etl: {
      ariaLabel: string;
      title: string;
      sources: string;
      airflow: string;
      tasks: string;
      footer: string;
      window: string;
      schema: string;
      caption: string;
    };
    orator: {
      ariaLabel: string;
      title: string;
      pace: string;
      fillerWords: string;
      clarity: string;
      window: string;
      paper: string;
      caption: string;
    };
    hitec: {
      ariaLabel: string;
      title: string;
      window: string;
      status: string;
      caption: string;
    };
    quality: {
      ariaLabel: string;
      title: string;
      window: string;
      status: string;
      caption: string;
    };
    upliftu: {
      ariaLabel: string;
      title: string;
      window: string;
      status: string;
      caption: string;
    };
  };
  meta: { titleSuffix: string; description: string };
};

export const ui: UiStrings = {
  skipLink: "Skip to content",
  navLabel: "Sections",
  nav: {
    work: "Projects",
    about: "About",
    skills: "Skills",
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
    pill: "Working-student eligible, 20h/wk",
    ask: "Looking for a working-student role in data engineering or ML.",
    emailMe: "Email me",
    downloadCv: "Download CV",
    seeWorkFirst: "See the projects",
    featuredProjects: "Featured projects",
  },
  work: {
    heading: "Latest projects",
    intro: "Four projects in depth, two more below.",
    proof: "Proof",
    viewCaseStudy: "View case study",
    trackCaseStudy: "Case study",
    viewMore: "More on GitHub",
    allProjects: "All 6 projects",
    earlierHeading: "Earlier work",
  },
  workIndex: {
    heading: "All projects",
    intro:
      "All six projects — the four featured in the track, and the two earlier ones.",
    back: "Home",
    kickerNumber: "Work",
    kickerText: "All work — {count} projects",
  },
  about: {
    kicker: "About",
    experience: "Experience",
    education: "Education",
    rolesLabel: "Experience and education",
  },
  skills: {
    heading: "Skills",
    usedIn: "Used in",
    usedInLabel: "{skill} — used in {project}",
  },
  footer: {
    heading: "Contact",
    ctaHeading: "Have a role in mind? Let's talk.",
    ctaSub: "I reply within 2 working days.",
    exploreHeading: "Explore",
    elsewhereHeading: "Elsewhere",
    currentlyHeading: "Currently",
    currentlyWorking: "Working on LeaseLens v1.0.0",
    currentlyLooking: "Looking for Werkstudent roles",
    builtWith: "Built with Next.js, hosted on Vercel",
  },
  form: {
    heading: "Send a message",
    nameLabel: "Name",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    messageLabel: "Message",
    messagePlaceholder: "Tell me about the role and the team.",
    submit: "Send message",
    nameRequired: "Please enter your name.",
    emailRequired: "Please enter your email address.",
    emailInvalid: "That email address does not look right.",
    messageRequired: "Please write a message.",
    statusSent: "Message sent — I'll reply within 2 working days.",
    statusFailed: "The message could not be sent. Please email me directly.",
  },
  caseStudy: {
    allProjects: "All projects",
    problem: "Problem",
    contribution: "Contribution",
    myPart: "My part",
    decision: "Decision",
    result: "Result",
    evidence: "Evidence",
    stack: "Stack",
    links: "Links",
    role: "My role",
    registryHeading: "Deposit caps in the registry",
    limitsHeading: "Limits",
    outcomeTitle: "The Outcome.",
    outcomeSub: "See the results.",
    evidenceTitle: "The Evidence.",
    evidenceSub: "What proves it.",
    builtWith: "Built with",
    scope: "Scope",
    testsBackend: "Backend",
    testsFrontend: "Frontend",
    testsSplit: "{backend} backend, {frontend} frontend, at {version}",
    pagesCount: "{count} pages",
  },
  proofNote: { evidence: "Evidence", close: "Close" },
  assets: {
    leaselens: {
      ariaLabel:
        "Interface mockup of the LeaseLens evidence review: move-in and move-out room boundaries registered against each other, deposit figures, and an 86.1 percent registered IoU",
      title:
        "LeaseLens evidence review mockup — registered move-in and move-out boundaries, 86.1% IoU",
      moveIn: "MOVE-IN",
      moveOut: "MOVE-OUT",
      iou: "86.1% IoU",
      window: "LeaseLens — Evidence review",
      deposit: "DEPOSIT",
      cap: "CAP",
      excess: "EXCESS",
      status: "86.1% registered IoU — single-pair score, no baseline",
      caption:
        "Interface mockup of the evidence review — an illustration, not a product screenshot.",
    },
    etl: {
      ariaLabel:
        "Interface mockup of the Sales ETL pipeline: sources feed MinIO and Parquet staging, Airflow tasks load the PostgreSQL star schema",
      title:
        "Sales ETL pipeline mockup — sources, MinIO and Parquet, Airflow tasks, PostgreSQL star schema",
      sources: "Sources",
      airflow: "Airflow",
      tasks: "Tasks",
      footer: "1 DAG · 3 TASKS · 4 TABLES",
      window: "Sales ETL Pipeline — Airflow",
      schema: "STAR SCHEMA",
      caption: "Pipeline mockup — an illustration, not a product screenshot.",
    },
    orator: {
      ariaLabel:
        "Interface mockup of the OratorPath speech analysis: waveform with schematic metric bars for pace, filler words, and clarity",
      title:
        "OratorPath speech-analysis mockup — waveform and metric bars: pace, filler words, clarity",
      pace: "PACE",
      fillerWords: "FILLER WORDS",
      clarity: "CLARITY",
      window: "OratorPath — Speech analysis",
      paper: "Spectrum of Engineering Sciences · Vol. 3, Issue 7 · 2025",
      caption: "Speech-analysis mockup — schematic bars, no measured values.",
    },
    hitec: {
      ariaLabel:
        "Interface mockup of the HITEC admin panel: web-module list, content table, and the RAG support chatbot answering from university documents",
      title:
        "HITEC admin panel mockup — web modules, content management, RAG support chatbot",
      window: "HITEC — Admin Panel",
      status: "Internal / Archived",
      caption:
        "Admin panel mockup — an illustration, not a product screenshot.",
    },
    quality: {
      ariaLabel:
        "Interface mockup of the Quality CRM defect list: defects in one record with status and owner",
      title: "Quality CRM mockup — defect list with status and owner",
      window: "Quality CRM — Defect tracking",
      status: "Laravel · MySQL",
      caption:
        "Defect-tracking mockup — an illustration, not a product screenshot.",
    },
    upliftu: {
      ariaLabel:
        "Interface mockup of UpliftU student support: a structured conversation with a support form",
      title: "UpliftU mockup — structured student support conversation",
      window: "UpliftU — Student support",
      status: "Python · Hugging Face NLP",
      caption:
        "Student-support mockup — an illustration, not a product screenshot.",
    },
  },
  meta: {
    titleSuffix: "Data Engineering Student, Dresden",
    description:
      "Shamas Ur Rehman, MSc Computer Science student at TU Dresden. Data pipelines and ML systems: LeaseLens, a sales ETL pipeline, and four more projects, each with its evidence.",
  },
};

/** The full translatable content of the site, in one typed shape.
 *  content.de.ts must satisfy this exact type. */
export type SiteContent = {
  profile: Profile;
  projects: Project[];
  about: AboutContent;
  skills: Skills;
  ui: UiStrings;
};

/** English content — the source of truth. */
export const enContent: SiteContent = {
  profile,
  projects,
  about,
  skills,
  ui,
};
