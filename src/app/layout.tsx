import type { Metadata, Viewport } from "next";
import { Inter_Tight, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SkipLink } from "@/components/SkipLink";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { profile, siteUrl } from "@/content";

/* Self-hosted, subsetted, with size-adjusted fallbacks (next/font
   generates the fallback metrics, so there is no layout shift).
   latin-ext covers ä ö ü ß. Newsreader is the display serif,
   Inter Tight the body grotesque (user decision 2026-11-24);
   JetBrains Mono stays for years, figures, labels and metadata.
   The italic serif used by the case-study quote lives in
   CaseStudy.tsx, so it is only loaded on case pages. */
const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-newsreader",
});

const interTight = Inter_Tight({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter-tight",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

const description =
  "Shamas Ur Rehman, MSc Computer Science student at TU Dresden. Data pipelines and ML systems: LeaseLens, a sales ETL pipeline, and four more projects, each with its evidence.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Shamas Ur Rehman — Data Engineering Student, Dresden",
    template: "%s — Shamas Ur Rehman",
  },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Shamas Ur Rehman",
    title: "Shamas Ur Rehman — Data Engineering Student, Dresden",
    description,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Shamas Ur Rehman — I build data pipelines and ML systems. Looking for a working-student role in data engineering or ML, 20 hours a week, in Dresden.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shamas Ur Rehman — Data Engineering Student, Dresden",
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

/* No-flash script: a plain parser-blocking inline <script> in the
 *  head (the standard next-themes approach), so a stored dark
 *  preference never flashes light and a stored German choice never
 *  flashes English in the document language. It must be a raw
 *  <script>, not next/script beforeInteractive: in the App Router
 *  beforeInteractive is loaded by the Next.js runtime and can run
 *  after first paint, so the server-rendered data-theme="light"
 *  painted first and the script flipped it to dark afterwards.
 *  A raw script in the head runs before the body is parsed and
 *  before first paint. The html element carries
 *  suppressHydrationWarning because this script may change
 *  data-theme and data-locale/lang before React hydrates. */
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}var l=localStorage.getItem('locale');if(l==='de'||l==='en'){document.documentElement.setAttribute('data-locale',l);document.documentElement.setAttribute('lang',l);}}catch(e){}})();`;

/* Scrolled-header no-flash script: the same parser-blocking
 *  inline <script> in the head as the theme script, so the
 *  frosted pill is already showing on a mid-scroll reload at
 *  first paint instead of appearing ~100ms later when React
 *  hydrates. It cannot add .is-scrolled to the header itself —
 *  the body is not parsed yet when this runs — so it marks
 *  <html data-scrolled="true"> and the header CSS has a
 *  parallel html[data-scrolled="true"] selector. The mark is
 *  read three ways, because no single one is certain before
 *  first paint: a section hash in the URL always lands past
 *  the 50px threshold, so it sets the mark at once; a
 *  requestAnimationFrame loop checks window.scrollY every
 *  frame — rAF runs before paint in the same frame, so the
 *  check lands before the first paint that follows a scroll
 *  restore; and a passive scroll listener catches any scroll
 *  that happens before hydration. The loop stops at
 *  readyState complete; React owns the mark from hydration
 *  onward (SiteHeader mirrors its scrolled state onto the
 *  attribute), so it clears when the reader scrolls back to
 *  the top. At scroll 0 nothing is set — a top reload stays
 *  bare with no pill flash. */
const scrollScript = `(function(){try{var d=document.documentElement;var h=location.hash.replace(/^#/,'');if(h==='work'||h==='about'||h==='skills'||h==='contact'){d.setAttribute('data-scrolled','true');}if(window.scrollY>=50){d.setAttribute('data-scrolled','true');}function check(){if(d.hasAttribute('data-scrolled')){return;}if(window.scrollY>=50){d.setAttribute('data-scrolled','true');return;}if(document.readyState==='complete'){return;}requestAnimationFrame(check);}requestAnimationFrame(check);window.addEventListener('scroll',function(){if(window.scrollY>=50){d.setAttribute('data-scrolled','true');}},{passive:true});}catch(e){}})();`;

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
      className={`${newsreader.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: scrollScript }} />
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
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter />
        </LocaleProvider>
      </body>
    </html>
  );
}
