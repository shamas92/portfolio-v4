import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    /* Cap the largest generated size at 1920: the widest figure
       renders at 720px, so nothing wider than ~2x is ever needed.
       This also removes the old w=3840 src fallback. */
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
