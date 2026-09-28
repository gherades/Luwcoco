"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import { addToCart } from "@/lib/cart";
import { flyToCart } from "@/lib/cartFlight";
import type { Product } from "@/lib/products";

/**
 * Al pulsar, la imagen del producto (el `data-cart-source` dentro del mismo
 * `data-cart-scope`) sale volando hasta la bolsa del header, y el botón pasa
 * a "Añadido" durante un momento.
 */
export function AddToCartButton({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const reduce = useReducedMotion() ?? false;
  const [added, setAdded] = useState(0);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(0), 1500);
    return () => clearTimeout(timer);
  }, [added]);

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    setAdded((value) => value + 1);
    if (reduce) {
      addToCart(product.slug);
      return;
    }
    const button = e.currentTarget;
    const source =
      button.closest("[data-cart-scope]")?.querySelector("[data-cart-source]") ?? button;
    flyToCart(product, source);
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileTap={{ scale: compact ? 0.92 : 0.97 }}
      aria-label={`Añadir ${product.name} al carrito`}
      className={`flex items-center justify-center overflow-hidden rounded-full border font-semibold transition-colors duration-200 ${
        compact ? "flex-1 px-2 py-1.5 text-[11px]" : "w-full px-7 py-3 text-sm"
      } ${
        added
          ? "border-thread bg-thread text-cream"
          : "border-ink text-ink hover:bg-ink hover:text-cream"
      }`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={added ? "added" : "add"}
          className="flex items-center gap-1.5"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {added ? <Check size={compact ? 13 : 16} /> : <Plus size={compact ? 13 : 16} />}
          {added ? (compact ? "Añadido" : "Añadido al carrito") : compact ? "Añadir" : "Añadir al carrito"}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
