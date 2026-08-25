"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import type { Product, ProductIconType } from "@kleenkicks/db";
import { whatsappHref } from "./site-config";
import { formatPrice } from "./format-price";

const CART_STORAGE_KEY = "kleenkicks-cart";

// Line items store a snapshot of product details at add-to-bag time so the
// bag can render on any page without re-fetching the catalog. Checkout still
// re-derives the real price/name from the database (see /api/orders) — this
// snapshot is only ever used for display.
export interface CartLine {
  id: string;
  name: string;
  category: string;
  price: number;
  icon: ProductIconType;
  image: string | null;
  qty: number;
}

type CartState = Record<string, CartLine>;

const EMPTY_CART: CartState = {};
const listeners = new Set<() => void>();
let cache: CartState = EMPTY_CART;
let cacheLoaded = false;

function loadCart(): CartState {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : EMPTY_CART;
  } catch {
    return EMPTY_CART;
  }
}

function commit(next: CartState) {
  cache = next;
  cacheLoaded = true;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage can fail (private browsing, quota) — the cart just won't persist.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function getSnapshot(): CartState {
  if (!cacheLoaded) {
    cache = loadCart();
    cacheLoaded = true;
  }
  return cache;
}

function getServerSnapshot(): CartState {
  return EMPTY_CART;
}

export function useCart() {
  const cart = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [checkingOut, setCheckingOut] = useState(false);
  const [payingWithCard, setPayingWithCard] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  // Stable reference (no dependencies) — safe to put in a useEffect's
  // dependency array without re-triggering every render.
  const clearCart = useCallback(() => {
    commit(EMPTY_CART);
  }, []);

  function addToBag(product: Product, qty = 1) {
    const existing = cache[product.id];
    commit({
      ...cache,
      [product.id]: {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        icon: product.icon,
        image: product.images[0] ?? null,
        qty: (existing?.qty ?? 0) + qty,
      },
    });
  }

  function updateQty(id: string, qty: number) {
    const next = { ...cache };
    if (qty <= 0) {
      delete next[id];
    } else if (next[id]) {
      next[id] = { ...next[id], qty };
    }
    commit(next);
  }

  const items = Object.values(cart);
  const totalCount = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  async function checkout() {
    setCheckingOut(true);

    let orderId: string | null = null;
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({ productId: item.id, quantity: item.qty })),
        }),
      });
      const data = (await res.json()) as { id: string | null };
      orderId = data.id;
    } catch {
      // Order storage is best-effort — checkout still proceeds via WhatsApp
      // even if the database is unreachable.
      orderId = null;
    }

    const lines = items.map(
      (item) => `- ${item.name} x${item.qty} — ${formatPrice(item.price * item.qty)}`
    );
    const message = [
      "Hi STURVY! I'd like to order:",
      ...lines,
      `Subtotal: ${formatPrice(subtotal)}`,
      ...(orderId ? [`Order Ref: ${orderId.slice(0, 8)}`] : []),
    ].join("\n");

    window.open(whatsappHref(message), "_blank", "noopener,noreferrer");
    setCheckingOut(false);
    clearCart();
  }

  // Unlike WhatsApp checkout, a card payment can genuinely bounce the
  // customer back here (they cancel, or the card is declined) — so the bag
  // stays intact until the success page confirms payment actually went
  // through, rather than clearing the moment they click "Pay".
  async function payWithCard() {
    setPayingWithCard(true);
    setCardError(null);

    try {
      const res = await fetch("/api/checkout/yoco", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({ productId: item.id, quantity: item.qty })),
        }),
      });
      const data = (await res.json()) as { redirectUrl?: string; error?: string };
      if (!res.ok || !data.redirectUrl) {
        throw new Error(data.error ?? "Could not start card payment");
      }
      window.location.href = data.redirectUrl;
    } catch (err) {
      setCardError(err instanceof Error ? err.message : "Could not start card payment");
      setPayingWithCard(false);
    }
  }

  return {
    items,
    totalCount,
    subtotal,
    checkingOut,
    addToBag,
    updateQty,
    checkout,
    payWithCard,
    payingWithCard,
    cardError,
    clearCart,
  };
}
