import { getContent } from "@/lib/content";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Reveal, MaskReveal } from "@/components/Reveal";
import PortfolioGrid from "@/components/PortfolioGrid";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const content = await getContent();
  const portfolio = Array.isArray(content.portfolio) ? content.portfolio : [];

  return (
    <main className="bg-ivory">
      <Navbar nav={content.nav} />
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-36 md:px-10 md:pt-48">
        <Reveal>
          <p className="eyebrow mb-4">02 — Selected work</p>
        </Reveal>
        <MaskReveal>
          <h1 className="max-w-4xl font-display text-5xl leading-[0.95] text-ink text-balance md:text-7xl">
            Brands that found their sentence — and kept it.
          </h1>
        </MaskReveal>
        <p className="mt-8 max-w-xl text-lg text-ink/65">
          A small, considered body of work. Each project began with a problem
          only the right words could solve.
        </p>

        <div className="mt-16">
          <PortfolioGrid items={portfolio} />
        </div>
      </section>
      <Footer contact={content.contact} />
    </main>
  );
}
