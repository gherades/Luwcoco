export type CartItem = { slug: string; qty: number };

const STORAGE_KEY = "luwcoco-cart";
const CHANGE_EVENT = "luwcoco-cart-changed";

function loadFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

// Cached reference: useSyncExternalStore requires getSnapshot to return the
// same value between calls when nothing changed, so we only ever produce a
// new array when the cart actually mutates.
let cache: CartItem[] = typeof window !== "undefined" ? loadFromStorage() : [];

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeCart(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}

export function getCartSnapshot(): CartItem[] {
  return cache;
}

export function getCartServerSnapshot(): CartItem[] {
  return [];
}

export function addToCart(slug: string) {
  const existing = cache.find((item) => item.slug === slug);
  cache = existing
    ? cache.map((item) => (item.slug === slug ? { ...item, qty: item.qty + 1 } : item))
    : [...cache, { slug, qty: 1 }];
  persist();
}

export function removeFromCart(slug: string) {
  cache = cache.filter((item) => item.slug !== slug);
  persist();
}

export function setQty(slug: string, qty: number) {
  if (qty <= 0) {
    removeFromCart(slug);
    return;
  }
  cache = cache.map((item) => (item.slug === slug ? { ...item, qty } : item));
  persist();
}

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

const SECOND_PATTERN_DISCOUNT = 0.2;

/**
 * Promo "compra un patrón y el segundo, el más económico, tiene un 20% de
 * descuento": se aplica una única vez por pedido (no por pareja), sobre la
 * unidad más barata del carrito, en cuanto hay 2 o más unidades en total.
 */
export function cartDiscount(lines: { price: number; qty: number }[]) {
  const unitPrices = lines.flatMap((l) => Array(l.qty).fill(l.price));
  if (unitPrices.length < 2) {
    return { eligible: false as const, amount: 0, cheapestPrice: 0 };
  }
  const cheapestPrice = Math.min(...unitPrices);
  return {
    eligible: true as const,
    amount: cheapestPrice * SECOND_PATTERN_DISCOUNT,
    cheapestPrice,
  };
}
