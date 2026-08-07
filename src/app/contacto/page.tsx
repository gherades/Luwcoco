import { FadeIn } from "@/components/FadeIn";

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-xl px-5 py-20 sm:px-8">
      <FadeIn>
        <h1 className="font-display text-4xl font-medium">Contacto</h1>
        <p className="mt-3 text-ink-soft">
          Si tienes cualquier pregunta sobre los patrones, cómo funcionan o
          cómo comprar, no dudes en escribirme :)
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <form className="mt-8 space-y-4">
          <input
            type="text"
            placeholder="Nombre"
            className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-thread"
          />
          <input
            type="email"
            placeholder="Correo electrónico *"
            className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-thread"
          />
          <textarea
            placeholder="Comentario"
            rows={5}
            className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-thread"
          />
          <button
            type="submit"
            className="rounded-full bg-ink px-7 py-3 text-sm font-semibold text-cream transition-colors hover:bg-thread-dark"
          >
            Enviar
          </button>
        </form>
      </FadeIn>
    </div>
  );
}
