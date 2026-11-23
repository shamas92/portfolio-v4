# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16.4.6 (App Router), React 19.3, TypeScript, Tailwind CSS 4.3.3, MDX for case-study content, lucide-react icons only. Deploy target: Vercel. Chosen by the user 2026-11-23 ("Next.js, React + TypeScript + Tailwind (as v2/v3)").

## Users

- **Hiring managers** — skim in minutes, need to judge engineering ability and reach out. They arrive from a CV, LinkedIn, or an application.
- **Engineering leads** — read for substance: architecture decisions, verification, real systems, not claims. They open the code and the live artefact.
- **Collaborators** — check what the person has actually shipped and how they work.

## Product Purpose

A personal portfolio for Shamas Ur Rehman, MSc Computer Science student at TU Dresden and software engineer in Dresden. It presents shipped work and background so a visitor can judge engineering ability quickly and contact him. Success is a visitor who, after one page, can say what he builds, how he verifies it, and where to find the proof — and then writes to him.

## Positioning

Verification as the product: every claim on the page is backed by a measured figure, a published paper, or a live artefact. Nothing is asserted without its proof beside it, and honest limits are stated where they exist. A neighbouring portfolio could not truthfully copy the figures, because they are measured from this person's own work.

## Operating Context

Visitors arrive from a CV, LinkedIn, GitHub, or a job application, on desktop or phone, and decide in minutes. The page must read at a glance on a phone and reward a longer read on desktop. Contact is by email, GitHub, or LinkedIn — no account, no form that pretends to send mail it cannot send.

## Capabilities and Constraints

- Sections: hero (value proposition, engineering role, primary CTA), selected work (problem-to-architecture breakdowns, tech tags, live demo and GitHub links), technical stack and background (structured overview, systems/AI focus, milestones), contact/footer (direct links).
- Motion: smooth 60fps hover states and scroll reveals that respect `prefers-reduced-motion`; mobile-first across all breakpoints.
- Real links only: every project links out to its live demo, repository, or publication. No dead actions.
- No invented figures, testimonials, user numbers, or business outcomes. Unverified content is left out or labelled as unverified.
- LeaseLens is presented like any other project in the work section — same weight, not a featured centerpiece (standing user direction from the v3 redesign). Its depth lives only on its own case-study page.
- The contact form, if present, must never fake a "sent" state: without a configured mail service it falls back to an honest mailto compose.
- German legal names, statute references, and case names stay in their original language; explanations are in English.

## Brand Commitments

- Name: Shamas Ur Rehman. Dresden, Germany. Email shamasrehman249@gmail.com; GitHub github.com/shamas92; LinkedIn linkedin.com/in/shamasrehman.
- Reference inspiration: ten design-pattern galleries (land-book.com, supahero.io, pricingpages.design, socialproofexamples.com, reallygoodemails.com, deck.gallery, posts.design, adfolio.design, navbar.gallery, ogimage.gallery) — their gallery grammar (specimen-led, dense, scannable, curated) is the structural reference. No single gallery is cloned.
- Design tokens are blended from VoltAgent/awesome-design-md brand files, not copied from one brand. Research: `~/workspace/research_notes/portfolio-redesign-v4/reference-research.md`.
- The v3 portfolio ("The Evidence Dossier", `~/workspace/portfolio`) is the incumbent: its look is evidence of what the subject is, not authority over what v4 becomes. v4 replaces the world; it does not polish v3.

## Evidence on Hand

