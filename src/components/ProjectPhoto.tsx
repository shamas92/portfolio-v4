import Image from "next/image";

/** Slug → the project's created visual in public/projects. One
 *  file per project, the same in light and dark mode: the photo
 *  never changes on theme toggle. (The SVG mockups these replace
 *  had dark variants; the photos do not.) The files are created
 *  visuals — a device showing the project against a backdrop —
 *  not photographs of the real products and not screenshots, and
 *  nothing on the device screens is quoted as project content. */
const PHOTOS: Record<string, string> = {
  leaselens: "/projects/leaselens.jpg",
  "sales-etl-pipeline": "/projects/sales-etl.jpg",
  oratorpath: "/projects/oratorpath.jpg",
  "hitec-cms": "/projects/hitec.jpg",
  "quality-crm": "/projects/quality-crm.jpg",
  upliftu: "/projects/upliftu.jpg",
};

/** A project's photo, cropped to the card's frame
 *  (object-fit: cover — the files are 3:2, so the frame trims a
 *  little top and bottom, never the device). next/image serves a
 *  responsive size, and the deck and the track use the same sizes
 *  string, so the browser reuses one optimised file per width
 *  instead of fetching the same photo twice. The desktop slot is
 *  640px, not 360px: the track photo displays at ~429x568, and a
 *  360px slot served a 359x239 file that the checker measured
 *  blown up 2.38x; 640px serves a 750w file that covers it.
 *  Decorative inside its link or deck card (alt ""), never a
 *  screenshot claim. */
export function ProjectPhoto({
  slug,
  eager,
}: {
  slug: string;
  eager?: boolean;
}) {
  const src = PHOTOS[slug];
  if (!src) return null;
  return (
    <Image
      src={src}
      alt=""
      fill
      sizes="(max-width: 767px) 90vw, (max-width: 1023px) 45vw, 640px"
      loading={eager ? "eager" : "lazy"}
      style={{ objectFit: "cover" }}
    />
  );
}
