"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { LiquidImage } from "@/components/3d";
import type { PortfolioItem } from "@/lib/types";

export default function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  const [cat, setCat] = useState<string>("All");
  const [q, setQ] = useState("");

  const cats = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => set.add(i.category));
    return ["All", ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items.filter((i) => {
      const matchCat = cat === "All" || i.category === cat;
      const matchQ =
        !query ||
        i.title.toLowerCase().includes(query) ||
        i.client.toLowerCase().includes(query) ||
        i.category.toLowerCase().includes(query);
      return matchCat && matchQ;
    });
  }, [items, cat, q]);

  return (
    <div>
      <div className="flex flex-col gap-6 border-b border-ink/10 pb-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                cat === c
                  ? "bg-ink text-ivory"
                  : "border border-ink/15 text-ink/70 hover:border-coral hover:text-coral"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search work…"
          className="w-full max-w-xs rounded-full border border-ink/15 bg-transparent px-5 py-2.5 text-sm outline-none focus:border-teal md:w-64"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-ink/50">
          No work matches that — yet. Try another filter.
        </p>
      ) : (
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.07}>
              <Link href={`/portfolio/${p.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink/5">
                  {Array.isArray(p.images) && p.images[0] ? (
                    <LiquidImage src={p.images[0]} alt={p.title} />
                  ) : null}
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-2xl text-ink transition-colors group-hover:text-coral">
                    {p.title}
                  </h3>
                  <span className="eyebrow shrink-0">{p.category}</span>
                </div>
                <p className="mt-1 text-sm text-ink/55">{p.client}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
