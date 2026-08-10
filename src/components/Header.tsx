"use client";

import Link from "next/link";
import Image from "next/image";
import { Fragment, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { withBasePath } from "@/lib/basePath";
import { EASE_DRAPE } from "@/lib/motion";
import { cartCount, getCartServerSnapshot, getCartSnapshot, subscribeCart } from "@/lib/cart";
import { CartDrawer } from "./CartDrawer";

const links = [
  { href: "/", label: "Home" },
  { href: "/patrones", label: "Patrones" },
  { href: "/sobre-mi", label: "Sobre mí" },
  { href: "/contacto", label: "Contacto" },
];

function ThreadBow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 20" className={className} fill="currentColor">
      <path d="M15 10 2 3v14z" />
      <path d="M17 10 30 3v14z" />
      <rect x="13" y="6" width="6" height="8" rx="2" />
    </svg>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const items = useSyncExternalStore(subscribeCart, getCartSnapshot, getCartServerSnapshot);
  const count = cartCount(items);

  const [pulse, setPulse] = useState(0);
  const prevCountRef = useRef<number | null>(null);
  useEffect(() => {
    if (prevCountRef.current !== null && count > prevCountRef.current) {
      setPulse((p) => p + 1);
    }
    prevCountRef.current = count;
  }, [count]);

  return (
    <Fragment>
      <header className="sticky top-0 z-50 border-b border-line/80 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <button
          className="p-1 sm:hidden"
          aria-label="Abrir menú"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link href="/" className="mx-auto sm:mx-0">
          <Image
            src={withBasePath("/images/logo-luwcoco.png")}
            alt="luwcoco — sewn by luwcoco"
            width={300}
            height={120}
            priority
            className="h-10 w-auto sm:h-11 dark:invert"
          />
        </Link>

        <nav className="hidden gap-8 text-sm font-medium sm:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-ink-soft transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button aria-label="Buscar" className="hidden p-1 sm:block">
            <Search size={19} />
          </button>
          <button
            aria-label="Carrito"
            className="relative p-1"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag size={20} />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, ease: EASE_DRAPE }}
                  className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-coral font-mono text-[10px] font-semibold text-cream"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {pulse > 0 && (
                <motion.span
                  key={pulse}
                  initial={{ scale: 0.4, opacity: 0, rotate: -8 }}
                  animate={{ scale: [0.4, 1.25, 1, 0.9], opacity: [0, 1, 1, 0], rotate: [-8, 4, 0, 0] }}
                  transition={{ duration: 0.9, ease: EASE_DRAPE }}
                  className="pointer-events-none absolute -right-3 -top-3 text-coral"
                >
                  <ThreadBow className="h-6 w-6" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-line px-5 pb-4 pt-2 text-sm font-medium sm:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2 text-ink-soft hover:bg-cream-dim hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}

      </header>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </Fragment>
  );
}
