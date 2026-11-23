/** A missing fact. Visible as a marker in development, omitted
 *  entirely from the production build. */
export function Todo({ label }: { label: string }) {
  if (process.env.NODE_ENV === "production") return null;
  return <span className="todo-marker">TODO(content): {label}</span>;
}
