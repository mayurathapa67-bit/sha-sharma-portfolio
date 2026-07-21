import { getContent } from "@/lib/content";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Reveal, MaskReveal } from "@/components/Reveal";
import { LiquidImage } from "@/components/3d";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const content = await getContent();
  const about = content.about;
  const bio = Array.isArray(about.bio) ? about.bio : [];
  const journey = Array.isArray(about.journey) ? about.journey : [];
  const expertise = Array.isArray(about.expertise) ? about.expertise : [];
  const tools = Array.isArray(about.tools) ? about.tools : [];

  const pages = content.pages.about;

  return (
    <main className="bg-ivory">
      <Navbar nav={content.nav} navbarContent={content.navbar} />

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-36 md:px-10 md:pt-48">
        <p className="eyebrow mb-4">{pages.eyebrow}</p>
        <MaskReveal>
          <h1 className="max-w-4xl font-display text-5xl leading-[0.95] text-ink text-balance md:text-7xl">
            {about.headline}
          </h1>
        </MaskReveal>

        <div className="mt-16 grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink/5">
              <LiquidImage src={about.image} alt={content.hero.title} priority />
            </div>
          </div>
          <div className="md:col-span-7 md:pl-8">
            {bio.map((p, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <p className="mb-6 text-xl leading-relaxed text-ink/75 md:text-2xl">
                  {p}
                </p>
              </Reveal>
            ))}
            <Reveal delay={0.15}>
              <blockquote className="mt-4 border-l-2 border-coral pl-6 font-display text-2xl text-ink">
                {about.philosophy}
              </blockquote>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <Reveal>
          <p className="eyebrow mb-10">{pages.timelineEyebrow}</p>
        </Reveal>
        <div className="relative border-l border-ink/15 pl-8">
          {journey.map((j, i) => (
            <Reveal key={j.year} delay={i * 0.06} className="relative pb-12">
              <span className="absolute -left-[41px] top-1 h-3 w-3 rounded-full bg-teal ring-4 ring-ivory" />
              <span className="font-mono text-sm text-coral">{j.year}</span>
              <h3 className="mt-1 font-display text-3xl text-ink">{j.title}</h3>
              <p className="mt-2 max-w-xl text-ink/65">{j.detail}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:px-10">
          <Reveal>
            <p className="eyebrow mb-6">{pages.expertiseLabel}</p>
            <ul className="flex flex-wrap gap-3">
              {expertise.map((e) => (
                <li
                  key={e}
                  className="rounded-full border border-ink/15 px-5 py-2.5 text-ink/80"
                >
                  {e}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow mb-6">{pages.toolsLabel}</p>
            <ul className="flex flex-wrap gap-3">
              {tools.map((t) => (
                <li
                  key={t}
                  className="rounded-full bg-ink/5 px-5 py-2.5 text-ink/80"
                >
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <Footer contact={content.contact} footerContent={content.footer} />
    </main>
  );
}
