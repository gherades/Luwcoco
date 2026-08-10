import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { ProcessStrip } from "@/components/ProcessStrip";
import { HowItWorks } from "@/components/HowItWorks";
import { About } from "@/components/About";
import { Testimonials } from "@/components/Testimonials";
import { FadeIn } from "@/components/FadeIn";

export default function Home() {
  return (
    <>
      <Hero />
      <ProcessStrip />

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <FadeIn className="mb-10 flex flex-col items-center gap-2 text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-thread">
            Patrones digitales
          </span>
          <h2 className="font-display text-3xl font-medium sm:text-4xl">
            Los favoritos de la comunidad
          </h2>
        </FadeIn>

        <ProductGrid limit={4} />

        <div className="mt-12 text-center">
          <Link
            href="/patrones"
            className="inline-block rounded-full border border-ink px-7 py-3 text-sm font-semibold transition-colors hover:bg-ink hover:text-cream"
          >
            Ver todos los patrones
          </Link>
        </div>
      </section>

      <HowItWorks />
      <About />
      <Testimonials />
    </>
  );
}
