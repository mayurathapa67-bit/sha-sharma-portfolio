"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Content, Submission } from "@/lib/types";

type Tab =
  | "overview"
  | "hero"
  | "about"
  | "services"
  | "portfolio"
  | "blog"
  | "testimonials"
  | "contact"
  | "pages"
  | "header-footer"
  | "metadata"
  | "submissions"
  | "images";

const TABS: [Tab, string][] = [
  ["overview", "Overview"],
  ["hero", "Hero"],
  ["about", "About"],
  ["services", "Services"],
  ["portfolio", "Portfolio"],
  ["blog", "Blog"],
  ["testimonials", "Testimonials"],
  ["contact", "Contact"],
  ["pages", "Pages"],
  ["header-footer", "Header & Footer"],
  ["metadata", "Metadata"],
  ["submissions", "Submissions"],
  ["images", "Images"],
];

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content", { cache: "no-store" });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setContent(data.content);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function save() {
    if (!content) return;
    setSaving(true);
    setToast("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("Save failed");
      setToast("Saved to GitHub ✓ Site will auto-deploy on Vercel");
    } catch {
      setToast("Save failed — check connection");
    } finally {
      setSaving(false);
      setTimeout(() => setToast(""), 3500);
    }
  }

  function update(fn: (c: Content) => void) {
    setContent((c) => {
      if (!c) return c;
      const next = structuredClone(c);
      fn(next);
      return next;
    });
  }

  const subs = useSubmissions(tab === "submissions");

  if (loading || !content) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-ink/15 border-t-teal" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <header className="border-b border-ink/10 bg-paper px-6 py-5 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <p className="font-display text-2xl text-ink">Esha · Studio</p>
            <p className="eyebrow">Content control room</p>
          </div>
          <div className="flex items-center gap-3">
            {toast && (
              <span className="max-w-xs text-right text-sm text-teal">{toast}</span>
            )}
            <button
              onClick={save}
              disabled={saving}
              className="rounded-full bg-ink px-5 py-2.5 text-sm text-ivory transition-colors hover:bg-teal disabled:opacity-60"
            >
              {saving ? "Saving to GitHub…" : "Save & Deploy"}
            </button>
            <button
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                router.push("/admin/login");
              }}
              className="rounded-full border border-ink/15 px-5 py-2.5 text-sm text-ink/70 hover:border-coral hover:text-coral"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 md:flex-row md:px-10">
        <nav className="flex shrink-0 gap-2 overflow-x-auto md:w-56 md:flex-col">
          {TABS.map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`whitespace-nowrap rounded-full px-4 py-2.5 text-left text-sm transition-colors ${
                tab === k
                  ? "bg-ink text-ivory"
                  : "text-ink/70 hover:bg-ink/5"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="min-w-0 flex-1 rounded-2xl border border-ink/10 bg-paper p-6 md:p-8">
          {tab === "overview" && <Overview content={content} subs={subs} />}
          {tab === "hero" && <HeroEditor content={content} update={update} />}
          {tab === "about" && <AboutEditor content={content} update={update} />}
          {tab === "services" && <ServicesEditor content={content} update={update} />}
          {tab === "portfolio" && <PortfolioManager content={content} update={update} />}
          {tab === "blog" && <BlogManager content={content} update={update} />}
          {tab === "testimonials" && <TestimonialsEditor content={content} update={update} />}
          {tab === "contact" && <ContactEditor content={content} update={update} />}
          {tab === "pages" && <PagesEditor content={content} update={update} />}
          {tab === "header-footer" && <HeaderFooterEditor content={content} update={update} />}
          {tab === "metadata" && <MetadataEditor content={content} update={update} />}
          {tab === "submissions" && <Submissions subs={subs} />}
          {tab === "images" && <ImageUploader />}
        </div>
      </div>
    </div>
  );
}

function useSubmissions(active: boolean) {
  const [subs, setSubs] = useState<Submission[]>([]);
  const refresh = useCallback(async () => {
    const res = await fetch("/api/submissions", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setSubs(Array.isArray(data.submissions) ? data.submissions : []);
    }
  }, []);

  useEffect(() => {
    if (!active) return;
    refresh();
    const id = setInterval(refresh, 8000);
    return () => clearInterval(id);
  }, [active, refresh]);

  const remove = useCallback(
    async (id: string) => {
      await fetch(`/api/submissions?id=${id}`, { method: "DELETE" });
      refresh();
    },
    [refresh]
  );

  return { subs, remove, refresh };
}

function Field({ label, value, onChange, textarea, type, placeholder, rows }: {
  label: string; value: string; onChange: (v: string) => void; textarea?: boolean; type?: string; placeholder?: string; rows?: number;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="eyebrow">{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows ?? 4} placeholder={placeholder} className="resize-y rounded-xl border border-ink/15 bg-ivory px-4 py-3 outline-none focus:border-teal" />
      ) : (
        <input type={type ?? "text"} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="rounded-xl border border-ink/15 bg-ivory px-4 py-3 outline-none focus:border-teal" />
      )}
    </label>
  );
}

function ArrayField({ label, values, onChange }: { label: string; values: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="eyebrow">{label}</span>
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex gap-2">
            <input value={v} onChange={(e) => { const n = [...values]; n[i] = e.target.value; onChange(n); }} className="flex-1 rounded-xl border border-ink/15 bg-ivory px-4 py-3 outline-none focus:border-teal" />
            <button onClick={() => onChange(values.filter((_, j) => j !== i))} className="text-sm text-coral">×</button>
          </div>
        ))}
      </div>
      <button onClick={() => onChange([...values, ""])} className="self-start text-sm text-coral hover:underline">+ Add</button>
    </div>
  );
}

function Overview({ content, subs }: { content: Content; subs: ReturnType<typeof useSubmissions> }) {
  const counts = [
    ["Portfolio pieces", Array.isArray(content.portfolio) ? content.portfolio.length : 0],
    ["Blog posts", Array.isArray(content.blog) ? content.blog.length : 0],
    ["Testimonials", Array.isArray(content.testimonials) ? content.testimonials.length : 0],
    ["New submissions", subs.subs.length],
  ] as const;
  return (
    <div>
      <h2 className="font-display text-3xl text-ink">Overview</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {counts.map(([label, n]) => (
          <div key={label} className="rounded-xl border border-ink/10 bg-ivory p-5">
            <p className="font-display text-4xl text-teal">{n}</p>
            <p className="mt-1 text-sm text-ink/60">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-xl border border-ink/10 bg-ivory p-5">
        <p className="font-display text-xl text-ink">How it works</p>
        <ul className="mt-3 space-y-2 text-sm text-ink/60">
          <li>1. Edit any content using the tabs on the left</li>
          <li>2. Click <strong>Save & Deploy</strong> to push changes to GitHub</li>
          <li>3. Vercel auto-deploys the updated site</li>
          <li>Changes are committed to: <code className="text-teal">{process.env.NEXT_PUBLIC_GITHUB_REPO || "GitHub repo"}</code></li>
        </ul>
      </div>
    </div>
  );
}

function HeroEditor({ content, update }: { content: Content; update: (fn: (c: Content) => void) => void }) {
  const h = content.hero;
  return (
    <Section title="Hero Section">
      <Field label="Title" value={h.title} onChange={(v) => update((c) => { c.hero.title = v })} />
      <Field label="Role / Eyebrow" value={h.role} onChange={(v) => update((c) => { c.hero.role = v })} />
      <Field label="Tagline (h1)" value={h.tagline} onChange={(v) => update((c) => { c.hero.tagline = v })} textarea />
      <Field label="Subtitle" value={h.subtitle} onChange={(v) => update((c) => { c.hero.subtitle = v })} textarea />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Primary CTA label" value={h.cta_primary.label} onChange={(v) => update((c) => { c.hero.cta_primary.label = v })} />
        <Field label="Primary CTA href" value={h.cta_primary.href} onChange={(v) => update((c) => { c.hero.cta_primary.href = v })} />
        <Field label="Secondary CTA label" value={h.cta_secondary.label} onChange={(v) => update((c) => { c.hero.cta_secondary.label = v })} />
        <Field label="Secondary CTA href" value={h.cta_secondary.href} onChange={(v) => update((c) => { c.hero.cta_secondary.href = v })} />
      </div>
      <ArrayField label="3D Headline Words" values={h.headline_3d} onChange={(v) => update((c) => { c.hero.headline_3d = v })} />
    </Section>
  );
}

function AboutEditor({ content, update }: { content: Content; update: (fn: (c: Content) => void) => void }) {
  const a = content.about;
  return (
    <Section title="About Page">
      <Field label="Headline" value={a.headline} onChange={(v) => update((c) => { c.about.headline = v })} />
      <ArrayField label="Bio paragraphs" values={a.bio} onChange={(v) => update((c) => { c.about.bio = v })} />
      <Field label="Philosophy (blockquote)" value={a.philosophy} onChange={(v) => update((c) => { c.about.philosophy = v })} textarea />
      <Field label="Profile image path" value={a.image} onChange={(v) => update((c) => { c.about.image = v })} />
      <ArrayField label="Expertise" values={a.expertise} onChange={(v) => update((c) => { c.about.expertise = v })} />
      <ArrayField label="Tools" values={a.tools} onChange={(v) => update((c) => { c.about.tools = v })} />
      <div className="mt-6">
        <p className="eyebrow mb-3">Journey Timeline</p>
        <div className="space-y-4">
          {a.journey.map((j, i) => (
            <div key={i} className="rounded-xl border border-ink/10 bg-ivory p-4">
              <div className="grid gap-3 md:grid-cols-3">
                <Field label="Year" value={j.year} onChange={(v) => update((c) => { c.about.journey[i].year = v })} />
                <Field label="Title" value={j.title} onChange={(v) => update((c) => { c.about.journey[i].title = v })} />
                <Field label="Detail" value={j.detail} onChange={(v) => update((c) => { c.about.journey[i].detail = v })} />
              </div>
              <button onClick={() => update((c) => { c.about.journey = c.about.journey.filter((_, j) => j !== i) })} className="mt-2 text-sm text-coral">Remove</button>
            </div>
          ))}
          <button onClick={() => update((c) => { c.about.journey = [...c.about.journey, { year: "", title: "", detail: "" }] })} className="text-sm text-coral hover:underline">+ Add timeline entry</button>
        </div>
      </div>
    </Section>
  );
}

function ServicesEditor({ content, update }: { content: Content; update: (fn: (c: Content) => void) => void }) {
  const services = Array.isArray(content.services) ? content.services : [];
  const process = Array.isArray(content.process) ? content.process : [];
  const faq = Array.isArray(content.faq) ? content.faq : [];
  return (
    <Section title="Services & Pricing">
      <p className="font-display text-xl text-ink">Service Items</p>
      <div className="mt-2 space-y-4">
        {services.map((s, i) => (
          <div key={i} className="rounded-xl border border-ink/10 bg-ivory p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Title" value={s.title} onChange={(v) => update((c) => { c.services[i].title = v })} />
              <Field label="Price" value={s.price} onChange={(v) => update((c) => { c.services[i].price = v })} />
              <Field label="Description" value={s.desc} onChange={(v) => update((c) => { c.services[i].desc = v })} textarea />
              <Field label="Icon" value={s.icon} onChange={(v) => update((c) => { c.services[i].icon = v })} />
            </div>
            <ArrayField label="Deliverables" values={s.deliverables} onChange={(v) => update((c) => { c.services[i].deliverables = v })} />
            <button onClick={() => update((c) => { c.services = c.services.filter((_, j) => j !== i) })} className="mt-2 text-sm text-coral">Remove service</button>
          </div>
        ))}
        <button onClick={() => update((c) => { c.services = [...c.services, { title: "", desc: "", icon: "quill", price: "", deliverables: [""] }] })} className="text-sm text-coral hover:underline">+ Add service</button>
      </div>

      <div className="mt-10">
        <p className="font-display text-xl text-ink">Process Steps</p>
        <div className="mt-2 space-y-4">
          {process.map((p, i) => (
            <div key={i} className="grid gap-3 rounded-xl border border-ink/10 bg-ivory p-4 md:grid-cols-3">
              <Field label="Number" value={p.n} onChange={(v) => update((c) => { c.process[i].n = v })} />
              <Field label="Title" value={p.t} onChange={(v) => update((c) => { c.process[i].t = v })} />
              <Field label="Description" value={p.d} onChange={(v) => update((c) => { c.process[i].d = v })} />
              <button onClick={() => update((c) => { c.process = c.process.filter((_, j) => j !== i) })} className="text-sm text-coral md:col-span-3">Remove</button>
            </div>
          ))}
          <button onClick={() => update((c) => { c.process = [...c.process, { n: "", t: "", d: "" }] })} className="text-sm text-coral hover:underline">+ Add step</button>
        </div>
      </div>

      <div className="mt-10">
        <p className="font-display text-xl text-ink">FAQ</p>
        <div className="mt-2 space-y-4">
          {faq.map((f, i) => (
            <div key={i} className="rounded-xl border border-ink/10 bg-ivory p-4">
              <div className="grid gap-3">
                <Field label="Question" value={f.q} onChange={(v) => update((c) => { c.faq[i].q = v })} />
                <Field label="Answer" value={f.a} onChange={(v) => update((c) => { c.faq[i].a = v })} textarea />
              </div>
              <button onClick={() => update((c) => { c.faq = c.faq.filter((_, j) => j !== i) })} className="mt-2 text-sm text-coral">Remove</button>
            </div>
          ))}
          <button onClick={() => update((c) => { c.faq = [...c.faq, { q: "", a: "" }] })} className="text-sm text-coral hover:underline">+ Add FAQ</button>
        </div>
      </div>
    </Section>
  );
}

function PortfolioManager({ content, update }: { content: Content; update: (fn: (c: Content) => void) => void }) {
  const items = Array.isArray(content.portfolio) ? content.portfolio : [];
  return (
    <Section title="Portfolio">
      <div className="flex items-center justify-between">
        <p className="font-display text-xl text-ink">{items.length} pieces</p>
        <button onClick={() => update((c) => { c.portfolio = [...(c.portfolio ?? []), { slug: `new-${Date.now()}`, title: "New project", category: "Brand Voice", client: "", challenge: "", strategy: "", results: { metrics: [{ label: "Metric", value: "0%" }] }, images: [], testimonial: "", testimonial_author: "", published_date: new Date().toISOString().slice(0, 10), read_time: "5 min" }] })} className="rounded-full border border-ink/15 px-4 py-2 text-sm hover:border-coral hover:text-coral">+ Add piece</button>
      </div>
      <div className="mt-4 space-y-4">
        {items.map((p, i) => (
          <div key={p.slug} className="rounded-xl border border-ink/10 bg-ivory p-5">
            <div className="flex items-center justify-between">
              <input value={p.title} onChange={(e) => update((c) => { c.portfolio[i].title = e.target.value })} className="w-full bg-transparent font-display text-xl text-ink outline-none" />
              <button onClick={() => update((c) => { c.portfolio = c.portfolio.filter((_, j) => j !== i) })} className="ml-3 shrink-0 text-sm text-coral">Delete</button>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <Field label="Client" value={p.client} onChange={(v) => update((c) => { c.portfolio[i].client = v })} />
              <Field label="Category" value={p.category} onChange={(v) => update((c) => { c.portfolio[i].category = v })} />
              <Field label="Slug" value={p.slug} onChange={(v) => update((c) => { c.portfolio[i].slug = v })} />
              <Field label="Published date" value={p.published_date} onChange={(v) => update((c) => { c.portfolio[i].published_date = v })} />
              <Field label="Read time" value={p.read_time} onChange={(v) => update((c) => { c.portfolio[i].read_time = v })} />
              <Field label="Challenge" value={p.challenge} onChange={(v) => update((c) => { c.portfolio[i].challenge = v })} textarea />
              <Field label="Strategy" value={p.strategy} onChange={(v) => update((c) => { c.portfolio[i].strategy = v })} textarea />
              <Field label="Testimonial" value={p.testimonial} onChange={(v) => update((c) => { c.portfolio[i].testimonial = v })} textarea />
              <Field label="Testimonial author" value={p.testimonial_author} onChange={(v) => update((c) => { c.portfolio[i].testimonial_author = v })} />
            </div>
            <p className="mt-3 text-sm text-ink/50">Images: {Array.isArray(p.images) ? p.images.join(", ") : "none"}</p>
            <ArrayField label="Image paths" values={p.images} onChange={(v) => update((c) => { c.portfolio[i].images = v })} />
            <div className="mt-3">
              <p className="eyebrow">Results Metrics</p>
              {(p.results.metrics ?? []).map((m, mi) => (
                <div key={mi} className="mt-2 flex gap-3">
                  <input value={m.label} onChange={(e) => update((c) => { c.portfolio[i].results.metrics[mi].label = e.target.value })} placeholder="Label" className="flex-1 rounded-xl border border-ink/15 bg-ivory px-4 py-2 outline-none focus:border-teal" />
                  <input value={m.value} onChange={(e) => update((c) => { c.portfolio[i].results.metrics[mi].value = e.target.value })} placeholder="Value" className="w-24 rounded-xl border border-ink/15 bg-ivory px-4 py-2 outline-none focus:border-teal" />
                  <button onClick={() => update((c) => { c.portfolio[i].results.metrics = c.portfolio[i].results.metrics.filter((_, k) => k !== mi) })} className="text-sm text-coral">×</button>
                </div>
              ))}
              <button onClick={() => update((c) => { c.portfolio[i].results.metrics = [...(c.portfolio[i].results.metrics ?? []), { label: "", value: "" }] })} className="mt-2 text-sm text-coral hover:underline">+ Add metric</button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function BlogManager({ content, update }: { content: Content; update: (fn: (c: Content) => void) => void }) {
  const posts = Array.isArray(content.blog) ? content.blog : [];
  return (
    <Section title="Blog">
      <div className="flex items-center justify-between">
        <p className="font-display text-xl text-ink">{posts.length} posts</p>
        <button onClick={() => update((c) => { c.blog = [...(c.blog ?? []), { slug: `new-${Date.now()}`, title: "New post", category: "Notes", excerpt: "", body: [""], published_date: new Date().toISOString().slice(0, 10), read_time: "3 min", cover: "" }] })} className="rounded-full border border-ink/15 px-4 py-2 text-sm hover:border-coral hover:text-coral">+ Add post</button>
      </div>
      <div className="mt-4 space-y-4">
        {posts.map((p, i) => (
          <div key={p.slug} className="rounded-xl border border-ink/10 bg-ivory p-5">
            <div className="flex items-center justify-between">
              <input value={p.title} onChange={(e) => update((c) => { c.blog[i].title = e.target.value })} className="w-full bg-transparent font-display text-xl text-ink outline-none" />
              <button onClick={() => update((c) => { c.blog = c.blog.filter((_, j) => j !== i) })} className="ml-3 shrink-0 text-sm text-coral">Delete</button>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <Field label="Slug" value={p.slug} onChange={(v) => update((c) => { c.blog[i].slug = v })} />
              <Field label="Category" value={p.category} onChange={(v) => update((c) => { c.blog[i].category = v })} />
              <Field label="Published date" value={p.published_date} onChange={(v) => update((c) => { c.blog[i].published_date = v })} />
              <Field label="Read time" value={p.read_time} onChange={(v) => update((c) => { c.blog[i].read_time = v })} />
              <Field label="Cover image path" value={p.cover} onChange={(v) => update((c) => { c.blog[i].cover = v })} />
              <Field label="Excerpt" value={p.excerpt} onChange={(v) => update((c) => { c.blog[i].excerpt = v })} textarea />
            </div>
            <ArrayField label="Body paragraphs" values={p.body} onChange={(v) => update((c) => { c.blog[i].body = v })} />
          </div>
        ))}
      </div>
    </Section>
  );
}

function TestimonialsEditor({ content, update }: { content: Content; update: (fn: (c: Content) => void) => void }) {
  const testimonials = Array.isArray(content.testimonials) ? content.testimonials : [];
  return (
    <Section title="Testimonials">
      <div className="flex items-center justify-between">
        <p className="font-display text-xl text-ink">{testimonials.length} testimonials</p>
        <button onClick={() => update((c) => { c.testimonials = [...(c.testimonials ?? []), { quote: "", author: "", role: "" }] })} className="rounded-full border border-ink/15 px-4 py-2 text-sm hover:border-coral hover:text-coral">+ Add</button>
      </div>
      <div className="mt-4 space-y-4">
        {testimonials.map((t, i) => (
          <div key={i} className="rounded-xl border border-ink/10 bg-ivory p-5">
            <div className="grid gap-3">
              <Field label="Quote" value={t.quote} onChange={(v) => update((c) => { c.testimonials[i].quote = v })} textarea />
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Author" value={t.author} onChange={(v) => update((c) => { c.testimonials[i].author = v })} />
                <Field label="Role" value={t.role} onChange={(v) => update((c) => { c.testimonials[i].role = v })} />
              </div>
            </div>
            <button onClick={() => update((c) => { c.testimonials = c.testimonials.filter((_, j) => j !== i) })} className="mt-3 text-sm text-coral">Remove</button>
          </div>
        ))}
      </div>
    </Section>
  );
}

function ContactEditor({ content, update }: { content: Content; update: (fn: (c: Content) => void) => void }) {
  const c = content.contact;
  const cf = content.contactForm;
  return (
    <Section title="Contact & Contact Form">
      <p className="font-display text-xl text-ink">Contact Info</p>
      <div className="mt-2 grid gap-4 md:grid-cols-2">
        <Field label="Email" value={c.email} onChange={(v) => update((c2) => { c2.contact.email = v })} />
        <Field label="Phone" value={c.phone} onChange={(v) => update((c2) => { c2.contact.phone = v })} />
        <Field label="Primary location" value={c.location_primary} onChange={(v) => update((c2) => { c2.contact.location_primary = v })} />
        <Field label="Secondary location" value={c.location_secondary} onChange={(v) => update((c2) => { c2.contact.location_secondary = v })} />
        <Field label="Availability" value={c.availability} onChange={(v) => update((c2) => { c2.contact.availability = v })} />
      </div>
      <div className="mt-6">
        <p className="eyebrow">Social Links</p>
        <div className="mt-2 space-y-3">
          {c.socials.map((s, i) => (
            <div key={i} className="flex gap-3">
              <input value={s.label} onChange={(e) => update((c2) => { c2.contact.socials[i].label = e.target.value })} placeholder="Label" className="flex-1 rounded-xl border border-ink/15 bg-ivory px-4 py-3 outline-none focus:border-teal" />
              <input value={s.href} onChange={(e) => update((c2) => { c2.contact.socials[i].href = e.target.value })} placeholder="URL" className="flex-[2] rounded-xl border border-ink/15 bg-ivory px-4 py-3 outline-none focus:border-teal" />
              <button onClick={() => update((c2) => { c2.contact.socials = c2.contact.socials.filter((_, j) => j !== i) })} className="text-sm text-coral">×</button>
            </div>
          ))}
          <button onClick={() => update((c2) => { c2.contact.socials = [...c2.contact.socials, { label: "", href: "" }] })} className="text-sm text-coral hover:underline">+ Add social link</button>
        </div>
      </div>

      <div className="mt-10">
        <p className="font-display text-xl text-ink">Contact Form Labels</p>
        <div className="mt-2 grid gap-4 md:grid-cols-2">
          <Field label="Name label" value={cf.nameLabel} onChange={(v) => update((c2) => { c2.contactForm.nameLabel = v })} />
          <Field label="Name placeholder" value={cf.namePlaceholder} onChange={(v) => update((c2) => { c2.contactForm.namePlaceholder = v })} />
          <Field label="Email label" value={cf.emailLabel} onChange={(v) => update((c2) => { c2.contactForm.emailLabel = v })} />
          <Field label="Email placeholder" value={cf.emailPlaceholder} onChange={(v) => update((c2) => { c2.contactForm.emailPlaceholder = v })} />
          <Field label="Project label" value={cf.projectLabel} onChange={(v) => update((c2) => { c2.contactForm.projectLabel = v })} />
          <Field label="Message label" value={cf.messageLabel} onChange={(v) => update((c2) => { c2.contactForm.messageLabel = v })} />
          <Field label="Message placeholder" value={cf.messagePlaceholder} onChange={(v) => update((c2) => { c2.contactForm.messagePlaceholder = v })} />
          <Field label="Send button" value={cf.sendButton} onChange={(v) => update((c2) => { c2.contactForm.sendButton = v })} />
          <Field label="Sending button" value={cf.sendingButton} onChange={(v) => update((c2) => { c2.contactForm.sendingButton = v })} />
          <Field label="Success message" value={cf.successMessage} onChange={(v) => update((c2) => { c2.contactForm.successMessage = v })} />
        </div>
        <ArrayField label="Project type options" values={cf.projectOptions} onChange={(v) => update((c2) => { c2.contactForm.projectOptions = v })} />
      </div>
    </Section>
  );
}

function PagesEditor({ content, update }: { content: Content; update: (fn: (c: Content) => void) => void }) {
  const p = content.pages;
  return (
    <Section title="Page Text Content">
      <p className="font-display text-xl text-ink">Home Page</p>
      <div className="mt-2 grid gap-4 md:grid-cols-2">
        <Field label="Reel eyebrow" value={p.home.reelEyebrow} onChange={(v) => update((c) => { c.pages.home.reelEyebrow = v })} />
        <Field label="Reel title" value={p.home.reelTitle} onChange={(v) => update((c) => { c.pages.home.reelTitle = v })} textarea />
        <Field label="Services eyebrow" value={p.home.servicesEyebrow} onChange={(v) => update((c) => { c.pages.home.servicesEyebrow = v })} />
        <Field label="Services title" value={p.home.servicesTitle} onChange={(v) => update((c) => { c.pages.home.servicesTitle = v })} textarea />
        <Field label="CTA eyebrow" value={p.home.ctaEyebrow} onChange={(v) => update((c) => { c.pages.home.ctaEyebrow = v })} />
        <Field label="CTA title" value={p.home.ctaTitle} onChange={(v) => update((c) => { c.pages.home.ctaTitle = v })} textarea />
        <Field label="CTA button" value={p.home.ctaButton} onChange={(v) => update((c) => { c.pages.home.ctaButton = v })} />
        <Field label="Scroll text" value={p.home.scrollText} onChange={(v) => update((c) => { c.pages.home.scrollText = v })} />
        <Field label="See services text" value={p.home.seeServicesText} onChange={(v) => update((c) => { c.pages.home.seeServicesText = v })} />
      </div>

      <div className="mt-10">
        <p className="font-display text-xl text-ink">About Page</p>
        <div className="mt-2 grid gap-4 md:grid-cols-2">
          <Field label="Eyebrow" value={p.about.eyebrow} onChange={(v) => update((c) => { c.pages.about.eyebrow = v })} />
          <Field label="Timeline eyebrow" value={p.about.timelineEyebrow} onChange={(v) => update((c) => { c.pages.about.timelineEyebrow = v })} />
          <Field label="Expertise label" value={p.about.expertiseLabel} onChange={(v) => update((c) => { c.pages.about.expertiseLabel = v })} />
          <Field label="Tools label" value={p.about.toolsLabel} onChange={(v) => update((c) => { c.pages.about.toolsLabel = v })} />
        </div>
      </div>

      <div className="mt-10">
        <p className="font-display text-xl text-ink">Services Page</p>
        <div className="mt-2 grid gap-4 md:grid-cols-2">
          <Field label="Eyebrow" value={p.services.eyebrow} onChange={(v) => update((c) => { c.pages.services.eyebrow = v })} />
          <Field label="Title" value={p.services.title} onChange={(v) => update((c) => { c.pages.services.title = v })} textarea />
          <Field label="Process eyebrow" value={p.services.processEyebrow} onChange={(v) => update((c) => { c.pages.services.processEyebrow = v })} />
          <Field label="FAQ eyebrow" value={p.services.faqEyebrow} onChange={(v) => update((c) => { c.pages.services.faqEyebrow = v })} />
          <Field label="CTA button" value={p.services.ctaButton} onChange={(v) => update((c) => { c.pages.services.ctaButton = v })} />
        </div>
      </div>

      <div className="mt-10">
        <p className="font-display text-xl text-ink">Contact Page</p>
        <div className="mt-2 grid gap-4 md:grid-cols-2">
          <Field label="Eyebrow" value={p.contact.eyebrow} onChange={(v) => update((c) => { c.pages.contact.eyebrow = v })} />
          <Field label="Title" value={p.contact.title} onChange={(v) => update((c) => { c.pages.contact.title = v })} textarea />
          <Field label="Free offer eyebrow" value={p.contact.freeOfferEyebrow} onChange={(v) => update((c) => { c.pages.contact.freeOfferEyebrow = v })} />
          <Field label="Free offer title" value={p.contact.freeOfferTitle} onChange={(v) => update((c) => { c.pages.contact.freeOfferTitle = v })} />
          <Field label="Free offer desc" value={p.contact.freeOfferDesc} onChange={(v) => update((c) => { c.pages.contact.freeOfferDesc = v })} textarea />
          <Field label="Email label" value={p.contact.emailLabel} onChange={(v) => update((c) => { c.pages.contact.emailLabel = v })} />
          <Field label="Phone label" value={p.contact.phoneLabel} onChange={(v) => update((c) => { c.pages.contact.phoneLabel = v })} />
          <Field label="Studios label" value={p.contact.studiosLabel} onChange={(v) => update((c) => { c.pages.contact.studiosLabel = v })} />
          <Field label="Availability label" value={p.contact.availabilityLabel} onChange={(v) => update((c) => { c.pages.contact.availabilityLabel = v })} />
        </div>
      </div>
    </Section>
  );
}

function HeaderFooterEditor({ content, update }: { content: Content; update: (fn: (c: Content) => void) => void }) {
  return (
    <Section title="Header & Footer">
      <p className="font-display text-xl text-ink">Navigation Bar</p>
      <div className="mt-2 grid gap-4 md:grid-cols-2">
        <Field label="Brand name" value={content.nav.brand} onChange={(v) => update((c) => { c.nav.brand = v })} />
        <Field label="Start project button" value={content.navbar.startProjectLabel} onChange={(v) => update((c) => { c.navbar.startProjectLabel = v })} />
      </div>
      <div className="mt-4">
        <p className="eyebrow">Nav Links</p>
        <div className="mt-2 space-y-3">
          {content.nav.links.map((l, i) => (
            <div key={i} className="flex gap-3">
              <input value={l.label} onChange={(e) => update((c) => { c.nav.links[i].label = e.target.value })} placeholder="Label" className="flex-1 rounded-xl border border-ink/15 bg-ivory px-4 py-3 outline-none focus:border-teal" />
              <input value={l.href} onChange={(e) => update((c) => { c.nav.links[i].href = e.target.value })} placeholder="href" className="flex-1 rounded-xl border border-ink/15 bg-ivory px-4 py-3 outline-none focus:border-teal" />
              <button onClick={() => update((c) => { c.nav.links = c.nav.links.filter((_, j) => j !== i) })} className="text-sm text-coral">×</button>
            </div>
          ))}
          <button onClick={() => update((c) => { c.nav.links = [...c.nav.links, { label: "", href: "" }] })} className="text-sm text-coral hover:underline">+ Add nav link</button>
        </div>
      </div>

      <div className="mt-10">
        <p className="font-display text-xl text-ink">Footer</p>
        <div className="mt-2 grid gap-4 md:grid-cols-2">
          <Field label="Headline" value={content.footer.headline} onChange={(v) => update((c) => { c.footer.headline = v })} />
          <Field label="Copyright" value={content.footer.copyright} onChange={(v) => update((c) => { c.footer.copyright = v })} />
          <Field label="Admin label" value={content.footer.adminLabel} onChange={(v) => update((c) => { c.footer.adminLabel = v })} />
          <Field label="Tagline" value={content.footer.tagline} onChange={(v) => update((c) => { c.footer.tagline = v })} />
        </div>
      </div>

      <div className="mt-10">
        <p className="font-display text-xl text-ink">3D Scroll Chapter Beats</p>
        <div className="mt-2 space-y-4">
          {content.beats.map((b, i) => (
            <div key={i} className="rounded-xl border border-ink/10 bg-ivory p-4">
              <div className="grid gap-3">
                <Field label="Label" value={b.label} onChange={(v) => update((c) => { c.beats[i].label = v })} />
                <Field label="Title" value={b.title} onChange={(v) => update((c) => { c.beats[i].title = v })} />
                <Field label="Copy" value={b.copy} onChange={(v) => update((c) => { c.beats[i].copy = v })} textarea />
              </div>
              <button onClick={() => update((c) => { c.beats = c.beats.filter((_, j) => j !== i) })} className="mt-2 text-sm text-coral">Remove</button>
            </div>
          ))}
          <button onClick={() => update((c) => { c.beats = [...c.beats, { label: "", title: "", copy: "" }] })} className="text-sm text-coral hover:underline">+ Add beat</button>
        </div>
      </div>
    </Section>
  );
}

function MetadataEditor({ content, update }: { content: Content; update: (fn: (c: Content) => void) => void }) {
  const m = content.metadata;
  return (
    <Section title="SEO & Metadata">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Default title" value={m.defaultTitle} onChange={(v) => update((c) => { c.metadata.defaultTitle = v })} />
        <Field label="Title template" value={m.titleTemplate} onChange={(v) => update((c) => { c.metadata.titleTemplate = v })} />
        <Field label="Description" value={m.description} onChange={(v) => update((c) => { c.metadata.description = v })} textarea />
        <Field label="OG Title" value={m.ogTitle} onChange={(v) => update((c) => { c.metadata.ogTitle = v })} />
        <Field label="OG Description" value={m.ogDescription} onChange={(v) => update((c) => { c.metadata.ogDescription = v })} textarea />
        <Field label="OG Image path" value={m.ogImage} onChange={(v) => update((c) => { c.metadata.ogImage = v })} />
      </div>
      <ArrayField label="Keywords" values={m.keywords} onChange={(v) => update((c) => { c.metadata.keywords = v })} />
    </Section>
  );
}

function Submissions({ subs }: { subs: ReturnType<typeof useSubmissions> }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-3xl text-ink">Submissions</h2>
        <span className="flex items-center gap-2 text-sm text-teal"><span className="h-2 w-2 animate-pulse rounded-full bg-teal" /> Live</span>
      </div>
      <div className="mt-6 space-y-4">
        {subs.subs.length === 0 ? (
          <p className="text-ink/50">No submissions yet.</p>
        ) : (
          subs.subs.map((s) => (
            <div key={s.id} className="rounded-xl border border-ink/10 bg-ivory p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display text-lg text-ink">{s.name}</p>
                  <p className="font-mono text-xs text-ink/50">{s.email} · {s.project_type} · {new Date(s.created_at).toLocaleString()}</p>
                </div>
                <button onClick={() => subs.remove(s.id)} className="shrink-0 text-sm text-coral">Delete</button>
              </div>
              <p className="mt-3 text-ink/70">{s.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setUploading(true);
    setError("");
    setUrl("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <h2 className="font-display text-3xl text-ink">Image Upload</h2>
      <p className="mt-2 text-sm text-ink/60">Upload images to Cloudinary. Copy the URL to use in Content fields.</p>
      <div className="mt-6">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }}
          className="block w-full rounded-xl border border-ink/15 bg-ivory px-4 py-3 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:text-ivory"
        />
      </div>
      {uploading && <p className="mt-4 text-sm text-teal">Uploading to Cloudinary…</p>}
      {url && (
        <div className="mt-4 rounded-xl border border-teal/30 bg-teal/5 p-4">
          <p className="text-sm text-teal">Uploaded successfully!</p>
          <p className="mt-2 break-all font-mono text-xs text-ink/70">{url}</p>
          <button onClick={() => navigator.clipboard.writeText(url)} className="mt-2 text-sm text-coral hover:underline">Copy URL</button>
        </div>
      )}
      {error && <p className="mt-4 text-sm text-coral">{error}</p>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-3xl text-ink">{title}</h2>
      {children}
    </div>
  );
}
