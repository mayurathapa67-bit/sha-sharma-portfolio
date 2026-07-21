"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Nav, NavbarContent } from "@/lib/types";

const FALLBACK: Nav = {
  brand: "Esha Sharma",
  links: [
    { label: "Work", href: "/portfolio" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Words", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
};

export default function Navbar({ nav, navbarContent }: { nav?: Nav; navbarContent?: NavbarContent }) {
  const data = nav ?? FALLBACK;
  const nb = navbarContent ?? { startProjectLabel: "Start a project" };
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-ivory/80 backdrop-blur-md border-b border-ink/5"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <Link href="/" className="font-display text-xl tracking-tight">
          {data.brand}
          <span className="text-coral">.</span>
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {Array.isArray(data.links)
            ? data.links.map((l) => {
                const active =
                  pathname === l.href ||
                  (l.href !== "/" && pathname.startsWith(l.href));
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`relative text-sm tracking-wide transition-colors ${
                      active ? "text-teal" : "text-ink/70 hover:text-ink"
                    }`}
                  >
                    {l.label}
                    {active && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-1.5 left-0 right-0 h-px bg-coral"
                      />
                    )}
                  </Link>
                );
              })
            : null}
          <Link
            href="/contact"
            className="rounded-full bg-ink px-5 py-2.5 text-sm text-ivory transition-colors hover:bg-teal"
          >
            {nb.startProjectLabel}
          </Link>
        </div>

        <button
          aria-label="Menu"
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="h-px w-7 bg-ink" />
          <span className="h-px w-7 bg-ink" />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-ink/5 bg-ivory md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {Array.isArray(data.links)
                ? data.links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="py-3 font-display text-2xl"
                    >
                      {l.label}
                    </Link>
                  ))
                : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
