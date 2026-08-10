"use client";

import { useState } from "react";
import { ExternalLink, Lock } from "lucide-react";

export function CheckoutButton({ paymentLink }: { paymentLink?: string }) {
  const [notice, setNotice] = useState<string | null>(null);

  if (paymentLink) {
    return (
      <a
        href={paymentLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-thread-dark"
      >
        <Lock size={15} />
        Comprar
        <ExternalLink size={14} className="opacity-70" />
      </a>
    );
  }

  return (
    <div>
      <button
        onClick={() =>
          setNotice(
            "Demo: aquí se enlazaría el Stripe Payment Link de este patrón (se crea en dashboard.stripe.com/payment-links, sin backend).",
          )
        }
        className="flex w-full items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-thread-dark"
      >
        <Lock size={15} />
        Comprar
      </button>
      {notice && (
        <p className="mt-3 rounded-lg bg-cream-dim px-3 py-2 text-xs text-ink-soft">
          {notice}
        </p>
      )}
    </div>
  );
}
