import Link from "next/link";
import { FadeIn } from "./FadeIn";
import { PatternIcon } from "./PatternIcon";

export function About() {
  return (
    <section className="bg-thread-dark py-20 text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:grid-cols-2 sm:items-center sm:px-8">
        <FadeIn>
          <div className="relative flex aspect-square items-center justify-center rounded-2xl bg-cream/10">
            <PatternIcon icon="totebag" className="h-40 w-40 text-cream/70" animated />
            <span className="absolute bottom-6 rounded-full bg-cream px-4 py-1.5 text-xs font-medium text-ink">
              foto de estudio próximamente
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <span className="text-xs uppercase tracking-[0.2em] text-blush">
            Sobre mí
          </span>
          <h2 className="mt-3 font-display text-3xl font-medium sm:text-4xl">
            Soy Lucía, arquitecta de día, costurera siempre
          </h2>
          <p className="mt-4 text-cream/80">
            En 2020 saqué del armario una máquina de coser que llevaba años
            esperando su momento. No imaginé que terminaría cambiando mi
            vida por completo. Hoy diseño patrones y te acompaño paso a paso
            para que descubras que crear tu propio armario es posible.
          </p>
          <Link
            href="/sobre-mi"
            className="mt-6 inline-block rounded-full border border-cream/40 px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-cream/10"
          >
            Conoce mi historia
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
