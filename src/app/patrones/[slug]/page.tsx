import { notFound } from "next/navigation";
import Image from "next/image";
import { getProduct, levelLabels, products } from "@/lib/products";
import { PatternIcon } from "@/components/PatternIcon";
import { CheckoutButton } from "@/components/CheckoutButton";
import { FadeIn } from "@/components/FadeIn";
import { FileText, PlayCircle, Ruler } from "lucide-react";
import { withBasePath } from "@/lib/basePath";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <div className="grid gap-12 sm:grid-cols-2 sm:items-start">
        <FadeIn className="sm:sticky sm:top-24">
          {product.photoImage ? (
            <div>
              <div className="relative aspect-square overflow-hidden rounded-3xl border border-line bg-cream-dim">
                <Image
                  src={withBasePath(product.photoImage)}
                  alt={`${product.name} — foto del patrón terminado`}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
              {product.patternImage && (
                <div className="relative mt-4 aspect-[4/5] w-28 overflow-hidden rounded-xl border border-line">
                  <Image
                    src={withBasePath(product.patternImage)}
                    alt={`Portada del patrón ${product.name}`}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-3xl border border-line bg-gradient-to-br from-denim/50 to-cream-dim">
              <PatternIcon icon={product.icon} className="h-56 w-56 text-ink/70" animated />
            </div>
          )}
        </FadeIn>

        <FadeIn delay={0.1}>
          {(product.isNew || product.isBestseller) && (
            <span className="mb-3 inline-block rounded-full bg-ink px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-cream">
              {product.isNew ? "Nuevo" : "Top ventas"}
            </span>
          )}

          <h1 className="font-display text-4xl font-medium">{product.name}</h1>
          <p className="mt-1 text-lg text-ink-soft">{product.subtitle}</p>
          <p className="mt-4 font-display text-3xl">{product.price.toFixed(2)}€</p>

          <p className="mt-6 text-ink-soft">{product.description}</p>

          <div className="mt-8 space-y-3 rounded-2xl border border-line bg-cream-dim p-5 text-sm">
            <div className="flex items-center gap-3">
              <Ruler size={16} className="text-thread" />
              <span>
                Nivel: <strong>{levelLabels[product.level]}</strong>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <FileText size={16} className="text-thread" />
              <span>{product.fabric}</span>
            </div>
            <div className="flex items-center gap-3">
              <PlayCircle size={16} className="text-thread" />
              <span>{product.format}</span>
            </div>
          </div>

          <div className="mt-8">
            <CheckoutButton paymentLink={product.paymentLink} />
            <p className="mt-3 text-xs text-ink-soft">
              Entrega digital inmediata tras el pago. Pago seguro procesado
              por Stripe.
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
