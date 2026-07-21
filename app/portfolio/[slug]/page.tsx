import { notFound } from "next/navigation";
import Link from "next/link";
import { getContent } from "@/lib/content";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Reveal, MaskReveal } from "@/components/Reveal";
import { LiquidImage, ScrollChapter } from "@/components/3d";
import type { PortfolioItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await getContent();
  const item = (Array.isArray(content.portfolio) ? content.portfolio : []).find(
    (p) => p.slug === slug
  );
  if (!item) return { title: "Work not found" };
  return {
    title: item.title,
    description: item.challenge,
    openGraph: { title: item.title, description: item.challenge, images: item.images },
  };
}

export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await getContent();
  const items = Array.isArray(content.portfolio) ? content.portfolio : [];
  const item: PortfolioItem | undefined = items.find((p) => p.slug === slug);
  if (!item) notFound();

  const idx = items.findIndex((p) => p.slug === slug);
  const next = items[(idx + 1) % items.length];
  const metrics = item.results?.metrics ?? [];

  return (
    <main className="bg-ivory">
      <Navbar nav={content.nav} />

      <section className="mx-auto max-w-7xl px-6 pb-16 pt-36 md:px-10 md:pt-48">
        <Link href="/portfolio" className="eyebrow hover:text-coral">
          ← All work
        </Link>
        <p className="eyebrow mb-4 mt-8">{item.category}</p>
        <MaskReveal>
          <h1 className="max-w-4xl font-display text-5xl leading-[0.95] text-ink text-balance md:text-7xl">
            {item.title}
          </h1>
        </MaskReveal>
        <p className="mt-6 font-mono text-sm text-ink/55">
          {item.client} · {item.published_date} · {item.read_time}
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-ink/5">
          {Array.isArray(item.images) && item.images[0] ? (
            <LiquidImage src={item.images[0]} alt={item.title} priority />
          ) : null}
        </div>
      </section>

      <ScrollChapter />

      <section className="mx-auto max-w-3xl px-6 py-24 md:px-10">
        <Reveal>
          <p className="eyebrow mb-4">The challenge</p>
          <p className="text-2xl leading-relaxed text-ink/80">{item.challenge}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="eyebrow mb-4 mt-16">The strategy</p>
          <p className="text-2xl leading-relaxed text-ink/80">{item.strategy}</p>
        </Reveal>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10">
          <Reveal>
            <p className="eyebrow mb-10">The results</p>
          </Reveal>
          <div className="grid gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 md:grid-cols-3">
            {Array.isArray(metrics) && metrics.length > 0 ? (
              metrics.map((m, i) => (
                <Reveal key={m.label} delay={i * 0.08} className="bg-paper p-10">
                  <p className="font-display text-6xl text-teal">{m.value}</p>
                  <p className="mt-3 text-ink/60">{m.label}</p>
                </Reveal>
              ))
            ) : (
              <p className="bg-paper p-10 text-ink/50">Results pending.</p>
            )}
          </div>
        </div>
      </section>

      {Array.isArray(item.images) && item.images.length > 1 ? (
        <section className="mx-auto max-w-7xl px-6 py-24 md:px-10">
          <div className="grid gap-6 md:grid-cols-2">
            {item.images.slice(1).map((img, i) => (
              <Reveal key={img} delay={i * 0.08} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink/5">
                <LiquidImage src={img} alt={`${item.title} ${i + 2}`} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-3xl px-6 py-20 md:px-10">
        <Reveal>
          <blockquote className="border-l-2 border-coral pl-6 font-display text-3xl leading-snug text-ink">
            “{item.testimonial}”
          </blockquote>
          <p className="mt-5 font-mono text-sm text-teal">{item.testimonial_author}</p>
        </Reveal>
      </section>

      <section className="border-t border-ink/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-12 md:px-10">
          <span className="eyebrow">Next project</span>
          <Link
            href={`/portfolio/${next.slug}`}
            className="font-display text-3xl text-ink transition-colors hover:text-coral md:text-4xl"
          >
            {next.title} →
          </Link>
        </div>
      </section>

      <Footer contact={content.contact} />
    </main>
  );
}
