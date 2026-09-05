import { NextResponse } from "next/server";
import { validateContact } from "@/lib/contact";

/**
 * Contact form endpoint. Validates server-side, then forwards to an optional
 * webhook (CONTACT_WEBHOOK_URL — e.g. a Slack/Discord/Make hook or your own
 * mailer). Secrets never reach the client. Without a webhook configured, the
 * message is logged server-side so the flow still works in development.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: bots fill the hidden "company" field. Pretend success, do nothing.
  if (typeof body === "object" && body !== null && (body as Record<string, unknown>).company) {
    return NextResponse.json({ ok: true });
  }

  const result = validateContact(body);
  if (!result.ok) {
    return NextResponse.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...result.data, receivedAt: new Date().toISOString() }),
    });
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: "Delivery failed" }, { status: 502 });
    }
  } else {
    console.info("[contact] message received (set CONTACT_WEBHOOK_URL to deliver it):", {
      name: result.data.name,
      email: result.data.email,
      length: result.data.message.length,
    });
  }

  return NextResponse.json({ ok: true });
}
