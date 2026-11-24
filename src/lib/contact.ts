/** Contact delivery, as pure functions so they are unit-testable
 *  without a browser. There is no delivery backend on this site
 *  (no API route, no form service), so the form opens the
 *  visitor's email app with a prefilled message instead of
 *  pretending to send. The subject names the sender; the body
 *  carries the name, the reply-to address and the message. */
export function buildMailto({
  to,
  name,
  email,
  message,
}: {
  to: string;
  name: string;
  email: string;
  message: string;
}): string {
  const subject = `Portfolio contact — ${name.trim()}`;
  const body = [
    `Name: ${name.trim()}`,
    `Email: ${email.trim()}`,
    "",
    message.trim(),
  ].join("\n");
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Minimal email check for the form: an @ with something on
 *  both sides and a dot in the domain. The browser's
 *  type="email" check runs too; this one produces the inline
 *  error text. */
export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
