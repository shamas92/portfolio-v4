// Project data for the v4 portfolio.
// Every fact here comes from PRODUCT.md. No invented figures, testimonials,
// user numbers, or business outcomes. The image model invented small print
// in the decision comps (uptime, F1 scores, line counts) — none of that
// belongs here. Figures that are unverified are labelled as such by their
// absence: if a project has no verified figure, it has no figure field.

export type Project = {
  slug: string;
  title: string;
  year: number;
  /** One line: what was wrong before this existed. */
  problem: string;
  /** One line: how it is built. */
  architecture: string;
  /** The verified outcome. Plain words when no number is verified. */
  outcome: string;
  /** The one verified figure, when one exists. */
  figure?: { value: string; label: string };
  /** The one specimen that proves it — a quote, a citation, a diagram. */
  specimen?: { kind: "quote" | "citation" | "diagram"; text: string };
  tech: string[];
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "leaselens",
    title: "LeaseLens",
    year: 2026,
    problem:
      "Cross-border tenants cannot tell whether a landlord's deposit claim matches the lease or the law.",
    architecture:
      "Next.js/TypeScript frontend, FastAPI/Python backend. A deterministic validator checks every LLM-flagged quote verbatim against the lease text and every citation against a five-jurisdiction registry; deposit math runs in Python, never in the model.",
    outcome:
      "Shipped as a production release (v1.0.0, 2026-11-09) with 197 tests (132 backend, 65 frontend). Accepted into the Meta Global AI Developer Hackathon 2026, Indie Developer Track, as Team Shamas, Team Number 4919; not a top finalist.",
    figure: { value: "86.1%", label: "registered IoU, v7 demo pairing, measured live twice identically" },
    specimen: {
      kind: "quote",
      text: "Die vor dem Einzug zu zahlende Kaution beträgt 950,00 EUR.",
    },
    tech: ["Next.js", "TypeScript", "FastAPI", "Python", "SAM 3.1"],
    links: [
      { label: "GitHub", href: "https://github.com/shamas92/leaselens" },
      { label: "Demo film", href: "https://youtu.be/le_KM97lm5w" },
    ],
  },
  {
    slug: "sales-etl-pipeline",
    title: "Sales ETL Pipeline",
    year: 2026,
    problem:
      "Sales data arrived from several sources with no single, trustworthy shape for analysis.",
    architecture:
      "Apache Airflow TaskFlow DAG with Docker Compose, Parquet/MinIO staging, Kimball star schema, PostgreSQL psycopg2 ON CONFLICT upserts, Mailpit alerts.",
    outcome: "Running pipeline, one DAG, three tasks, four tables.",
    tech: ["Apache Airflow", "Docker Compose", "PostgreSQL", "MinIO", "Parquet"],
    links: [{ label: "GitHub", href: "https://github.com/shamas92/sales-etl-pipeline" }],
  },
  {
    slug: "oratorpath",
    title: "OratorPath",
    year: 2025,
    problem:
      "Public-speaking feedback for software developers was anecdotal, not measured.",
    architecture:
      "AI public-speaking coach built with PyTorch, Hugging Face, and NLP, with a live dashboard. Final-year thesis project.",
    outcome: "Co-authored publication in a peer-reviewed journal.",
    specimen: {
      kind: "citation",
      text: "An AI-driven speech analysis for enhancing communication and public speaking in global software development, Spectrum of Engineering Sciences, Vol. 3, Issue 7, pp. 843–852, 2025, ISSN 3007-3138.",
    },
    tech: ["PyTorch", "Hugging Face", "NLP"],
    links: [],
  },
  {
    slug: "quality-crm",
    title: "Quality Management & Defect-Tracking CRM",
    year: 2024,
    problem:
      "Defects and quality issues were tracked informally, with no single record.",
    architecture: "Laravel/MySQL CRM for quality management and defect tracking.",
    outcome: "Shipped academic project.",
    tech: ["Laravel", "MySQL", "PHP"],
    links: [],
  },
  {
    slug: "upliftu",
    title: "UpliftU",
    year: 2024,
    problem: "Conversational support for students had no structured, measured form.",
    architecture: "Python conversational support built with Hugging Face NLP.",
    outcome: "Shipped academic project.",
    tech: ["Python", "Hugging Face", "NLP"],
    links: [],
  },
];
