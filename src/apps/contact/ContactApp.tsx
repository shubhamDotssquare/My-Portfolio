"use client";

import { Briefcase, CheckCircle2, Code, Mail, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useId, useState, type FormEvent } from "react";
import { fades } from "@/animations/spring";
import { profile, PROFILE_IS_PLACEHOLDER } from "@/data/profile";
import type { ProfileLink } from "@/data/profile";
import { CONTACT_LIMITS, validateContact, type ContactErrors, type ContactMessage } from "@/lib/contact";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LargeTitle } from "@/components/ui/LargeTitle";
import { ListGroup, ListRow } from "@/components/ui/ListRow";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { TintIcon } from "@/components/ui/TintIcon";

const LINK_ICONS: Record<ProfileLink["id"], typeof Mail> = {
  email: Mail,
  linkedin: Briefcase,
  github: Code,
};
const LINK_TINTS: Record<ProfileLink["id"], string> = {
  email: "rose",
  linkedin: "sky",
  github: "slate",
};

type Status = "idle" | "submitting" | "success" | "error";
const EMPTY: ContactMessage = { name: "", email: "", message: "" };

export function ContactApp() {
  const [values, setValues] = useState<ContactMessage>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [honeypot, setHoneypot] = useState("");
  const id = useId();

  const update = (field: keyof ContactMessage) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = validateContact(values);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.data, company: honeypot }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
      setValues(EMPTY);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col pb-4">
      <Reveal>
        <LargeTitle
          title="Let's build something."
          subtitle="Have a project, a mobile challenge, or an interesting idea? I'd love to hear about it."
        />
      </Reveal>

      <Reveal index={1}>
        <Section title="Reach me">
          <ListGroup>
            {profile.links.map((l) => (
              <ListRow
                key={l.id}
                title={l.label}
                subtitle={l.value}
                href={l.href}
                external={l.id !== "email"}
                leading={<TintIcon icon={LINK_ICONS[l.id]} tint={LINK_TINTS[l.id]} />}
              />
            ))}
          </ListGroup>
        </Section>
      </Reveal>

      <Reveal index={2}>
        <Section title="Send a message">
          <AnimatePresence mode="wait" initial={false}>
            {status === "success" ? (
              <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={fades.standard}>
                <Card className="flex flex-col items-center gap-3 py-8 text-center" >
                  <CheckCircle2 className="h-8 w-8 text-os-success" aria-hidden />
                  <div>
                    <p className="text-[16px] font-semibold text-os-text-primary">Message sent</p>
                    <p className="mt-1 text-[14px] text-os-text-secondary">{"Thanks — I'll get back to you soon."}</p>
                  </div>
                  <Button variant="secondary" onClick={() => setStatus("idle")}>
                    Send another
                  </Button>
                </Card>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                noValidate
                onSubmit={onSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={fades.standard}
                className="flex flex-col gap-3"
                aria-busy={status === "submitting"}
              >
                <Field id={`${id}-name`} label="Name" error={errors.name}>
                  <input
                    id={`${id}-name`}
                    name="name"
                    autoComplete="name"
                    maxLength={CONTACT_LIMITS.name}
                    value={values.name}
                    onChange={update("name")}
                    className={inputClass}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? `${id}-name-error` : undefined}
                  />
                </Field>
                <Field id={`${id}-email`} label="Email" error={errors.email}>
                  <input
                    id={`${id}-email`}
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    maxLength={CONTACT_LIMITS.email}
                    value={values.email}
                    onChange={update("email")}
                    className={inputClass}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? `${id}-email-error` : undefined}
                  />
                </Field>
                <Field id={`${id}-message`} label="Message" error={errors.message}>
                  <textarea
                    id={`${id}-message`}
                    name="message"
                    rows={5}
                    maxLength={CONTACT_LIMITS.message}
                    value={values.message}
                    onChange={update("message")}
                    className={cn(inputClass, "resize-none")}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? `${id}-message-error` : undefined}
                  />
                </Field>

                {/* Honeypot — invisible to people, tempting to bots. */}
                <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
                  <label htmlFor={`${id}-company`}>Company</label>
                  <input
                    id={`${id}-company`}
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                {status === "error" && (
                  <p role="alert" className="px-1 text-[13px] text-os-danger">
                    Something went wrong sending that. Please try again or email me directly.
                  </p>
                )}

                <Button type="submit" icon={Send} disabled={status === "submitting"} className="mt-1">
                  {status === "submitting" ? "Sending…" : "Send Message"}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </Section>
      </Reveal>

      {PROFILE_IS_PLACEHOLDER && <PlaceholderNotice />}
    </div>
  );
}

const inputClass =
  "w-full rounded-2xl os-glass px-4 py-3 text-[15px] text-os-text-primary outline-none placeholder:text-os-text-tertiary focus-visible:ring-2 focus-visible:ring-os-accent aria-[invalid=true]:border-os-danger";

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="px-1 text-[13px] font-medium text-os-text-secondary">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="px-1 text-[12px] text-os-danger">
          {error}
        </p>
      )}
    </div>
  );
}
