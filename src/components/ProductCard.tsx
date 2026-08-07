"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { PatternIcon } from "./PatternIcon";
import { levelLabels, type Product } from "@/lib/products";
import { withBasePath } from "@/lib/basePath";

const bgByCategory: Record<Product["category"], string> = {
  bolsos: "from-denim/70 to-cream-dim",
  ropa: "from-blush/60 to-cream-dim",
  accesorios: "from-coral/30 to-cream-dim",
};

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
    >
      <Link href={`/patrones/${product.slug}`} className="group block">
        <div
          className={`relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl border border-line ${
            product.patternImage ? "bg-cream-dim" : `bg-gradient-to-br ${bgByCategory[product.category]}`
          }`}
        >
          {(product.isNew || product.isBestseller) && (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-ink px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-cream">
              {product.isNew ? "Nuevo" : "Top ventas"}
            </span>
          )}
          {product.patternImage ? (
            <Image
              src={withBasePath(product.patternImage)}
              alt={`Patrón ${product.name} — ${product.subtitle}`}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <PatternIcon
              icon={product.icon}
              className="h-28 w-28 text-ink/70 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 sm:h-36 sm:w-36"
            />
          )}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-cream/90 px-4 py-2 text-[11px] font-medium text-ink-soft backdrop-blur">
            <span>Nivel: {levelLabels[product.level]}</span>
            <span className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className={`h-1.5 w-1.5 rounded-full ${n <= product.level ? "bg-thread" : "bg-line"}`}
                />
              ))}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-medium leading-tight">
              {product.name}
            </h3>
            <p className="text-sm text-ink-soft">{product.subtitle}</p>
          </div>
          <span className="whitespace-nowrap font-display text-lg">
            {product.price.toFixed(2)}€
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
