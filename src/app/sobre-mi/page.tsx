import { FadeIn } from "@/components/FadeIn";
import { PatternIcon } from "@/components/PatternIcon";

export default function SobreMiPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
      <FadeIn>
        <span className="text-xs uppercase tracking-[0.2em] text-thread">
          Sobre mí
        </span>
        <h1 className="mt-3 font-display text-4xl font-medium sm:text-5xl">
          Hola, soy Lucía
        </h1>
      </FadeIn>

      <FadeIn delay={0.1} className="mt-8 flex justify-center">
        <div className="flex h-40 w-40 items-center justify-center rounded-full bg-thread text-cream">
          <PatternIcon icon="pouch" className="h-20 w-20" animated />
        </div>
      </FadeIn>

      <FadeIn delay={0.2} className="mt-10 space-y-5 text-ink-soft">
        <p>
          Soy arquitecta de profesión, pero la creatividad siempre ha sido
          una parte fundamental de mi vida. Mi madre me regaló una máquina
          de coser cuando tenía 16 años, y se quedó guardada durante años
          esperando el momento adecuado.
        </p>
        <p>
          En 2020, como a tantas personas durante el confinamiento, me
          surgió la necesidad de explorar algo creativo. Saqué la máquina
          de coser sin imaginar que terminaría cambiando mi vida por
          completo.
        </p>
        <p>
          A día de hoy creo contenido en redes sociales donde enseño
          procesos, ideas e inspiración para tus proyectos. Me encanta
          enseñar a coser, pero aún más me encanta mostrarte de lo que
          eres capaz cuando entiendes el proceso.
        </p>
        <p className="font-display text-xl italic text-ink">
          Mi objetivo es acompañarte paso a paso, demostrarte que crear tu
          propio armario es posible.
        </p>
      </FadeIn>
    </div>
  );
}
