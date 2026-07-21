import { getContent } from "@/lib/content";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Reveal, MaskReveal } from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const content = await getContent();
  const services = Array.isArray(content.services) ? content.services : [];
  const processSteps = Array.isArray(content.process) ? content.process : [];
  const faq = Array.isArray(content.faq) ? content.faq : [];
  const pages = content.pages.services;

  return (
    <main className="bg-ivory">
      <Navbar nav={content.nav} navbarContent={content.navbar} />
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-36 md:px-10 md:pt-48">
        <p className="eyebrow mb-4">{pages.eyebrow}</p>
        <MaskReveal>
          <h1 className="max-w-4xl font-display text-5xl leading-[0.95] text-ink text-balance md:text-7xl">
            {pages.title}
          </h1>
        </MaskReveal>

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
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <Reveal>
          <p className="eyebrow mb-10">{pages.processEyebrow}</p>
        </Reveal>
        <div className="grid gap-8 md:grid-cols-4">
          {processSteps.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.06} className="border-t border-ink/15 pt-6">
              <span className="font-mono text-sm text-coral">{p.n}</span>
              <h3 className="mt-3 font-display text-2xl text-ink">{p.t}</h3>
              <p className="mt-2 text-ink/60">{p.d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-3xl px-6 py-24 md:px-10">
          <Reveal>
            <p className="eyebrow mb-10">{pages.faqEyebrow}</p>
          </Reveal>
          <div className="divide-y divide-ink/10">
            {faq.map((f, i) => (
              <details key={i} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between font-display text-2xl text-ink">
                  {f.q}
                  <span className="text-coral transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-ink/65">{f.a}</p>
              </details>
            ))}
          </div>
          <Reveal delay={0.1} className="mt-12">
            <a href="/contact">
              <MagneticButton variant="primary">{pages.ctaButton}</MagneticButton>
            </a>
          </Reveal>
        </div>
      </section>

      <Footer contact={content.contact} footerContent={content.footer} />
    </main>
  );
}
