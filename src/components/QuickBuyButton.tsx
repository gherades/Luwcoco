import Link from "next/link";
import { Lock } from "lucide-react";

export function QuickBuyButton({ slug, paymentLink }: { slug: string; paymentLink?: string }) {
  if (paymentLink) {
    return (
      <a
        href={paymentLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="flex flex-1 items-center justify-center gap-1 rounded-full bg-ink px-2 py-1.5 text-[11px] font-semibold text-cream transition-colors hover:bg-thread-dark"
      >
        <Lock size={12} />
        Comprar
      </a>
    );
  }

  // Sin Payment Link configurado todavía: lleva a la ficha, donde el botón
  // de compra explica el estado de la demo en vez de fallar en silencio.
  return (
    <Link
      href={`/patrones/${slug}`}
      onClick={(e) => e.stopPropagation()}
      className="flex flex-1 items-center justify-center gap-1 rounded-full bg-ink px-2 py-1.5 text-[11px] font-semibold text-cream transition-colors hover:bg-thread-dark"
    >
      <Lock size={12} />
      Comprar
    </Link>
  );
}
