import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // NOTE (carried from v3): cacheComponents/partialPrefetching are NOT
  // enabled — with Cache Components on, awaiting `params` in a static page
  // logged a dev-time "URL data during prerendering" error. The site is
  // fully static via generateStaticParams and needs neither flag.
  // Rust-based MDX loader: the JS loader (@mdx-js/loader) cannot be
  // resolved by Turbopack's loader runner, so MDX uses the Rust transform.
  experimental: {
    mdxRs: true,
  },
  pageExtensions: ["ts", "tsx", "mdx"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
