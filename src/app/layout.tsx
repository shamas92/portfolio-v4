import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SkipLink } from "@/components/SkipLink";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { profile, siteUrl } from "@/content";

/* Self-hosted, subsetted, with size-adjusted fallbacks (next/font
   generates the fallback metrics, so there is no layout shift).
   latin-ext covers ä ö ü ß. The italic serif used by the case-study
   quote lives in CaseStudy.tsx, so it is only loaded on case pages. */
const geist = Geist({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-geist",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-jetbrains-mono",
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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0b" },
  ],
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

/* No-flash script: injected before hydration, so a stored dark
 *  preference never flashes light and a stored German choice never
 *  flashes English in the document language. The html element
 *  carries suppressHydrationWarning because this script may change
 *  data-theme and data-locale/lang before React hydrates. */
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}var l=localStorage.getItem('locale');if(l==='de'||l==='en'){document.documentElement.setAttribute('data-locale',l);document.documentElement.setAttribute('lang',l);}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="light"
      data-locale="en"
      suppressHydrationWarning
      className={`${geist.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <Script id="theme" strategy="beforeInteractive">
          {themeScript}
        </Script>
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <LocaleProvider>
          <SkipLink />
          <SiteHeader />
          <div className="header-spacer" aria-hidden="true" />
          <main id="main">{children}</main>
          <SiteFooter />
        </LocaleProvider>
      </body>
    </html>
  );
}
