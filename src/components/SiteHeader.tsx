import Link from "next/link";
import { profile } from "@/content";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="site-name" href="/">
          {profile.name}
        </Link>
        <nav className="site-nav" aria-label="Sections">
          <Link href="/#work">Work</Link>
          <Link href="/#stack">Stack</Link>
          <Link href="/#background">Background</Link>
          <Link href="#contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
