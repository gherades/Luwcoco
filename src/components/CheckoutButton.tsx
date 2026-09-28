"use client";

import { useState } from "react";
import { ScissorsBuyButton } from "@/components/buttons/scissors-buy-button";

export function CheckoutButton({ paymentLink, price }: { paymentLink?: string; price: number }) {
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div>
      <ScissorsBuyButton
        price={price}
        onCheckout={() => {
          if (paymentLink) {
            window.location.assign(paymentLink);
            return;
          }
          setNotice(
            "Demo: aquí se enlazaría el Stripe Payment Link de este patrón (se crea en dashboard.stripe.com/payment-links, sin backend).",
          );
        }}
      />
      {notice && (
        <p className="mt-3 rounded-lg bg-cream-dim px-3 py-2 text-xs text-ink-soft">{notice}</p>
      )}
    </div>
  );
}
