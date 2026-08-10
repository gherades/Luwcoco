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
