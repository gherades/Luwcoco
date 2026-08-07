"use client";

import { useState } from "react";
import { Loader2, Lock } from "lucide-react";

export function CheckoutButton({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setNotice(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();

      if (!res.ok) {
        setNotice(data.error ?? "No se pudo iniciar el pago.");
        return;
      }

      window.location.href = data.url;
    } catch {
      setNotice("Error de red al conectar con Stripe.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-thread-dark disabled:opacity-60"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={15} />}
        Comprar con Stripe
      </button>
      {notice && (
        <p className="mt-3 rounded-lg bg-cream-dim px-3 py-2 text-xs text-ink-soft">
          {notice}
        </p>
      )}
    </div>
  );
}
