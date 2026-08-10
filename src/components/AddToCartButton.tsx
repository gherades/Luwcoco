"use client";

import { useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import { addToCart } from "@/lib/cart";
import { EASE_DRAPE } from "@/lib/motion";

export function AddToCartButton({
  slug,
  compact = false,
}: {
  slug: string;
  compact?: boolean;
}) {
  const [justAdded, setJustAdded] = useState(false);

  function handleClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(slug);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  }

  return (
    <button
      onClick={handleClick}
      className={
        compact
          ? "flex flex-1 items-center justify-center gap-1 rounded-full border border-ink px-2 py-1.5 text-[11px] font-semibold text-ink transition-colors hover:bg-ink hover:text-cream"
          : "flex w-full items-center justify-center gap-2 rounded-full border border-ink px-7 py-3 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-cream"
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        {justAdded ? (
          <motion.span
            key="added"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.25, ease: EASE_DRAPE }}
            className="flex items-center gap-1.5"
          >
            <Check size={compact ? 13 : 16} />
            {compact ? "Añadido" : "Añadido al carrito"}
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.25, ease: EASE_DRAPE }}
            className="flex items-center gap-1.5"
          >
            <Plus size={compact ? 13 : 16} />
            {compact ? "Añadir" : "Añadir al carrito"}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
