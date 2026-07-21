import Link from "next/link";
import { getContent } from "@/lib/content";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Reveal, MaskReveal } from "@/components/Reveal";
import type { BlogItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const content = await getContent();
  const posts = Array.isArray(content.blog) ? content.blog : [];

  return (
    <main className="bg-ivory">
      <Navbar nav={content.nav} />
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-36 md:px-10 md:pt-48">
        <p className="eyebrow mb-4">04 — Words on words</p>
        <MaskReveal>
          <h1 className="max-w-4xl font-display text-5xl leading-[0.95] text-ink text-balance md:text-7xl">
            Notes from the desk of a working wordsmith.
          </h1>
        </MaskReveal>

        <div className="mt-16 columns-1 gap-8 md:columns-2 lg:columns-3 [&>*]:mb-8">
          {posts.map((p: BlogItem, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.06}>
              <Link
                href={`/blog/${p.slug}`}
                className="group block break-inside-avoid rounded-2xl border border-ink/10 bg-paper p-7 transition-colors hover:border-coral"
              >
                <div className="flex items-center justify-between">
                  <span className="eyebrow">{p.category}</span>
                  <span className="font-mono text-xs text-ink/40">{p.read_time}</span>
                </div>
                <h2 className="mt-4 font-display text-2xl leading-snug text-ink transition-colors group-hover:text-coral">
                  {p.title}
                </h2>
                <p className="mt-3 text-ink/60">{p.excerpt}</p>
                <p className="mt-5 font-mono text-xs text-ink/40">{p.published_date}</p>
              </Link>
            </Reveal>
          ))}
          {posts.length === 0 ? (
            <p className="text-ink/50">New pieces landing soon.</p>
          ) : null}
        </div>
      </section>
      <Footer contact={content.contact} />
    </main>
  );
}
