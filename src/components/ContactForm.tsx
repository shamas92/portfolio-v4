"use client";

import { useRef, useState } from "react";
import { useContent, useLocale } from "@/i18n/LocaleProvider";
import { isEmail } from "@/lib/contact";
import { CopyEmailButton } from "./CopyEmailButton";

/** Contact form. On a valid submit it POSTs the message as JSON
 *  to /api/contact (a Next.js route handler that sends it via
 *  Resend) and shows a success status; on failure it shows an
 *  error status with a Copy email fallback, so the visitor is
 *  never left without a way to reach the owner. Fields validate
 *  on blur as well as on submit; invalid fields get inline
 *  errors, aria-invalid, and focus on the first one. A honeypot
 *  field ("Company") catches bots; a filled honeypot silently
 *  discards the submit. The form sends nothing until the
 *  visitor clicks Send. */
export function ContactForm() {
  const content = useContent();
  const { locale } = useLocale();
  const ui = content.ui.form;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});
  const [status, setStatus] = useState<"idle" | "sent" | "failed">("idle");
  const [sending, setSending] = useState(false);
  /* Synchronous in-flight guard: `disabled={sending}` is async
     React state, so a second click can land before the button
     disables and POST twice. This ref flips synchronously in
     onSubmit, so the second submit is dropped before any fetch. */
  const inFlightRef = useRef(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  type Field = "name" | "email" | "message";

  function fieldError(field: Field): string | undefined {
    if (field === "name" && !name.trim()) return ui.nameRequired;
    if (field === "email") {
      if (!email.trim()) return ui.emailRequired;
      if (!isEmail(email)) return ui.emailInvalid;
    }
    if (field === "message" && !message.trim()) return ui.messageRequired;
    return undefined;
  }

  function validateAll() {
    const next: typeof errors = {};
    const nameErr = fieldError("name");
    const emailErr = fieldError("email");
    const messageErr = fieldError("message");
    if (nameErr) next.name = nameErr;
    if (emailErr) next.email = emailErr;
    if (messageErr) next.message = messageErr;
    return next;
  }

  function validateField(field: Field) {
    setErrors((prev) => {
      const err = fieldError(field);
      const next = { ...prev };
      if (err) next[field] = err;
      else delete next[field];
      return next;
    });
  }

  function focusFirstInvalid(next: typeof errors) {
    if (next.name) nameRef.current?.focus();
    else if (next.email) emailRef.current?.focus();
    else messageRef.current?.focus();
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    /* Honeypot filled: a bot. Discard silently — no send, no
       status change. */
    if (honeypotRef.current?.value) return;
    const next = validateAll();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      /* Focus after the state flush: focusing synchronously here
         loses to the browser's own focus handling after the
         submit button is activated, leaving focus on the button.
         A frame later the invalid field takes focus. */
      requestAnimationFrame(() => focusFirstInvalid(next));
      return;
    }
    /* Second submit while one is in flight (e.g. a double-click
       before React disables the button): drop it silently. */
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setSending(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data: unknown = await res.json().catch(() => null);
      if (
        res.ok &&
        typeof data === "object" &&
        data !== null &&
        (data as { ok?: unknown }).ok === true
      ) {
        setStatus("sent");
      } else {
        setStatus("failed");
      }
    } catch {
      setStatus("failed");
    } finally {
      setSending(false);
      inFlightRef.current = false;
    }
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
          onBlur={() => validateField("name")}
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
          onBlur={() => validateField("email")}
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
          onBlur={() => validateField("message")}
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
        <button type="submit" className="btn btn-primary" disabled={sending}>
          {sending
            ? locale === "de"
              ? "Wird gesendet…"
              : "Sending…"
            : ui.submit}
        </button>
      </div>
      {status === "sent" && (
        <p className="form-status" role="status">
          {ui.statusSent}
        </p>
      )}
      {status === "failed" && (
        <>
          <p className="form-status form-status--error" role="alert">
            {ui.statusFailed}
          </p>
          <div className="form-fallback">
            <CopyEmailButton />
          </div>
        </>
      )}
    </form>
  );
}
