"use client";

import { useMemo, useState } from "react";
import { products, type Product } from "@/lib/products";
import { ProductCard } from "./ProductCard";

const categories: { key: Product["category"] | "todos"; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "bolsos", label: "Bolsos" },
  { key: "ropa", label: "Ropa" },
  { key: "accesorios", label: "Accesorios" },
];

export function ProductGrid({ limit }: { limit?: number }) {
  const [category, setCategory] = useState<(typeof categories)[number]["key"]>("todos");

  const filtered = useMemo(() => {
    const list =
      category === "todos" ? products : products.filter((p) => p.category === category);
    return limit ? list.slice(0, limit) : list;
  }, [category, limit]);

  return (
    <div>
      {!limit && (
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                category === c.key
                  ? "border-ink bg-ink text-cream"
                  : "border-line text-ink-soft hover:border-ink/40 hover:text-ink"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((product, i) => (
          <ProductCard key={product.slug} product={product} index={i} />
        ))}
      </div>
    </div>
  );
}
