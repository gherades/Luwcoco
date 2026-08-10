import { FadeIn } from "./FadeIn";
import {
  FabricFoldIcon,
  HangerIcon,
  PatternPieceIcon,
  SketchIcon,
} from "./SewingMotifs";

const steps = [
  {
    rev: "A",
    title: "Boceto",
    text: "La idea toma forma en un boceto rápido, antes de convertirse en algo que se pueda coser.",
    icon: SketchIcon,
  },
  {
    rev: "B",
    title: "Patrón",
    text: "El boceto se convierte en un patrón acotado, con las medidas y las piezas listas para imprimir.",
    icon: PatternPieceIcon,
  },
  {
    rev: "C",
    title: "Tela",
    text: "Eliges la tela y cortas las piezas siguiendo el patrón, pieza a pieza.",
    icon: FabricFoldIcon,
  },
  {
    rev: "D",
    title: "Prenda",
    text: "Las piezas se cosen entre sí y el boceto se convierte, por fin, en una prenda real.",
    icon: HangerIcon,
  },
];

export function ProcessStrip() {
  return (
    <section className="bg-cream-dim py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <FadeIn className="mb-14 text-center">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-coral">
            De la idea al armario
          </span>
          <h2 className="mt-3 font-display text-3xl font-medium sm:text-4xl">
            Así se construye un LUWCOCO
          </h2>
        </FadeIn>

        <div className="relative grid gap-10 sm:grid-cols-4 sm:gap-6">
          <div className="pointer-events-none absolute inset-x-8 top-8 hidden border-t border-dashed border-line sm:block" />
          {steps.map((step, i) => (
            <FadeIn key={step.rev} delay={i * 0.1} className="relative flex flex-col items-center text-center">
              <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-line bg-cream text-thread">
                <step.icon className="h-8 w-8" />
              </span>
              <span className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-coral">
                Rev {step.rev}
              </span>
              <h3 className="mt-1 font-display text-lg font-medium">{step.title}</h3>
              <p className="mt-1 text-sm text-ink-soft">{step.text}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
