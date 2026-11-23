// Site identity and background. Facts from PRODUCT.md only.

export const site = {
  name: "Shamas Ur Rehman",
  role: "Software Engineer",
  location: "Dresden, Germany",
  claim: "I build systems that hold up under verification.",
  email: "shamasrehman249@gmail.com",
  github: "https://github.com/shamas92",
  linkedin: "https://linkedin.com/in/shamasrehman",
};

export const background = {
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
      note: "Real-time C#/.NET + SQL Server process monitoring with live dashboards.",
    },
  ],
  languages: [
    { language: "English", level: "C1 (IELTS 7.5)" },
    { language: "German", level: "A1/A2 (TU Dresden course)" },
    { language: "Urdu", level: "Native" },
  ],
  certifications: [
    "Google Advanced Data Analytics",
    "Google Data Analytics",
    "Google IT Automation with Python",
    "Google Project Management",
  ],
  skills: {
    languages: ["Python", "SQL", "C#", "TypeScript", "JavaScript", "PHP"],
    dataAndBi: [
      "Pandas",
      "NumPy",
      "Matplotlib",
      "scikit-learn",
      "time-series analysis",
      "anomaly detection",
      "Tableau",
      "Excel",
    ],
    frameworksAndAi: [
      "FastAPI",
      "ASP.NET MVC",
      "Next.js",
      "React",
      "PyTorch",
      "Hugging Face",
      "RAG",
      "NLP",
    ],
    databases: ["SQL Server", "MySQL", "PostgreSQL"],
    tools: ["Git", "Docker", "Linux (Ubuntu)", "REST APIs"],
  },
};
