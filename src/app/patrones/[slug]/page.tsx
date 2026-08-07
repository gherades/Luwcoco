import { notFound } from "next/navigation";
import { getProduct, levelLabels, products } from "@/lib/products";
import { ScrollAssembly } from "@/components/ScrollAssembly";
import { ProductGallery } from "@/components/ProductGallery";
import { CheckoutButton } from "@/components/CheckoutButton";
import { FadeIn } from "@/components/FadeIn";
import { FileText, PlayCircle, Ruler } from "lucide-react";

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
        <div>
          <ScrollAssembly
            icon={product.icon}
            patternImage={product.patternImage}
            productName={product.name}
          />

          {product.photoImage && (
            <FadeIn>
              <h2 className="mt-2 font-display text-lg font-medium">
                La bolsa terminada
              </h2>
              <ProductGallery
                photoImage={product.photoImage}
                gallery={product.gallery}
                productName={product.name}
              />
            </FadeIn>
          )}
        </div>

        <FadeIn delay={0.1} className="sm:sticky sm:top-24">
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
