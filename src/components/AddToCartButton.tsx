"use client";

import type { MouseEvent } from "react";
import { useReducedMotion } from "framer-motion";
import { StitchAddButton } from "@/components/buttons/stitch-add-button";
import { addToCart } from "@/lib/cart";
import { flyToCart } from "@/lib/cartFlight";
import type { Product } from "@/lib/products";

/**
 * Al pulsar, una aguja cose el borde del botón y la imagen del producto (el
 * `data-cart-source` dentro del mismo `data-cart-scope`) sale volando hasta
 * la bolsa del header.
 */
export function AddToCartButton({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const reduce = useReducedMotion() ?? false;

  function handleAdd(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
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
    <StitchAddButton
      compact={compact}
      onAdd={handleAdd}
      className={compact ? "min-w-0! flex-1" : "w-full"}
    />
  );
}
