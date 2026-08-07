import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CanceladoPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-28 text-center">
      <XCircle size={48} className="text-ink-soft" />
      <h1 className="mt-6 font-display text-3xl font-medium">
        Pago cancelado
      </h1>
      <p className="mt-3 text-ink-soft">
        No se ha realizado ningún cargo. Puedes volver cuando quieras.
      </p>
      <Link
        href="/patrones"
        className="mt-8 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream"
      >
        Volver a los patrones
      </Link>
    </div>
  );
}
