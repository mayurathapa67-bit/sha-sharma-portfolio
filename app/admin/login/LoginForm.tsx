"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Login failed");
      }
      router.push(next);
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Login failed");
    }
  }

  return (
    <main className="grain flex min-h-screen items-center justify-center bg-ivory px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="eyebrow hover:text-coral">
          ← Back to site
        </Link>
        <h1 className="mt-6 font-display text-5xl text-ink">Studio login</h1>
        <p className="mt-3 text-ink/60">
          Welcome back. This is where the words get edited.
        </p>

        <form onSubmit={submit} className="mt-10 flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <span className="eyebrow">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-ink/15 bg-paper px-4 py-3.5 outline-none focus:border-teal"
              placeholder="you@studio.com"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="eyebrow">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-ink/15 bg-paper px-4 py-3.5 outline-none focus:border-teal"
              placeholder="••••••••"
            />
          </label>

          {status === "error" && <p className="text-sm text-coral">{error}</p>}

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-ink px-7 py-3.5 text-sm font-medium tracking-wide text-ivory transition-colors hover:bg-teal disabled:opacity-60"
          >
            {status === "loading" ? "Signing in…" : "Enter studio →"}
          </button>
        </form>
      </div>
    </main>
  );
}
