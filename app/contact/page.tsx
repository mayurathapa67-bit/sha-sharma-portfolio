import { getContent } from "@/lib/content";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Reveal, MaskReveal } from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const content = await getContent();
  const c = content.contact;

  const pages = content.pages.contact;

  return (
    <main className="bg-ivory">
      <Navbar nav={content.nav} navbarContent={content.navbar} />
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-36 md:px-10 md:pt-48">
        <p className="eyebrow mb-4">{pages.eyebrow}</p>
        <MaskReveal>
          <h1 className="max-w-4xl font-display text-5xl leading-[0.95] text-ink text-balance md:text-7xl">
            {pages.title}
          </h1>
        </MaskReveal>

        <div className="mt-16 grid gap-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <Reveal>
              <ContactForm contactForm={content.contactForm} />
            </Reveal>
          </div>

          <aside className="md:col-span-5 md:border-l md:border-ink/10 md:pl-10">
            <Reveal delay={0.1}>
              <div className="rounded-3xl border border-coral/30 bg-paper p-8">
                <p className="eyebrow text-coral">{pages.freeOfferEyebrow}</p>
                <h3 className="mt-3 font-display text-2xl text-ink">
                  {pages.freeOfferTitle}
                </h3>
                <p className="mt-3 text-ink/65">
                  {pages.freeOfferDesc}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.15} className="mt-10 space-y-6">
              <div>
                <p className="eyebrow">{pages.emailLabel}</p>
                <a
                  href={`mailto:${c.email}`}
                  className="mt-2 block text-lg text-ink hover:text-coral"
                >
                  {c.email}
                </a>
              </div>
              <div>
                <p className="eyebrow">{pages.phoneLabel}</p>
                <a
                  href={`tel:${c.phone}`}
                  className="mt-2 block text-lg text-ink hover:text-coral"
                >
                  {c.phone}
                </a>
              </div>
              <div>
                <p className="eyebrow">{pages.studiosLabel}</p>
                <p className="mt-2 text-lg text-ink/80">{c.location_primary}</p>
                <p className="text-lg text-ink/80">{c.location_secondary}</p>
              </div>
              <div>
                <p className="eyebrow">{pages.availabilityLabel}</p>
                <p className="mt-2 text-lg text-teal">{c.availability}</p>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>
      <Footer contact={content.contact} footerContent={content.footer} />
    </main>
  );
}
