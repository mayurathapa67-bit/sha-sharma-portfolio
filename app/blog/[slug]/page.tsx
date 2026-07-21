import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Reveal, MaskReveal } from "@/components/Reveal";
import type { BlogItem } from "@/lib/types";

export const dynamic = "force-dynamic";

function readingTime(body: string[]): string {
  const words = body.join(" ").split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await getContent();
  const post = (Array.isArray(content.blog) ? content.blog : []).find(
    (p) => p.slug === slug
  );
  if (!post) return { title: "Not found" };
  return { title: post.title, description: post.excerpt, openGraph: { title: post.title, description: post.excerpt, images: [post.cover] } };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await getContent();
  const posts = Array.isArray(content.blog) ? content.blog : [];
  const post: BlogItem | undefined = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const body = Array.isArray(post.body) ? post.body : [];
  const rt = post.read_time || readingTime(body);
  const toc = body
    .map((_, i) => ({ n: i + 1, label: `Section ${i + 1}` }))
    .slice(0, 6);

  return (
    <main className="bg-ivory">
      <Navbar nav={content.nav} />
      <article className="mx-auto max-w-3xl px-6 pb-24 pt-36 md:px-10 md:pt-48">
        <Link href="/blog" className="eyebrow hover:text-coral">
          ← All words
        </Link>
        <p className="eyebrow mb-4 mt-8">{post.category}</p>
        <MaskReveal>
          <h1 className="font-display text-4xl leading-[1.05] text-ink text-balance md:text-6xl">
            {post.title}
          </h1>
        </MaskReveal>
        <p className="mt-6 font-mono text-sm text-ink/50">
          {post.published_date} · {rt}
        </p>

        <div className="mt-10 grid gap-10 md:grid-cols-[200px_1fr]">
          <aside className="hidden md:block">
            <p className="eyebrow mb-4">Contents</p>
            <ul className="space-y-2 text-sm text-ink/60">
              {toc.map((t) => (
                <li key={t.n}>
                  <a href={`#s${t.n}`} className="hover:text-coral">
                    {t.label}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          <div>
            {body.map((para, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <p
                  id={`s${i + 1}`}
                  className={`text-xl leading-relaxed text-ink/80 ${
                    i === 0 ? "first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-coral" : "mt-8"
                  }`}
                >
                  {para}
                </p>
              </Reveal>
            ))}
            <Reveal>
              <blockquote className="mt-12 border-l-2 border-teal pl-6 font-display text-2xl text-ink">
                That&apos;s the whole trick: say the true thing, clearly.
              </blockquote>
            </Reveal>
          </div>
        </div>
      </article>
      <Footer contact={content.contact} />
    </main>
  );
}
