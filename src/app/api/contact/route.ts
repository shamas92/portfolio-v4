import { NextResponse } from "next/server";

/** POST /api/contact — sends a contact-form message via Resend.
 *  The API key comes from the RESEND_API_KEY environment
 *  variable (set in Vercel, never in the repo and never logged).
 *  Without it the route answers 500 with a clear error instead
 *  of crashing. The sender is Resend's sandbox address
 *  (onboarding@resend.dev), which only delivers to the email the
 *  Resend account is registered under — for a custom sender
 *  domain, verify it in Resend and change `from` below. The
 *  visitor's address is the reply-to, so replies go to them. */

const TO = "shamasrehman249@gmail.com";
const FROM = "Portfolio Contact <onboarding@resend.dev>";

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "Email delivery is not configured." },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const fields =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>)
      : {};
  const name = typeof fields.name === "string" ? fields.name.trim() : "";
  const email = typeof fields.email === "string" ? fields.email.trim() : "";
  const message =
    typeof fields.message === "string" ? fields.message.trim() : "";

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "Name, email and message are required." },
      { status: 400 },
    );
  }
  if (!isEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "Invalid email address." },
      { status: 400 },
    );
  }

  let res: Response;
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: TO,
        reply_to: email,
        subject: `Portfolio message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }),
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not reach the email service." },
      { status: 502 },
    );
  }

  if (!res.ok) {
    return NextResponse.json(
      { ok: false, error: "The message could not be sent." },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
