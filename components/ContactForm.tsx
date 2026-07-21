"use client";

import { useState } from "react";
import type { ContactFormContent } from "@/lib/types";

export default function ContactForm({ contactForm }: { contactForm?: ContactFormContent }) {
  const cf = contactForm ?? {
    nameLabel: "Your name",
    namePlaceholder: "Jane Appleseed",
    emailLabel: "Email",
    emailPlaceholder: "jane@brand.com",
    projectLabel: "What do you need?",
    projectOptions: ["Brand Voice", "Conversion Copy", "Long-form", "Not sure yet"],
    messageLabel: "Tell me about it",
    messagePlaceholder: "The brand, the audience, the sentence you wish you had…",
    sendButton: "Send it →",
    sendingButton: "Sending…",
    successMessage: "Thank you — I'll reply within two days.",
  };
  const [form, setForm] = useState({
    name: "",
    email: "",
    project_type: cf.projectOptions[0] ?? "Brand Voice",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  function update(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong");
      }
      setStatus("ok");
      setForm({ name: "", email: "", project_type: cf.projectOptions[0] ?? "Brand Voice", message: "" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="eyebrow">{cf.nameLabel}</span>
          <input
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="rounded-xl border border-ink/15 bg-transparent px-4 py-3.5 outline-none focus:border-teal"
            placeholder={cf.namePlaceholder}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="eyebrow">{cf.emailLabel}</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="rounded-xl border border-ink/15 bg-transparent px-4 py-3.5 outline-none focus:border-teal"
            placeholder={cf.emailPlaceholder}
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="eyebrow">{cf.projectLabel}</span>
        <select
          value={form.project_type}
          onChange={(e) => update("project_type", e.target.value)}
          className="rounded-xl border border-ink/15 bg-transparent px-4 py-3.5 outline-none focus:border-teal"
        >
          {cf.projectOptions.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2">
        <span className="eyebrow">{cf.messageLabel}</span>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className="resize-none rounded-xl border border-ink/15 bg-transparent px-4 py-3.5 outline-none focus:border-teal"
          placeholder={cf.messagePlaceholder}
        />
      </label>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-ink px-7 py-3.5 text-sm font-medium tracking-wide text-ivory transition-colors hover:bg-teal"
        >
          {status === "sending" ? cf.sendingButton : cf.sendButton}
        </button>
        {status === "ok" && (
          <span className="text-sm text-teal">{cf.successMessage}</span>
        )}
        {status === "error" && <span className="text-sm text-coral">{error}</span>}
      </div>
    </form>
  );
}
