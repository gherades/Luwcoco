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
- **Pago propio con Stripe**, en lugar del checkout de Shopify.

Todos los productos, precios y testimonios son de ejemplo, pensados para
mostrar el sistema de diseño — se sustituyen por los reales de tu prima
antes de lanzar.

## Stack

- **Next.js 16 (App Router) + TypeScript**, compilado como **export
  estático** (`output: "export"`) para poder vivir en GitHub Pages sin
  servidor.
- **Tailwind CSS v4** — sistema de diseño con tokens de color/tipografía
  en `src/app/globals.css`.
- **Framer Motion** — animaciones de entrada y hover.
- **Stripe Payment Links** — pago único por patrón, sin backend propio.
- **lucide-react** — iconografía de interfaz.

### Por qué no Shopify

Shopify es rápido para arrancar, pero para "más dinámica y visual" el tema
se queda corto sin pagar apps adicionales, y el checkout de Shopify no se
puede rediseñar. Con Next.js se controla el 100% del diseño, y al ser
exportado como sitio estático el hosting en GitHub Pages es gratis (sin
cuota mensual de Shopify).

### Por qué Payment Links y no Stripe Checkout con servidor

GitHub Pages solo sirve HTML/CSS/JS estático — no puede ejecutar el código
de servidor que crea una sesión de Stripe Checkout dinámica. La alternativa
sin backend son los
[Stripe Payment Links](https://dashboard.stripe.com/payment-links): enlaces
de pago que se crean una vez en el panel de Stripe (uno por patrón) y que
el sitio simplemente enlaza. Es una limitación real de este hosting frente
a Vercel/Netlify, no un atajo — si más adelante quieres precios dinámicos,
descuentos por código o el webhook de entrega automática, hay que mover el
hosting a uno con servidor (ver más abajo).

## Próximos pasos para producción (fuera del alcance de esta demo)

1. **Payment Links reales**: crear uno por patrón en el dashboard de
   Stripe y rellenar el campo `paymentLink` en `src/lib/products.ts`.
2. **Entrega digital**: con Payment Links, configúrala directamente en
   Stripe (adjuntar el PDF como "archivo digital" del producto — Stripe lo
   entrega automáticamente tras el pago). Si más adelante se necesita algo
   más a medida (enlaces firmados, vídeos, etc.), hace falta un backend:
   webhook `checkout.session.completed` + Vercel/Netlify.
3. **CMS**: mover `src/lib/products.ts` a un headless CMS (Sanity o Payload)
   para que tu prima pueda subir patrones sin tocar código.
4. **Fotografía/vídeo real** sustituyendo los iconos placeholder e
   incrustando sus vídeos de YouTube/TikTok.
5. **Analítica** (Plausible o GA4) y **SEO** (sitemap, metadata por
   producto, datos estructurados `Product`).

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Para generar el sitio estático igual que en producción:

```bash
npm run build   # genera la carpeta out/
npx serve out   # opcional, para previsualizarlo
```

## Despliegue en GitHub Pages

El repo incluye `.github/workflows/deploy-pages.yml`, que compila y
publica automáticamente en cada push a `main`. Solo hace falta un paso
manual, una vez:

1. En GitHub → **Settings → Pages**.
2. En "Source", elige **GitHub Actions** (no "Deploy from a branch").
3. Haz push/merge a `main` y en la pestaña **Actions** verás el deploy.
   El sitio queda en `https://gherades.github.io/Luwcoco/`.

Si el repo cambia de nombre, actualiza `repoName` en `next.config.ts` (se
usa como `basePath` para que los assets carguen bien bajo esa ruta).

### Alternativa: Vercel

Si en algún momento quieres el checkout dinámico completo (Stripe
Checkout con servidor, webhook de entrega automática, CMS), Vercel
también es gratis a este volumen y no requiere `output: "export"` — basta
con quitar esa línea de `next.config.ts` y volver a añadir la ruta
`/api/checkout` con la Secret Key de Stripe en variables de entorno.
