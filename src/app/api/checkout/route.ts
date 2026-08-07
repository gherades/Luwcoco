import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getProduct } from "@/lib/products";

export async function POST(req: NextRequest) {
  const { slug } = await req.json();
  const product = getProduct(slug);

  if (!product) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      {
        error:
          "STRIPE_SECRET_KEY no configurada. Añade tu clave de test de Stripe en .env.local para probar el checkout real.",
      },
      { status: 501 },
    );
  }

  const origin = req.headers.get("origin") ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(product.price * 100),
          product_data: {
            name: `${product.name} — ${product.subtitle}`,
            description: "Patrón digital en PDF + vídeo tutorial (entrega inmediata)",
          },
        },
      },
    ],
    success_url: `${origin}/exito?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cancelado`,
    metadata: { slug: product.slug },
  });

  return NextResponse.json({ url: session.url });
}
