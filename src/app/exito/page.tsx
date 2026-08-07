import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function ExitoPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-28 text-center">
      <CheckCircle2 size={48} className="text-thread" />
      <h1 className="mt-6 font-display text-3xl font-medium">
        ¡Gracias por tu compra!
      </h1>
      <p className="mt-3 text-ink-soft">
        En una tienda real, aquí llegaría el enlace de descarga del patrón
        y una copia por correo electrónico.
      </p>
      <Link
        href="/patrones"
        className="mt-8 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream"
      >
        Seguir explorando patrones
      </Link>
    </div>
  );
}
