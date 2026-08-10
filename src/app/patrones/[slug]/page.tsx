import { notFound } from "next/navigation";
import { getProduct, levelLabels, products } from "@/lib/products";
import { ScrollAssembly } from "@/components/ScrollAssembly";
import { ProductGallery } from "@/components/ProductGallery";
import { VideoEmbed } from "@/components/VideoEmbed";
import { CheckoutButton } from "@/components/CheckoutButton";
import { AddToCartButton } from "@/components/AddToCartButton";
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
                instructionsImage={product.instructionsImage}
                productName={product.name}
              />
            </FadeIn>
          )}
        </div>

        <FadeIn delay={0.1} className="sm:sticky sm:top-24">
          {(product.isNew || product.isBestseller) && (
            <span className="mb-3 inline-block rounded-full bg-ink px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-cream">
              {product.isNew ? "Nuevo" : "Top ventas"}
            </span>
          )}

          <h1 className="font-display text-4xl font-medium">{product.name}</h1>
          <p className="mt-1 text-lg text-ink-soft">{product.subtitle}</p>
          <p className="mt-4 font-mono text-3xl text-ink">{product.price.toFixed(2)}€</p>

          <p className="mt-6 text-ink-soft">{product.description}</p>

          <div className="mt-8 rounded-2xl border border-line bg-cream-dim p-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-coral">
              Ficha técnica
            </span>
            <div className="mt-3 space-y-3 font-mono text-[13px] uppercase tracking-wide text-ink-soft">
              <div className="flex items-center gap-3">
                <Ruler size={16} className="text-thread" />
                <span>
                  Nivel · <strong className="text-ink">{levelLabels[product.level]}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FileText size={16} className="text-thread" />
                <span>{product.fabric}</span>
              </div>
              <div className="flex items-center gap-3">
                <PlayCircle size={16} className="text-thread" />
                {product.videoUrl ? (
                  <a href="#video" className="underline underline-offset-2 hover:text-ink">
                    {product.format} — ver vídeo tutorial
                  </a>
                ) : (
                  <span>{product.format}</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <AddToCartButton slug={product.slug} />
            <CheckoutButton paymentLink={product.paymentLink} />
            <p className="mt-3 text-xs text-ink-soft">
              Entrega digital inmediata tras el pago. Pago seguro procesado
              por Stripe.
            </p>
          </div>
        </FadeIn>
      </div>

      {product.videoUrl && (
        <FadeIn id="video" className="mx-auto mt-16 max-w-3xl scroll-mt-24">
          <h2 className="mb-4 text-center font-display text-2xl font-medium">
            Vídeo tutorial paso a paso
          </h2>
          <VideoEmbed videoUrl={product.videoUrl} title={`Tutorial ${product.name}`} />
        </FadeIn>
      )}
    </div>
  );
}
