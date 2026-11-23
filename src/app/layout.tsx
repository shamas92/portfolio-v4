import type { Metadata } from "next";
import { Schibsted_Grotesk, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { profile, siteUrl } from "@/content";

/* Self-hosted, subsetted, with size-adjusted fallbacks (next/font
   generates the fallback metrics, so there is no layout shift).
   latin-ext covers ä ö ü ß. */
const grotesk = Schibsted_Grotesk({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-grotesk",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-source-serif",
});

const description =
  "Personal portfolio of Shamas Ur Rehman, MSc Computer Science student at TU Dresden. Five shipped systems, each shown with its proof.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Shamas Ur Rehman — Software Engineer, Dresden",
    template: "%s — Shamas Ur Rehman",
  },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Shamas Ur Rehman",
    title: "Shamas Ur Rehman — Software Engineer, Dresden",
    description,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Shamas Ur Rehman — I build data & ML systems, and prove every claim on this page.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shamas Ur Rehman — Software Engineer, Dresden",
    description,
    images: ["/og.png"],
  },
  icons: { icon: "/favicon.ico" },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dresden",
    addressCountry: "DE",
  },
  email: `mailto:${profile.email}`,
  url: siteUrl,
  sameAs: [profile.github, profile.linkedin],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${grotesk.variable} ${sourceSerif.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
