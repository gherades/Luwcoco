"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Scissors } from "lucide-react";
import { addToCart } from "@/lib/cart";
import { EASE_DRAPE } from "@/lib/motion";

export function AddToCartButton({ slug }: { slug: string }) {
  const [justAdded, setJustAdded] = useState(false);
  const [snip, setSnip] = useState(0);

  function handleClick() {
    addToCart(slug);
    setJustAdded(true);
    setSnip((s) => s + 1);
    window.setTimeout(() => setJustAdded(false), 1400);
  }

  return (
    <button
      onClick={handleClick}
      className="flex w-full items-center justify-center gap-2 rounded-full border border-ink px-7 py-3 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-cream"
    >
      <AnimatePresence mode="wait" initial={false}>
        {justAdded ? (
          <motion.span
            key="added"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <Check size={16} />
            Añadido al carrito
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <motion.span
              key={snip}
              animate={snip > 0 ? { rotate: [0, -22, 6, 0] } : {}}
              transition={{ duration: 0.4, ease: EASE_DRAPE }}
            >
              <Scissors size={16} />
            </motion.span>
            Añadir al carrito
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
