"use client";

import { useMemo, useState } from "react";
import {
  CATEGORIES,
  PRODUCTS,
  formatPrice,
  type Product,
  type ProductCategory,
} from "@/lib/products";
import { whatsappHref } from "@/lib/site-config";
import { ProductIcon } from "./product-icon";

type SortKey = "featured" | "price-asc" | "price-desc" | "name";
type CategoryFilter = "All" | ProductCategory;

const SORT_LABELS: Record<SortKey, string> = {
  featured: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  name: "Name: A to Z",
};

function categoryCount(category: CategoryFilter) {
  if (category === "All") return PRODUCTS.length;
  return PRODUCTS.filter((p) => p.category === category).length;
}

function sortProducts(products: Product[], sort: SortKey) {
  const list = [...products];
  if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
  if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
}

function VariantDots({ variants }: { variants: Product["variants"] }) {
  if (!variants?.length) return null;
  return (
    <div className="mt-3 flex items-center gap-2">
      {variants.map((v) => (
        <span
          key={v.label}
          title={v.label}
          className="h-3 w-3 rounded-full ring-1 ring-hairline"
          style={{ backgroundColor: v.swatch }}
        />
      ))}
    </div>
  );
}

function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (id: string) => void;
}) {
  const onSale = product.compareAtPrice != null;
  const pctOff = onSale
    ? Math.round(100 - (product.price / product.compareAtPrice!) * 100)
    : 0;

  return (
    <div className="flex flex-col bg-canvas">
      <div className="relative flex aspect-square items-center justify-center bg-soft-cloud">
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full border border-hairline bg-canvas px-3 py-1 text-[11px] font-medium text-ink">
            {product.badge}
          </span>
        )}
        <ProductIcon type={product.icon} className="h-24 w-24 text-ink/70 sm:h-28 sm:w-28" />
      </div>

      <VariantDots variants={product.variants} />

      <h3 className="mt-3 text-sm font-medium text-ink sm:text-base">{product.name}</h3>
      <p className="mt-1 text-xs text-mute sm:text-sm">{product.subtitle}</p>

      <div className="mt-2 flex items-baseline gap-2">
        {onSale ? (
          <>
            <span className="text-sm font-medium text-sale sm:text-base">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-mute line-through sm:text-sm">
              {formatPrice(product.compareAtPrice!)}
            </span>
            <span className="text-xs font-medium text-sale">{pctOff}% off</span>
          </>
        ) : (
          <span className="text-sm font-medium text-ink sm:text-base">
            {formatPrice(product.price)}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={() => onAdd(product.id)}
        className="mt-4 flex h-11 items-center justify-center rounded-full bg-soft-cloud text-sm font-medium text-ink transition hover:bg-hairline-soft"
      >
        Add to Bag
      </button>
    </div>
  );
}

