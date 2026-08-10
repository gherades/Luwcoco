import { Star } from "lucide-react";
import { FadeIn } from "./FadeIn";

const testimonials = [
  {
    name: "Marta G.",
    text: "Nunca había cosido nada y con el patrón del Maxi Bag hice mi primera bolsa en una tarde. Las explicaciones del vídeo son clarísimas.",
  },
  {
    name: "Elena R.",
    text: "El Palazzo me ha quedado igual que en las fotos. Se nota que los patrones están probados de verdad antes de publicarlos.",
  },
  {
    name: "Sofía M.",
    text: "Lo que más valoro es poder pausar el vídeo en cada paso. Ya llevo cuatro patrones y no pienso parar.",
  },
];

const stats = [
  { value: "+2.400", label: "patrones descargados" },
  { value: "4.9/5", label: "valoración media" },
  { value: "+350k", label: "en redes sociales" },
];

export function Testimonials() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <FadeIn className="mb-14 grid gap-6 rounded-2xl border border-line bg-cream-dim p-8 text-center sm:grid-cols-3 sm:p-10">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-mono text-3xl text-thread sm:text-4xl">
                {s.value}
              </div>
              <div className="mt-1 font-mono text-xs uppercase tracking-wide text-ink-soft">{s.label}</div>
            </div>
          ))}
        </FadeIn>

        <FadeIn className="mb-10 text-center">
          <h2 className="font-display text-3xl font-medium sm:text-4xl">
            Lo que dice la comunidad
          </h2>
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-3">
          {testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.12}>
              <div className="flex h-full flex-col rounded-2xl border border-line bg-cream p-6">
                <div className="mb-3 flex gap-0.5 text-coral">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} size={15} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className="flex-1 text-sm text-ink-soft">“{t.text}”</p>
                <p className="mt-4 font-display text-base">{t.name}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-ink-soft/70">
          Testimonios y valoración de ejemplo para esta demo de diseño — el
          dato de seguidores en redes sociales sí es real.
        </p>
      </div>
    </section>
  );
}
