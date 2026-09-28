import { addToCart } from "./cart";
import type { Product } from "./products";

export type CartFlight = {
  key: number;
  product: Product;
  /** Imagen que se ve en el origen; sin ella vuela el icono del patrón. */
  image?: string;
  /** Caja de origen en coordenadas de viewport. */
  from: { x: number; y: number; w: number; h: number };
};

type Listener<T> = (value: T) => void;

const flightListeners = new Set<Listener<CartFlight>>();
const landingListeners = new Set<Listener<string>>();
let nextKey = 0;

export function subscribeFlights(listener: Listener<CartFlight>) {
  flightListeners.add(listener);
  return () => {
    flightListeners.delete(listener);
  };
}

export function subscribeLandings(listener: Listener<string>) {
  landingListeners.add(listener);
  return () => {
    landingListeners.delete(listener);
  };
}

/**
 * Lanza una copia del producto desde `source` (un elemento con
 * `data-cart-source`, cuyo valor es la imagen que muestra) hasta la bolsa del
 * header. El producto solo entra en el carrito al aterrizar; si no hay capa
 * de vuelo montada, se añade directamente.
 */
export function flyToCart(product: Product, source: Element) {
  if (!flightListeners.size) {
    addToCart(product.slug);
    return;
  }
  const rect = source.getBoundingClientRect();
  const flight: CartFlight = {
    key: ++nextKey,
    product,
    image: source.getAttribute("data-cart-source") || undefined,
    from: { x: rect.left, y: rect.top, w: rect.width, h: rect.height },
  };
  flightListeners.forEach((listener) => listener(flight));
}

export function landInCart(product: Product) {
  addToCart(product.slug);
  landingListeners.forEach((listener) => listener(product.slug));
}
