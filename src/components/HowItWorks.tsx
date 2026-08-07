import { FadeIn } from "./FadeIn";
import { CreditCard, Download, Scissors } from "lucide-react";

const steps = [
  {
    icon: CreditCard,
    title: "Elige y compra",
    text: "Paga de forma segura con tarjeta, Apple Pay o Google Pay. Todo el proceso tarda menos de un minuto.",
  },
  {
    icon: Download,
    title: "Descarga al instante",
    text: "Recibes el PDF listo para imprimir en A0 o A4, y el enlace al vídeo tutorial en tu correo.",
  },
  {
    icon: Scissors,
    title: "Cose paso a paso",
    text: "Sigue el vídeo a tu ritmo, con explicaciones pensadas para cualquier nivel de costura.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-cream-dim py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <FadeIn className="mb-14 text-center">
          <h2 className="font-display text-3xl font-medium sm:text-4xl">
            Cómo funciona
          </h2>
          <p className="mt-3 text-ink-soft">
            De la compra a la primera puntada, en tres pasos.
          </p>
        </FadeIn>

        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((s, i) => (
            <FadeIn key={s.title} delay={i * 0.12}>
              <div className="flex h-full flex-col items-center rounded-2xl border border-line bg-cream p-8 text-center">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-thread text-cream">
                  <s.icon size={22} />
                </div>
                <h3 className="font-display text-xl font-medium">{s.title}</h3>
                <p className="mt-2 text-sm text-ink-soft">{s.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
