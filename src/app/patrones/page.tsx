import type { Metadata } from "next";
import { ProductGrid } from "@/components/ProductGrid";
import { FadeIn } from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Patrones — Luwcoco",
};

export default function PatronesPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <FadeIn className="mb-10">
        <h1 className="font-display text-4xl font-medium sm:text-5xl">
          Patrones de costura
        </h1>
        <p className="mt-3 max-w-xl text-ink-soft">
          Todos los patrones incluyen PDF listo para imprimir y vídeo
          tutorial paso a paso. Filtra por categoría para encontrar tu
          próximo proyecto.
        </p>
      </FadeIn>

      <ProductGrid />
    </div>
  );
}
