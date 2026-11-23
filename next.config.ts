import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // NOTE (carried from v3): cacheComponents/partialPrefetching are NOT
  // enabled — with Cache Components on, awaiting `params` in a static page
  // logged a dev-time "URL data during prerendering" error. The site is
  // fully static via generateStaticParams and needs neither flag.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
