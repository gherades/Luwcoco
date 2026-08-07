import Image from "next/image";
import { FadeIn } from "@/components/FadeIn";
import { SewingDoodle } from "@/components/SewingDoodle";
import { SewingSection } from "@/components/SewingSection";
import { StitchReveal } from "@/components/StitchReveal";
import {
  MeasuringTapeIcon,
  NeedleThread,
  PinIcon,
  ScissorsIcon,
  ThreadSpool,
} from "@/components/SewingMotifs";
import { withBasePath } from "@/lib/basePath";

const photos = [
  { src: "/images/about-1.jpg", rotate: -4 },
  { src: "/images/about-2.jpg", rotate: 3 },
  { src: "/images/about-3.jpg", rotate: 2 },
  { src: "/images/about-4.jpg", rotate: -3 },
];

export default function SobreMiPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8 lg:px-24">
      <FadeIn>
        <span className="text-xs uppercase tracking-[0.2em] text-thread">
          Sobre mí
        </span>
        <h1 className="mt-3 font-display text-4xl font-medium sm:text-5xl">
          Hola, soy Lucía
        </h1>
      </FadeIn>

      <div className="mt-14 space-y-14">
        <SewingSection
          icon={<NeedleThread className="h-14 w-14" />}
          side="right"
          rotate={-12}
          colorClassName="text-thread/70"
        >
          <p>
            Soy la persona que está detrás de LUWCOCO. Soy arquitecta de
            profesión, pero la creatividad siempre ha sido una parte
            fundamental de mi vida. Mi madre me regaló una máquina de coser
            cuando tenía 16 años, se quedó guardada durante años… esperando
            el momento adecuado.
          </p>
        </SewingSection>

        <SewingSection
          icon={<ScissorsIcon className="h-12 w-12" />}
          side="left"
          rotate={10}
          delay={0.15}
          colorClassName="text-coral/80"
        >
          <p>
            En 2020, como a tantas personas durante el COVID, me surgió la
            necesidad de explorar algo creativo. Saqué la máquina de coser
            sin imaginar que terminaría cambiando mi vida por completo.
          </p>
        </SewingSection>

        <SewingSection
          icon={<ThreadSpool className="h-14 w-14" />}
          side="right"
          rotate={-8}
          colorClassName="text-thread/70"
        >
          <p>
            A día de hoy creo contenido en redes sociales en donde enseño
            procesos, ideas, inspiración para vuestros proyectos, dónde
            comprar telas o incluso cómo es mi vida como arquitecta y
            creadora de contenido de costura.
          </p>
        </SewingSection>

        <FadeIn delay={0.1} className="relative rounded-3xl bg-thread-dark px-6 py-10 text-center text-cream sm:px-12">
          <SewingDoodle
            rotate={14}
            delay={0.2}
            className="absolute -top-6 left-1/2 -translate-x-1/2 text-blush"
          >
            <PinIcon className="h-10 w-10" />
          </SewingDoodle>
          <StitchReveal delay={0.15} threadClassName="stroke-cream/60" needleClassName="text-blush">
            <p className="font-display text-2xl italic leading-snug sm:text-3xl">
              Coser te da libertad, originalidad, creatividad, imaginación e
              ilusión de crear cosas. Te da la capacidad de diseñar ropa que
              realmente te representa.
            </p>
          </StitchReveal>
        </FadeIn>

        <SewingSection
          icon={<MeasuringTapeIcon className="h-12 w-12" />}
          side="left"
          rotate={12}
          colorClassName="text-coral/80"
        >
          <p>
            LUWCOCO nace de una idea clara: poder crear lo que yo quiera —
            un espacio donde comparto todo lo que he aprendido y sigo
            aprendiendo. Me encanta enseñar a coser, pero aún más me
            encanta mostrarte de lo que eres capaz cuando entiendes el
            proceso.
          </p>
        </SewingSection>

        <StitchReveal delay={0.1}>
          <p className="font-display text-xl italic text-ink">
            Mi objetivo es acompañarte paso a paso, demostrarte que crear tu
            propio armario es posible!!!
          </p>
        </StitchReveal>
      </div>

      <FadeIn delay={0.1} className="mt-20">
        <h2 className="text-center font-display text-2xl font-medium">
          Cosido y llevado por mí
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-5 sm:gap-8">
          {photos.map((photo, i) => (
            <FadeIn key={photo.src} delay={i * 0.1}>
              <div
                className="overflow-hidden rounded-2xl border-4 border-cream bg-cream shadow-md"
                style={{ transform: `rotate(${photo.rotate}deg)` }}
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={withBasePath(photo.src)}
                    alt="Lucía llevando una prenda cosida por ella"
                    fill
                    sizes="(min-width: 640px) 25vw, 45vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </FadeIn>
    </div>
  );
}
