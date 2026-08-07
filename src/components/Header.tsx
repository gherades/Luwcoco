"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/patrones", label: "Patrones" },
  { href: "/sobre-mi", label: "Sobre mí" },
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
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
          <span className="block text-[10px] uppercase tracking-[0.3em] text-ink-soft text-center">
            cosido por
          </span>
          <span className="font-display text-2xl font-semibold tracking-tight">
            luwcoco
          </span>
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
          <button aria-label="Carrito" className="relative p-1">
            <ShoppingBag size={20} />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-coral text-[10px] font-semibold text-cream">
              0
            </span>
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
  );
}