export function ProductCatalog() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [sort, setSort] = useState<SortKey>("featured");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [bagOpen, setBagOpen] = useState(false);

  const filtered = useMemo(() => {
    const base =
      activeCategory === "All"
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === activeCategory);
    return sortProducts(base, sort);
  }, [activeCategory, sort]);

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => ({
          product: PRODUCTS.find((p) => p.id === id)!,
          qty,
        }))
        .filter((item) => item.product && item.qty > 0),
    [cart]
  );

  const totalCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );

  function addToBag(id: string) {
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }

  function updateQty(id: string, qty: number) {
    setCart((prev) => {
      if (qty <= 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: qty };
    });
  }

  const [checkingOut, setCheckingOut] = useState(false);

  async function handleCheckout() {
    setCheckingOut(true);

    let orderId: string | null = null;
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            productId: item.product.id,
            quantity: item.qty,
          })),
        }),
      });
      const data = (await res.json()) as { id: string | null };
      orderId = data.id;
    } catch {
      // Order storage is best-effort — checkout still proceeds via WhatsApp
      // even if the database is unreachable or not yet configured.
      orderId = null;
    }

    const lines = cartItems.map(
      (item) =>
        `- ${item.product.name} x${item.qty} — ${formatPrice(
          item.product.price * item.qty
        )}`
    );
    const message = [
      "Hi KleenKicks! I'd like to order:",
      ...lines,
      `Subtotal: ${formatPrice(subtotal)}`,
      ...(orderId ? [`Order Ref: ${orderId.slice(0, 8)}`] : []),
    ].join("\n");

    window.open(whatsappHref(message), "_blank", "noopener,noreferrer");
    setCheckingOut(false);
    setCart({});
    setBagOpen(false);
  }

  return (
    <div className="relative">
      {/* Sub-nav strip: breadcrumb + sort */}
      <div className="border-b border-hairline-soft">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-6 py-4">
          <p className="text-xs text-mute sm:text-sm">
            <span className="text-ink">Home</span> / Shop
          </p>
          <label className="flex items-center gap-2 text-xs font-medium text-ink sm:text-sm">
            Sort By
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-full border border-hairline bg-canvas px-3 py-1.5 text-xs font-medium text-ink sm:text-sm"
            >
              {Object.entries(SORT_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Category chips (mobile / tablet) */}
      <div className="mx-auto max-w-[1440px] overflow-x-auto px-6 py-4 lg:hidden">
        <div className="flex w-max gap-2">
          {(["All", ...CATEGORIES] as CategoryFilter[]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={
                activeCategory === cat
                  ? "flex h-10 items-center whitespace-nowrap rounded-full bg-ink px-4 text-sm font-medium text-on-ink"
                  : "flex h-10 items-center whitespace-nowrap rounded-full border border-hairline px-4 text-sm font-medium text-ink"
              }
            >
              {cat} ({categoryCount(cat)})
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-6 py-8">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          {/* Filter sidebar (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <h2 className="text-sm font-medium text-ink">Category</h2>
              <ul className="mt-4 space-y-3">
                {(["All", ...CATEGORIES] as CategoryFilter[]).map((cat) => (
                  <li key={cat}>
                    <button
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={
                        activeCategory === cat
                          ? "text-sm font-medium text-ink underline decoration-1 underline-offset-4"
                          : "text-sm text-mute hover:text-ink"
                      }
                    >
                      {cat}{" "}
                      <span className="text-mute">({categoryCount(cat)})</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product grid */}
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={addToBag} />
            ))}
          </div>
        </div>
      </div>

      {/* Floating bag pill */}
      {totalCount > 0 && (
        <button
          type="button"
          onClick={() => setBagOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex h-12 items-center rounded-full bg-ink px-6 text-sm font-medium text-on-ink"
        >
          Bag ({totalCount})
        </button>
      )}

      {/* Bag drawer */}
      {bagOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setBagOpen(false)}
            aria-hidden="true"
          />
          <div className="relative flex h-full w-full max-w-md flex-col border-l border-hairline bg-canvas">
            <div className="flex items-center justify-between border-b border-hairline-soft px-6 py-5">
              <h2 className="text-lg font-medium text-ink">Your Bag ({totalCount})</h2>
              <button
                type="button"
                aria-label="Close bag"
                onClick={() => setBagOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-soft-cloud text-ink"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              {cartItems.length === 0 ? (
                <p className="py-10 text-center text-sm text-mute">
                  Your bag is empty.
                </p>
              ) : (
                <ul className="divide-y divide-hairline-soft">
                  {cartItems.map(({ product, qty }) => (
                    <li key={product.id} className="flex gap-4 py-5">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-soft-cloud">
                        <ProductIcon type={product.icon} className="h-8 w-8 text-ink/70" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-ink">{product.name}</p>
                        <p className="mt-0.5 text-xs text-mute">{product.category}</p>
                        <div className="mt-2 flex items-center gap-3">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => updateQty(product.id, qty - 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-soft-cloud text-sm text-ink"
                          >
                            −
                          </button>
                          <span className="text-sm text-ink">{qty}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => updateQty(product.id, qty + 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-soft-cloud text-sm text-ink"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-ink">
                        {formatPrice(product.price * qty)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-hairline-soft px-6 py-5">
                <div className="flex items-center justify-between text-sm font-medium text-ink">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <p className="mt-1 text-xs text-mute">
                  Final total confirmed via WhatsApp.
                </p>
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-ink text-sm font-medium text-on-ink disabled:opacity-50"
                >
                  {checkingOut ? "Preparing order…" : "Checkout via WhatsApp"}
                </button>
                <button
                  type="button"
                  onClick={() => setBagOpen(false)}
                  className="mt-3 flex h-12 w-full items-center justify-center rounded-full bg-soft-cloud text-sm font-medium text-ink"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
