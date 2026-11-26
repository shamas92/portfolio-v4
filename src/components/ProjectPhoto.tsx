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

/** What the created visual depicts, per project — the alt text.
 *  It describes the scene (a device against a backdrop), never
 *  claims the image is a product screenshot or a real photo. */
const ALT: Record<string, string> = {
  leaselens:
    "A phone on a rainy neon street, its screen showing the LeaseLens app",
  "sales-etl-pipeline":
    "A laptop in a dark studio, its screen showing the Sales ETL pipeline",
  oratorpath:
    "A laptop on a dark stage, its screen showing the OratorPath dashboard",
  "hitec-cms":
    "A laptop in a bright office, its screen showing the HITEC admin panel",
  "quality-crm":
    "A laptop in a warm workshop, its screen showing the Quality CRM",
  upliftu:
    "A phone in a bright campus study space, its screen showing the UpliftU app",
};

/** A project's photo, cropped to the card's frame
 *  (object-fit: cover — the files are 3:2, so the frame trims a
 *  little top and bottom, never the device). next/image serves a
 *  responsive size, and the deck, the track and the track's
 *  tilted detail use different sizes strings — their real
 *  display widths — so the browser fetches a file close to what
 *  it shows instead of the 1920w file a shared 640px slot
 *  served at DPR 2: the deck card is 489px wide (200px on
 *  phones, 280px on tablets), the track photo 590px on desktop
 *  and near full width in the vertical stack, the detail about
 *  293px. The sizes caps keep the DPR-2 pick at 1080w (deck)
 *  and 1200w (track, the next file above 1180px for a 590px
 *  display), never larger than the file itself; the detail's
 *  DPR-2 pick is 640w.
 *
 *  The detail variant is the SAME photo shown tighter: the
 *  image is scaled up (1.7×, centred on the device, which is
 *  the subject of every photo) inside its frame, so the tilted
 *  detail reads as a closer look at the same created visual —
 *  never a screenshot, never a second image. */
export function ProjectPhoto({
  slug,
  variant = "track",
  eager,
  fetchPriority,
}: {
  slug: string;
  variant?: "deck" | "track" | "detail";
  eager?: boolean;
  fetchPriority?: "high" | "low" | "auto";
}) {
  const src = PHOTOS[slug];
  if (!src) return null;
  const sizes =
    variant === "deck"
      ? "(max-width: 767px) 200px, (max-width: 1023px) 280px, 489px"
      : variant === "detail"
        ? "293px"
        : "(max-width: 767px) 90vw, (max-width: 1023px) 90vw, 590px";
  return (
    <Image
      src={src}
      alt={ALT[slug] ?? ""}
      fill
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={fetchPriority}
      style={
        variant === "detail"
          ? { objectFit: "cover", transform: "scale(1.7)" }
          : { objectFit: "cover" }
      }
    />
  );
}
