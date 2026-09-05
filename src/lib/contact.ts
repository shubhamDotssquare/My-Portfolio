/** Shared client/server validation for the Contact form (no external deps). */

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export type ContactField = keyof ContactMessage;
export type ContactErrors = Partial<Record<ContactField, string>>;

export const CONTACT_LIMITS = { name: 80, email: 254, message: 2000 } as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(
  input: unknown,
): { ok: true; data: ContactMessage } | { ok: false; errors: ContactErrors } {
  const errors: ContactErrors = {};
  const obj = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;

  const name = str(obj.name).trim();
  const email = str(obj.email).trim();
  const message = str(obj.message).trim();

  if (name.length < 2) errors.name = "Please enter your name.";
  else if (name.length > CONTACT_LIMITS.name) errors.name = "That name is a little long.";

  if (!EMAIL_RE.test(email) || email.length > CONTACT_LIMITS.email)
    errors.email = "Please enter a valid email address.";

  if (message.length < 10) errors.message = "Tell me a bit more (at least 10 characters).";
  else if (message.length > CONTACT_LIMITS.message) errors.message = "Please keep it under 2000 characters.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data: { name, email, message } };
}

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}
