import { getContent } from "@/lib/content";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MagneticButton from "@/components/MagneticButton";
import { Reveal, MaskReveal } from "@/components/Reveal";
import {
  HeroScene,
  ScrollChapter,
  LiquidImage,
  KineticMarquee3D,
  CursorField,
} from "@/components/3d";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getContent();
  const hero = content.hero;
  const portfolio = Array.isArray(content.portfolio) ? content.portfolio : [];
  const services = Array.isArray(content.services) ? content.services : [];
  const testimonials = Array.isArray(content.testimonials)
    ? content.testimonials
    : [];
  const contact = content.contact;

  const pages = content.pages;
  const beats = Array.isArray(content.beats) ? content.beats : [];

  return (
    <main className="relative bg-ivory">
      <Navbar nav={content.nav} navbarContent={content.navbar} />

      {/* HERO */}
      <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <CursorField />
          <HeroScene words={Array.isArray(hero.headline_3d) ? hero.headline_3d : ["WORDS", "THAT", "STAY"]} />
        </div>
        <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-16 md:px-10">
          <p className="eyebrow mb-4">{hero.role}</p>
          <MaskReveal>
            <h1 className="max-w-4xl font-display text-5xl leading-[0.95] text-ink text-balance md:text-7xl">
              {hero.tagline}
            </h1>
          </MaskReveal>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-xl text-lg text-ink/65">{hero.subtitle}</p>
          </Reveal>
          <Reveal delay={0.25} className="mt-9 flex flex-wrap gap-4">
            <a href={hero.cta_primary.href} className="pointer-events-auto">
              <MagneticButton variant="primary">{hero.cta_primary.label} →</MagneticButton>
            </a>
            <a href={hero.cta_secondary.href} className="pointer-events-auto">
              <MagneticButton variant="ghost">{hero.cta_secondary.label}</MagneticButton>
            </a>
          </Reveal>
        </div>
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-xs tracking-[0.3em] text-ink/40">
          {pages.home.scrollText}
        </div>
      </section>

      {/* STUDIO REEL */}
      <section className="mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-40">
        <Reveal>
          <p className="eyebrow mb-3">{pages.home.reelEyebrow}</p>
          <h2 className="max-w-3xl font-display text-4xl text-ink text-balance md:text-6xl">
            {pages.home.reelTitle}
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-6 md:grid-cols-12">
          {portfolio.slice(0, 3).map((p, i) => (
            <Reveal
              key={p.slug}
              delay={i * 0.08}
              className={i === 0 ? "md:col-span-7" : "md:col-span-5"}
            >
              <a href={`/portfolio/${p.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink/5">
                  {Array.isArray(p.images) && p.images[0] ? (
                    <LiquidImage src={p.images[0]} alt={p.title} priority={i === 0} />
                  ) : null}
                </div>
                <div className="mt-5 flex items-baseline justify-between">
                  <h3 className="font-display text-2xl text-ink transition-colors group-hover:text-coral">
                    {p.title}
                  </h3>
                  <span className="eyebrow">{p.category}</span>
                </div>
                <p className="mt-2 max-w-md text-ink/60">{p.client}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* VISIONARY PINNED CHAPTER */}
      <ScrollChapter beats={beats} />

      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-40">
        <Reveal>
          <p className="eyebrow mb-3">{pages.home.servicesEyebrow}</p>
          <h2 className="max-w-3xl font-display text-4xl text-ink text-balance md:text-6xl">
            {pages.home.servicesTitle}
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 md:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08} className="bg-ivory p-8 md:p-10">
              <span className="font-display text-5xl text-coral/30">{`0${i + 1}`}</span>
              <h3 className="mt-6 font-display text-3xl text-ink">{s.title}</h3>
              <p className="mt-4 text-ink/65">{s.desc}</p>
              <ul className="mt-6 space-y-2 text-sm text-ink/60">
                {Array.isArray(s.deliverables)
                  ? s.deliverables.map((d) => (
                      <li key={d} className="flex gap-2">
                        <span className="text-teal">—</span>
                        {d}
                      </li>
                    ))
                  : null}
              </ul>
              <p className="mt-8 font-mono text-sm text-teal">{s.price}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1} className="mt-10">
          <a href="/services">
            <MagneticButton variant="ghost">{pages.home.seeServicesText}</MagneticButton>
          </a>
        </Reveal>
      </section>

      {/* KIND WORDS */}
      <section className="relative h-[80vh] min-h-[560px] w-full overflow-hidden bg-paper">
        <div className="absolute inset-0">
          <KineticMarquee3D
            quotes={testimonials.map((t) => ({ text: t.quote, author: t.author }))}
          />
        </div>
        <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6 md:px-10">
          <p className="eyebrow">03 — Kind words</p>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-44">
        <Reveal>
          <div className="rounded-[2rem] bg-ink px-8 py-16 text-ivory md:px-20 md:py-24">
            <p className="eyebrow text-gold">{pages.home.ctaEyebrow}</p>
            <h2 className="mt-5 max-w-3xl font-display text-4xl text-balance md:text-6xl">
              {pages.home.ctaTitle}
            </h2>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="/contact">
                <MagneticButton
                  variant="primary"
                  className="!bg-ivory !text-ink hover:!bg-gold"
                >
                  {pages.home.ctaButton}
                </MagneticButton>
              </a>
              <a href={`mailto:${contact.email}`}>
                <span className="inline-block font-mono text-sm text-ivory/70">
                  {contact.email}
                </span>
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer contact={contact} footerContent={content.footer} />
    </main>
  );
}
