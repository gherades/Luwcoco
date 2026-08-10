"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { useSyncExternalStore } from "react";
import { getProduct } from "@/lib/products";
import { withBasePath } from "@/lib/basePath";
import { EASE_DRAPE } from "@/lib/motion";
import {
  getCartServerSnapshot,
  getCartSnapshot,
  removeFromCart,
  setQty,
  subscribeCart,
} from "@/lib/cart";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const items = useSyncExternalStore(subscribeCart, getCartSnapshot, getCartServerSnapshot);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const lines = items
    .map((item) => ({ item, product: getProduct(item.slug) }))
    .filter((l): l is { item: (typeof items)[number]; product: NonNullable<ReturnType<typeof getProduct>> } => !!l.product);

  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.item.qty, 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-graphite/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-[71] flex w-full max-w-sm flex-col bg-cream shadow-xl"
            initial={{ x: "100%", rotate: 2 }}
            animate={{ x: 0, rotate: 0 }}
            exit={{ x: "100%", rotate: 2 }}
            transition={{ duration: 0.45, ease: EASE_DRAPE }}
            role="dialog"
            aria-label="Carrito"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="font-display text-lg font-medium">Tu carrito</span>
              <button aria-label="Cerrar carrito" onClick={onClose} className="p-1 text-ink-soft hover:text-ink">
                <X size={20} />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <p className="text-ink-soft">Todavía no has añadido ningún patrón.</p>
                <Link
                  href="/patrones"
                  onClick={onClose}
                  className="rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-thread-dark"
                >
                  Ver patrones
                </Link>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <ul className="space-y-4">
                  {lines.map(({ item, product }) => (
                    <li key={item.slug} className="flex gap-3 border-b border-line pb-4">
                      <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg border border-line bg-cream-dim">
                        {product.patternImage && (
                          <Image
                            src={withBasePath(product.patternImage)}
                            alt={product.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-display text-sm font-medium leading-tight">{product.name}</p>
                        <p className="mt-0.5 font-mono text-xs text-ink-soft">
                          {product.price.toFixed(2)}€ · unidad
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                          <div className="flex items-center gap-2 rounded-full border border-line px-2 py-1">
                            <button
                              aria-label="Quitar una unidad"
                              onClick={() => setQty(item.slug, item.qty - 1)}
                              className="text-ink-soft hover:text-ink"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-4 text-center font-mono text-xs">{item.qty}</span>
                            <button
                              aria-label="Añadir una unidad"
                              onClick={() => setQty(item.slug, item.qty + 1)}
                              className="text-ink-soft hover:text-ink"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.slug)}
                            className="font-mono text-[11px] uppercase tracking-wide text-ink-soft underline underline-offset-2 hover:text-coral"
                          >
                            Quitar
                          </button>
                        </div>
                      </div>
                      <span className="whitespace-nowrap font-mono text-sm text-ink">
                        {(product.price * item.qty).toFixed(2)}€
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {lines.length > 0 && (
              <div className="border-t border-line px-5 py-4">
                <div className="flex items-center justify-between font-mono text-sm">
                  <span className="uppercase tracking-wide text-ink-soft">Subtotal</span>
                  <span className="text-ink">{subtotal.toFixed(2)}€</span>
                </div>
                <p className="mt-2 text-xs text-ink-soft">
                  Cada patrón se paga por separado con su propio enlace de Stripe — sin
                  carrito combinado en esta demo.
                </p>
                <div className="mt-3 space-y-2">
                  {lines.map(({ item, product }) =>
                    product.paymentLink ? (
                      <a
                        key={item.slug}
                        href={product.paymentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-full bg-ink px-4 py-2 text-xs font-semibold text-cream transition-colors hover:bg-thread-dark"
                      >
                        Comprar {product.name}
                      </a>
                    ) : (
                      <div
                        key={item.slug}
                        className="flex items-center justify-between rounded-full border border-line bg-cream-dim px-4 py-2 text-xs text-ink-soft"
                      >
                        <span>Comprar {product.name}</span>
                        <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft/70">
                          enlace pendiente
                        </span>
                      </div>
                    )
                  )}
                </div>
                {lines.some((l) => !l.product.paymentLink) && (
                  <p className="mt-2 text-[11px] text-ink-soft/70">
                    Demo: los Stripe Payment Links se crean en dashboard.stripe.com/payment-links,
                    sin backend.
                  </p>
                )}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
