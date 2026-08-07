export type Level = 1 | 2 | 3 | 4 | 5;

export type Product = {
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  level: Level;
  fabric: string;
  format: string;
  category: "bolsos" | "ropa" | "accesorios";
  icon: "duffbag" | "totebag" | "pants" | "top" | "skirt" | "pouch";
  description: string;
  isNew?: boolean;
  isBestseller?: boolean;
  /** Stripe Payment Link (dashboard.stripe.com/payment-links). Sin backend: funciona en sitio estático. */
  paymentLink?: string;
  /** Foto real del producto acabado (luwcoco.com) */
  photoImage?: string;
  /** Portada real del patrón en PDF (luwcoco.com) */
  patternImage?: string;
  /** Fotos adicionales del producto acabado, para la galería */
  gallery?: string[];
  /** Página de instrucciones/materiales real del PDF, para la galería */
  instructionsImage?: string;
  /** Enlace al vídeo tutorial de YouTube */
  videoUrl?: string;
};

export const products: Product[] = [
  {
    slug: "duffbag-gimnasio",
    name: "Duff Bag",
    subtitle: "Bolsa de gimnasio",
    price: 9.95,
    level: 2,
    fabric: "Tejido plano / canvas / algodón + forro + foam opcional",
    format: "PDF A4 + instrucciones + vídeo",
    category: "bolsos",
    icon: "duffbag",
    description:
      "El básico que no falla: una bolsa de deporte forrada, con asas reforzadas y bolsillo interior. Patrón pensado para tu primera bolsa estructurada.",
    isBestseller: true,
    photoImage: "/images/duffbag-photo.jpg",
    patternImage: "/images/duffbag-pattern.jpg",
    instructionsImage: "/images/duffbag-instructions.jpg",
    videoUrl: "https://youtu.be/urvVmllzof0",
  },
  {
    slug: "maxi-bag-playa",
    name: "Maxi Bag",
    subtitle: "Bolsa de playa multiusos",
    price: 9.95,
    level: 1,
    fabric: "Tejido plano / canvas / algodón + forro + foam opcional",
    format: "PDF A4 + vídeo tutorial",
    category: "bolsos",
    icon: "totebag",
    description:
      "Una tote gigante para playa, piscina o para llevar todo tu proyecto de costura a cuestas. El patrón perfecto para empezar.",
    isBestseller: true,
    photoImage: "/images/maxibag-photo.jpg",
    patternImage: "/images/maxibag-pattern.jpg",
    gallery: ["/images/maxibag-photo-2.jpg"],
    instructionsImage: "/images/maxibag-instructions.jpg",
    videoUrl: "https://youtu.be/DfvNZb_U5nE",
  },
  {
    slug: "pantalon-fluido-palazzo",
    name: "Palazzo",
    subtitle: "Pantalón fluido de pierna ancha",
    price: 12.95,
    level: 3,
    fabric: "Viscosa, crep o lino ligero",
    format: "PDF A0 + A4 + vídeo tutorial",
    category: "ropa",
    icon: "pants",
    description:
      "El pantalón de fiesta que viste llevar Lucía. Cintura elástica, caída fluida y patrón graduado del 34 al 48.",
    isNew: true,
  },
  {
    slug: "top-cruzado-drapeado",
    name: "Drapé",
    subtitle: "Top cruzado drapeado",
    price: 8.95,
    level: 2,
    fabric: "Punto fluido o satén ligero",
    format: "PDF A4 + vídeo tutorial",
    category: "ropa",
    icon: "top",
    description:
      "Top con escote cruzado y caída drapeada. Ideal para combinar con el Palazzo o con vaqueros.",
    isNew: true,
  },
  {
    slug: "falda-midi-tablas",
    name: "Midi Tablas",
    subtitle: "Falda midi con tablas",
    price: 10.95,
    level: 3,
    fabric: "Popelín, gabardina ligera o lino",
    format: "PDF A0 + A4 + vídeo tutorial",
    category: "ropa",
    icon: "skirt",
    description:
      "Falda midi con tablas frontales y cremallera invisible. Un proyecto perfecto para dar el salto a prendas con estructura.",
  },
  {
    slug: "neceser-cremallera",
    name: "Mini Pouch",
    subtitle: "Neceser con cremallera",
    price: 6.95,
    level: 1,
    fabric: "Restos de tela + entretela",
    format: "PDF A4 + vídeo tutorial",
    category: "accesorios",
    icon: "pouch",
    description:
      "El proyecto ideal para tu primera cremallera. Aprovecha esos retales que no te atrevías a tirar.",
  },
];

export const levelLabels: Record<Level, string> = {
  1: "Iniciación",
  2: "Fácil",
  3: "Intermedio",
  4: "Avanzado",
  5: "Experto",
};

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}
