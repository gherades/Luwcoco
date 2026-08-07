import type { Metadata } from "next";
import { FadeIn } from "@/components/FadeIn";
import { refundPolicy } from "@/lib/legalContent";

export const metadata: Metadata = {
  title: "Política de reembolso — Luwcoco",
};

export default function ReembolsoPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-20 sm:px-8">
      <FadeIn>
        <h1 className="font-display text-4xl font-medium">
          Política de reembolso
        </h1>
        <p className="mt-6 text-ink-soft">{refundPolicy}</p>
      </FadeIn>
    </div>
  );
}
