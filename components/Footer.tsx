import Link from "next/link";
import type { Contact, FooterContent } from "@/lib/types";

export default function Footer({ contact, footerContent }: { contact?: Contact; footerContent?: FooterContent }) {
  const c = contact ?? {
    email: "esha.australia01@gmail.com",
    phone: "+61 482 075 788",
    location_primary: "Melbourne, Australia",
    location_secondary: "Kathmandu, Nepal",
    socials: [],
    availability: "Booking projects for Q3 2026",
  };
  const f = footerContent ?? {
    headline: "Let's write something worth reading",
    copyright: "© {year} Esha Sharma. Words with intent.",
    adminLabel: "Admin",
    tagline: "Made between two cities, with care.",
  };
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink/10 bg-paper">
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="eyebrow">{f.headline}</p>
            <a
              href={`mailto:${c.email}`}
              className="mt-5 block font-display text-4xl leading-tight text-ink transition-colors hover:text-coral md:text-6xl"
            >
              {c.email}
            </a>
            <p className="mt-6 max-w-sm text-ink/60">{c.availability}</p>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow">Studio</p>
            <ul className="mt-5 space-y-2 text-ink/70">
              <li>{c.location_primary}</li>
              <li>{c.location_secondary}</li>
              <li>
                <a href={`tel:${c.phone}`} className="hover:text-teal">
                  {c.phone}
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="eyebrow">Elsewhere</p>
            <ul className="mt-5 space-y-2">
              {Array.isArray(c.socials) && c.socials.length > 0 ? (
                c.socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-ink/70 transition-colors hover:text-coral"
                    >
                      {s.label}
                      <span aria-hidden>→</span>
                    </a>
                  </li>
                ))
              ) : (
                <li className="text-ink/50">Links coming soon</li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-ink/10 pt-8 text-sm text-ink/50 md:flex-row md:items-center">
          <p>{f.copyright.replace("{year}", String(year))}</p>
          <div className="flex items-center gap-6">
            <Link href="/admin/login" className="hover:text-teal">
              {f.adminLabel}
            </Link>
            <span>{f.tagline}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
