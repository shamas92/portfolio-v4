import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, siteUrl } from "@/content";
import { CaseStudy } from "@/components/CaseStudy";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  const title = `${project.title} — ${project.year}`;
  const description = project.rowProof
    ? `${project.rowOutcome} ${project.rowProof}`
    : project.rowOutcome;
  return {
    title,
    description,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      type: "article",
      url: `${siteUrl}/work/${slug}`,
      title,
      description,
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: `Shamas Ur Rehman — ${project.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index < 0) notFound();
  const prev = index > 0 ? projects[index - 1]! : undefined;
  const next = index < projects.length - 1 ? projects[index + 1]! : undefined;
  return (
    <div className="page">
      <CaseStudy slug={slug} />
      <div className="case-pager">
        {prev && (
          <Link className="case-back" href={`/work/${prev.slug}`}>
            ← {prev.shortTitle ?? prev.title}
          </Link>
        )}
        {next && (
          <Link className="case-back" href={`/work/${next.slug}`}>
            {next.shortTitle ?? next.title} →
          </Link>
        )}
      </div>
    </div>
  );
}
