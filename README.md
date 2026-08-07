# Luwcoco — demo de rediseño

Demo de rediseño de [luwcoco.com](https://luwcoco.com) (tienda Shopify de
patrones de costura digitales). El objetivo: una versión más dinámica y
visual que la actual, con animaciones, mejor prueba social y un flujo de
compra propio con Stripe, en vez de depender de un tema Shopify genérico.

## Análisis del sitio actual

- Tema Dawn de Shopify prácticamente sin personalizar (blanco y negro, sin
  color de marca propio).
- 4 productos (Duff Bag y Maxi Bag, duplicados en ES/EN), todos a 9,95€.
- Fichas de producto con mockup ilustrado + nivel/tejido/formato — lo único
  realmente cuidado del sitio, y la semilla de estilo de esta demo.
- Sin animaciones, sin prueba social (reseñas, nº de alumnas), sin vídeo
  embebido pese a tener YouTube/TikTok activos, sin filtros ni packs.
- Páginas "Sobre mí" y "Contacto" con el formulario y layout por defecto de
  Shopify.

## Qué cambia en esta demo

- **Identidad visual propia**: paleta cálida (crema, azul hilo, coral,
  rosa empolvado) en vez de blanco/negro plano, tipografía serif
  (Fraunces) + sans (Inter) igual que el logo original pero llevado a todo
  el sitio.
- **Movimiento**: hero animado con iconos flotantes, entradas de sección al
  hacer scroll (Framer Motion), hover en tarjetas de producto.
- **Iconografía propia**: ilustraciones SVG line-art originales por tipo de
  prenda (bolso, pantalón, top, falda, neceser) en vez de fotos, para que
  el catálogo pueda crecer sin depender de fotografía de producto.
- **Estructura de venta más completa**: "Cómo funciona" en 3 pasos, bloque
  de prueba social (estadísticas + testimonios), filtro de catálogo por
  categoría, ficha de producto con nivel/tejido/formato y botón de compra.
- **Pago propio con Stripe Checkout**, en lugar del checkout de Shopify.

Todos los productos, precios y testimonios son de ejemplo, pensados para
mostrar el sistema de diseño — se sustituyen por los reales de tu prima
antes de lanzar.

## Stack

- **Next.js 16 (App Router) + TypeScript** — SSR/SSG, buen SEO para
  búsquedas tipo "patrón bolsa de gimnasio", carga rápida.
- **Tailwind CSS v4** — sistema de diseño con tokens de color/tipografía
  en `src/app/globals.css`.
- **Framer Motion** — animaciones de entrada y hover.
- **Stripe Checkout** — pago único por patrón (producto digital).
- **lucide-react** — iconografía de interfaz.

### Por qué no Shopify

Shopify es rápido para arrancar, pero para "más dinámica y visual" el tema
se queda corto sin pagar apps adicionales, y el checkout de Shopify no se
puede rediseñar. Con Next.js + Stripe se controla el 100% del diseño y el
coste fijo baja (Vercel gratis a este volumen + solo comisión de Stripe,
sin cuota mensual de Shopify).

## Próximos pasos para producción (fuera del alcance de esta demo)

1. **Entrega digital real**: webhook de Stripe (`checkout.session.completed`)
   que genere un enlace de descarga firmado (ej. Supabase Storage o S3 +
   URL temporal) y lo envíe por email (Resend/Postmark).
2. **CMS**: mover `src/lib/products.ts` a un headless CMS (Sanity o Payload)
   para que tu prima pueda subir patrones sin tocar código.
3. **Fotografía/vídeo real** sustituyendo los iconos placeholder e
   incrustando sus vídeos de YouTube/TikTok.
4. **Analítica** (Plausible o GA4) y **SEO** (sitemap, metadata por
   producto, datos estructurados `Product`).

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Stripe

1. Copia `.env.example` a `.env.local`.
2. Añade tu clave secreta de test desde
   [dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys).
3. Sin la clave configurada, el botón "Comprar con Stripe" muestra un
   aviso en vez de romperse.

## Despliegue

Pensado para [Vercel](https://vercel.com/new): conecta el repo, añade la
variable de entorno `STRIPE_SECRET_KEY` y despliega. Cada push a la rama
principal genera un deploy automático.
