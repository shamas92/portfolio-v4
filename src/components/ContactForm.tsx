"use client";

import { useRef, useState } from "react";
import { useContent } from "@/i18n/LocaleProvider";
import { buildMailto, isEmail } from "@/lib/contact";

/** Contact form. There is no delivery backend on this site (no
 *  API route, no form service), so the form never claims to
 *  send: on a valid submit it opens the visitor's email app
 *  with a prefilled message to the owner, and says so in the
 *  status line and in the note under the button. Direct email
 *  and the social links stay available beside the form. A
 *  honeypot field ("Company") catches bots; a filled honeypot
 *  silently discards the submit. Invalid fields get inline
 *  errors, aria-invalid, and focus on the first one. */
export function ContactForm() {
  const content = useContent();
  const ui = content.ui.form;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});
  const [status, setStatus] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    /* Honeypot filled: a bot. Discard silently — no mailto,
       no status change. */
    if (honeypotRef.current?.value) return;
    const next: typeof errors = {};
    if (!name.trim()) next.name = ui.nameRequired;
    if (!email.trim()) next.email = ui.emailRequired;
    else if (!isEmail(email)) next.email = ui.emailInvalid;
    if (!message.trim()) next.message = ui.messageRequired;
    setErrors(next);
    if (Object.keys(next).length > 0) {
      if (next.name) nameRef.current?.focus();
      else if (next.email) emailRef.current?.focus();
      else messageRef.current?.focus();
      return;
    }
    const href = buildMailto({
      to: content.profile.email,
      name,
      email,
      message,
    });
    setStatus(ui.statusOpening);
    window.location.href = href;
  }

  return (
    <form
      className="contact-form"
      onSubmit={onSubmit}
      aria-label={ui.heading}
      noValidate
    >
      <h3 className="contact-form-head">{ui.heading}</h3>

      <div className="form-field">
        <label htmlFor="contact-name">{ui.nameLabel}</label>
        <input
          id="contact-name"
          ref={nameRef}
          name="name"
          type="text"
          autoComplete="name"
          placeholder={ui.namePlaceholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={errors.name ? "true" : undefined}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
        />
        {errors.name && (
          <p className="form-error" id="contact-name-error">
            {errors.name}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="contact-email">{ui.emailLabel}</label>
        <input
          id="contact-email"
          ref={emailRef}
          name="email"
          type="email"
          autoComplete="email"
          placeholder={ui.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={errors.email ? "true" : undefined}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
        />
        {errors.email && (
          <p className="form-error" id="contact-email-error">
            {errors.email}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="contact-message">{ui.messageLabel}</label>
        <textarea
          id="contact-message"
          ref={messageRef}
          name="message"
          rows={5}
          placeholder={ui.messagePlaceholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={
            errors.message ? "contact-message-error" : undefined
          }
        />
        {errors.message && (
          <p className="form-error" id="contact-message-error">
            {errors.message}
          </p>
        )}
      </div>

      {/* Honeypot: visually hidden, out of the tab order, hidden
          from assistive technology. Bots fill it; people never
          see it. */}
      <div className="form-honeypot" aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input
          id="contact-company"
          ref={honeypotRef}
          name="company"
          type="text"
          autoComplete="off"
          tabIndex={-1}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {ui.submit}
        </button>
      </div>
      <p className="form-note">{ui.note}</p>
      {status && (
        <p className="form-status" role="status">
          {status}
        </p>
      )}
    </form>
  );
}