- **LeaseLens** (2026, renamed from KautionGuard 2026-11-04): cross-border tenant legal auditor + deposit-evidence workspace, Next.js/TypeScript frontend, FastAPI/Python backend. Registry: DE BGB §551 (max 3× monthly cold rent), UK Tenant Fees Act 2019 (5 weeks), US_NY NY GOL §7-108 (1 month), FR Loi 89-462 art. 22 (1 month unfurnished / 2 furnished), JP Civil Code art. 622-2 — no deposit-cap figure exists for Japan, never state one. Verified figures: 86.1% registered IoU on the v7 demo pairing (Δ(+2,−82), scale 2.35×, residual +8.4%, aligned 1588 / move-out 1722, measured live twice identically); dorm demo cap €535.41 / excess €414.59; 132 backend + 65 frontend = 197 tests at v1.0.0 (2026-11-09). Meta Global AI Developer Hackathon 2026, Indie Developer Track; submission accepted before 03:00 CET 2026-11-05, Team Shamas, Team Number 4919; NOT a top finalist (finalists: Video2URDF, David Barry, ControlAnything, Gatekeeper, Aurora). Repo: github.com/shamas92/leaselens (public). Video: youtu.be/le_KM97lm5w (v7). Honest limits: SAM cannot isolate the door-frame dent or capture small burn specks; socket needs a click, not a concept phrase; QR handoff never scan-tested on a real phone; no hosted live-demo URL verified. Assets: 10 status shots (1360×1000, captured 2026-11-02 pre-rename) in `~/workspace/your_files/leaselens-status-shots/`; YouTube thumbnail 1280×720.
- **OratorPath** (2025): AI public-speaking coach, PyTorch/Hugging Face/NLP, live dashboard; final-year thesis. Co-authored publication: "An AI-driven speech analysis for enhancing communication and public speaking in global software development", *Spectrum of Engineering Sciences*, Vol. 3, Issue 7, pp. 843–852, 2025, ISSN 3007-3138.
- **Sales ETL Pipeline** (Oct 2026): Apache Airflow TaskFlow + Docker Compose, Parquet/MinIO staging, Kimball star schema, PostgreSQL psycopg2 ON CONFLICT upserts, Mailpit alerts. Repo: github.com/shamas92/sales-etl-pipeline (1 DAG, 3 tasks, 4 tables; no stored procedures).
- **Quality Management & Defect-Tracking CRM** (2024): Laravel/MySQL.
- **UpliftU** (2024): Python conversational support, Hugging Face NLP.
- **Experience:** HITEC University IT Dept intern May–Oct 2025 (C#/ASP.NET MVC portal modules; RAG support chatbot, Python/Hugging Face); Heavy Industries Taxila intern Jul–Aug 2024 (real-time C#/.NET + SQL Server process monitoring, live dashboards; "cut manual logging errors by 20%" is a CV claim, attribute it to the CV).
- **Education:** MSc Computer Science, TU Dresden, Oct 2026–present (Scalable Data Engineering, Data Visualization, Requirements Engineering); BSc Software Engineering, HITEC University Taxila, Sep 2021–Aug 2025, CGPA 3.48/4.00 (German grade 1.7).
- **Languages:** English C1 (IELTS 7.5), German A1/A2 (TU Dresden course), Urdu native. Work authorisation: enrolled German university student, eligible for working-student employment (20 h/week) and internships.
- **Certifications:** 4 Google certificates (Advanced Data Analytics, Data Analytics, IT Automation with Python, Project Management; Nov 2025–Sep 2026).
- **Absences future work must not fabricate:** no portrait of Shamas exists anywhere (none may be generated); no OratorPath, ETL, CRM, or UpliftU visuals exist — typographic exhibits only, never fabricated UI; no user numbers, testimonials, or business outcomes exist.

## Product Principles

1. Proof beside the claim — a figure, a quote, or a link on the same card as the claim, never in an end-loaded list.
2. The specimen is the content — each project is shown by its best real artefact, not summarised into equal-length text.
3. One idea per section — the hero makes one claim, the work section shows five covers, the stack is one structured overview, the contact is one line.
4. Curation stated openly — five shipped systems, chosen; only work that ran in the real world gets a slot.
5. Honest limits — what could not be verified is said, not hidden.

## Accessibility & Inclusion

WCAG 2.2 AA as the working bar: keyboard-operable throughout, visible focus, body text contrast ≥4.5:1, motion disabled under `prefers-reduced-motion`, content readable with JavaScript off.
