/**
 * Capabilities matrix: every technology on the site, grouped by
 * what it does, each exactly once, as plain text with no links.
 *
 * Mapping (29 skills from skillGroups + 6 tags that only appear in
 * project stacks = 35 items):
 * - Data & Pipelines: the 8 Data & BI skills + SQL + the ETL
 *   staging tags (Parquet, MinIO, Apache Airflow).
 * - ML & NLP: the ML skills + Python, the language the ML work
 *   is written in here, and SAM 3.1, the segmentation model.
 * - Full-Stack: the remaining languages and web frameworks,
 *   including Laravel, which only appears in the CRM stack.
 * - Infra & DBs: the three databases + Docker, Docker Compose,
 *   Git, Linux (Ubuntu).
 * No skill is claimed for a project it was not linked to: the
 * matrix groups capabilities, it does not attribute them.
 */
const columns: { title: string; skills: string[] }[] = [
  {
    title: "Data & Pipelines",
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
    title: "Infra & DBs",
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
];

export function CapabilitiesMatrix() {
  return (
    <div className="matrix">
      {columns.map((col) => (
        <div className="matrix-col" key={col.title}>
          <h3 className="matrix-col-head">{col.title}</h3>
          <ul className="matrix-list">
            {col.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
