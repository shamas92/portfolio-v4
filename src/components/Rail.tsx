/** The narrow left rail: a sticky index of the sections on this page.
 *  Desktop only — the header nav covers the same links on mobile. */
export function Rail({ items }: { items: { href: string; label: string }[] }) {
  return (
    <aside className="rail">
      <nav className="rail-index" aria-label="On this page">
        <p className="rail-label">Contents</p>
        <ul>
          {items.map((item) => (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
