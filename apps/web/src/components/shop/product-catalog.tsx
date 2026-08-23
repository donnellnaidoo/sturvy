"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@kleenkicks/db";
import { ProductIcon } from "@kleenkicks/ui";
import { formatPrice } from "@/lib/format-price";
import { useCart } from "@/lib/use-cart";
import { BagDrawer } from "./bag-drawer";

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

const SORT_LABELS: Record<SortKey, string> = {
  featured: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  name: "Name: A to Z",
};

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
  onAdd: (product: Product) => void;
}) {
  const onSale = product.compareAtPrice != null;
  const pctOff = onSale
    ? Math.round(100 - (product.price / product.compareAtPrice!) * 100)
    : 0;
  const cover = product.images[0];

  return (
    <div className="flex flex-col bg-canvas">
      <Link
        href={`/products/${product.id}`}
        className="relative flex aspect-square items-center justify-center bg-soft-cloud"
      >
        {product.badge && (
          <span className="absolute left-3 top-3 z-10 rounded-full border border-hairline bg-canvas px-3 py-1 text-[11px] font-medium text-ink">
            {product.badge}
          </span>
        )}
        {cover ? (
          <Image
            src={cover}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <ProductIcon type={product.icon} className="h-24 w-24 text-ink/70 sm:h-28 sm:w-28" />
        )}
      </Link>

      <VariantDots variants={product.variants} />

      <Link href={`/products/${product.id}`}>
        <h3 className="mt-3 text-sm font-medium text-ink hover:underline sm:text-base">
          {product.name}
        </h3>
      </Link>
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
        onClick={() => onAdd(product)}
        className="mt-4 flex h-11 items-center justify-center rounded-full bg-soft-cloud text-sm font-medium text-ink transition hover:bg-hairline-soft"
      >
        Add to Bag
      </button>
    </div>
  );
}

export function ProductCatalog({ products }: { products: Product[] }) {
  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  );

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sort, setSort] = useState<SortKey>("featured");
  const [bagOpen, setBagOpen] = useState(false);
  const { items, totalCount, subtotal, addToBag, updateQty, checkout, checkingOut } =
    useCart();

  function categoryCount(category: string) {
    if (category === "All") return products.length;
    return products.filter((p) => p.category === category).length;
  }

  const filtered = useMemo(() => {
    const base =
      activeCategory === "All"
        ? products
        : products.filter((p) => p.category === activeCategory);
    return sortProducts(base, sort);
  }, [products, activeCategory, sort]);

  async function handleCheckout() {
    await checkout();
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

      {products.length === 0 ? (
        <p className="mx-auto max-w-[1440px] px-6 py-16 text-center text-sm text-mute">
          No products available right now — check back soon.
        </p>
      ) : (
        <>
          {/* Category chips (mobile / tablet) */}
          <div className="mx-auto max-w-[1440px] overflow-x-auto px-6 py-4 lg:hidden">
            <div className="flex w-max gap-2">
              {["All", ...categories].map((cat) => (
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
                    {["All", ...categories].map((cat) => (
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
        </>
      )}

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

      <BagDrawer
        open={bagOpen}
        onClose={() => setBagOpen(false)}
        items={items}
        subtotal={subtotal}
        onUpdateQty={updateQty}
        onCheckout={handleCheckout}
        checkingOut={checkingOut}
      />
    </div>
  );
}
