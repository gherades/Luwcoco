"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { SewingCart, type SewingCartItem } from "@/components/cart/sewing-cart";
import type { GarmentIconName } from "@/components/cart/garment-icons";
import { getProduct, products, type Product } from "@/lib/products";
import { EASE_DRAPE } from "@/lib/motion";
import {
  addToCart,
  cartDiscount,
  getCartServerSnapshot,
  getCartSnapshot,
  removeFromCart,
  setQty,
  subscribeCart,
} from "@/lib/cart";

/** Dibujo de cada tipo de patrón en su sobre del carrito. */
const garmentIcons: Record<Product["icon"], GarmentIconName> = {
  duffbag: "duffel",
  totebag: "tote",
  pants: "pants",
  top: "top",
  skirt: "skirt",
  pouch: "pouch",
};

function toCartItem(product: Product, qty: number): SewingCartItem {
  return {
    id: product.slug,
    name: product.name,
    subtitle: product.subtitle,
    price: product.price,
    qty,
    icon: garmentIcons[product.icon],
  };
}

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const items = useSyncExternalStore(subscribeCart, getCartSnapshot, getCartServerSnapshot);
  const [showNotice, setShowNotice] = useState(false);

  function handleClose() {
    setShowNotice(false);
    onClose();
  }

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const lines = items
    .map((item) => ({ item, product: getProduct(item.slug) }))
    .filter((l): l is { item: (typeof items)[number]; product: Product } => !!l.product);

  const totalUnits = lines.reduce((sum, l) => sum + l.item.qty, 0);
  const discount = cartDiscount(lines.map((l) => ({ price: l.product.price, qty: l.item.qty })));

  // Sugerencia: el primer superventas que aún no está en el carrito.
  const suggested =
    products.find((p) => p.isBestseller && !items.some((i) => i.slug === p.slug)) ??
    products.find((p) => !items.some((i) => i.slug === p.slug));

  function handleCheckout() {
    const link = lines[0]?.product.paymentLink;
    if (totalUnits === 1 && link) {
      window.location.assign(link);
      return;
    }
    setShowNotice(true);
  }

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
            onClick={handleClose}
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
            <SewingCart
              className="h-full rounded-none! shadow-none!"
              items={lines.map((l) => toCartItem(l.product, l.item.qty))}
              onQtyChange={setQty}
              onRemove={removeFromCart}
              onClose={handleClose}
              onBrowse={() => {
                handleClose();
                router.push("/patrones");
              }}
              suggestion={suggested ? toCartItem(suggested, 1) : undefined}
              onAddSuggestion={(item) => addToCart(item.id)}
              onCheckout={handleCheckout}
              notice={
                showNotice && (
                  <p className="mt-3 rounded-lg bg-cream-dim px-3 py-2 text-xs text-ink-soft">
                    {discount.eligible
                      ? "Demo: un pago con el descuento ya aplicado (o con varios patrones distintos) necesita crear la sesión de Stripe desde una función ligera (p. ej. Cloudflare Pages Functions), ya que los Stripe Payment Links son enlaces fijos y este sitio no tiene backend."
                      : "Demo: un solo pago para varios patrones distintos necesita crear la sesión de Stripe desde una función ligera (p. ej. Cloudflare Pages Functions), ya que los Stripe Payment Links son enlaces fijos y este sitio no tiene backend."}{" "}
                    Con un solo patrón en el carrito, el botón sí abre su enlace de pago real.
                  </p>
                )
              }
            />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
